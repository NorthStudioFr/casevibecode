import { itemListJsonLd, breadcrumbJsonLd } from './jsonld';

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
