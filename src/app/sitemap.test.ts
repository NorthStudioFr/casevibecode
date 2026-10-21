import { vi } from 'vitest';

const getLogicielsMock = vi.fn();
vi.mock('@/lib/logiciels-server', () => ({ getLogiciels: getLogicielsMock }));

describe('sitemap', () => {
  it('publie les pages par public et la méthode, en français et en anglais, avec hreflang', async () => {
    getLogicielsMock.mockResolvedValue([
      { slug: 'zelty', secteur: 'chr', dateMaj: Date.UTC(2026, 9, 20) },
      { slug: 'notion', secteur: 'saas', dateMaj: Date.UTC(2026, 9, 18) },
    ]);
    const sitemap = (await import('./sitemap')).default;
    const urls = (await sitemap()).map((e) => e.url);
    for (const u of [
      'https://casevibecode.fr/restauration',
      'https://casevibecode.fr/en/restauration',
      'https://casevibecode.fr/outils',
      'https://casevibecode.fr/en/outils',
      'https://casevibecode.fr/methode',
    ]) {
      expect(urls).toContain(u);
    }
    const chr = (await sitemap()).find((e) => e.url === 'https://casevibecode.fr/restauration');
    expect(chr?.alternates?.languages).toMatchObject({ en: 'https://casevibecode.fr/en/restauration' });
    expect(chr?.lastModified).toEqual(new Date(Date.UTC(2026, 9, 20)));
  });
});
