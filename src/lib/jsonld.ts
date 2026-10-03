import { SITE_URL } from './site';

export function itemListJsonLd(logiciels: { nom: string; slug: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: logiciels.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.nom,
      url: `${SITE_URL}/logiciel/${l.slug}`,
    })),
  };
}

export function breadcrumbJsonLd(nom: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: nom, item: `${SITE_URL}/logiciel/${slug}` },
    ],
  };
}
