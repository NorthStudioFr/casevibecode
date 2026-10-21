// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import type { Logiciel } from '@/types/logiciel';

const getLogicielsMock = vi.fn();
vi.mock('@/lib/logiciels-server', () => ({
  getLogiciels: getLogicielsMock,
  getVoteCounts: vi.fn().mockResolvedValue({ remplace: 0, pasRemplacable: 0 }),
  getNbConstruits: vi.fn().mockResolvedValue({}),
}));
vi.mock('@/lib/votes-client', () => ({ castVote: vi.fn() }));
vi.mock('@/lib/newsletter-client', () => ({ subscribeNewsletter: vi.fn() }));

const fiche = (o: Partial<Logiciel>): Logiciel => ({
  id: 'x', nom: 'X', slug: 'x', categorie: 'caisse', secteur: 'chr', description: '', verdictEditeur: 'KINDA',
  justificationEditeur: '', domaine: '', dateAjout: 0, dateMaj: Date.UTC(2026, 9, 20), ...o,
});

describe('SecteurLanding', () => {
  beforeEach(() => {
    getLogicielsMock.mockResolvedValue([
      fiche({ id: 'zelty', nom: 'Zelty', slug: 'zelty', verdictEditeur: 'NOT_REALLY', prixMensuel: 59 }),
      fiche({ id: 'zenchef', nom: 'Zenchef', slug: 'zenchef', categorie: 'reservation', verdictEditeur: 'KINDA', prixMensuel: 69 }),
      fiche({ id: 'notion', nom: 'Notion', slug: 'notion', categorie: 'notes', secteur: 'saas', verdictEditeur: 'YES', prixMensuel: 10 }),
    ]);
  });

  it('affiche sa question, ses chiffres réels et seulement les fiches de son secteur', async () => {
    const { SecteurLanding } = await import('./SecteurLanding');
    render(await SecteurLanding({ lang: 'fr', secteur: 'chr' }));
    expect(screen.getByRole('heading', { level: 1, name: /Restaurateur, hôtelier/ })).toBeInTheDocument();
    expect(screen.getByText(/2 logiciels · 128 € par mois cumulés/)).toBeInTheDocument();
    expect(screen.getByText('Zelty')).toBeInTheDocument();
    expect(screen.queryByText('Notion')).not.toBeInTheDocument();
  });

  it("renvoie vers l'autre secteur et vers la méthode", async () => {
    const { SecteurLanding } = await import('./SecteurLanding');
    render(await SecteurLanding({ lang: 'fr', secteur: 'saas' }));
    expect(screen.getByRole('link', { name: 'Restauration et hôtellerie' })).toHaveAttribute('href', '/restauration');
    expect(screen.getByRole('link', { name: /Comment ces verdicts/ })).toHaveAttribute('href', '/methode');
  });

  it("décrit la collection en données structurées, avec la date de mise à jour la plus récente et sans note", async () => {
    const { SecteurLanding } = await import('./SecteurLanding');
    const { container } = render(await SecteurLanding({ lang: 'en', secteur: 'chr' }));
    const blocs = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent as string));
    const page = blocs.find((b) => b['@type'] === 'CollectionPage');
    expect(page.url).toBe('https://casevibecode.fr/en/restauration');
    expect(page.dateModified).toBe('2026-10-20T00:00:00.000Z');
    expect(page.mainEntity.itemListElement).toHaveLength(2);
    expect(JSON.stringify(blocs)).not.toMatch(/Rating|Review/);
    expect(blocs.find((b) => b['@type'] === 'BreadcrumbList').itemListElement[1].item).toBe('https://casevibecode.fr/en/restauration');
  });
});

describe('secteurMetadata', () => {
  it.each([['fr', 'chr'], ['fr', 'saas'], ['en', 'chr'], ['en', 'saas']] as const)('titre et description tiennent dans les résultats (%s, %s)', async (lang, secteur) => {
    const { secteurMetadata } = await import('./SecteurLanding');
    const m = secteurMetadata(lang, secteur);
    expect(`${m.title} | casevibecode`.length).toBeLessThanOrEqual(60);
    expect((m.description as string).length).toBeLessThanOrEqual(155);
    expect(m.alternates?.languages).toBeTruthy();
  });
});
