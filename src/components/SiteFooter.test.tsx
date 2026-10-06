// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

let chemin: string | null = '/';
vi.mock('next/navigation', () => ({ usePathname: () => chemin }));

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

  it('transmet la page courante au signalement de bug, sans préfixe de langue', () => {
    chemin = '/fr/logiciel/tally';
    render(<SiteFooter />);
    expect(screen.getByRole('link', { name: 'Signaler un bug' })).toHaveAttribute('href', '/signaler?page=%2Flogiciel%2Ftally');
    chemin = '/en/logiciel/tally';
    render(<SiteFooter />);
    expect(screen.getAllByRole('link', { name: 'Signaler un bug' })[1]).toHaveAttribute('href', '/signaler?page=%2Flogiciel%2Ftally');
    chemin = '/';
  });
});
