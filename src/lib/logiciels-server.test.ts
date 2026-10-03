import { describe, it, expect, vi, beforeEach } from 'vitest';

const row = (slug: string, extra: Record<string, unknown> = {}) => ({
  slug,
  nom: slug,
  categorie: 'reservation',
  description: 'd',
  verdict_editeur: 'KINDA',
  justification_editeur: 'j',
  domaine: `${slug}.com`,
  prix: null,
  prix_mensuel: null,
  ce_que_vous_perdez: null,
  alternatives: null,
  date_ajout: '2026-10-01T00:00:00.000Z',
  date_maj: '2026-10-02T00:00:00.000Z',
  ...extra,
});

describe('logiciels-server', () => {
  const orderMock = vi.fn();
  const maybeSingleMock = vi.fn();
  const eqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
  const selectMock = vi.fn(() => ({ order: orderMock, eq: eqMock }));
  const fromMock = vi.fn(() => ({ select: selectMock }));
  const rpcMock = vi.fn();
  let buildWithoutSupabase = false;
  const cacheEntered = vi.fn();

  beforeEach(() => {
    buildWithoutSupabase = false;
    vi.resetModules();
    [orderMock, maybeSingleMock, eqMock, selectMock, fromMock, rpcMock, cacheEntered].forEach((m) => m.mockClear());
    vi.doMock('./supabase/server', () => ({
      getSupabaseServer: () => ({ from: fromMock, rpc: rpcMock }),
      isBuildWithoutSupabase: () => buildWithoutSupabase,
    }));
    // unstable_cache needs a real Next.js request context (incrementalCache),
    // which doesn't exist under Vitest; make it a passthrough here so these
    // tests exercise the underlying fetch/mapping logic instead.
    vi.doMock('next/cache', () => ({
      unstable_cache:
        (fn: (...args: unknown[]) => unknown) =>
        (...args: unknown[]) => {
          cacheEntered();
          return fn(...args);
        },
    }));
  });

  it("build sans variables : liste vide renvoyée HORS du cache (jamais mémorisée par Next)", async () => {
    buildWithoutSupabase = true;
    const { getLogiciels } = await import('./logiciels-server');
    expect(await getLogiciels()).toEqual([]);
    expect(cacheEntered).not.toHaveBeenCalled();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('getLogiciels reads the whole table and maps rows to Logiciel objects with numeric dates', async () => {
    orderMock.mockResolvedValue({ data: [row('zenchef'), row('fudger', { prix_mensuel: 29 })], error: null });

    const { getLogiciels } = await import('./logiciels-server');
    const result = await getLogiciels();

    expect(fromMock).toHaveBeenCalledWith('logiciels');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(result.map((l) => l.id)).toEqual(['zenchef', 'fudger']);
    expect(result[0]).toMatchObject({
      nom: 'zenchef',
      verdictEditeur: 'KINDA',
      dateAjout: Date.parse('2026-10-01T00:00:00.000Z'),
      dateMaj: Date.parse('2026-10-02T00:00:00.000Z'),
    });
    expect(typeof result[0].dateAjout).toBe('number');
    expect(result[1].prixMensuel).toBe(29);
  });

  it('getLogiciels throws when the query fails (no silent empty list)', async () => {
    orderMock.mockResolvedValue({ data: null, error: new Error('boom') });
    const { getLogiciels } = await import('./logiciels-server');
    await expect(getLogiciels()).rejects.toThrow('boom');
  });

  it('getLogicielBySlug filters on the slug and maps the row', async () => {
    maybeSingleMock.mockResolvedValue({ data: row('fudger'), error: null });
    const { getLogicielBySlug } = await import('./logiciels-server');
    const result = await getLogicielBySlug('fudger');

    expect(eqMock).toHaveBeenCalledWith('slug', 'fudger');
    expect(result).toMatchObject({ id: 'fudger', slug: 'fudger', dateAjout: Date.parse('2026-10-01T00:00:00.000Z') });
    expect(typeof result?.dateMaj).toBe('number');
  });

  it('getLogicielBySlug returns null when no match is found', async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    const { getLogicielBySlug } = await import('./logiciels-server');
    expect(await getLogicielBySlug('inconnu')).toBeNull();
  });

  it('getLogicielBySlug throws when the query fails', async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: new Error('down') });
    const { getLogicielBySlug } = await import('./logiciels-server');
    await expect(getLogicielBySlug('x')).rejects.toThrow('down');
  });

  it('getVoteCounts calls the vote_counts function and maps the counts', async () => {
    rpcMock.mockResolvedValue({ data: [{ remplace: 12, pas_remplacable: 3 }], error: null });
    const { getVoteCounts } = await import('./logiciels-server');
    const result = await getVoteCounts('zenchef');

    expect(rpcMock).toHaveBeenCalledWith('vote_counts', { p_slug: 'zenchef' });
    expect(result).toEqual({ remplace: 12, pasRemplacable: 3 });
  });

  it('getVoteCounts returns zeros when the function returns no row, and throws on error', async () => {
    rpcMock.mockResolvedValue({ data: [], error: null });
    const { getVoteCounts } = await import('./logiciels-server');
    expect(await getVoteCounts('zenchef')).toEqual({ remplace: 0, pasRemplacable: 0 });

    rpcMock.mockResolvedValue({ data: null, error: new Error('rpc down') });
    await expect(getVoteCounts('zenchef')).rejects.toThrow('rpc down');
  });

  it('returns empty data without touching the database during a CI build without Supabase variables', async () => {
    buildWithoutSupabase = true;
    const { getLogiciels, getLogicielBySlug, getVoteCounts } = await import('./logiciels-server');
    expect(await getLogiciels()).toEqual([]);
    expect(await getLogicielBySlug('zenchef')).toBeNull();
    expect(await getVoteCounts('zenchef')).toEqual({ remplace: 0, pasRemplacable: 0 });
    expect(fromMock).not.toHaveBeenCalled();
    expect(rpcMock).not.toHaveBeenCalled();
  });
});
