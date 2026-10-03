import { readFileSync, existsSync } from 'node:fs';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Client « service_role » pour les scripts exécutés en LOCAL uniquement. La
// clé contourne la RLS : elle ne doit jamais être dans Vercel ni dans le
// navigateur. Lue dans l'environnement ou dans .env.local (ignoré par git).
function readEnvFile(): Record<string, string> {
  if (!existsSync('.env.local')) return {};
  return Object.fromEntries(
    readFileSync('.env.local', 'utf8')
      .split('\n')
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]),
  );
}

export function getServiceClient(): SupabaseClient {
  const file = readEnvFile();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? file.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? file.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies (environnement ou .env.local).');
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
