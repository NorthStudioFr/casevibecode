import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.fn();
const insert = vi.fn();
const from = vi.fn(() => ({ insert }));
vi.mock('@/lib/supabase/server', () => ({ getSupabaseAdmin: () => ({ rpc, from }) }));

import { POST } from './route';

const post = (body: unknown) =>
  POST(
    new Request('http://x/api/contribution', {
      method: 'POST',
      headers: { 'x-forwarded-for': '9.9.9.9' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

const retour = { kind: 'retour', logicielId: 'notion', type: 'construit', texte: 'Un texte de retour assez long pour être accepté.', lien: '', langue: 'en' };

describe('POST /api/contribution', () => {
  beforeEach(() => {
    process.env.VOTE_IP_SALT = 's'.repeat(32);
    rpc.mockReset().mockResolvedValue({ data: true, error: null });
    insert.mockReset().mockResolvedValue({ error: null });
    from.mockClear();
  });

  it('enregistre un retour en attente avec une empreinte, jamais l’IP', async () => {
    const res = await post(retour);
    expect(res.status).toBe(201);
    expect(from).toHaveBeenCalledWith('retours');
    const row = insert.mock.calls[0][0];
    expect(row).toMatchObject({ logiciel_slug: 'notion', type: 'construit', langue: 'en', lien: null });
    expect(row.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(row)).not.toContain('9.9.9.9');
    // Pas de colonne « statut » : la base le pose à « en_attente ».
    expect(row).not.toHaveProperty('statut');
  });

  it('enregistre une proposition', async () => {
    const res = await post({ kind: 'proposition', nom: 'Tilby', url: 'https://www.tilby.com', raison: '' });
    expect(res.status).toBe(201);
    expect(from).toHaveBeenCalledWith('propositions');
    expect(insert.mock.calls[0][0]).toMatchObject({ nom: 'Tilby', url: 'https://www.tilby.com/', raison: null });
  });

  it('répond 429 au-delà de la limite, sans écrire', async () => {
    rpc.mockResolvedValueOnce({ data: false, error: null });
    expect((await post(retour)).status).toBe(429);
    expect(insert).not.toHaveBeenCalled();
  });

  it('répond 503 si la limite ne peut pas être vérifiée', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    expect((await post(retour)).status).toBe(503);
    expect(insert).not.toHaveBeenCalled();
  });

  it.each([
    [{ ...retour, texte: 'court' }, 'texte'],
    [{ ...retour, lien: 'http://pas-https.fr' }, 'lien'],
    [{ ...retour, site: 'spam' }, 'invalide'],
    ['pas du json', 'invalide'],
  ])('refuse un envoi invalide (%j) avec 400', async (body, erreur) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(erreur);
    expect(insert).not.toHaveBeenCalled();
  });

  it('refuse une fiche inconnue (clé étrangère) avec 400', async () => {
    insert.mockResolvedValueOnce({ error: { code: '23503', message: 'fk' } });
    const res = await post(retour);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('fiche');
  });
});
