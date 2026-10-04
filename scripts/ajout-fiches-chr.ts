// Usage : npx --yes tsx scripts/ajout-fiches-chr.ts [fichier.json] [--apply]
// (fichier par défaut : scripts/data/nouvelles-fiches-chr.json)
//
// INSÈRE de nouvelles fiches CHR. Jamais d'upsert : un slug déjà en base fait
// échouer le script. Sans --apply : simulation, la base n'est que LUE.
import { readFileSync } from 'fs';
import { getServiceClient } from './lib/supabase-admin';
import { mapNouveauLogicielToRow } from '../src/lib/logiciel-doc';
import { problemesNouvelleFiche } from './lib/ajout-fiches-chr';
import type { NouveauLogicielInput } from '../src/types/logiciel';

const apply = process.argv.includes('--apply');
const fichier = process.argv.slice(2).find((a) => !a.startsWith('--')) ?? 'scripts/data/nouvelles-fiches-chr.json';
const fiches = JSON.parse(readFileSync(fichier, 'utf8')) as Record<string, unknown>[];

async function main() {
  const problemes = fiches.flatMap((f) => problemesNouvelleFiche(f).map((p) => `${f.slug} : ${p}`));
  if (problemes.length) throw new Error(problemes.join('\n'));

  const client = getServiceClient();
  const { data, error } = await client.from('logiciels').select('slug').in('slug', fiches.map((f) => f.slug as string));
  if (error) throw error;
  if (data.length) throw new Error(`Déjà en base : ${data.map((d) => d.slug).join(', ')}`);

  const lignes = fiches.map((f) => mapNouveauLogicielToRow({ ...(f as object), verdictEditeur: f.verdict_editeur, justificationEditeur: f.justification_editeur, ceQueVousPerdez: f.ce_que_vous_perdez, prixMensuel: f.prix_mensuel, sourceVerdict: f.source_verdict } as unknown as NouveauLogicielInput));
  for (const l of lignes) console.log(`+ ${l.slug} (${l.categorie}, ${l.verdict_editeur})`);
  if (!apply) return console.log('Simulation : rien écrit. Relancer avec --apply.');
  const { error: e } = await client.from('logiciels').insert(lignes);
  if (e) throw e;
  console.log(`${lignes.length} fiches insérées.`);
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
