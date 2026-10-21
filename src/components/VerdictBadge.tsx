'use client';

import type { VerdictEditeur } from '@/types/logiciel';
import { useLocale } from '@/lib/i18n/LocaleProvider';

// Seul « Remplaçable » (une action possible) est en aplat. « Pas remplaçable » concerne la majorité du
// catalogue et n'est pas une alerte (souvent : « gardez l'outil ») : contour et pastille de couleur sur
// texte neutre, pour ne pas transformer toute la liste en mur de rouge, et pour tenir le contraste AA
// dans les deux thèmes (le texte n'est jamais en rouge ni en ambre).
const COLORS: Record<VerdictEditeur, string> = {
  YES: 'bg-primary text-primary-ink',
  KINDA: 'border border-kinda text-slate-800',
  NOT_REALLY: 'border border-no text-slate-800',
};
const DOT: Partial<Record<VerdictEditeur, string>> = { KINDA: 'bg-kinda', NOT_REALLY: 'bg-no' };

export function VerdictBadge({
  verdict,
  big = false,
  court = false,
}: {
  verdict: VerdictEditeur;
  big?: boolean;
  court?: boolean;
}) {
  const { t } = useLocale();
  const size = big ? 'px-4 py-1.5 text-lg' : 'px-2.5 py-0.5 text-xs';
  const label = court ? t.verdictCourt[verdict] : t.verdict[verdict];
  return (
    <span className={`inline-block whitespace-nowrap rounded-sm font-bold ${size} ${COLORS[verdict]}`}>
      {DOT[verdict] && <span className={`mr-1.5 inline-block h-2 w-2 rounded-full align-middle ${DOT[verdict]}`} aria-hidden="true" />}
      {label}
    </span>
  );
}
