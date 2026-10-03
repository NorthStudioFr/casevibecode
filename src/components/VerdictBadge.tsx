import type { VerdictEditeur } from '@/types/logiciel';
import { VERDICT_LABEL } from '@/lib/verdict';

// Couleurs du thème (globals.css) : vert phosphore / ambre / rouge, texte
// sombre sur fond saturé pour tenir le contraste AA dans les deux thèmes.
const COLORS: Record<VerdictEditeur, string> = {
  YES: 'bg-primary text-primary-ink',
  KINDA: 'bg-kinda text-on-kinda',
  NOT_REALLY: 'bg-no text-on-no',
};

export function VerdictBadge({ verdict, big = false }: { verdict: VerdictEditeur; big?: boolean }) {
  const size = big ? 'px-4 py-1.5 text-lg' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-block rounded-sm font-bold ${size} ${COLORS[verdict]}`}>
      {VERDICT_LABEL[verdict]}
    </span>
  );
}
