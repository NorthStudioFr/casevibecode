// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RetoursFiche } from './RetoursFiche';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

const retours = [{ id: '1', type: 'construit' as const, texte: 'Remplacé par des fichiers Markdown.', lien: 'https://exemple.fr/p', createdAt: Date.UTC(2026, 9, 1) }];

describe('RetoursFiche', () => {
  it('affiche les retours publiés avec un lien nofollow', () => {
    render(<RetoursFiche logicielId="notion" retours={retours} />);
    expect(screen.getByText('Remplacé par des fichiers Markdown.')).toBeInTheDocument();
    const lien = screen.getByRole('link', { name: 'Voir le projet' });
    expect(lien).toHaveAttribute('rel', expect.stringContaining('nofollow'));
    expect(lien).toHaveAttribute('rel', expect.stringContaining('ugc'));
  });

  it('invite à écrire le premier retour quand il n’y en a pas', () => {
    render(<RetoursFiche logicielId="notion" retours={[]} />);
    expect(screen.getByText(/Aucun retour publié/)).toBeInTheDocument();
  });

  it('envoie un retour (avec la langue) et remercie', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 201, json: async () => ({ ok: true }) });
    render(
      <LocaleProvider lang="en">
        <RetoursFiche logicielId="notion" retours={[]} />
      </LocaleProvider>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'It broke' }));
    await userEvent.type(screen.getByLabelText(/What you did/), 'The sync broke after a week of use, I went back.');
    await userEvent.click(screen.getByRole('button', { name: 'Send for review' }));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/contribution');
    expect(JSON.parse(init.body)).toMatchObject({ kind: 'retour', logicielId: 'notion', type: 'casse', langue: 'en', site: '' });
    expect(await screen.findByRole('status')).toHaveTextContent('Thank you');
  });

  it('traduit l’erreur renvoyée par le serveur', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 429, json: async () => ({ error: 'trop' }) });
    render(<RetoursFiche logicielId="notion" retours={[]} />);
    await userEvent.type(screen.getByLabelText(/Ce que vous avez fait/), 'Un texte suffisamment long pour être envoyé.');
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer pour relecture' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Trop d');
  });
});
