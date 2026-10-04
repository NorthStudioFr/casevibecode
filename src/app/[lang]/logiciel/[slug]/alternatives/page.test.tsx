// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import type { Logiciel } from '@/types/logiciel';

const getLogicielsMock = vi.fn();
vi.mock('@/lib/logiciels-server', () => ({ getLogiciels: getLogicielsMock }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

function fiche(overrides: Partial<Logiciel>): Logiciel {
  return {
    id: 'zenchef',
    nom: 'Zenchef',
    slug: 'zenchef',
    categorie: 'reservation',
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

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe('Alternatives of a fiche', () => {
  beforeEach(() => {
    getLogicielsMock.mockReset().mockResolvedValue([
      fiche({
        alternatives: [
          { nom: 'OpenResto', url: 'https://openresto.io', type: 'open-source', description: 'Réservations.' },
          { nom: 'Libre', url: 'https://libre.fr', type: 'gratuit', description: 'Gratuit.' },
        ],
      }),
      fiche({ id: 'vide', slug: 'vide', nom: 'Vide' }),
    ]);
  });

  it('lists every alternative and links back to the fiche', async () => {
    const Page = (await import('./page')).default;
    render(await Page(params('zenchef')));

    expect(screen.getByRole('heading', { level: 1, name: /alternatives à zenchef/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'OpenResto' })).toHaveAttribute('href', 'https://openresto.io');
    expect(screen.getByRole('link', { name: 'Libre' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /retour à la fiche zenchef/i })).toHaveAttribute('href', '/logiciel/zenchef');
  });

  it('is a 404 for an unknown fiche or a fiche without alternatives', async () => {
    const Page = (await import('./page')).default;
    await expect(Page(params('inconnu'))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(Page(params('vide'))).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
