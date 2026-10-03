import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.fn();
const upsert = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  getSupabaseAdmin: () => ({ rpc, from: () => ({ upsert }) }),
}));

import { POST } from './route';

const post = (body: unknown) =>
  POST(
    new Request('http://x/api/vote', {
      method: 'POST',
      headers: { 'x-forwarded-for': '9.9.9.9' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

describe('POST /api/vote', () => {
  beforeEach(() => {
    process.env.VOTE_IP_SALT = 's'.repeat(32);
    rpc.mockReset();
    upsert.mockReset();
    // 1er appel : rate_limit_hit, 2e : vote_counts
    rpc.mockImplementation(async (fn: string) =>
      fn === 'rate_limit_hit' ? { data: true, error: null } : { data: [{ remplace: 3, pas_remplacable: 1 }], error: null },
    );
    upsert.mockResolvedValue({ error: null });
  });

  it('enregistre le vote avec une empreinte (jamais l’IP) et renvoie les compteurs', async () => {
    const res = await post({ logicielId: 'zenchef', valeur: 'remplace' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, counts: { remplace: 3, pasRemplacable: 1 } });
    const [row, opts] = upsert.mock.calls[0];
    expect(row.logiciel_slug).toBe('zenchef');
    expect(row.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(row)).not.toContain('9.9.9.9');
    expect(opts).toEqual({ onConflict: 'logiciel_slug,ip_hash' });
  });

  it('répond 429 quand la limite partagée est dépassée, sans écrire', async () => {
    rpc.mockResolvedValueOnce({ data: false, error: null });
    const res = await post({ logicielId: 'zenchef', valeur: 'remplace' });
    expect(res.status).toBe(429);
    expect(upsert).not.toHaveBeenCalled();
  });

  it('répond 503 (refus) si la limite ne peut pas être vérifiée', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    const res = await post({ logicielId: 'zenchef', valeur: 'remplace' });
    expect(res.status).toBe(503);
    expect(upsert).not.toHaveBeenCalled();
  });

  it.each([{ logicielId: 'z', valeur: 'nimporte' }, { valeur: 'remplace' }, 'pas du json'])(
    'refuse une requête invalide (%j) avec 400',
    async (body) => {
      expect((await post(body)).status).toBe(400);
      expect(upsert).not.toHaveBeenCalled();
    },
  );

  it('répond 400 pour une fiche inconnue (violation de clé étrangère)', async () => {
    upsert.mockResolvedValue({ error: { code: '23503' } });
    expect((await post({ logicielId: 'inconnu', valeur: 'remplace' })).status).toBe(400);
  });

  it('échoue franchement (500) sans VOTE_IP_SALT, sans valeur par défaut', async () => {
    delete process.env.VOTE_IP_SALT;
    expect((await post({ logicielId: 'zenchef', valeur: 'remplace' })).status).toBe(500);
    expect(upsert).not.toHaveBeenCalled();
  });
});
