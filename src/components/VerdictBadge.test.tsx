// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { VerdictBadge } from './VerdictBadge';

describe('VerdictBadge', () => {
  it.each([
    ['YES', 'Remplaçable'],
    ['KINDA', 'Partiellement remplaçable'],
    ['NOT_REALLY', 'Pas remplaçable'],
  ] as const)('renders the French label for %s', (verdict, label) => {
    render(<VerdictBadge verdict={verdict} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders a larger badge when big is set', () => {
    render(<VerdictBadge verdict="YES" big />);
    expect(screen.getByText('Remplaçable').className).toContain('text-lg');
  });
});
