// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { CtaEditeur } from './CtaEditeur';

describe('CtaEditeur', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('affiche un mot étiqueté avec le lien de contact et la marque fournis par l’environnement', () => {
    vi.stubEnv('EDITEUR_CONTACT_URL', 'https://exemple.test/contact');
    vi.stubEnv('EDITEUR_MARQUE', 'Marque Test');
    render(<CtaEditeur />);
    expect(screen.getByText("Mot de l'éditeur")).toBeInTheDocument();
    expect(screen.getByText(/Marque Test regarde vos outils/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /En savoir plus/ })).toHaveAttribute('href', 'https://exemple.test/contact');
  });

  it('parle aux restaurateurs sur une fiche CHR', () => {
    vi.stubEnv('EDITEUR_CONTACT_URL', 'https://exemple.test/contact');
    vi.stubEnv('EDITEUR_MARQUE', 'Marque Test');
    render(<CtaEditeur secteur="chr" />);
    expect(screen.getByText(/Restaurateur, hôtelier/)).toBeInTheDocument();
  });

  it('n’affiche rien sans URL de contact', () => {
    vi.stubEnv('EDITEUR_CONTACT_URL', '');
    const { container } = render(<CtaEditeur />);
    expect(container).toBeEmptyDOMElement();
  });
});
