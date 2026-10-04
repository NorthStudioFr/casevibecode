import { describe, expect, it } from 'vitest';
import { calculerChangement, validerTextes, type FicheTextes } from './maj-textes-fiches';

const fiche: FicheTextes = {
  slug: 'x',
  description: 'Une description assez longue pour passer.',
  justificationEditeur: 'Une justification qui dépasse largement les quarante caractères requis.',
  ceQueVousPerdez: ['a', 'b'],
  prompt: 'Un prompt qui dépasse largement les quarante caractères requis ici.',
  verdictEditeur: 'KINDA',
  sourceVerdict: 'casevibecode',
};

describe('validerTextes', () => {
  it('accepte une fiche complète', () => {
    expect(validerTextes(fiche)).toEqual([]);
  });
  it('refuse un verdict inconnu, un tableau vide et un texte court', () => {
    const p = validerTextes({ ...fiche, verdictEditeur: 'MAYBE', ceQueVousPerdez: [], description: 'court' });
    expect(p).toHaveLength(3);
  });
});

describe('calculerChangement', () => {
  const ligne = {
    description: fiche.description,
    justification_editeur: 'ancienne justification',
    ce_que_vous_perdez: ['a', 'b'],
    prompt: fiche.prompt,
    verdict_editeur: 'YES',
    source_verdict: 'canivibecodeit',
  };
  it('ne renvoie que les colonnes qui diffèrent', () => {
    expect(calculerChangement(fiche, ligne)).toEqual({
      justification_editeur: fiche.justificationEditeur,
      verdict_editeur: 'KINDA',
      source_verdict: 'casevibecode',
    });
  });
  it('ne renvoie rien si tout est identique', () => {
    const identique = { ...ligne, justification_editeur: fiche.justificationEditeur, verdict_editeur: 'KINDA', source_verdict: 'casevibecode' };
    expect(calculerChangement(fiche, identique)).toEqual({});
  });
  it('ne touche jamais prix, alternatives ni votes', () => {
    const cles = Object.keys(calculerChangement(fiche, {}));
    expect(cles.sort()).toEqual(['ce_que_vous_perdez', 'description', 'justification_editeur', 'prompt', 'source_verdict', 'verdict_editeur']);
  });
});
