// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach } from 'vitest';

const pushMock = vi.fn();
let mockParams: { id: string } = { id: 'nouveau' };
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => mockParams,
}));

const saveLogicielMock = vi.fn().mockResolvedValue(undefined);
const getLogicielClientMock = vi.fn();
vi.mock('@/lib/logiciels-admin-client', () => ({
  saveLogiciel: saveLogicielMock,
  getLogicielClient: getLogicielClientMock,
}));

describe('Logiciel form page', () => {
  beforeEach(() => {
    pushMock.mockClear();
    saveLogicielMock.mockClear();
    getLogicielClientMock.mockReset();
    saveLogicielMock.mockResolvedValue(undefined);
  });

  it('renders a blank form and does not fetch anything for /admin/logiciels/nouveau', async () => {
    mockParams = { id: 'nouveau' };
    const Page = (await import('./page')).default;
    render(<Page />);

    expect(screen.getByLabelText('Nom')).toHaveValue('');
    expect(screen.getByLabelText('Slug (identifiant URL)')).toHaveValue('');
    expect(getLogicielClientMock).not.toHaveBeenCalled();
  });

  it('pre-fills the form with the existing fiche when editing an existing logiciel', async () => {
    mockParams = { id: 'zenchef' };
    getLogicielClientMock.mockResolvedValue({
        nom: 'Zenchef',
        slug: 'zenchef',
        categorie: 'reservation',
        description: 'Logiciel de réservation',
        verdictEditeur: 'YES',
        justificationEditeur: 'API ouverte',
        domaine: 'zenchef.com',
        prix: '29 €/mois',
        prixMensuel: 29,
      });
    const Page = (await import('./page')).default;
    render(<Page />);

    await waitFor(() => expect(screen.getByLabelText('Nom')).toHaveValue('Zenchef'));
    expect(screen.getByLabelText('Slug (identifiant URL)')).toHaveValue('zenchef');
    expect(screen.getByLabelText('Description')).toHaveValue('Logiciel de réservation');
    expect(screen.getByLabelText('Justification éditeur')).toHaveValue('API ouverte');
    expect(screen.getByLabelText('Domaine du site (ex: zenchef.com)')).toHaveValue('zenchef.com');
    expect(screen.getByLabelText('Prix (optionnel, ex: 29 €/mois)')).toHaveValue('29 €/mois');
    expect(screen.getByLabelText('Prix mensuel en € (nombre, optionnel)')).toHaveValue(29);
    expect(getLogicielClientMock).toHaveBeenCalledWith('zenchef');
  });

  it('leaves a blank form when the referenced doc does not exist', async () => {
    mockParams = { id: 'inconnu' };
    getLogicielClientMock.mockResolvedValue(null);
    const Page = (await import('./page')).default;
    render(<Page />);

    await waitFor(() => expect(getLogicielClientMock).toHaveBeenCalled());
    expect(screen.getByLabelText('Nom')).toHaveValue('');
  });

  it('keeps the slug field editable when creating a new fiche', async () => {
    mockParams = { id: 'nouveau' };
    const Page = (await import('./page')).default;
    render(<Page />);

    expect(screen.getByLabelText('Slug (identifiant URL)')).toBeEnabled();
  });

  it('disables the slug field when editing an existing fiche and saves under the route id', async () => {
    mockParams = { id: 'zenchef' };
    getLogicielClientMock.mockResolvedValue({
        nom: 'Zenchef',
        slug: 'zenchef',
        categorie: 'reservation',
        description: '',
        verdictEditeur: 'YES',
        justificationEditeur: '',
        domaine: '',
      });
    const Page = (await import('./page')).default;
    render(<Page />);

    await waitFor(() => expect(screen.getByLabelText('Nom')).toHaveValue('Zenchef'));
    const slugInput = screen.getByLabelText('Slug (identifiant URL)');
    expect(slugInput).toBeDisabled();
    expect(slugInput).toHaveValue('zenchef');

    await userEvent.clear(screen.getByLabelText('Nom'));
    await userEvent.type(screen.getByLabelText('Nom'), 'Zenchef Pro');
    await userEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => expect(saveLogicielMock).toHaveBeenCalledTimes(1));
    expect(saveLogicielMock.mock.calls[0][0]).toMatchObject({ nom: 'Zenchef Pro', slug: 'zenchef' });
    expect(pushMock).toHaveBeenCalledWith('/admin');
  });

  it('refuses to create a new fiche whose slug already exists, without overwriting it', async () => {
    mockParams = { id: 'nouveau' };
    // Collision check: a row already exists for slug zenchef.
    getLogicielClientMock.mockResolvedValue({ nom: 'Zenchef', slug: 'zenchef' });
    const Page = (await import('./page')).default;
    render(<Page />);

    await userEvent.type(screen.getByLabelText('Nom'), 'Autre Zenchef');
    await userEvent.type(screen.getByLabelText('Slug (identifiant URL)'), 'zenchef');
    await userEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/existe déjà/i);
    expect(getLogicielClientMock).toHaveBeenCalledWith('zenchef');
    expect(saveLogicielMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('creates a new fiche when its slug is free', async () => {
    mockParams = { id: 'nouveau' };
    getLogicielClientMock.mockResolvedValue(null);
    const Page = (await import('./page')).default;
    render(<Page />);

    await userEvent.type(screen.getByLabelText('Nom'), 'Fudger');
    await userEvent.type(screen.getByLabelText('Slug (identifiant URL)'), 'fudger');
    await userEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => expect(saveLogicielMock).toHaveBeenCalledTimes(1));
    expect(saveLogicielMock.mock.calls[0][0]).toMatchObject({ nom: 'Fudger', slug: 'fudger' });
    expect(pushMock).toHaveBeenCalledWith('/admin');
  });
});
