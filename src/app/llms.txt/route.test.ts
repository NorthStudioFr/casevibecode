import { vi } from 'vitest';

vi.mock('@/lib/logiciels-server', () => ({
  getLogiciels: vi.fn().mockResolvedValue([{ slug: 'zelty', nom: 'Zelty', description: 'Caisse cloud.' }]),
}));

describe('llms.txt', () => {
  it('renvoie vers les pages par public et la méthode avant la liste des logiciels', async () => {
    const { GET } = await import('./route');
    const body = await (await GET()).text();
    expect(body).toContain('(https://casevibecode.fr/restauration)');
    expect(body).toContain('(https://casevibecode.fr/outils)');
    expect(body).toContain('(https://casevibecode.fr/methode)');
    expect(body.indexOf('## Par public')).toBeLessThan(body.indexOf('## Logiciels référencés'));
  });
});
