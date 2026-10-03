import { describe, it, expect } from 'vitest';
import { SEED_LOGICIELS } from './seed-data';

const CATEGORIES = ['caisse', 'reservation', 'livraison', 'compta', 'autre'];
const VERDICTS = ['YES', 'KINDA', 'NOT_REALLY'];

describe('SEED_LOGICIELS', () => {
  it('has at least 10 entries', () => {
    expect(SEED_LOGICIELS.length).toBeGreaterThanOrEqual(10);
  });

  it('has unique slugs', () => {
    const slugs = SEED_LOGICIELS.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('uses only allowed categorie and verdictEditeur values, and has non-empty text fields', () => {
    for (const l of SEED_LOGICIELS) {
      expect(CATEGORIES).toContain(l.categorie);
      expect(VERDICTS).toContain(l.verdictEditeur);
      expect(l.nom.length).toBeGreaterThan(0);
      expect(l.description.length).toBeGreaterThan(0);
      expect(l.justificationEditeur.length).toBeGreaterThan(0);
    }
  });
});
