import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.fn();
const insert = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  getSupabaseAdmin: () => ({ rpc, from: () => ({ insert }) }),
}));

import { POST } from './route';

const post = (body: unknown) =>
  POST(new Request('http://x/api/newsletter', { method: 'POST', headers: { 'x-forwarded-for': '9.9.9.9' }, body: JSON.stringify(body) }));

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    process.env.VOTE_IP_SALT = 's'.repeat(32);
    rpc.mockReset().mockResolvedValue({ data: true, error: null });
    insert.mockReset().mockResolvedValue({ error: null });
  });

  it('inscrit un e-mail valide', async () => {
    const res = await post({ email: ' a@b.fr ' });
    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledWith({ email: 'a@b.fr' });
  });

  it('traite un e-mail déjà inscrit comme un succès silencieux', async () => {
    insert.mockResolvedValue({ error: { code: '23505' } });
    expect((await post({ email: 'a@b.fr' })).status).toBe(200);
  });

  it.each(['', 'pas-un-email', 'a@b', 'x'.repeat(260) + '@b.fr'])('refuse %j avec 400', async (email) => {
    expect((await post({ email })).status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it('répond 429 au-delà de la limite partagée', async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    expect((await post({ email: 'a@b.fr' })).status).toBe(429);
    expect(insert).not.toHaveBeenCalled();
  });
});
