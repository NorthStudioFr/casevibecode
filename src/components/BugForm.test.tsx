// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

let query = '';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(query) }));

import { BugForm } from './BugForm';

afterEach(() => {
  vi.unstubAllGlobals();
  query = '';
});

describe('BugForm', () => {
  it('préremplit la page depuis le lien du pied de page, sans demander d’e-mail', () => {
    query = 'page=%2Flogiciel%2Ftally';
    render(<BugForm />);
    expect(screen.getByLabelText(/Page concernée/)).toHaveValue('/logiciel/tally');
    expect(screen.queryByLabelText(/mail/i)).toBeNull();
  });

  it('ignore une page externe passée dans le lien', () => {
    query = 'page=https%3A%2F%2Fevil.example';
    render(<BugForm />);
    expect(screen.getByLabelText(/Page concernée/)).toHaveValue('');
  });

  it('envoie le signalement à /api/contribution et remercie', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal('fetch', fetchMock);
    query = 'page=%2Flogiciel%2Ftally';
    render(<BugForm />);
    await userEvent.type(screen.getByLabelText(/Ce qui ne marche pas/), 'Le bouton ne répond pas sur mon iPhone.');
    await userEvent.click(screen.getByRole('button', { name: 'Envoyer le signalement' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Merci'));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/contribution');
    expect(JSON.parse(init.body)).toMatchObject({ kind: 'bug', message: 'Le bouton ne répond pas sur mon iPhone.', page: '/logiciel/tally', langue: 'fr' });
  });
});
