// Langues du site. Le français est la langue d'origine et reste à la racine
// (casevibecode.fr/logiciel/x) ; l'anglais vit sous /en. Le proxy réécrit les
// chemins sans préfixe vers /fr, si bien que les anciennes URLs ne changent pas.
export const LANGS = ['fr', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'fr';

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

// Les tests (et les appels directs) peuvent omettre `lang` : on retombe sur le français.
export function langOf(params: { lang?: string } | undefined): Lang {
  return isLang(params?.lang) ? params.lang : DEFAULT_LANG;
}

// '/' → '/' (fr) ou '/en' (en) ; '/logiciel/x' → '/logiciel/x' ou '/en/logiciel/x'.
export function localePath(lang: Lang, path: string): string {
  const propre = path === '' ? '/' : path.startsWith('/') ? path : `/${path}`;
  if (lang === DEFAULT_LANG) return propre;
  return propre === '/' ? `/${lang}` : `/${lang}${propre}`;
}

// Chemin sans préfixe de langue : '/en/alternatives' → '/alternatives'.
export function stripLang(pathname: string): string {
  for (const lang of LANGS) {
    if (lang === DEFAULT_LANG) continue;
    if (pathname === `/${lang}`) return '/';
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  }
  return pathname || '/';
}

export const OG_LOCALE: Record<Lang, string> = { fr: 'fr_FR', en: 'en_US' };
export const HTML_LANG: Record<Lang, string> = { fr: 'fr-FR', en: 'en' };

// Métadonnées <link rel="alternate" hreflang> pour une page donnée.
export function alternatesFor(lang: Lang, path: string) {
  return {
    canonical: localePath(lang, path),
    languages: {
      fr: localePath('fr', path),
      en: localePath('en', path),
      'x-default': localePath('fr', path),
    },
  };
}
