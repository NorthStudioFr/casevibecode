import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('castVote', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('posts the vote to /api/vote', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ success: true, counts: { remplace: 1, pasRemplacable: 0 } }) } as Response);
    const { castVote } = await import('./votes-client');
    const result = await castVote('zenchef', 'remplace');

    expect(fetch).toHaveBeenCalledWith('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logicielId: 'zenchef', valeur: 'remplace' }),
    });
    expect(result.counts).toEqual({ remplace: 1, pasRemplacable: 0 });
  });

  it('throws a specific error for 429 rate limit', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 429, json: async () => ({}) } as Response);
    const { castVote } = await import('./votes-client');
    await expect(castVote('zenchef', 'remplace')).rejects.toThrow('Vous avez voté trop de fois récemment');
  });

  it('throws an error with the server message when available', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: 'Requête invalide' }) } as Response);
    const { castVote } = await import('./votes-client');
    await expect(castVote('zenchef', 'remplace')).rejects.toThrow('Requête invalide');
  });
});
