// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import ConfidentialitePage from './page';

const NOMS = ['MARQUE', 'NOM', 'EMAIL', 'ADRESSE'];

describe('ConfidentialitePage', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('présente la notice RGPD et la CNIL, sans identité codée en dur', () => {
    NOMS.forEach((n) => vi.stubEnv(`EDITEUR_${n}`, ''));
    render(<ConfidentialitePage />);
    expect(screen.getByRole('heading', { name: 'Politique de confidentialité' })).toBeInTheDocument();
    expect(screen.getByText(/CNIL/)).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/responsable du traitement est l'éditeur du site\./);
    expect(document.body.textContent).toMatch(/l'adresse indiquée dans les mentions légales/);
  });

  it('cite le responsable et le contact fournis par l’environnement', () => {
    vi.stubEnv('EDITEUR_MARQUE', 'Studio Exemple');
    vi.stubEnv('EDITEUR_NOM', 'Jeanne Modèle');
    vi.stubEnv('EDITEUR_ADRESSE', '1 rue de l’Exemple, 75000 Paris');
    vi.stubEnv('EDITEUR_EMAIL', 'contact@exemple.test');
    render(<ConfidentialitePage />);
    expect(document.body.textContent).toMatch(
      /Studio Exemple — Jeanne Modèle, 1 rue de l’Exemple, 75000 Paris, contact@exemple\.test\./,
    );
    expect(document.body.textContent).toMatch(/en écrivant à contact@exemple\.test\./);
  });
});
