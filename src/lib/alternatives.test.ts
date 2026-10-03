import { compteAlternatives, alternativesPolyvalentes, logicielsParCategorie } from './alternatives';
import type { Alternative, Logiciel } from '@/types/logiciel';

const make = (overrides: Partial<Logiciel>): Logiciel => ({
  id: 'x',
  nom: 'X',
  slug: 'x',
  categorie: 'caisse',
  secteur: 'chr',
  description: '',
  verdictEditeur: 'KINDA',
  justificationEditeur: '',
  domaine: '',
  dateAjout: 0,
  dateMaj: 0,
  ...overrides,
});

const alt = (nom: string, url: string, type: Alternative['type'] = 'open-source'): Alternative => ({
  nom,
  url,
  type,
  description: `${nom} fait ça.`,
});

describe('compteAlternatives', () => {
  it('counts distinct alternatives (by url) and the fiches that have at least one', () => {
    const result = compteAlternatives([
      make({ id: 'a', alternatives: [alt('Tasty', 'https://tasty.io'), alt('Resto', 'https://resto.io')] }),
      make({ id: 'b', alternatives: [alt('Tasty', 'https://www.tasty.io/')] }),
      make({ id: 'c' }),
      make({ id: 'd', alternatives: [] }),
    ]);
    expect(result).toEqual({ alternatives: 2, logiciels: 2 });
  });
});

describe('alternativesPolyvalentes', () => {
  it('keeps alternatives shared by at least 2 fiches, biggest first, with the summed monthly price', () => {
    const groupes = alternativesPolyvalentes([
      make({ id: 'a', nom: 'A', prixMensuel: 10, alternatives: [alt('Tasty', 'https://tasty.io')] }),
      make({ id: 'b', nom: 'B', prixMensuel: 5, alternatives: [alt('Tasty', 'https://tasty.io/'), alt('Solo', 'https://solo.io')] }),
      make({ id: 'c', nom: 'C', alternatives: [alt('Resto', 'https://resto.io')] }),
      make({ id: 'd', nom: 'D', alternatives: [alt('Resto', 'https://resto.io')] }),
      make({ id: 'e', nom: 'E', alternatives: [alt('Resto', 'https://resto.io')] }),
    ]);

    expect(groupes.map((g) => g.nom)).toEqual(['Resto', 'Tasty']);
    expect(groupes[1].remplace.map((l) => l.id)).toEqual(['a', 'b']);
    expect(groupes[1].totalMensuel).toBe(15);
    expect(groupes[0].totalMensuel).toBe(0);
  });
});

describe('logicielsParCategorie', () => {
  it('lists only fiches with alternatives, grouped by category in the site order, most alternatives first', () => {
    const groupes = logicielsParCategorie([
      make({ id: 'z', nom: 'Zed', categorie: 'compta', alternatives: [alt('A', 'https://a.io')] }),
      make({ id: 'b', nom: 'Beta', categorie: 'caisse', alternatives: [alt('A', 'https://a.io')] }),
      make({ id: 'a', nom: 'Alpha', categorie: 'caisse', alternatives: [alt('A', 'https://a.io'), alt('B', 'https://b.io')] }),
      make({ id: 'n', nom: 'None', categorie: 'caisse' }),
    ]);

    expect(groupes.map((g) => g.categorie)).toEqual(['caisse', 'compta']);
    expect(groupes[0].logiciels.map((l) => l.id)).toEqual(['a', 'b']);
  });
});
