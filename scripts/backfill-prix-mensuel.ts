// Usage : npx --yes tsx scripts/backfill-prix-mensuel.ts [--apply]
// Sans --apply : simple rapport. Ne touche que la colonne prix_mensuel.
import type { SupabaseClient } from '@supabase/supabase-js';
import { parsePrixMensuel } from '../src/lib/prix';
import { getServiceClient } from './lib/supabase-admin';

export async function backfillPrixMensuel(client: SupabaseClient, apply: boolean) {
  const { data, error } = await client.from('logiciels').select('slug, prix');
  if (error) throw error;
  const updates: { slug: string; value: number }[] = [];
  const skipped: string[] = [];
  for (const { slug, prix } of data ?? []) {
    if (!prix) continue;
    const value = parsePrixMensuel(prix);
    if (value === undefined) skipped.push(`${slug}: ${prix}`);
    else updates.push({ slug, value });
  }
  if (apply) {
    for (const { slug, value } of updates) {
      const { error: e } = await client.from('logiciels').update({ prix_mensuel: value }).eq('slug', slug);
      if (e) throw e;
    }
  }
  return { parsed: updates.length, skipped };
}

if (require.main === module) {
  const apply = process.argv.includes('--apply');
  backfillPrixMensuel(getServiceClient(), apply)
    .then(({ parsed, skipped }) => {
      console.log(`${parsed} prix chiffrés ; ${skipped.length} non chiffrables :`);
      skipped.forEach((s) => console.log('  -', s));
      console.log(apply ? 'Appliqué.' : 'Dry-run (ajouter --apply pour écrire).');
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
