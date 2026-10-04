import { SITE_URL } from './site';
import { getDict } from './i18n/dictionaries';
import { DEFAULT_LANG, localePath, type Lang } from './i18n/config';

export function itemListJsonLd(logiciels: { nom: string; slug: string }[], lang: Lang = DEFAULT_LANG) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: logiciels.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: l.nom,
      url: `${SITE_URL}${localePath(lang, `/logiciel/${l.slug}`)}`,
    })),
  };
}

export function breadcrumbJsonLd(nom: string, slug: string, lang: Lang = DEFAULT_LANG) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: getDict(lang).breadcrumbHome, item: `${SITE_URL}${localePath(lang, '/')}` },
      { '@type': 'ListItem', position: 2, name: nom, item: `${SITE_URL}${localePath(lang, `/logiciel/${slug}`)}` },
    ],
  };
}
