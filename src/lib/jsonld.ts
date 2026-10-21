import { SITE_URL } from './site';
import { getDict } from './i18n/dictionaries';
import { DEFAULT_LANG, localePath, type Lang } from './i18n/config';
import type { Editeur } from './editeur';

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

// Page de fiche décrite pour les moteurs et les assistants IA. Seules des informations réelles y figurent :
// `dateModified` est la dernière mise à jour de la fiche en base, `lastReviewed` n'est émis que si une
// vérification a été datée (aujourd'hui quelques fiches seulement). Aucune note ni avis : rien n'est inventé.
export function fichePageJsonLd(p: {
  nom: string;
  slug: string;
  lang?: Lang;
  description: string;
  categorie: string;
  domaine?: string;
  dateMaj?: number;
  verifieLe?: string | null;
  auteur?: string;
}) {
  const lang = p.lang ?? DEFAULT_LANG;
  const url = `${SITE_URL}${localePath(lang, `/logiciel/${p.slug}`)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: getDict(lang).fiche.title(p.nom, false),
    description: p.description,
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en',
    isPartOf: { '@type': 'WebSite', name: 'casevibecode', url: SITE_URL },
    ...(p.dateMaj && Number.isFinite(p.dateMaj) ? { dateModified: new Date(p.dateMaj).toISOString() } : {}),
    ...(p.verifieLe ? { lastReviewed: p.verifieLe } : {}),
    ...(p.auteur ? { author: { '@type': 'Organization', name: p.auteur }, publisher: { '@type': 'Organization', name: p.auteur } } : {}),
    about: {
      '@type': 'SoftwareApplication',
      name: p.nom,
      applicationCategory: p.categorie,
      ...(p.domaine ? { url: `https://${p.domaine}` } : {}),
    },
  };
}

export function methodePageJsonLd(lang: Lang, dateModified: string) {
  const d = getDict(lang).methode;
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${SITE_URL}${localePath(lang, '/methode')}`,
    name: d.heading,
    description: d.description,
    inLanguage: lang === 'fr' ? 'fr-FR' : 'en',
    dateModified,
    isPartOf: { '@type': 'WebSite', name: 'casevibecode', url: SITE_URL },
  };
}

// L'éditeur du site, décrit à partir des variables d'environnement : rien n'est écrit dans le dépôt
// (public), et une information absente n'est pas émise.
export function organisationJsonLd(e: Editeur) {
  if (!e.marque) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: e.marque,
    url: e.url,
    logo: `${SITE_URL}/apple-icon.png`,
    ...(e.sameAs?.length ? { sameAs: e.sameAs } : {}),
    ...(e.fondateur ? { founder: { '@type': 'Person', name: e.fondateur, ...(e.fondateurUrl ? { sameAs: [e.fondateurUrl] } : {}) } } : {}),
  };
}
