import { describe, it, expect, vi, beforeEach } from 'vitest';

const getLogicielBySlugMock = vi.fn();
vi.mock('@/lib/logiciels-server', () => ({
  getLogicielBySlug: getLogicielBySlugMock,
  getVoteCounts: vi.fn(),
  getLogiciels: vi.fn().mockResolvedValue([]),
}));
// The page imports client components that need browser-only APIs; stub them.
vi.mock('@/lib/votes-client', () => ({ castVote: vi.fn() }));
vi.mock('@/lib/newsletter-client', () => ({ subscribeNewsletter: vi.fn() }));

describe('Fiche logiciel generateMetadata', () => {
  beforeEach(() => {
    getLogicielBySlugMock.mockReset();
  });

  it("builds a per-fiche title and description from the logiciel's name and description", async () => {
    getLogicielBySlugMock.mockResolvedValue({
      id: 'zenchef',
      nom: 'Zenchef',
      slug: 'zenchef',
      description: 'Gestion des réservations en ligne',
    });
    const { generateMetadata } = await import('./page');

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'zenchef' }) });

    expect(getLogicielBySlugMock).toHaveBeenCalledWith('zenchef');
    expect(metadata.title).toBe('Zenchef : remplaçable ou pas ?');
    expect(metadata.description).toBe('Gestion des réservations en ligne');
  });

  it('falls back to a generated description when the fiche has none', async () => {
    getLogicielBySlugMock.mockResolvedValue({ id: 'fudger', nom: 'Fudger', slug: 'fudger', description: '' });
    const { generateMetadata } = await import('./page');

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'fudger' }) });

    expect(metadata.title).toBe('Fudger : remplaçable ou pas ?');
    expect(metadata.description).toMatch(/^Fudger peut-il être remplacé/);
  });

  it('falls back gracefully when the logiciel is not found', async () => {
    getLogicielBySlugMock.mockResolvedValue(null);
    const { generateMetadata } = await import('./page');

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'inconnu' }) });

    expect(metadata.title).toBe('Logiciel introuvable');
  });
});
