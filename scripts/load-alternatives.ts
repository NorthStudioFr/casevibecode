// Usage : npx --yes tsx scripts/load-alternatives.ts <dossier-des-alt-output> [--apply]
//
// 1. fusionne alt-output-*.json ; 2. valide le format ; 3. VÉRIFIE chaque lien
// (dépôt GitHub : non archivé et actif depuis moins de 18 mois ; autre site : il
// répond) et écarte ce qui échoue ; 4. écrit alternatives-final.json et un
// rapport ; 5. avec --apply seulement, écrit la colonne `alternatives` (jsonb)
// de la table logiciels dans Supabase (service_role, voir scripts/lib).
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { join } from 'path';
import { getServiceClient } from './lib/supabase-admin';

type Type = 'open-source' | 'gratuit' | 'plus-petit' | 'concurrent';
interface Alt {
  nom: string;
  url: string;
  type: Type;
  description: string;
}

const dir = process.argv[2];
const apply = process.argv.includes('--apply');
if (!dir) {
  console.error('Usage: load-alternatives.ts <dossier> [--apply]');
  process.exit(1);
}

const TYPES: Type[] = ['open-source', 'gratuit', 'plus-petit', 'concurrent'];
const LICENCE_CONNUE = new Set(['odoo/odoo']);
const DIX_HUIT_MOIS_MS = 18 * 30 * 24 * 3600 * 1000;

function cle(url: string): string {
  return url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
}

function githubRepo(url: string): string | null {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  return m ? `${m[1]}/${m[2].replace(/\.git$/, '')}` : null;
}

function verifierGithub(repo: string): { probleme: string | null; note?: string } {
  try {
    const out = execFileSync(
      'gh',
      ['api', `repos/${repo}`, '--jq', '{a:.archived,p:.pushed_at,l:(.license.spdx_id // null)}'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    const { a, p, l } = JSON.parse(out);
    if (a) return { probleme: 'dépôt archivé' };
    if (Date.now() - new Date(p).getTime() > DIX_HUIT_MOIS_MS) return { probleme: `inactif depuis ${p.slice(0, 10)}` };
    // Sans licence déclarée, le code n'est pas open source (tous droits réservés).
    if (!l) return { probleme: 'aucune licence déclarée (pas open source)' };
    // « Licence non reconnue » = fichier de licence sur mesure : seul Odoo
    // (LGPL-3.0 pour l'édition Community) est connu et accepté ; tout autre cas
    // (ex. « usage éducatif uniquement ») n'est pas de l'open source.
    if (l === 'NOASSERTION') {
      return LICENCE_CONNUE.has(repo.toLowerCase())
        ? { probleme: null }
        : { probleme: 'licence sur mesure non reconnue (pas démontré open source)' };
    }
    return { probleme: null };
  } catch {
    return { probleme: 'dépôt introuvable' };
  }
}

async function verifierSite(url: string): Promise<{ ok: boolean; note?: string }> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; casevibecode-linkcheck)' },
    });
    if (res.status < 400) return { ok: true };
    // Anti-bot : on garde mais on signale pour un contrôle manuel.
    if ([401, 403, 405, 429, 999].includes(res.status)) return { ok: true, note: `HTTP ${res.status} (anti-bot ?)` };
    return { ok: false, note: `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, note: `injoignable (${(e as Error).name})` };
  }
}

async function main() {
  const fichiers = readdirSync(dir).filter((f) => /^alt-output-\d+\.json$/.test(f));
  const entrees: { slug: string; alternatives: Alt[] }[] = [];
  for (const f of fichiers) entrees.push(...JSON.parse(readFileSync(join(dir, f), 'utf8')));

  const input = Object.fromEntries(
    readdirSync(dir)
      .filter((f) => /^alt-input-\d+\.json$/.test(f))
      .flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as { slug: string; nom: string; domaine: string | null }[])
      .map((l) => [l.slug, l])
  );

  const rapport: string[] = [];
  const final: Record<string, Alt[]> = {};
  const cache = new Map<string, { ok: boolean; note?: string }>();

  for (const { slug, alternatives } of entrees) {
    const ok: Alt[] = [];
    const vus = new Set<string>();
    for (const a of alternatives ?? []) {
      const quoi = `${slug} → ${a.nom}`;
      if (!a.nom || !a.url?.startsWith('https://') || !TYPES.includes(a.type) || !a.description) {
        rapport.push(`ÉCARTÉ (format) ${quoi}`);
        continue;
      }
      const k = cle(a.url);
      if (vus.has(k)) continue;
      const domaineFiche = input[slug]?.domaine;
      if (domaineFiche && k.startsWith(domaineFiche.toLowerCase().replace(/^www\./, ''))) {
        rapport.push(`ÉCARTÉ (c'est le logiciel lui-même) ${quoi}`);
        continue;
      }
      const repo = githubRepo(a.url);
      if (repo) {
        const r = verifierGithub(repo);
        if (r.probleme) {
          rapport.push(`ÉCARTÉ (${r.probleme}) ${quoi} ${a.url}`);
          continue;
        }
        if (r.note) rapport.push(`À CONTRÔLER (${r.note}) ${quoi} ${a.url}`);
      } else {
        const r = cache.get(k) ?? (await verifierSite(a.url));
        cache.set(k, r);
        if (!r.ok) {
          rapport.push(`ÉCARTÉ (${r.note}) ${quoi} ${a.url}`);
          continue;
        }
        if (r.note) rapport.push(`À CONTRÔLER (${r.note}) ${quoi} ${a.url}`);
      }
      vus.add(k);
      ok.push({ nom: a.nom.trim(), url: a.url.trim(), type: a.type, description: a.description.trim().slice(0, 160) });
    }
    final[slug] = ok;
  }

  // Un même lien doit porter un seul nom (ex. « Odoo Community » / « Odoo (Point
  // de vente) » = github.com/odoo/odoo) : on garde le plus fréquent.
  const noms = new Map<string, Map<string, number>>();
  for (const l of Object.values(final)) {
    for (const a of l) {
      const m = noms.get(cle(a.url)) ?? new Map<string, number>();
      m.set(a.nom, (m.get(a.nom) ?? 0) + 1);
      noms.set(cle(a.url), m);
    }
  }
  for (const l of Object.values(final)) {
    for (const a of l) {
      const m = noms.get(cle(a.url))!;
      a.nom = cle(a.url) === 'github.com/odoo/odoo' ? 'Odoo Community' : [...m.entries()].sort((x, y) => y[1] - x[1] || x[0].length - y[0].length)[0][0];
      // Une caisse en France doit être certifiée NF525 : on le rappelle toujours
      // quand l'alternative est la caisse d'Odoo, dont la conformité n'est pas prouvée.
      if (cle(a.url) === 'github.com/odoo/odoo' && /caisse|point de vente/i.test(a.description) && !/NF525/i.test(a.description)) {
        a.description = `${a.description.replace(/\.$/, '')}. NF525 à vérifier.`.slice(0, 160);
      }
    }
  }

  const total = Object.values(final).reduce((n, l) => n + l.length, 0);
  const avec = Object.values(final).filter((l) => l.length > 0).length;
  writeFileSync(join(dir, 'alternatives-final.json'), JSON.stringify(final, null, 2));
  writeFileSync(join(dir, 'alternatives-rapport.txt'), rapport.join('\n'));
  console.log(`${entrees.length} logiciels traités, ${avec} avec au moins une alternative, ${total} alternatives retenues.`);
  console.log(`${rapport.length} lignes de rapport -> alternatives-rapport.txt`);

  if (!apply) {
    console.log('Dry-run (ajouter --apply pour écrire dans Supabase).');
    return;
  }

  const client = getServiceClient();
  for (const [slug, alternatives] of Object.entries(final)) {
    const { data, error } = await client.from('logiciels').update({ alternatives }).eq('slug', slug).select('slug');
    if (error) throw error;
    if (!data?.length) console.warn(`Fiche absente en base, ignorée : ${slug}`);
  }
  console.log(`Appliqué à ${Object.keys(final).length} fiches.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
