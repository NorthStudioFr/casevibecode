// Usage : npx --yes tsx scripts/import-fiches-saas.ts <dossier-des-saas-output> [--apply]
//
// 1. fusionne saas-output-*.json ; 2. valide (scripts/lib/fiches-saas.ts) ;
// 3. VÉRIFIE chaque alternative sur le réseau : dépôt GitHub non archivé, actif
//    depuis moins de 18 mois et sous licence libre déclarée (« open-source » n'est
//    admis que pour un dépôt GitHub) ; autre site : il répond ; 4. écarte les
//    doublons avec les fiches déjà en base ; 5. écrit saas-final.json et
//    saas-rapport.txt ; 6. avec --apply seulement, upsert dans Supabase.
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { join } from 'path';
import { getServiceClient } from './lib/supabase-admin';
import { mapNouveauLogicielToRow } from '../src/lib/logiciel-doc';
import type { Alternative, NouveauLogicielInput } from '../src/types/logiciel';
import { githubRepo, licenceLibreDepuisTexte, nettoyerPrix, normaliserFiche, type FicheBrute } from './lib/fiches-saas';

const dir = process.argv[2];
const apply = process.argv.includes('--apply');
if (!dir) {
  console.error('Usage: import-fiches-saas.ts <dossier> [--apply]');
  process.exit(1);
}

const DIX_HUIT_MOIS_MS = 18 * 30 * 24 * 3600 * 1000;
const rapport: string[] = [];
const log = (s: string) => {
  rapport.push(s);
  console.log(s);
};

function verifierGithub(repo: string, exigerLicenceLibre: boolean): { ok: boolean; raison?: string } {
  try {
    const out = execFileSync('gh', ['api', `repos/${repo}`, '--jq', '{archived,pushed_at,license:.license.spdx_id}'], { encoding: 'utf8' });
    const d = JSON.parse(out) as { archived: boolean; pushed_at: string; license: string | null };
    if (d.archived) return { ok: false, raison: 'archivé' };
    if (Date.now() - new Date(d.pushed_at).getTime() > DIX_HUIT_MOIS_MS) return { ok: false, raison: 'inactif depuis plus de 18 mois' };
    // La licence n'est exigée que pour « open-source » (pas pour « gratuit » ou
    // « plus petit »).
    if (exigerLicenceLibre && (!d.license || d.license === 'NOASSERTION')) {
      // GitHub n'a pas su la reconnaître : on lit le fichier de licence.
      let texte = '';
      try {
        texte = Buffer.from(execFileSync('gh', ['api', `repos/${repo}/license`, '--jq', '.content'], { encoding: 'utf8' }), 'base64').toString('utf8');
      } catch {
        return { ok: false, raison: 'aucun fichier de licence' };
      }
      if (!licenceLibreDepuisTexte(texte)) return { ok: false, raison: 'licence non libre ou non reconnue' };
    }
    return { ok: true };
  } catch {
    return { ok: false, raison: 'dépôt introuvable' };
  }
}

async function siteRepond(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 casevibecode-link-check' } });
    // 403/429 : le site répond mais bloque les robots ; 404/410/5xx : lien mort.
    return res.status < 400 || res.status === 403 || res.status === 429;
  } catch {
    return false;
  }
}

async function verifierAlternatives(slug: string, alts: Alternative[] | undefined): Promise<Alternative[]> {
  const gardees: Alternative[] = [];
  for (const a of alts ?? []) {
    const repo = githubRepo(a.url);
    if (a.type === 'open-source' && !repo) {
      log(`  ✗ ${slug} : « ${a.nom} » écarté (open source sans dépôt GitHub vérifiable)`);
      continue;
    }
    if (repo) {
      const r = verifierGithub(repo, a.type === 'open-source');
      if (!r.ok) {
        log(`  ✗ ${slug} : « ${a.nom} » écarté (${r.raison})`);
        continue;
      }
    } else if (!(await siteRepond(a.url))) {
      log(`  ✗ ${slug} : « ${a.nom} » écarté (site injoignable)`);
      continue;
    }
    gardees.push(a);
  }
  return gardees;
}

async function main() {
  const brutes: FicheBrute[] = readdirSync(dir)
    .filter((f) => /^saas-output-\d+\.json$/.test(f))
    .flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as FicheBrute[]);
  log(`${brutes.length} fiches lues.`);

  const client = getServiceClient();
  const { data: existantes, error } = await client.from('logiciels').select('slug, domaine');
  if (error) throw error;
  const slugs = new Set((existantes ?? []).map((l: { slug: string }) => l.slug));
  const domaines = new Set((existantes ?? []).map((l: { domaine: string }) => l.domaine).filter(Boolean));

  const finales: NouveauLogicielInput[] = [];
  for (const brute of brutes) {
    const nettoye = nettoyerPrix(brute);
    if (nettoye.avertissement) log(`! ${brute.slug} : ${nettoye.avertissement}`);
    const { fiche, problemes } = normaliserFiche(nettoye.fiche);
    if (!fiche) {
      log(`✗ ${brute.slug ?? '?'} ignorée : ${problemes.join(' ; ')}`);
      continue;
    }
    if (slugs.has(fiche.slug) || domaines.has(fiche.domaine) || finales.some((f) => f.slug === fiche.slug || f.domaine === fiche.domaine)) {
      log(`↷ ${fiche.slug} ignorée : doublon (slug ou domaine déjà présent)`);
      continue;
    }
    const alts = await verifierAlternatives(fiche.slug, fiche.alternatives);
    const prete: NouveauLogicielInput = { ...fiche };
    if (alts.length) prete.alternatives = alts;
    else delete prete.alternatives;
    finales.push(prete);
    log(`✓ ${fiche.slug} : ${alts.length}/${fiche.alternatives?.length ?? 0} alternatives, prix ${fiche.prix ?? 'non lu'}`);
  }

  writeFileSync(join(dir, 'saas-final.json'), JSON.stringify(finales, null, 1));
  log(`\n${finales.length} fiches prêtes sur ${brutes.length}.`);
  writeFileSync(join(dir, 'saas-rapport.txt'), rapport.join('\n'));

  if (!apply) {
    console.log('Dry-run : rien écrit en base. Relancer avec --apply.');
    return;
  }
  const rows = finales.map(mapNouveauLogicielToRow);
  const { error: upsertError } = await client.from('logiciels').upsert(rows, { onConflict: 'slug' });
  if (upsertError) throw upsertError;
  console.log(`${rows.length} fiches importées dans Supabase.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
