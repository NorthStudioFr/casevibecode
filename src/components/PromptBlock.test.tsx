// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptBlock } from './PromptBlock';
import type { Logiciel } from '@/types/logiciel';

const logiciel: Logiciel = {
  id: 'eazmenu',
  nom: 'Eazmenu',
  slug: 'eazmenu',
  categorie: 'autre',
  secteur: 'chr',
  description: 'Menu digital QR code multilingue.',
  verdictEditeur: 'YES',
  justificationEditeur: 'Un menu QR code sans commande ni paiement est simple à recoder.',
  domaine: '',
  dateAjout: 0,
  dateMaj: 0,
};

describe('PromptBlock', () => {
  it("includes the fiche's name, description and justification in the prompt", () => {
    render(<PromptBlock logiciel={logiciel} />);
    const pre = screen.getByText(/Construis un outil qui remplace Eazmenu/);
    expect(pre.textContent).toContain(logiciel.description);
    expect(pre.textContent).toContain(logiciel.justificationEditeur);
  });

  it('copies the prompt to the clipboard and shows confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<PromptBlock logiciel={logiciel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Copier le prompt' }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Construis un outil qui remplace Eazmenu'));
    expect(await screen.findByRole('button', { name: 'Copié !' })).toBeInTheDocument();
  });

  it('offers an open-in link for each agent carrying the prompt', () => {
    render(<PromptBlock logiciel={logiciel} />);
    expect(screen.getByRole('link', { name: /Claude Code/ }).getAttribute('href')).toMatch(/^claude-cli:\/\/open\?q=/);
    expect(screen.getByRole('link', { name: /Codex/ }).getAttribute('href')).toMatch(/^https:\/\/chatgpt\.com\/codex/);
    expect(screen.getByRole('link', { name: /Cursor/ }).getAttribute('href')).toMatch(/^https:\/\/cursor\.com\/link\/prompt/);
  });
});

describe('PromptBlock — prompt dédié', () => {
  it('affiche le prompt propre à la fiche quand il existe, sans le texte CHR', () => {
    render(<PromptBlock logiciel={{ ...logiciel, secteur: 'saas', prompt: 'Construis un clone de Notion avec Next.js.' }} />);
    expect(screen.getByText('Construis un clone de Notion avec Next.js.')).toBeInTheDocument();
    expect(screen.queryByText(/restaurant, bar ou hôtel/)).toBeNull();
  });
});
