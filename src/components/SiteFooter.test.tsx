// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { SiteFooter } from './SiteFooter';

describe('SiteFooter', () => {
  it('links to the legal pages', () => {
    render(<SiteFooter />);
    expect(screen.getByRole('link', { name: 'Mentions légales' })).toHaveAttribute(
      'href',
      '/mentions-legales'
    );
    expect(screen.getByRole('link', { name: 'Confidentialité' })).toHaveAttribute(
      'href',
      '/confidentialite'
    );
  });

  it('credits canivibecodeit for the design', () => {
    render(<SiteFooter />);
    expect(screen.getByRole('link', { name: /canivibecodeit/i })).toHaveAttribute(
      'href',
      'https://canivibecodeit.com'
    );
  });
});
