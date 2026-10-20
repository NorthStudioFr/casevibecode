// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const getLogicielBySlugMock = vi.fn();
const getVoteCountsMock = vi.fn().mockResolvedValue({ remplace: 0, pasRemplacable: 0 });
const getLogicielsMock = vi.fn().mockResolvedValue([]);
const getRetoursMock = vi.fn().mockResolvedValue([]);
vi.mock('@/lib/logiciels-server', () => ({
  getLogicielBySlug: getLogicielBySlugMock,
  getVoteCounts: getVoteCountsMock,
  getLogiciels: getLogicielsMock,
  getRetours: getRetoursMock,
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

    expect(getLogicielBySlugMock).toHaveBeenCalledWith('zenchef', 'fr');
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

describe('FicheLogicielPage rendu', () => {
  beforeEach(() => {
    getLogicielBySlugMock.mockReset();
  });

  it('affiche la date de vérification si verifieLe est renseigné', async () => {
    getLogicielBySlugMock.mockResolvedValue({
      id: 'zelty',
      nom: 'Zelty',
      slug: 'zelty',
      categorie: 'caisse',
      secteur: 'chr',
      description: 'Caisse iPad pour la restauration',
      verdictEditeur: 'NOT_REALLY',
      justificationEditeur: 'NF525 obligatoire',
      domaine: 'zelty.fr',
      verifieLe: '2026-10-20',
      dateAjout: 0,
      dateMaj: 0,
    });
    const Page = (await import('./page')).default;
    const jsx = await Page({ params: Promise.resolve({ lang: 'fr', slug: 'zelty' }) });
    render(jsx);

    expect(screen.getByText(/Vérifié le 20 octobre 2026/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Vous êtes l'éditeur/i })).toHaveAttribute(
      'href',
      expect.stringContaining('sujet=editeur')
    );
  });

  it('n’affiche aucune mention de vérification si verifieLe est absent', async () => {
    getLogicielBySlugMock.mockResolvedValue({
      id: 'notion',
      nom: 'Notion',
      slug: 'notion',
      categorie: 'notes',
      secteur: 'saas',
      description: 'Notes et docs',
      verdictEditeur: 'KINDA',
      justificationEditeur: 'Base de données relationnelle complexe',
      domaine: 'notion.so',
      dateAjout: 0,
      dateMaj: 0,
    });
    const Page = (await import('./page')).default;
    const jsx = await Page({ params: Promise.resolve({ lang: 'fr', slug: 'notion' }) });
    render(jsx);

    expect(screen.queryByText(/Vérifié le/)).not.toBeInTheDocument();
  });
});
