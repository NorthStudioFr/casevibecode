import { parsePrixMensuel } from './prix';

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
