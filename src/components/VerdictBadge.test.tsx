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

  it('includes whitespace-nowrap to avoid breaking onto two lines', () => {
    render(<VerdictBadge verdict="KINDA" />);
    expect(screen.getByText('Partiellement remplaçable').className).toContain('whitespace-nowrap');
  });

  it('renders a short label when court is set', () => {
    render(<VerdictBadge verdict="KINDA" court />);
    expect(screen.getByText('Partiel')).toBeInTheDocument();
  });

  it("réserve l'aplat de couleur à « Remplaçable » : les autres verdicts sont en contour, texte neutre", () => {
    const { rerender } = render(<VerdictBadge verdict="YES" />);
    expect(screen.getByText('Remplaçable').className).toContain('bg-primary');
    rerender(<VerdictBadge verdict="NOT_REALLY" />);
    const no = screen.getByText('Pas remplaçable');
    expect(no.className).not.toContain('bg-no');
    expect(no.className).toContain('border-no');
    expect(no.className).toContain('text-slate-800');
  });
});
