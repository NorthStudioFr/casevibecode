import type { VerdictEditeur } from '@/types/logiciel';

export interface VoteCounts {
  remplace: number;
  pasRemplacable: number;
}

export interface VerdictDisplay {
  verdict: VerdictEditeur;
  source: 'editeur' | 'communaute';
  totalVotes: number;
}

export const SEUIL_VOTES_COMMUNAUTE = 20;

export const VERDICT_LABEL: Record<VerdictEditeur, string> = {
  YES: 'Remplaçable',
  KINDA: 'Partiellement remplaçable',
  NOT_REALLY: 'Pas remplaçable',
};

export function computeVerdictDisplay(
  verdictEditeur: VerdictEditeur,
  votes: VoteCounts
): VerdictDisplay {
  const totalVotes = votes.remplace + votes.pasRemplacable;

  if (totalVotes < SEUIL_VOTES_COMMUNAUTE) {
    return { verdict: verdictEditeur, source: 'editeur', totalVotes };
  }

  const verdict: VerdictEditeur = votes.remplace > votes.pasRemplacable ? 'YES' : 'NOT_REALLY';
  return { verdict, source: 'communaute', totalVotes };
}
