// Usage : npx --yes tsx scripts/seed-logiciels.ts
// Upsert idempotent des fiches CHR de scripts/seed-data.ts et des fiches « outils
// du quotidien » déjà validées de scripts/data/fiches-saas.json. Relancer pousse une correction sans toucher à date_ajout : elle
// n'est jamais envoyée, donc posée par la base à la création seulement ;
// date_maj est mise à jour par le trigger.
import type { SupabaseClient } from '@supabase/supabase-js';
import { mapNouveauLogicielToRow } from '../src/lib/logiciel-doc';
import type { NouveauLogicielInput } from '../src/types/logiciel';
import { SEED_LOGICIELS } from './seed-data';
import fichesSaas from './data/fiches-saas.json';
import { getServiceClient } from './lib/supabase-admin';

export async function seedLogiciels(client: SupabaseClient, logiciels: NouveauLogicielInput[]): Promise<number> {
  const rows = logiciels.map(mapNouveauLogicielToRow);
  const { error } = await client.from('logiciels').upsert(rows, { onConflict: 'slug' });
  if (error) throw error;
  return rows.length;
}

if (require.main === module) {
  seedLogiciels(getServiceClient(), [...SEED_LOGICIELS, ...(fichesSaas as NouveauLogicielInput[])])
    .then((n) => console.log(`${n} fiches importées.`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
