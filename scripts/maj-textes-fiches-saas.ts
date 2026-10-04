// Usage : npx --yes tsx scripts/maj-textes-fiches-saas.ts [--apply]
//
// Met à jour les TEXTES éditoriaux des fiches « outils du quotidien » depuis
// scripts/data/fiches-saas.json (description, justification, « ce que vous
// perdez », prompt, verdict, source). Jamais le prix, les alternatives ni les
// votes. Sans --apply : simulation, la base n'est que LUE. Le rapport détaillé
// est écrit dans scripts/data/maj-textes-rapport.txt.
import { readFileSync, writeFileSync } from 'fs';
import { getServiceClient } from './lib/supabase-admin';
import { CHAMPS, calculerChangement, validerTextes, type Changement, type FicheTextes, type LigneBase } from './lib/maj-textes-fiches';

const apply = process.argv.includes('--apply');
const fiches = JSON.parse(readFileSync('scripts/data/fiches-saas.json', 'utf8')) as FicheTextes[];
const rapport: string[] = [];
const log = (s: string) => {
  rapport.push(s);
  console.log(s);
};

async function main() {
  const invalides = fiches.flatMap((f) => validerTextes(f).map((p) => `${f.slug ?? '?'} : ${p}`));
  if (invalides.length) {
    invalides.forEach((i) => log(`✗ ${i}`));
    throw new Error(`${invalides.length} problème(s) de validation : rien n'est écrit.`);
  }

  const client = getServiceClient();
  const slugs = fiches.map((f) => f.slug as string);
  const colonnes = ['slug', 'secteur', ...Object.values(CHAMPS)].join(',');
  const { data, error } = await client.from('logiciels').select(colonnes).in('slug', slugs);
  if (error) throw error;
  const lignes = new Map((data as unknown as (LigneBase & { slug: string; secteur: string })[]).map((l) => [l.slug, l]));

  const manquants = slugs.filter((s) => !lignes.has(s));
  const horsSaas = slugs.filter((s) => lignes.get(s) && lignes.get(s)!.secteur !== 'saas');
  if (manquants.length || horsSaas.length) {
    manquants.forEach((s) => log(`✗ ${s} : absent de la base`));
    horsSaas.forEach((s) => log(`✗ ${s} : secteur ≠ saas en base, refus de toucher une fiche CHR`));
    throw new Error('Slugs incohérents avec la base : rien n\'est écrit.');
  }

  const aAppliquer: { slug: string; changement: Changement }[] = [];
  let inchanges = 0;
  for (const f of fiches) {
    const ligne = lignes.get(f.slug as string)!;
    const changement = calculerChangement(f, ligne);
    const cles = Object.keys(changement);
    if (cles.length === 0) {
      inchanges++;
      continue;
    }
    const verdict = changement.verdict_editeur ? ` ⚠ VERDICT ${ligne.verdict_editeur} → ${changement.verdict_editeur}` : '';
    log(`~ ${f.slug} : ${cles.join(', ')}${verdict}`);
    aAppliquer.push({ slug: f.slug as string, changement });
  }

  const verdicts = aAppliquer.filter((a) => a.changement.verdict_editeur).length;
  log(`\nRésumé : ${aAppliquer.length} fiche(s) à modifier, ${inchanges} déjà à jour, ${verdicts} changement(s) de verdict.`);

  if (!apply) {
    writeFileSync('scripts/data/maj-textes-rapport.txt', rapport.join('\n') + '\n');
    log('Simulation : rien écrit en base. Relancer avec --apply pour appliquer.');
    return;
  }

  for (const { slug, changement } of aAppliquer) {
    const { error: e } = await client.from('logiciels').update(changement).eq('slug', slug);
    if (e) throw new Error(`${slug} : ${e.message}`);
    console.log(`✓ ${slug}`);
  }
  console.log(`Terminé : ${aAppliquer.length} fiche(s) mises à jour.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
