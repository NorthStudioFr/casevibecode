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
      verdictEditeur: 'KINDA',
      prix: 'à partir de 69 €/mois',
      alternatives: [{ nom: 'Odoo', url: 'https://odoo.com', type: 'open-source', description: '' }],
    });
    const { generateMetadata } = await import('./page');

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'zenchef' }) });

    expect(getLogicielBySlugMock).toHaveBeenCalledWith('zenchef', 'fr');
    expect(metadata.title).toBe('Zenchef : prix, alternatives et verdict');
    expect(metadata.description).toBe(
      'Gestion des réservations en ligne Prix : à partir de 69 €/mois. Verdict casevibecode : Partiellement remplaçable. 1 alternative.',
    );
    expect((metadata.description as string).length).toBeLessThanOrEqual(155);
  });

  it('raccourcit la description de l’outil, jamais le verdict ni le prix', async () => {
    getLogicielBySlugMock.mockResolvedValue({
      id: 'zelty', nom: 'Zelty', slug: 'zelty', verdictEditeur: 'NOT_REALLY', prix: 'à partir de 59 €/mois',
      description: 'Caisse et gestion cloud pour restaurants indépendants, fast-foods et chaînes multi-établissements, avec écran cuisine, click & collect et gestionnaire de commandes.',
    });
    const { generateMetadata } = await import('./page');
    const d = (await generateMetadata({ params: Promise.resolve({ slug: 'zelty' }) })).description as string;
    expect(d.length).toBeLessThanOrEqual(155);
    expect(d).toContain('Prix : à partir de 59 €/mois.');
    expect(d).toContain('Verdict casevibecode : Pas remplaçable.');
    expect(d).toContain('…');
  });

  it('falls back to a generated description when the fiche has none', async () => {
    getLogicielBySlugMock.mockResolvedValue({ id: 'fudger', nom: 'Fudger', slug: 'fudger', description: '' });
    const { generateMetadata } = await import('./page');

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'fudger' }) });

    expect(metadata.title).toBe('Fudger : alternatives et verdict');
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
    // Snippet badge éditeur sur Zelty (NOT_REALLY)
    expect(screen.getByText('Badge pour votre site')).toBeInTheDocument();
    expect(screen.getAllByText(/Verdict casevibecode : Pas remplaçable/).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/recommandé par/i)).not.toBeInTheDocument();
  });

  it('n’affiche aucune mention de vérification si verifieLe est absent mais propose le badge éditeur', async () => {
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
    // Le badge est bien proposé sur Notion (KINDA) à l’identique
    expect(screen.getByText('Badge pour votre site')).toBeInTheDocument();
    expect(screen.getAllByText(/Verdict casevibecode : Partiellement remplaçable/).length).toBeGreaterThanOrEqual(1);
  });
});
