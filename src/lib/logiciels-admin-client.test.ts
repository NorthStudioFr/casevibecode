import { describe, it, expect, vi, beforeEach } from 'vitest';

const maybeSingleMock = vi.fn();
const updateSelectMock = vi.fn();
const updateEqMock = vi.fn(() => ({ select: updateSelectMock }));
const updateMock = vi.fn(() => ({ eq: updateEqMock }));
const insertMock = vi.fn();
const orderMock = vi.fn();
const selectEqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
const selectMock = vi.fn(() => ({ eq: selectEqMock, order: orderMock }));
const fromMock = vi.fn(() => ({ select: selectMock, update: updateMock, insert: insertMock }));
vi.mock('./supabase/client', () => ({ getSupabaseBrowser: () => ({ from: fromMock }) }));

const NEW = {
  nom: 'Fudger',
  slug: 'fudger',
  categorie: 'caisse' as const,
  secteur: 'chr' as const,
  description: '',
  verdictEditeur: 'YES' as const,
  justificationEditeur: '',
  domaine: '',
};

describe('logiciels-admin-client', () => {
  beforeEach(() => {
    [maybeSingleMock, updateSelectMock, updateEqMock, updateMock, insertMock, orderMock, selectEqMock, selectMock, fromMock]
      .forEach((m) => m.mockClear());
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    insertMock.mockResolvedValue({ error: null });
    updateSelectMock.mockResolvedValue({ data: [{ slug: 'fudger' }], error: null });
  });

  it('saveLogiciel inserts a new row, without dates (the database sets date_ajout and date_maj)', async () => {
    const { saveLogiciel } = await import('./logiciels-admin-client');
    await saveLogiciel(NEW);

    expect(fromMock).toHaveBeenCalledWith('logiciels');
    expect(insertMock).toHaveBeenCalledTimes(1);
    const [payload] = insertMock.mock.calls[0] as unknown as [Record<string, unknown>];
    expect(payload).toMatchObject({ slug: 'fudger', nom: 'Fudger', verdict_editeur: 'YES' });
    expect(payload).not.toHaveProperty('date_ajout');
    expect(payload).not.toHaveProperty('date_maj');
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('saveLogiciel updates an existing row and never sends date_ajout, preserving its original value', async () => {
    maybeSingleMock.mockResolvedValue({ data: { slug: 'fudger' }, error: null });
    const { saveLogiciel } = await import('./logiciels-admin-client');
    await saveLogiciel(NEW);

    expect(updateEqMock).toHaveBeenCalledWith('slug', 'fudger');
    const [payload] = updateMock.mock.calls[0] as unknown as [Record<string, unknown>];
    expect(payload).not.toHaveProperty('date_ajout');
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('saveLogiciel fails loudly when an update changes no row (RLS: not an admin)', async () => {
    maybeSingleMock.mockResolvedValue({ data: { slug: 'fudger' }, error: null });
    updateSelectMock.mockResolvedValue({ data: [], error: null });
    const { saveLogiciel } = await import('./logiciels-admin-client');
    await expect(saveLogiciel(NEW)).rejects.toThrow(/droits administrateur/);
  });

  it('saveLogiciel throws when the insert is rejected', async () => {
    insertMock.mockResolvedValue({ error: new Error('new row violates row-level security policy') });
    const { saveLogiciel } = await import('./logiciels-admin-client');
    await expect(saveLogiciel(NEW)).rejects.toThrow(/row-level security/);
  });

  it('getLogicielClient returns the mapped fiche, or null when absent', async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        slug: 'zenchef', nom: 'Zenchef', categorie: 'reservation', secteur: 'chr', description: 'd', verdict_editeur: 'YES',
        justification_editeur: 'j', domaine: 'z.com', prix: '29 €/mois', prix_mensuel: 29,
        ce_que_vous_perdez: null, alternatives: null, prompt: null, source_verdict: null,
        date_ajout: '2026-10-01T00:00:00.000Z', date_maj: '2026-10-02T00:00:00.000Z',
      },
      error: null,
    });
    const { getLogicielClient } = await import('./logiciels-admin-client');
    expect(await getLogicielClient('zenchef')).toMatchObject({ slug: 'zenchef', prixMensuel: 29, verdictEditeur: 'YES' });
    expect(selectEqMock).toHaveBeenCalledWith('slug', 'zenchef');

    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    expect(await getLogicielClient('inconnu')).toBeNull();
  });

  it('listLogicielsClient maps rows to Logiciel objects with numeric dates', async () => {
    orderMock.mockResolvedValue({
      data: [{
        slug: 'fudger', nom: 'Fudger', categorie: 'caisse', secteur: 'chr', description: '', verdict_editeur: 'YES',
        justification_editeur: '', domaine: '', prix: null, prix_mensuel: null, ce_que_vous_perdez: null,
        alternatives: null, prompt: null, source_verdict: null, date_ajout: '2026-10-01T00:00:00.000Z', date_maj: '2026-10-02T00:00:00.000Z',
      }],
      error: null,
    });
    const { listLogicielsClient } = await import('./logiciels-admin-client');
    const result = await listLogicielsClient();
    expect(result[0]).toMatchObject({ id: 'fudger', dateAjout: Date.parse('2026-10-01T00:00:00.000Z') });
    expect(typeof result[0].dateMaj).toBe('number');
  });
});
