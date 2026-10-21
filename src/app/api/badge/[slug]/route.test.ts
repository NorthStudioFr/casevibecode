import { describe, expect, it, vi } from 'vitest';
import { genererBadgeSvg, GET } from './route';

vi.mock('@/lib/logiciels-server', () => ({
  getLogicielBySlug: vi.fn(async (slug: string) => {
    if (slug === 'zelty') {
      return { id: 'zelty-id', slug: 'zelty', nom: 'Zelty', verdictEditeur: 'NOT_REALLY' };
    }
    if (slug === 'tally') {
      return { id: 'tally-id', slug: 'tally', nom: 'Tally', verdictEditeur: 'YES' };
    }
    if (slug === 'notion') {
      return { id: 'notion-id', slug: 'notion', nom: 'Notion', verdictEditeur: 'KINDA' };
    }
    return null;
  }),
  getVoteCounts: vi.fn(async () => ({ remplace: 0, pasRemplacable: 0 })),
}));

describe('genererBadgeSvg', () => {
  it('génère un SVG avec le verdict réel et une formulation neutre sans « recommandé par »', () => {
    const svg = genererBadgeSvg({ verdictLabel: 'Pas remplaçable', verdict: 'NOT_REALLY' });
    expect(svg).toContain('<svg');
    expect(svg).toContain('casevibecode');
    expect(svg).toContain('Verdict : Pas remplaçable');
    expect(svg).toContain('#475569');
    expect(svg.toLowerCase()).not.toContain('recommandé');
    expect(svg.toLowerCase()).not.toContain('recommended');
  });

  it('génère un badge vert pour remplaçable', () => {
    const svg = genererBadgeSvg({ verdictLabel: 'Remplaçable', verdict: 'YES' });
    expect(svg).toContain('Verdict : Remplaçable');
    expect(svg).toContain('#16a34a');
  });

  it('génère un badge ambre pour partiel', () => {
    const svg = genererBadgeSvg({ verdictLabel: 'Partiel', verdict: 'KINDA' });
    expect(svg).toContain('Verdict : Partiel');
    expect(svg).toContain('#d97706');
  });
});

describe('GET /api/badge/[slug]', () => {
  it('renvoie 404 pour un logiciel inconnu', async () => {
    const req = new Request('http://localhost:3000/api/badge/inconnu');
    const res = await GET(req, { params: Promise.resolve({ slug: 'inconnu' }) });
    expect(res.status).toBe(404);
  });

  it('renvoie un badge SVG pour Zelty (Pas remplaçable)', async () => {
    const req = new Request('http://localhost:3000/api/badge/zelty');
    const res = await GET(req, { params: Promise.resolve({ slug: 'zelty' }) });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('image/svg+xml');
    const body = await res.text();
    expect(body).toContain('Verdict : Pas remplaçable');
    expect(body.toLowerCase()).not.toContain('recommandé');
  });

  it('supporte le paramètre de langue anglais ?lang=en', async () => {
    const req = new Request('http://localhost:3000/api/badge/tally?lang=en');
    const res = await GET(req, { params: Promise.resolve({ slug: 'tally' }) });
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('Verdict : Replaceable');
    expect(body.toLowerCase()).not.toContain('recommended');
  });
});
