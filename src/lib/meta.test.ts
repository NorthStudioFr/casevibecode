import { tronquer } from './meta';

describe('tronquer', () => {
  it('laisse intact un texte court', () => {
    expect(tronquer('court')).toBe('court');
  });
  it('coupe au dernier mot, sous 155 caractères, avec une ellipse', () => {
    const t = tronquer('mot '.repeat(80));
    expect(t.length).toBeLessThanOrEqual(155);
    expect(t.endsWith('…')).toBe(true);
    expect(t).not.toMatch(/\s…$/);
  });
});
