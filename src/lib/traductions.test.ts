import { describe, expect, it } from 'vitest';
import fiches from '@/content/en/fiches.json';
import { appliquerTraduction, traductionDe } from './traductions';
import type { Logiciel } from '@/types/logiciel';

const base: Logiciel = {
  id: 'zenchef', nom: 'Zenchef', slug: 'zenchef', categorie: 'reservation', secteur: 'chr',
  description: 'fr', verdictEditeur: 'KINDA', justificationEditeur: 'fr', domaine: 'zenchef.com',
  dateAjout: 0, dateMaj: 0,
  ceQueVousPerdez: ['a'], prompt: 'p',
  alternatives: [{ nom: 'X', url: 'https://x.io', type: 'gratuit', description: 'fr' }],
};

describe('traductions anglaises', () => {
  it('chaque entrée a un texte, et des listes de chaînes non vides', () => {
    for (const [slug, e] of Object.entries(fiches as Record<string, Record<string, unknown>>)) {
      expect(typeof e.description, slug).toBe('string');
      expect((e.description as string).length, slug).toBeGreaterThan(20);
      expect(typeof e.justification, slug).toBe('string');
      expect((e.justification as string).length, slug).toBeGreaterThan(40);
      for (const k of ['perdez', 'alternatives'] as const) {
        const liste = e[k] as string[] | undefined;
        if (liste) for (const t of liste) expect(typeof t === 'string' && t.length > 3, `${slug}.${k}`).toBe(true);
      }
    }
  });

  it('ne renvoie rien en français', () => {
    expect(traductionDe('zenchef', 'fr')).toBeUndefined();
    expect(appliquerTraduction(base, 'fr')).toBe(base);
  });

  it('remplace les textes quand la fiche est traduite, en gardant noms, liens et types', () => {
    const l = appliquerTraduction(base, 'en');
    expect(l.traduit).toBe(true);
    expect(l.description).not.toBe('fr');
    expect(l.alternatives?.[0]).toMatchObject({ nom: 'X', url: 'https://x.io', type: 'gratuit' });
    expect(l.alternatives?.[0].description).not.toBe('fr');
    expect(l.ceQueVousPerdez?.[0]).not.toBe('a');
    expect(l.prompt).not.toBe('p');
  });

  it('signale une fiche sans traduction', () => {
    const l = appliquerTraduction({ ...base, slug: 'inconnu-xyz' }, 'en');
    expect(l.traduit).toBe(false);
    expect(l.description).toBe('fr');
  });
});
