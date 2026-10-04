// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }));

const listLogicielsClientMock = vi.fn().mockResolvedValue([]);
vi.mock('@/lib/logiciels-admin-client', () => ({ listLogicielsClient: listLogicielsClientMock }));

let mockAuth = { user: null as { uid: string } | null, isAdmin: false, loading: false };
vi.mock('@/lib/auth/useAuth', () => ({ useAuth: () => mockAuth }));

describe('Admin page', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('redirects to /connexion when the user is not an admin', async () => {
    mockAuth = { user: null, isAdmin: false, loading: false };
    const Page = (await import('./page')).default;
    render(<Page />);

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/connexion'));
  });

  it('redirects to /connexion when the user is signed in but lacks the admin claim', async () => {
    mockAuth = { user: { uid: 'friend1' }, isAdmin: false, loading: false };
    const Page = (await import('./page')).default;
    render(<Page />);

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/connexion'));
  });

  it('shows the logiciels list when the user is an admin', async () => {
    mockAuth = { user: { uid: 'admin1' }, isAdmin: true, loading: false };
    listLogicielsClientMock.mockResolvedValue([
      { id: 'zenchef', nom: 'Zenchef', slug: 'zenchef' },
    ]);
    const Page = (await import('./page')).default;
    render(<Page />);

    await waitFor(() => expect(screen.getByText('Zenchef')).toBeInTheDocument());
  });
});
