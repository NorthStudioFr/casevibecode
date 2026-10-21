// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SnippetBadgeEditeur } from './SnippetBadgeEditeur';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';

describe('SnippetBadgeEditeur', () => {
  it('affiche le snippet avec le verdict réel et formulation neutre', () => {
    render(<SnippetBadgeEditeur nom="Zelty" slug="zelty" verdict="NOT_REALLY" />);
    expect(screen.getByText('Badge pour votre site')).toBeInTheDocument();
    const code = screen.getByText(/<a href=/);
    expect(code.textContent).toContain('https://casevibecode.fr/logiciel/zelty');
    expect(code.textContent).toContain('/api/badge/zelty?lang=fr');
    expect(code.textContent).toContain('Verdict casevibecode : Pas remplaçable');
    expect(code.textContent?.toLowerCase()).not.toContain('recommandé');
    expect(code.textContent?.toLowerCase()).not.toContain('recommended');
  });

  it('fonctionne à l’identique pour les verdicts Remplaçable et Partiel', () => {
    const { rerender } = render(<SnippetBadgeEditeur nom="Tally" slug="tally" verdict="YES" />);
    expect(screen.getByText(/Verdict casevibecode : Remplaçable/)).toBeInTheDocument();

    rerender(<SnippetBadgeEditeur nom="Notion" slug="notion" verdict="KINDA" />);
    expect(screen.getByText(/Verdict casevibecode : Partiellement remplaçable/)).toBeInTheDocument();
  });

  it('copie le snippet HTML dans le presse-papiers au clic', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<SnippetBadgeEditeur nom="Zelty" slug="zelty" verdict="NOT_REALLY" />);
    const button = screen.getByRole('button', { name: 'Copier le snippet HTML' });
    await userEvent.click(button);

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain('https://casevibecode.fr/logiciel/zelty');
    expect(screen.getByRole('button', { name: 'Copié !' })).toBeInTheDocument();
  });

  it('s’adapte sous la locale anglaise', () => {
    render(
      <LocaleProvider lang="en">
        <SnippetBadgeEditeur nom="Tally" slug="tally" verdict="YES" />
      </LocaleProvider>,
    );
    expect(screen.getByText('Badge for your website')).toBeInTheDocument();
    expect(screen.getByText(/casevibecode verdict: Replaceable/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy HTML snippet' })).toBeInTheDocument();
  });
});
