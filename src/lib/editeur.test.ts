import { afterEach, describe, expect, it, vi } from 'vitest';
import { adressesHttps, editeur, libelleEditeur } from './editeur';

const NOMS = ['MARQUE', 'NOM', 'URL', 'CONTACT_URL', 'EMAIL', 'SIRET', 'APE', 'FORME', 'TVA', 'ADRESSE', 'SAMEAS', 'FONDATEUR', 'FONDATEUR_URL'];

describe('editeur', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('lit chaque information dans sa variable, sans espaces autour', () => {
    NOMS.forEach((n) => vi.stubEnv(`EDITEUR_${n}`, `  valeur ${n}  `));
    const e = editeur();
    expect(e.marque).toBe('valeur MARQUE');
    expect(e.adresse).toBe('valeur ADRESSE');
    expect(e.contactUrl).toBe('valeur CONTACT_URL');
  });

  it('ne renvoie rien (aucune valeur par défaut) quand les variables sont absentes ou vides', () => {
    NOMS.forEach((n) => vi.stubEnv(`EDITEUR_${n}`, ''));
    expect(Object.values(editeur()).every((v) => v === undefined)).toBe(true);
  });
});

describe('libelleEditeur', () => {
  it('préfère la marque, puis le nom, puis une formule neutre', () => {
    expect(libelleEditeur({ marque: 'Studio', nom: 'Jean' })).toBe('Studio');
    expect(libelleEditeur({ nom: 'Jean' })).toBe('Jean');
    expect(libelleEditeur({})).toBe("l'éditeur du site");
  });
});

describe('adressesHttps', () => {
  it("ne garde que des adresses https valides, et ignore les autres sans rien inventer", () => {
    expect(adressesHttps('https://www.linkedin.com/in/x, http://non-securise.fr, pas une adresse, ,https://a.fr')).toEqual(['https://www.linkedin.com/in/x', 'https://a.fr']);
    expect(adressesHttps(undefined)).toEqual([]);
  });
});
