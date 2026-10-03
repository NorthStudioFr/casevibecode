import { totalMensuel, formatEuros, tapeItems, tapeDurationSeconds } from './ticker';

describe('ticker', () => {
  it('sums only positive finite prixMensuel and ignores fiches without a price', () => {
    expect(totalMensuel([{ prixMensuel: 10 }, { prixMensuel: 5.5 }, {}, { prixMensuel: NaN }])).toBe(15.5);
    expect(totalMensuel([])).toBe(0);
  });

  it('formats euros in French with a decimal comma', () => {
    expect(formatEuros(1234.5)).toMatch(/^1\s234,5$/);
    expect(formatEuros(79)).toBe('79');
  });

  it('builds the tape from priced fiches, most expensive first, name uppercased', () => {
    expect(
      tapeItems([{ nom: 'Cheap', prixMensuel: 5 }, { nom: 'Pricey', prixMensuel: 129 }, { nom: 'NoPrice' }])
    ).toEqual(['PRICEY −129 €/mois', 'CHEAP −5 €/mois']);
  });

  it('keeps a constant scroll speed: duration grows with the text length, with a floor', () => {
    expect(tapeDurationSeconds('x')).toBe(20);
    expect(tapeDurationSeconds('x'.repeat(2000))).toBeGreaterThan(tapeDurationSeconds('x'.repeat(1000)));
  });
});
