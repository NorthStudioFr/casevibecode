// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { CtaEditeur } from './CtaEditeur';

describe('CtaEditeur', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('affiche le CTA vers l’URL de contact fournie par l’environnement', () => {
    vi.stubEnv('EDITEUR_CONTACT_URL', 'https://exemple.test/contact');
    render(<CtaEditeur />);
    const link = screen.getByRole('link', {
      name: "Vous voulez qu'on regarde vos outils et automatise ce qui peut l'être ?",
    });
    expect(link).toHaveAttribute('href', 'https://exemple.test/contact');
  });

  it('n’affiche rien sans URL de contact', () => {
    vi.stubEnv('EDITEUR_CONTACT_URL', '');
    const { container } = render(<CtaEditeur />);
    expect(container).toBeEmptyDOMElement();
  });
});
