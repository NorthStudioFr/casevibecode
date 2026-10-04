// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

import { NavLinks } from './NavLinks';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';

describe('NavLinks', () => {
  it('offers the list, audit, alternatives and the suggestion form', () => {
    pathname = '/';
    render(<NavLinks />);
    expect(screen.getByRole('link', { name: 'La liste' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Mon audit' })).toHaveAttribute('href', '/audit');
    expect(screen.getByRole('link', { name: 'Alternatives' })).toHaveAttribute('href', '/alternatives');
    expect(screen.getByRole('link', { name: 'Proposer un logiciel' })).toHaveAttribute('href', '/proposer');
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

  it('prefixes links and recognises the active tab in English', () => {
    pathname = '/en/audit';
    render(
      <LocaleProvider lang="en">
        <NavLinks />
      </LocaleProvider>,
    );
    expect(screen.getByRole('link', { name: 'My audit' })).toHaveAttribute('href', '/en/audit');
    expect(screen.getByRole('link', { name: 'My audit' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Suggest a tool' })).toHaveAttribute('href', '/en/proposer');
  });
});
