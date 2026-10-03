import type { ValeurVote } from '@/types/vote';
import type { VoteCounts } from '@/lib/verdict';

// Vote sans compte : IP hashée côté serveur.
// Un vote par IP et par fiche : revoter remplace le précédent.
export async function castVote(logicielId: string, valeur: ValeurVote): Promise<{ counts?: VoteCounts }> {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logicielId, valeur }),
  });
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 429) throw new Error('Vous avez voté trop de fois récemment. Réessayez plus tard.');
    throw new Error(data.error || 'Erreur lors de l\'enregistrement du vote.');
  }

  return { counts: data.counts };
}
