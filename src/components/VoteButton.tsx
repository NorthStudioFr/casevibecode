'use client';

import { useState } from 'react';
import { castVote } from '@/lib/votes-client';
import type { VoteCounts } from '@/lib/verdict';
import type { ValeurVote } from '@/types/vote';
import { useLocale } from '@/lib/i18n/LocaleProvider';

export function VoteButton({
  logicielId,
  initialCounts,
}: {
  logicielId: string;
  initialCounts: VoteCounts;
}) {
  const { t } = useLocale();
  const [counts, setCounts] = useState(initialCounts);
  const [voteError, setVoteError] = useState<string | null>(null);

  async function handleVote(valeur: ValeurVote) {
    setVoteError(null);
    const key = valeur === 'remplace' ? 'remplace' : 'pasRemplacable';
    
    // Optimistic update
    setCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    try {
      const result = await castVote(logicielId, valeur);
      if (result.counts) {
        setCounts(result.counts);
      }
    } catch (err: unknown) {
      console.error('castVote failed', err);
      // Rollback
      setCounts((prev) => ({ ...prev, [key]: prev[key] - 1 }));
      setVoteError((err instanceof Error && err.message) || t.vote.failed);
    }
  }

  return (
    <div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handleVote('remplace')}
          className="rounded-sm border border-slate-300 px-4 py-2 transition-colors hover:border-secondary hover:text-secondary"
        >
          {t.vote.replaced} (<span>{counts.remplace}</span>)
        </button>
        <button
          type="button"
          onClick={() => handleVote('pas_remplacable')}
          className="rounded-sm border border-slate-300 px-4 py-2 transition-colors hover:border-secondary hover:text-secondary"
        >
          {t.vote.notReplaceable} (<span>{counts.pasRemplacable}</span>)
        </button>
      </div>
      {voteError && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {voteError}
        </p>
      )}
    </div>
  );
}
