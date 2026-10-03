import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Client pour les lectures côté serveur (pages, sitemap, llms.txt). Il utilise
// la clé publique « anon » : les fiches et les compteurs de votes sont publics
// par RLS. Aucune session n'est conservée (rien n'est propre à un visiteur).
// La clé « service_role » n'est JAMAIS utilisée ici : elle est réservée aux
// scripts locaux.
// Vrai pendant `next build` quand les variables publiques Supabase sont absentes
// (build de CI sans secrets : il doit vérifier types et compilation sans base).
// Les lectures serveur renvoient alors des données vides au lieu de lever. En
// production, Vercel pose les variables : cette branche n'est jamais empruntée et
// une variable manquante à l'exécution reste une erreur franche.
export function isBuildWithoutSupabase(): boolean {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' &&
    !(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function getSupabaseServer(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies.');
  }
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies.');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
