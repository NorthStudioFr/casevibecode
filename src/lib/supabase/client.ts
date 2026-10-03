import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Client navigateur (clé publique « anon » : l'accès aux données est borné par
// les règles RLS de la base, voir supabase/migrations). Créé à la demande et
// non à l'import : le build (CI, prérendu) n'a pas les variables d'environnement
// et ne doit pas échouer tant qu'aucune page ne s'en sert réellement.
let client: SupabaseClient | undefined;

export function getSupabaseBrowser(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
  }
  client = createClient(url, anonKey, { auth: { flowType: 'pkce' } });
  return client;
}
