// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import MethodePage, { generateMetadata } from './page';

describe('MethodePage', () => {
  it('affiche le titre et les sections principales en français', async () => {
    const page = await MethodePage({ params: Promise.resolve({ lang: 'fr' }) });
    render(page);

    expect(screen.getByRole('heading', { level: 1, name: 'Méthode' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Qui édite casevibecode ?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'D’où viennent les données ?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Que signifient les trois verdicts ?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'La prise de relais par la communauté' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Vous êtes éditeur : comment corriger une fiche ?' })).toBeInTheDocument();

    // Transparence sur l'éditeur et l'origine des données
    expect(screen.getByText(/North Studio/)).toBeInTheDocument();
    expect(screen.getByText(/canivibecodeit/i)).toBeInTheDocument();
    expect(screen.getByText(/20 votes/)).toBeInTheDocument();
    expect(screen.getByText(/nous vérifions chaque proposition/i)).toBeInTheDocument();
  });

  it('affiche la page en anglais', async () => {
    const page = await MethodePage({ params: Promise.resolve({ lang: 'en' }) });
    render(page);

    expect(screen.getByRole('heading', { level: 1, name: 'Methodology' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Who publishes casevibecode?' })).toBeInTheDocument();
    expect(screen.getByText(/North Studio/)).toBeInTheDocument();
    expect(screen.getByText(/20 votes/)).toBeInTheDocument();
    expect(screen.getByText(/we review every submission/i)).toBeInTheDocument();
  });

  it('génère des métadonnées valides', async () => {
    const metaFr = await generateMetadata({ params: Promise.resolve({ lang: 'fr' }) });
    expect(metaFr.title).toBe('Méthode');
    expect(metaFr.description).toBeDefined();

    const metaEn = await generateMetadata({ params: Promise.resolve({ lang: 'en' }) });
    expect(metaEn.title).toBe('Methodology');
    expect(metaEn.description).toBeDefined();
  });

  it("nomme l'éditeur comme les mentions légales, sans nom erroné, et pose les limites des verdicts", async () => {
    render(await MethodePage({ params: Promise.resolve({ lang: 'fr' }) }));
    expect(screen.getByText(/François-Laurent Lhabitant/)).toBeInTheDocument();
    expect(screen.queryByText(/Mickaël/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Ce que les verdicts ne sont pas' })).toBeInTheDocument();
    expect(screen.getByText(/Dernière mise à jour de cette page/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Proposer une correction/ })).toHaveAttribute('href', expect.stringContaining('sujet=editeur'));
    expect(screen.queryByText(/illégal/)).not.toBeInTheDocument();
  });
});
