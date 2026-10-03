// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import type { Logiciel } from '@/types/logiciel';

const getLogicielsMock = vi.fn();
const getVoteCountsMock = vi.fn();
vi.mock('@/lib/logiciels-server', () => ({
  getLogiciels: getLogicielsMock,
  getVoteCounts: getVoteCountsMock,
}));

vi.mock('@/lib/newsletter-client', () => ({
  subscribeNewsletter: vi.fn(),
}));

function fiche(overrides: Partial<Logiciel>): Logiciel {
  return {
    id: 'x',
    nom: 'X',
    slug: 'x',
    categorie: 'caisse',
    secteur: 'chr',
    description: '',
    verdictEditeur: 'KINDA',
    justificationEditeur: '',
    domaine: '',
    dateAjout: 0,
    dateMaj: 0,
    ...overrides,
  };
}

describe('Home page', () => {
  beforeEach(() => {
    getLogicielsMock.mockReset().mockResolvedValue([]);
    getVoteCountsMock.mockReset().mockResolvedValue({ remplace: 0, pasRemplacable: 0 });
  });

  it('renders the casevibecode heading', async () => {
    const Page = (await import('./page')).default;
    render(await Page());
    expect(screen.getByRole('heading', { name: /casevibecode/i })).toBeInTheDocument();
  });

  it('shows the community verdict once the vote threshold is reached, and the editor verdict below it', async () => {
    getLogicielsMock.mockResolvedValue([
      fiche({ id: 'zenchef', nom: 'Zenchef', slug: 'zenchef', verdictEditeur: 'KINDA' }),
      fiche({ id: 'laddition', nom: "L'Addition", slug: 'laddition', verdictEditeur: 'KINDA' }),
    ]);
    getVoteCountsMock.mockImplementation(async (id: string) =>
      id === 'zenchef'
        ? { remplace: 18, pasRemplacable: 4 } // 22 votes: community says YES
        : { remplace: 3, pasRemplacable: 1 } // 4 votes: editor verdict stands
    );

    const Page = (await import('./page')).default;
    render(await Page());

    expect(getVoteCountsMock).toHaveBeenCalledWith('zenchef');
    expect(getVoteCountsMock).toHaveBeenCalledWith('laddition');
    const zenchefCard = screen.getByRole('link', { name: /zenchef/i });
    expect(zenchefCard).toHaveTextContent('Remplaçable');
    expect(zenchefCard).not.toHaveTextContent('Partiellement remplaçable');
    expect(screen.getByRole('link', { name: /l'addition/i })).toHaveTextContent('Partiellement remplaçable');
  });
});
