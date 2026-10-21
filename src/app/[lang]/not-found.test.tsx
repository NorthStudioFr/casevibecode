// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import NotFound, { metadata } from './not-found';
import PageInconnue from './[...rest]/page';

describe('404 de marque', () => {
  it('propose un retour à la liste, aux alternatives et à la version anglaise', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voir la liste des logiciels/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Les alternatives' })).toHaveAttribute('href', '/alternatives');
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en');
  });

  it("n'est pas indexée", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it('toute adresse inconnue déclenche une vraie 404', () => {
    expect(() => PageInconnue()).toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });
});
