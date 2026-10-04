import { describe, expect, it } from 'vitest';
import { problemesNouvelleFiche } from './ajout-fiches-chr';
import fiches from '../data/nouvelles-fiches-chr.json';

describe('problemesNouvelleFiche', () => {
  it('accepte les fiches du lot', () => {
    for (const f of fiches) expect(problemesNouvelleFiche(f)).toEqual([]);
  });
  it('refuse un verdict, un slug ou un secteur invalide', () => {
    const p = problemesNouvelleFiche({ ...fiches[0], verdict_editeur: 'MAYBE', slug: 'Bad Slug', secteur: 'saas' });
    expect(p).toHaveLength(3);
  });
});
