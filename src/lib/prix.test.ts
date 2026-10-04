import { formatPrix, parsePrixMensuel } from './prix';

describe('parsePrixMensuel', () => {
  it.each([
    ['29 €/mois', 29],
    ['à partir de 129 €/mois', 129],
    ['à partir de 39,99 €/mois', 39.99],
    ['79€/mois', 79],
  ])('parses %s', (input, expected) => {
    expect(parsePrixMensuel(input)).toBe(expected);
  });

  it.each([
    'sur devis',
    'gratuit',
    'gratuit (payant dès 9,99 €/mois)',
    'à partir de 2,75 €/mois/employé',
    'à partir de 1 €/jour/tablette',
    'à partir de 13 € (paiement unique, hors abonnement)',
    '',
    undefined,
  ])('returns undefined for %s (non chiffrable en un total mensuel)', (input) => {
    expect(parsePrixMensuel(input)).toBeUndefined();
  });
});

describe('formatPrix', () => {
  it('ne touche pas au français', () => {
    expect(formatPrix('à partir de 39 €/mois', 'fr')).toBe('à partir de 39 €/mois');
    expect(formatPrix(undefined, 'en')).toBeUndefined();
  });
  it.each([
    ['gratuit', 'free'],
    ['sur devis', 'on request'],
    ['à partir de 129 €/mois', 'from €129/month'],
    ['à partir de 14,90 €/mois', 'from €14.90/month'],
    ['à partir de 9 €/mois/utilisateur', 'from €9/month/user'],
    ['à partir de 2,75 €/mois/employé', 'from €2.75/month/employee'],
    ['à partir de 1 €/jour/tablette', 'from €1/day/tablet'],
    ['gratuit (plans payants à partir de 9,99 €/mois)', 'free (paid plans from €9.99/month)'],
    ['gratuit (plans dès 19,99 €/mois)', 'free (plans from €19.99/month)'],
    ['gratuit (Premium à 14,90 €/mois)', 'free (Premium at €14.90/month)'],
    ['gratuit (options payantes)', 'free (paid options)'],
    ['gratuit (forfaits Pro/Enterprise sur devis)', 'free (Pro/Enterprise plans on request)'],
    ['gratuit (version payante à partir de 159 €/mois)', 'free (paid version from €159/month)'],
    ['sur devis (à partir de 69 €/mois)', 'on request (from €69/month)'],
  ])('traduit %s', (fr, en) => {
    expect(formatPrix(fr, 'en')).toBe(en);
  });
});

describe('prix convertis', () => {
  const p = 'à partir de 17,82 €/mois (converti de 20 $, cours du 2 oct. 2026)';
  it('reste chiffrable malgré la mention de conversion', () => {
    expect(parsePrixMensuel(p)).toBe(17.82);
  });
  it('se traduit en anglais', () => {
    expect(formatPrix(p, 'en')).toBe('from €17.82/month (converted from $20, rate of 2 oct. 2026)');
  });
});
