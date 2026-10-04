// Usage : npx --yes tsx scripts/maj-corrections-chr.ts [fichier.json] [--apply]
// (fichier par défaut : scripts/data/corrections-chr.json)
//
// Applique scripts/data/corrections-chr.json aux fiches CHR : corrections de
// colonnes listées (jamais les alternatives, la source ni les votes) et retrait
// de fiches (« retirer »). Sans --apply : simulation, la base n'est que LUE.
// Avec --apply : sauvegarde d'abord les lignes touchées dans
// ../casevibecode-sauvegarde-corrections-chr-<date>.json (hors dépôt).
import { readFileSync, writeFileSync } from 'fs';
import { getServiceClient } from './lib/supabase-admin';
import { CATEGORIE_LABEL } from '../src/lib/categories';
import { colonnesInterdites, diffCorrection, type Correction } from './lib/corrections-chr';

const apply = process.argv.includes('--apply');
// Les fiches « outils du quotidien » se corrigent avec --secteur=saas (chr par défaut).
const secteur = process.argv.find((a) => a.startsWith('--secteur='))?.slice('--secteur='.length) ?? 'chr';
if (secteur !== 'chr' && secteur !== 'saas') throw new Error('--secteur doit valoir chr ou saas');
const fichier = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'scripts/data/corrections-chr.json';
const { retirer = [], corrections = [] } = JSON.parse(readFileSync(fichier, 'utf8')) as { retirer?: string[]; corrections?: Correction[] };

async function main() {
  const interdites = corrections.flatMap((c) => colonnesInterdites(c).map((k) => `${c.slug} : colonne interdite « ${k} »`));
  if (interdites.length) throw new Error(interdites.join('\n'));
  const mauvaises = corrections.filter((c) => c.categorie !== undefined && !(c.categorie as string in CATEGORIE_LABEL)).map((c) => `${c.slug} : catégorie inconnue « ${c.categorie} »`);
  if (mauvaises.length) throw new Error(mauvaises.join('\n'));

  const client = getServiceClient();
  const slugs = [...corrections.map((c) => c.slug), ...retirer];
  const { data, error } = await client.from('logiciels').select('*').in('slug', slugs);
  if (error) throw error;
  const lignes = new Map((data as Record<string, unknown>[]).map((l) => [l.slug as string, l]));

  for (const s of slugs) {
    const l = lignes.get(s);
    if (!l) throw new Error(`${s} : absent de la base`);
    if (l.secteur !== secteur) throw new Error(`${s} : secteur ≠ ${secteur}, refus`);
  }

  const aAppliquer = corrections
    .map((c) => ({ slug: c.slug, diff: diffCorrection(c, lignes.get(c.slug)!) }))
    .filter((a) => Object.keys(a.diff).length > 0);
  for (const a of aAppliquer) {
    const l = lignes.get(a.slug)!;
    const detail = Object.keys(a.diff).map((k) => (['justification_editeur', 'prompt', 'ce_que_vous_perdez'].includes(k) ? k : `${k}: ${JSON.stringify(l[k])} → ${JSON.stringify(a.diff[k])}`));
    console.log(`~ ${a.slug} : ${detail.join(' ; ')}`);
  }
  retirer.forEach((s) => console.log(`- ${s} : fiche retirée (votes supprimés en cascade)`));
  console.log(`\nRésumé : ${aAppliquer.length} fiche(s) à corriger, ${retirer.length} à retirer.`);

  if (!apply) return void console.log('Simulation : rien écrit en base. Relancer avec --apply.');

  const sauvegarde = `${process.env.HOME}/claude/casevibecode-sauvegarde-corrections-chr-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(sauvegarde, JSON.stringify([...lignes.values()], null, 1), { mode: 0o600 });
  console.log(`Sauvegarde : ${sauvegarde}`);

  for (const a of aAppliquer) {
    const { error: e } = await client.from('logiciels').update(a.diff).eq('slug', a.slug);
    if (e) throw new Error(`${a.slug} : ${e.message}`);
    console.log(`✓ ${a.slug}`);
  }
  for (const s of retirer) {
    const { error: e } = await client.from('logiciels').delete().eq('slug', s);
    if (e) throw new Error(`${s} : ${e.message}`);
    console.log(`✓ ${s} retirée`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
