import { getSupabaseBrowser } from './supabase/client';
import type { Logiciel, NouveauLogiciel } from '@/types/logiciel';
import { mapLogicielRow, mapNouveauLogicielToRow, type LogicielRow } from './logiciel-doc';

export async function getLogicielClient(slug: string): Promise<Logiciel | null> {
  const { data, error } = await getSupabaseBrowser().from('logiciels').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? mapLogicielRow(data as LogicielRow) : null;
}

export async function saveLogiciel(data: NouveauLogiciel): Promise<void> {
  const supabase = getSupabaseBrowser();
  const row = mapNouveauLogicielToRow(data);
  const { data: existing, error: lookupError } = await supabase
    .from('logiciels')
    .select('slug')
    .eq('slug', data.slug)
    .maybeSingle();
  if (lookupError) throw lookupError;

  if (existing) {
    // Modification : date_ajout n'est jamais envoyée (elle garde sa valeur
    // d'origine) et le trigger de la base met date_maj à jour. Sans droit
    // administrateur, la RLS ne modifie aucune ligne et ne renvoie pas d'erreur :
    // on la détecte avec select().
    const { data: updated, error } = await supabase
      .from('logiciels')
      .update(row)
      .eq('slug', data.slug)
      .select('slug');
    if (error) throw error;
    if (!updated || updated.length === 0) throw new Error("Modification refusée : droits administrateur requis.");
    return;
  }

  const { error } = await supabase.from('logiciels').insert(row);
  if (error) throw error;
}

export async function listLogicielsClient(): Promise<Logiciel[]> {
  const { data, error } = await getSupabaseBrowser().from('logiciels').select('*').order('slug');
  if (error) throw error;
  return (data as LogicielRow[]).map(mapLogicielRow);
}
