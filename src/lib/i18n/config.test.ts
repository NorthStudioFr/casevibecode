import { describe, expect, it } from 'vitest';
import { alternatesFor, langOf, localePath, stripLang } from './config';

describe('i18n config', () => {
  it('garde le français à la racine et préfixe l’anglais', () => {
    expect(localePath('fr', '/')).toBe('/');
    expect(localePath('en', '/')).toBe('/en');
    expect(localePath('fr', '/logiciel/zenchef')).toBe('/logiciel/zenchef');
    expect(localePath('en', '/logiciel/zenchef')).toBe('/en/logiciel/zenchef');
  });
  it('retire le préfixe de langue', () => {
    expect(stripLang('/en')).toBe('/');
    expect(stripLang('/en/alternatives')).toBe('/alternatives');
    expect(stripLang('/alternatives')).toBe('/alternatives');
    expect(stripLang('/english')).toBe('/english');
  });
  it('retombe sur le français sans langue valide', () => {
    expect(langOf(undefined)).toBe('fr');
    expect(langOf({ lang: 'de' })).toBe('fr');
    expect(langOf({ lang: 'en' })).toBe('en');
  });
  it('déclare les deux versions pour hreflang', () => {
    expect(alternatesFor('en', '/alternatives')).toEqual({
      canonical: '/en/alternatives',
      languages: { fr: '/alternatives', en: '/en/alternatives', 'x-default': '/alternatives' },
    });
  });
});
