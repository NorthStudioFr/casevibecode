import { describe, it, expect } from 'vitest';
import { formaterDateVerifie } from './date';

describe('formaterDateVerifie', () => {
  it('formate une date YYYY-MM-DD en français', () => {
    expect(formaterDateVerifie('2026-10-20', 'fr')).toBe('20 octobre 2026');
  });

  it('formate une date YYYY-MM-DD en anglais', () => {
    expect(formaterDateVerifie('2026-10-20', 'en')).toBe('October 20, 2026');
  });

  it('retourne la chaîne d’origine si malformée', () => {
    expect(formaterDateVerifie('invalide', 'fr')).toBe('invalide');
  });
});
