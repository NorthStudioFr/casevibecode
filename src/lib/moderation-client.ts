import { getSupabaseBrowser } from './supabase/client';

export interface RetourAModerer {
  id: string;
  logiciel_slug: string;
  type: 'construit' | 'casse';
  texte: string;
  lien: string | null;
  langue: 'fr' | 'en';
  created_at: string;
}
export interface PropositionATraiter {
  id: string;
  nom: string;
  url: string | null;
  raison: string | null;
  langue: 'fr' | 'en';
  created_at: string;
}

// Réservé aux administrateurs : la RLS ne renvoie rien aux autres (ni les retours en
// attente, ni les propositions).
export async function listerRetoursEnAttente(): Promise<RetourAModerer[]> {
  const { data, error } = await getSupabaseBrowser()
    .from('retours')
    .select('id, logiciel_slug, type, texte, lien, langue, created_at')
    .eq('statut', 'en_attente')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as RetourAModerer[];
}

export async function moderer(id: string, statut: 'publie' | 'refuse'): Promise<void> {
  const { data, error } = await getSupabaseBrowser()
    .from('retours')
    .update({ statut, modere_le: new Date().toISOString() })
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Modération refusée : droits administrateur requis.');
}

export async function listerPropositions(): Promise<PropositionATraiter[]> {
  const { data, error } = await getSupabaseBrowser()
    .from('propositions')
    .select('id, nom, url, raison, langue, created_at')
    .eq('traitee', false)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as PropositionATraiter[];
}

export async function marquerTraitee(id: string): Promise<void> {
  const { data, error } = await getSupabaseBrowser().from('propositions').update({ traitee: true }).eq('id', id).select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Action refusée : droits administrateur requis.');
}
