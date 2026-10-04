import type { Logiciel } from '@/types/logiciel';
import type { Lang } from '@/lib/i18n/config';
import fichesEn from '@/content/en/fiches.json';

// Les fiches sont écrites en français (base de données). Les traductions vivent
// dans le dépôt, une entrée par fiche, relues à la main : aucun appel à une IA au
// moment de la requête. Une fiche sans traduction reste en français et n'est pas
// proposée aux moteurs de recherche dans l'autre langue.
export interface TraductionFiche {
  description: string;
  justification: string;
  perdez?: string[];
  prompt?: string;
  // Descriptions des alternatives, dans le même ordre que la fiche française.
  alternatives?: string[];
}

const TRADUCTIONS: Record<Exclude<Lang, 'fr'>, Record<string, TraductionFiche>> = {
  en: fichesEn as Record<string, TraductionFiche>,
};

export function traductionDe(slug: string, lang: Lang): TraductionFiche | undefined {
  if (lang === 'fr') return undefined;
  return TRADUCTIONS[lang][slug];
}

export function appliquerTraduction(l: Logiciel, lang: Lang): Logiciel {
  if (lang === 'fr') return l;
  const tr = traductionDe(l.slug, lang);
  if (!tr) return { ...l, traduit: false };
  return {
    ...l,
    traduit: true,
    description: tr.description,
    justificationEditeur: tr.justification,
    ...(l.ceQueVousPerdez ? { ceQueVousPerdez: tr.perdez ?? l.ceQueVousPerdez } : {}),
    ...(l.prompt ? { prompt: tr.prompt ?? l.prompt } : {}),
    ...(l.alternatives
      ? {
          alternatives: l.alternatives.map((a, i) => ({ ...a, description: tr.alternatives?.[i] ?? a.description })),
        }
      : {}),
  };
}
