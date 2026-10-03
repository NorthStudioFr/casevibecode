import { describe, it, expect, vi } from 'vitest';

const SEED_LOGICIELS = [
  {
    slug: 'zenchef',
    nom: 'Zenchef',
    categorie: 'reservation' as const,
    secteur: 'chr' as const,
    description: 'desc',
    verdictEditeur: 'KINDA' as const,
    justificationEditeur: 'just',
    domaine: 'zenchef.com',
  },
];

describe('seedLogiciels', () => {
  it('upserts every fiche on the slug, without ever sending date_ajout or date_maj', async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    const client = { from: () => ({ upsert: upsertMock }) };

    const { seedLogiciels } = await import('./seed-logiciels');
    await seedLogiciels(client as never, SEED_LOGICIELS);

    expect(upsertMock).toHaveBeenCalledTimes(1);
    const [rows, options] = upsertMock.mock.calls[0];
    expect(options).toEqual({ onConflict: 'slug' });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ slug: 'zenchef', nom: 'Zenchef' });
    expect(rows[0]).not.toHaveProperty('date_ajout');
    expect(rows[0]).not.toHaveProperty('date_maj');
  });

  it('throws when the database rejects the upsert', async () => {
    const client = { from: () => ({ upsert: vi.fn().mockResolvedValue({ error: new Error('nope') }) }) };
    const { seedLogiciels } = await import('./seed-logiciels');
    await expect(seedLogiciels(client as never, SEED_LOGICIELS)).rejects.toThrow('nope');
  });
});
