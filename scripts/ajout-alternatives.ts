// Usage : npx --yes tsx scripts/ajout-alternatives.ts [fichier.json] [--apply]
// (fichier par défaut : scripts/data/alternatives-ajouts.json)
//
// AJOUTE des alternatives à des fiches existantes, sans jamais en retirer ni
// toucher une autre colonne. Une alternative dont l'URL figure déjà sur la fiche
// est ignorée. Sans --apply : simulation (la base n'est que LUE). Avec --apply :
// sauvegarde d'abord les fiches touchées dans
// ../casevibecode-sauvegarde-alternatives-<date>.json (hors dépôt), 
// Dans les deux cas, écrit scripts/data/alternatives-ajoutees.json (slug → URL
// réellement ajoutées) pour aligner les traductions anglaises.
import { readFileSync, writeFileSync } from 'fs';
import { getServiceClient } from './lib/supabase-admin';

type Ajout = { nom: string; url: string; type: string; description: string };
const apply = process.argv.includes('--apply');
const fichier = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'scripts/data/alternatives-ajouts.json';
const ajouts = JSON.parse(readFileSync(fichier, 'utf8')) as Record<string, Ajout[]>;
const norm = (u: string) => u.toLowerCase().replace(/\/+$/, '');

async function main() {
  const client = getServiceClient();
  const { data, error } = await client.from('logiciels').select('slug, alternatives').in('slug', Object.keys(ajouts));
  if (error) throw error;
  const lignes = new Map((data as { slug: string; alternatives: Ajout[] | null }[]).map((l) => [l.slug, l]));
  const faits: Record<string, string[]> = {};
  const aEcrire: { slug: string; alternatives: Ajout[] }[] = [];
  for (const [slug, liste] of Object.entries(ajouts)) {
    const l = lignes.get(slug);
    if (!l) throw new Error(`${slug} : absent de la base`);
    const existantes = l.alternatives ?? [];
    const vues = new Set(existantes.map((a) => norm(a.url)));
    const nouvelles = liste.filter((a) => !vues.has(norm(a.url))).map(({ nom, url, type, description }) => ({ nom, url, type, description }));
    if (!nouvelles.length) continue;
    faits[slug] = nouvelles.map((a) => a.url);
    aEcrire.push({ slug, alternatives: [...existantes, ...nouvelles] });
    console.log(`~ ${slug} : ${existantes.length} → ${existantes.length + nouvelles.length} (${nouvelles.map((a) => a.nom).join(', ')})`);
  }
  writeFileSync('scripts/data/alternatives-ajoutees.json', JSON.stringify(faits, null, 1));
  if (!apply) return console.log(`Simulation : ${aEcrire.length} fiches, rien écrit. Relancer avec --apply.`);
  const sauvegarde = `../casevibecode-sauvegarde-alternatives-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(sauvegarde, JSON.stringify(aEcrire.map((e) => lignes.get(e.slug)), null, 1));
  for (const e of aEcrire) {
    const { error: err } = await client.from('logiciels').update({ alternatives: e.alternatives }).eq('slug', e.slug);
    if (err) throw new Error(`${e.slug} : ${err.message}`);
    console.log(`✓ ${e.slug}`);
  }
  console.log(`Sauvegarde : ${sauvegarde}`);
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
