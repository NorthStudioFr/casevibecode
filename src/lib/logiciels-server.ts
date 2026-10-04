import { unstable_cache } from 'next/cache';
import { getSupabaseServer, isBuildWithoutSupabase } from './supabase/server';
import type { Logiciel } from '@/types/logiciel';
import type { VoteCounts } from './verdict';
import { mapLogicielRow, type LogicielRow } from './logiciel-doc';
import { appliquerTraduction } from './traductions';
import { DEFAULT_LANG, type Lang } from './i18n/config';

// Lecture de toute la liste (133+ fiches et plus), utilisée par chaque page de
// fiche (navigation précédent/suivant), l'accueil, le sitemap et llms.txt.
// Mise en cache indépendamment de la revalidation propre à chaque page pour ne
// pas relire toute la table à chaque régénération de fiche. 5 min (comme les
// pages) : une fiche ajoutée ou modifiée apparaît vite, et Supabase n'a pas de
// quota de lecture à ménager comme Firestore.
const getLogicielsCached = unstable_cache(
  async (): Promise<Logiciel[]> => {
    const { data, error } = await getSupabaseServer().from('logiciels').select('*').order('slug');
    if (error) throw error;
    return (data as LogicielRow[]).map(mapLogicielRow);
  },
  ['logiciels-all'],
  { revalidate: 300 },
);

// Le cas « build de CI sans variables » reste HORS du cache : sinon la liste vide qu'il
// produit serait mémorisée (cache de données de Next, persistant d'un build à l'autre) et
// resservie pendant une heure aux builds suivants, même une fois les variables posées.
// La liste en cache est toujours en français ; la traduction est appliquée en mémoire
// (src/content/en), sans lecture de base de plus.
export async function getLogiciels(lang: Lang = DEFAULT_LANG): Promise<Logiciel[]> {
  if (isBuildWithoutSupabase()) return [];
  const liste = await getLogicielsCached();
  return lang === DEFAULT_LANG ? liste : liste.map((l) => appliquerTraduction(l, lang));
}

export async function getLogicielBySlug(slug: string, lang: Lang = DEFAULT_LANG): Promise<Logiciel | null> {
  if (isBuildWithoutSupabase()) return null;
  const { data, error } = await getSupabaseServer().from('logiciels').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? appliquerTraduction(mapLogicielRow(data as LogicielRow), lang) : null;
}

export async function getVoteCounts(logicielId: string): Promise<VoteCounts> {
  if (isBuildWithoutSupabase()) return { remplace: 0, pasRemplacable: 0 };
  const { data, error } = await getSupabaseServer().rpc('vote_counts', { p_slug: logicielId });
  if (error) throw error;
  const row = (data as { remplace: number; pas_remplacable: number }[] | null)?.[0];
  return { remplace: row?.remplace ?? 0, pasRemplacable: row?.pas_remplacable ?? 0 };
}
