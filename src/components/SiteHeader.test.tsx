// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('links the brand to the home page and offers the theme toggle', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: /casevibecode/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('button', { name: /thème/i })).toBeInTheDocument();
  });
});
