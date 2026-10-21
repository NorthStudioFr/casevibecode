import { fichePageJsonLd, methodePageJsonLd, itemListJsonLd, breadcrumbJsonLd } from './jsonld';

describe('jsonld', () => {
  it('builds an ItemList with absolute fiche urls and 1-based positions', () => {
    const ld = itemListJsonLd([
      { nom: 'A', slug: 'a' },
      { nom: 'B', slug: 'b' },
    ]);
    expect(ld['@type']).toBe('ItemList');
    expect(ld.itemListElement[1]).toMatchObject({ '@type': 'ListItem', position: 2, name: 'B' });
    expect(ld.itemListElement[0].url).toBe('https://casevibecode.fr/logiciel/a');
  });

  it('builds a breadcrumb home > fiche', () => {
    const ld = breadcrumbJsonLd('Zenchef', 'zenchef');
    expect(ld['@type']).toBe('BreadcrumbList');
    expect(ld.itemListElement.map((i) => i.name)).toEqual(['Accueil', 'Zenchef']);
  });
});

describe('fichePageJsonLd', () => {
  it("n'émet ni note ni avis, et ne date une vérification que si elle existe", () => {
    const j = fichePageJsonLd({ nom: 'Zelty', slug: 'zelty', description: 'Caisse', categorie: 'Caisse', domaine: 'zelty.fr', dateMaj: Date.UTC(2026, 9, 20) });
    expect(JSON.stringify(j)).not.toMatch(/Rating|Review/);
    expect(j).not.toHaveProperty('lastReviewed');
    expect(j.dateModified).toBe('2026-10-20T00:00:00.000Z');
    expect(j.about).toMatchObject({ '@type': 'SoftwareApplication', name: 'Zelty', url: 'https://zelty.fr' });
  });
  it('reprend la date de vérification quand elle existe', () => {
    expect(fichePageJsonLd({ nom: 'Z', slug: 'z', description: '', categorie: 'Caisse', verifieLe: '2026-10-20' }).lastReviewed).toBe('2026-10-20');
  });
  it('décrit la page Méthode avec sa date de mise à jour', () => {
    expect(methodePageJsonLd('fr', '2026-10-21')).toMatchObject({ '@type': 'AboutPage', dateModified: '2026-10-21' });
  });
});
