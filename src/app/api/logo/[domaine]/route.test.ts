import { vi, afterEach } from 'vitest';
import { GET } from './route';

const appel = (domaine: string) => GET(new Request('http://x/api/logo/' + domaine), { params: Promise.resolve({ domaine }) });
afterEach(() => vi.restoreAllMocks());

describe('GET /api/logo/[domaine]', () => {
  it.each(['http://evil.com', 'a.fr/../x', 'localhost', '127.0.0.1', 'x'.repeat(300) + '.fr', 'zelty.fr?x=1', 'zelty .fr'])(
    'refuse %s sans aucune requête sortante',
    async (d) => {
      const f = vi.spyOn(globalThis, 'fetch');
      expect((await appel(d)).status).toBe(400);
      expect(f).not.toHaveBeenCalled();
    },
  );

  it('récupère le logo côté serveur et le sert avec un cache long', async () => {
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new Uint8Array([1, 2, 3]), { headers: { 'content-type': 'image/png' } }));
    const r = await appel('zelty.fr');
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toBe('image/png');
    expect(r.headers.get('cache-control')).toContain('s-maxage=2592000');
    expect(String(f.mock.calls[0][0])).toBe('https://www.google.com/s2/favicons?domain=zelty.fr&sz=128');
  });

  it("répond 404 si Google ne renvoie pas d'image", async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('nope', { status: 404, headers: { 'content-type': 'text/html' } }));
    expect((await appel('zelty.fr')).status).toBe(404);
  });
});
