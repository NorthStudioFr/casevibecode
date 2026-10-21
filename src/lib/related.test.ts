import { relatedFiches, voisinsCategorie } from './related';
import type { Logiciel } from '@/types/logiciel';

const make = (id: string, categorie: Logiciel['categorie']): Logiciel => ({
  id,
  nom: id,
  slug: id,
  categorie,
  secteur: 'chr',
  description: '',
  verdictEditeur: 'KINDA',
  justificationEditeur: '',
  domaine: '',
  dateAjout: 0,
  dateMaj: 0,
});

describe('relatedFiches', () => {
  const all = [make('a', 'caisse'), make('b', 'caisse'), make('c', 'caisse'), make('d', 'caisse'), make('e', 'compta')];

  it('returns up to 3 fiches of the same category, excluding the current one', () => {
    expect(relatedFiches(all, all[0]).map((l) => l.id)).toEqual(['b', 'c', 'd']);
  });

  it('falls back to other categories when the category is too small', () => {
    const result = relatedFiches(all, all[4]);
    expect(result).toHaveLength(3);
    expect(result.every((l) => l.id !== 'e')).toBe(true);
  });

  it('is deterministic (alphabetical by name) so ISR output is stable', () => {
    expect(relatedFiches(all, all[1]).map((l) => l.id)).toEqual(['a', 'c', 'd']);
  });
});

describe('relatedFiches — secteur', () => {
  const fiche = (id: string, categorie: Logiciel['categorie'], secteur: Logiciel['secteur']): Logiciel => ({
    ...make(id, categorie),
    secteur,
  });

  it('préfère le même secteur quand la catégorie est trop petite', () => {
    const all = [fiche('a', 'notes', 'saas'), fiche('b', 'caisse', 'chr'), fiche('c', 'productivite', 'saas'), fiche('d', 'design', 'saas'), fiche('e', 'compta', 'chr')];
    expect(relatedFiches(all, all[0]).map((l) => l.id)).toEqual(['c', 'd', 'b']);
  });
});

describe('relatedFiches — proximité par alternatives', () => {
  const alt = (u: string) => ({ nom: u, url: `https://${u}/`, type: 'gratuit' as const, description: '' });
  it('met en tête les fiches qui partagent une alternative, même hors catégorie', () => {
    const cur = { ...make('x', 'autre'), alternatives: [alt('odoo')] };
    const proche = { ...make('p', 'compta'), alternatives: [alt('odoo')] };
    const autres = [make('a', 'autre'), make('b', 'autre')];
    expect(relatedFiches([cur, ...autres, proche], cur)[0].id).toBe('p');
  });
  it("n'utilise pas la catégorie « autre » comme preuve de proximité", () => {
    const cur = make('x', 'autre');
    const memeSecteurAutre = make('a', 'autre');
    const autreCat = make('b', 'caisse');
    // les deux sont du même secteur : même rang, tri alphabétique
    expect(relatedFiches([cur, memeSecteurAutre, autreCat], cur).map((l) => l.id)).toEqual(['a', 'b']);
  });
});

describe('voisinsCategorie', () => {
  it('boucle dans la même catégorie', () => {
    const all = [make('a', 'caisse'), make('b', 'caisse'), make('c', 'caisse'), make('z', 'compta')];
    expect(voisinsCategorie(all, all[0], 'fr')).toMatchObject({ precedent: { id: 'c' }, suivant: { id: 'b' } });
    expect(voisinsCategorie(all, all[2], 'fr')).toMatchObject({ precedent: { id: 'b' }, suivant: { id: 'a' } });
  });
  it("n'affiche rien quand la catégorie ne contient qu'une fiche", () => {
    const all = [make('a', 'caisse'), make('z', 'compta')];
    expect(voisinsCategorie(all, all[1], 'fr')).toEqual({ precedent: null, suivant: null });
  });
});
