// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

import { NavLinks } from './NavLinks';

describe('NavLinks', () => {
  it('offers the list, alternatives and a way to propose a software', () => {
    render(<NavLinks proposerHref="mailto:contact@exemple.test?subject=Proposer" />);
    expect(screen.getByRole('link', { name: 'La liste' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Alternatives' })).toHaveAttribute('href', '/alternatives');
    expect(screen.getByRole('link', { name: 'Proposer un logiciel' }).getAttribute('href')).toMatch(/^mailto:/);
  });

  it('masque « Proposer un logiciel » sans adresse de contact', () => {
    render(<NavLinks />);
    expect(screen.queryByRole('link', { name: 'Proposer un logiciel' })).toBeNull();
  });

  it('marks the current tab, and keeps "La liste" active on a fiche page', () => {
    pathname = '/alternatives';
    const { rerender } = render(<NavLinks />);
    expect(screen.getByRole('link', { name: 'Alternatives' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'La liste' })).not.toHaveAttribute('aria-current');

    pathname = '/logiciel/zenchef';
    rerender(<NavLinks />);
    expect(screen.getByRole('link', { name: 'La liste' })).toHaveAttribute('aria-current', 'page');
  });
});
