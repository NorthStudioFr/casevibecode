// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import MentionsLegalesPage from './page';

const NOMS = ['MARQUE', 'NOM', 'EMAIL', 'SIRET', 'APE', 'FORME', 'TVA', 'ADRESSE'];

describe('MentionsLegalesPage', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('n’affiche aucune identité sans variables d’environnement (dépôt public neutre)', () => {
    NOMS.forEach((n) => vi.stubEnv(`EDITEUR_${n}`, ''));
    render(<MentionsLegalesPage />);
    expect(screen.getByRole('heading', { name: 'Mentions légales' })).toBeInTheDocument();
    for (const label of ['SIRET', 'Adresse', 'Email', 'Téléphone', 'Code APE']) {
      expect(screen.queryByText(new RegExp(`^${label}\\s*:`))).not.toBeInTheDocument();
    }
    expect(screen.getByText(/conçu et réalisé par l'éditeur du site/)).toBeInTheDocument();
  });

  it('affiche l’identité fournie par l’environnement, et jamais de téléphone', () => {
    vi.stubEnv('EDITEUR_MARQUE', 'Studio Exemple');
    vi.stubEnv('EDITEUR_NOM', 'Jeanne Modèle');
    vi.stubEnv('EDITEUR_EMAIL', 'contact@exemple.test');
    vi.stubEnv('EDITEUR_SIRET', '12345678900012');
    vi.stubEnv('EDITEUR_ADRESSE', '1 rue de l’Exemple, 75000 Paris');
    render(<MentionsLegalesPage />);
    expect(screen.getByText('Studio Exemple — Jeanne Modèle')).toBeInTheDocument();
    expect(screen.getByText('12345678900012')).toBeInTheDocument();
    expect(screen.getByText('contact@exemple.test')).toBeInTheDocument();
    expect(screen.getByText('1 rue de l’Exemple, 75000 Paris')).toBeInTheDocument();
    expect(screen.queryByText(/Téléphone\s*:/)).not.toBeInTheDocument();
  });
});
