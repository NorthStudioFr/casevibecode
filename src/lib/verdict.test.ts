import { describe, it, expect } from 'vitest';
import { computeVerdictDisplay } from './verdict';

describe('computeVerdictDisplay', () => {
  it('returns the editor verdict when total votes are below the 20-vote threshold', () => {
    const result = computeVerdictDisplay('KINDA', { remplace: 10, pasRemplacable: 5 });
    expect(result).toEqual({ verdict: 'KINDA', source: 'editeur', totalVotes: 15 });
  });

  it('returns YES from the community once the threshold is reached and remplace wins', () => {
    const result = computeVerdictDisplay('NOT_REALLY', { remplace: 15, pasRemplacable: 5 });
    expect(result).toEqual({ verdict: 'YES', source: 'communaute', totalVotes: 20 });
  });

  it('returns NOT_REALLY from the community once the threshold is reached and pasRemplacable wins', () => {
    const result = computeVerdictDisplay('YES', { remplace: 5, pasRemplacable: 16 });
    expect(result).toEqual({ verdict: 'NOT_REALLY', source: 'communaute', totalVotes: 21 });
  });
});
