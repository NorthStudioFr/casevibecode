import { describe, expect, it } from 'vitest';
import { colonnesInterdites, diffCorrection } from './corrections-chr';

describe('corrections CHR', () => {
  it('refuse les colonnes hors liste (alternatives, source, votes…)', () => {
    expect(colonnesInterdites({ slug: 'x', prix: null, alternatives: [], source_verdict: 'a' })).toEqual(['alternatives', 'source_verdict']);
  });
  it('ne renvoie que ce qui diffère, null compris', () => {
    const ligne = { prix: 'à partir de 13 €', domaine: '', verdict_editeur: 'YES' };
    expect(diffCorrection({ slug: 'x', prix: null, domaine: 'a.fr', verdict_editeur: 'YES' }, ligne)).toEqual({ prix: null, domaine: 'a.fr' });
  });
  it('ignore les colonnes absentes de la correction', () => {
    expect(diffCorrection({ slug: 'x' }, { prix: '1 €' })).toEqual({});
  });
});
