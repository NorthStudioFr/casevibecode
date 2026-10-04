import { lacunesDe } from './admin-lacunes';
import type { Logiciel } from '@/types/logiciel';

const base = {
  id: 'a', nom: 'A', slug: 'a', categorie: 'autre', secteur: 'saas', description: '', justificationEditeur: '',
  dateAjout: 0, dateMaj: 0, verdictEditeur: 'YES', domaine: 'a.fr', prix: '9 €/mois', prompt: 'p',
  alternatives: [{ nom: 'x', url: 'https://x.fr', type: 'gratuit', description: '' }],
} as Logiciel;

describe('lacunesDe', () => {
  it('ne signale rien sur une fiche complète', () => {
    expect(lacunesDe(base)).toEqual([]);
  });
  it('liste prix, domaine et alternatives manquants', () => {
    expect(lacunesDe({ ...base, prix: undefined, domaine: '', alternatives: [] })).toEqual(['prix', 'domaine', 'alternatives']);
  });
  it("n'attend un prompt que pour les verdicts remplaçables ou partiels", () => {
    expect(lacunesDe({ ...base, prompt: undefined })).toEqual(['prompt']);
    expect(lacunesDe({ ...base, prompt: undefined, verdictEditeur: 'NOT_REALLY' })).toEqual([]);
  });
});
