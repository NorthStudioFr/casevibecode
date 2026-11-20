import { sponsorsActifs, OFFRE_PUBLIQUE, PLACES_MAX, getSponsors } from './sponsors';

const ok = { nom: 'Exemple', url: 'https://exemple.test/', description: 'Une phrase.', debut: '2026-12-01', fin: '2026-12-31' };
const jour = new Date('2026-12-15T10:00:00Z');

describe('sponsorsActifs', () => {
  it('garde un sponsor bien formé dont la période couvre le jour', () => {
    expect(sponsorsActifs([ok], jour)).toEqual([ok]);
  });
  it('écarte hors période, URL non https, description vide ou trop longue', () => {
    expect(sponsorsActifs([{ ...ok, debut: '2027-01-01', fin: '2027-01-31' }], jour)).toEqual([]);
    expect(sponsorsActifs([{ ...ok, fin: '2026-12-14' }], jour)).toEqual([]);
    expect(sponsorsActifs([{ ...ok, url: 'http://exemple.test' }], jour)).toEqual([]);
    expect(sponsorsActifs([{ ...ok, url: 'javascript:alert(1)' }], jour)).toEqual([]);
    expect(sponsorsActifs([{ ...ok, description: '' }], jour)).toEqual([]);
    expect(sponsorsActifs([{ ...ok, description: 'x'.repeat(141) }], jour)).toEqual([]);
  });
  it('plafonne à 3 places et ignore ce qui n’est pas un tableau', () => {
    const quatre = [1, 2, 3, 4].map((n) => ({ ...ok, url: `https://s${n}.test/` }));
    expect(sponsorsActifs(quatre, jour)).toHaveLength(PLACES_MAX);
    expect(sponsorsActifs(null, jour)).toEqual([]);
    expect(sponsorsActifs({}, jour)).toEqual([]);
  });
  it('ne déclare aucun sponsor tant que le fichier est vide, et l’offre reste non publique sans prix', () => {
    expect(getSponsors()).toEqual([]);
    expect(OFFRE_PUBLIQUE).toBe(false);
  });
});
