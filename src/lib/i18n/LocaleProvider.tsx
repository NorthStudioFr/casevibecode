'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { DEFAULT_LANG, localePath, type Lang } from './config';
import { getDict, type Dict } from './dictionaries';

interface LocaleValue {
  lang: Lang;
  t: Dict;
  /** Chemin préfixé selon la langue : href('/alternatives') → '/en/alternatives'. */
  href: (path: string) => string;
}

const DEFAUT: LocaleValue = {
  lang: DEFAULT_LANG,
  t: getDict(DEFAULT_LANG),
  href: (path) => localePath(DEFAULT_LANG, path),
};

const LocaleContext = createContext<LocaleValue>(DEFAUT);

export function LocaleProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<LocaleValue>(
    () => ({ lang, t: getDict(lang), href: (path) => localePath(lang, path) }),
    [lang],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

// Hors LocaleProvider (tests, composants isolés), on retombe sur le français.
export function useLocale(): LocaleValue {
  return useContext(LocaleContext);
}
