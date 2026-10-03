import { describe, it, expect } from 'vitest';
import { mapLogicielRow, mapNouveauLogicielToRow, type LogicielRow } from './logiciel-doc';

const baseRow: LogicielRow = {
  slug: 'zenchef',
  nom: 'Zenchef',
  categorie: 'reservation',
  secteur: 'chr',
  description: 'desc',
  verdict_editeur: 'KINDA',
  justification_editeur: 'just',
  domaine: 'zenchef.com',
  prix: null,
  prix_mensuel: null,
  ce_que_vous_perdez: null,
  alternatives: null,
  prompt: null,
  source_verdict: null,
  date_ajout: '2026-10-01T10:00:00.000Z',
  date_maj: '2026-10-02T10:00:00.000Z',
};

describe('mapLogicielRow', () => {
  it('maps snake_case columns, uses the slug as id and converts dates to epoch millis', () => {
    expect(mapLogicielRow(baseRow)).toEqual({
      id: 'zenchef',
      slug: 'zenchef',
      nom: 'Zenchef',
      categorie: 'reservation',
      secteur: 'chr',
      description: 'desc',
      verdictEditeur: 'KINDA',
      justificationEditeur: 'just',
      domaine: 'zenchef.com',
      dateAjout: Date.parse('2026-10-01T10:00:00.000Z'),
      dateMaj: Date.parse('2026-10-02T10:00:00.000Z'),
    });
  });

  it('returns plain numbers for dates (safe across the RSC boundary)', () => {
    const l = mapLogicielRow(baseRow);
    expect(typeof l.dateAjout).toBe('number');
    expect(typeof l.dateMaj).toBe('number');
  });

  it('omits null optional fields and keeps the filled ones', () => {
    const l = mapLogicielRow({
      ...baseRow,
      prix: '29 €/mois',
      prix_mensuel: '29.5',
      ce_que_vous_perdez: ['a'],
      alternatives: [{ nom: 'X', url: 'https://x.test', type: 'gratuit', description: 'd' }],
      prompt: 'my prompt',
      source_verdict: 'my_source',
    });
    expect(l.prix).toBe('29 €/mois');
    expect(l.prixMensuel).toBe(29.5);
    expect(l.ceQueVousPerdez).toEqual(['a']);
    expect(l.alternatives).toHaveLength(1);
    expect(l.prompt).toBe('my prompt');
    expect(l.sourceVerdict).toBe('my_source');
    expect('prix' in mapLogicielRow(baseRow)).toBe(false);
    expect('prixMensuel' in mapLogicielRow(baseRow)).toBe(false);
    expect('alternatives' in mapLogicielRow(baseRow)).toBe(false);
  });
});

describe('mapNouveauLogicielToRow', () => {
  it('maps to columns, drops undefined fields and never sends dates', () => {
    const row = mapNouveauLogicielToRow({
      nom: 'Fudger',
      slug: 'fudger',
      categorie: 'caisse',
      secteur: 'saas',
      description: '',
      verdictEditeur: 'YES',
      justificationEditeur: '',
      domaine: '',
      prixMensuel: undefined,
    });
    expect(row).toEqual({
      slug: 'fudger',
      nom: 'Fudger',
      categorie: 'caisse',
      secteur: 'saas',
      description: '',
      verdict_editeur: 'YES',
      justification_editeur: '',
      domaine: '',
      prix: null,
      prix_mensuel: null,
      ce_que_vous_perdez: null,
      alternatives: null,
      prompt: null,
      source_verdict: null,
    });
    expect(row).not.toHaveProperty('date_ajout');
    expect(row).not.toHaveProperty('date_maj');
  });

  it('keeps optional fields that are set', () => {
    const row = mapNouveauLogicielToRow({
      nom: 'A',
      slug: 'a',
      categorie: 'autre',
      secteur: 'chr',
      description: '',
      verdictEditeur: 'NOT_REALLY',
      justificationEditeur: '',
      domaine: '',
      prix: '10 €/mois',
      prixMensuel: 10,
      ceQueVousPerdez: ['x'],
      alternatives: [],
      prompt: 'abc',
    });
    expect(row).toMatchObject({ prix: '10 €/mois', prix_mensuel: 10, ce_que_vous_perdez: ['x'], alternatives: [], prompt: 'abc' });
  });
});
