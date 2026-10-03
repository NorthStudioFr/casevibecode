// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import type { Alternative, Logiciel } from '@/types/logiciel';

const getLogicielsMock = vi.fn();
vi.mock('@/lib/logiciels-server', () => ({ getLogiciels: getLogicielsMock }));

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

const tasty: Alternative = {
  nom: 'TastyIgniter',
  url: 'https://tastyigniter.com',
  type: 'open-source',
  description: 'Commandes en ligne.',
};

describe('Alternatives page', () => {
  beforeEach(() => {
    getLogicielsMock.mockReset().mockResolvedValue([
      fiche({ id: 'clickeat', nom: 'ClickEat', slug: 'clickeat', prixMensuel: 20, alternatives: [tasty] }),
      fiche({ id: 'dood', nom: 'DOOD', slug: 'dood', alternatives: [tasty] }),
      fiche({ id: 'zenchef', nom: 'Zenchef', slug: 'zenchef', categorie: 'reservation', alternatives: [] }),
    ]);
  });

  it('summarises how many alternatives and fiches are covered', async () => {
    const Page = (await import('./page')).default;
    render(await Page());
    expect(screen.getByText(/1 alternative · 2 logiciels/i)).toBeInTheDocument();
  });

  it('highlights alternatives that cover several paid tools, with the summed monthly price', async () => {
    const Page = (await import('./page')).default;
    render(await Page());

    expect(screen.getByRole('heading', { name: /un outil, plusieurs abonnements/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'TastyIgniter' })).toHaveAttribute('href', 'https://tastyigniter.com');
    expect(screen.getByText(/2 logiciels · 20 €\/mois/i)).toBeInTheDocument();
  });

  it('lists the fiches that have alternatives by category, linking to their alternatives page', async () => {
    const Page = (await import('./page')).default;
    render(await Page());

    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/logiciel/clickeat/alternatives');
    expect(hrefs).toContain('/logiciel/dood/alternatives');
    expect(hrefs.some((h) => h?.includes('zenchef'))).toBe(false);
  });
});
