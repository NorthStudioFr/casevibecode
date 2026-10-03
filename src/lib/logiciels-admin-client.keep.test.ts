import { describe, expect, it } from 'vitest';
import { mapNouveauLogicielToRow } from './logiciel-doc';

// Régression : l'admin charge toute la fiche puis la renvoie ; une mise à jour
// ne doit jamais effacer alternatives / ceQueVousPerdez / prompt / secteur.
describe('aller-retour admin', () => {
  it('conserve les champs sans champ de formulaire', () => {
    const row = mapNouveauLogicielToRow({
      nom: 'X', slug: 'x', categorie: 'caisse', secteur: 'saas', description: 'd',
      verdictEditeur: 'YES', justificationEditeur: 'j', domaine: 'x.fr',
      ceQueVousPerdez: ['a'], prompt: 'p', sourceVerdict: 'canivibecodeit',
      alternatives: [{ nom: 'A', url: 'https://a.fr', type: 'gratuit', description: 'd' }],
    });
    expect(row.secteur).toBe('saas');
    expect(row.alternatives).toHaveLength(1);
    expect(row.ce_que_vous_perdez).toEqual(['a']);
    expect(row.prompt).toBe('p');
    expect(row.source_verdict).toBe('canivibecodeit');
  });
});
