// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

const signInWithEmail = vi.fn().mockResolvedValue(undefined);
const signInWithGoogle = vi.fn().mockResolvedValue(undefined);
const signUpWithEmail = vi.fn().mockResolvedValue(undefined);
const signOutUser = vi.fn().mockResolvedValue(undefined);

let mockUser: { uid: string; email: string } | null = null;

vi.mock('@/lib/auth/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    isAdmin: false,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    signOutUser,
  }),
}));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('Connexion page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    signInWithEmail.mockResolvedValue(undefined);
    signInWithGoogle.mockResolvedValue(undefined);
    signUpWithEmail.mockResolvedValue(undefined);
    signOutUser.mockResolvedValue(undefined);
  });

  it('submits email/password to signInWithEmail and redirects home on success', async () => {
    const Page = (await import('./page')).default;
    render(<Page />);

    await userEvent.type(screen.getByLabelText(/email/i), 'chef@example.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'motdepasse123');
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(signInWithEmail).toHaveBeenCalledWith('chef@example.com', 'motdepasse123');
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/'));
  });

  it('calls signInWithGoogle when clicking the Google button and redirects home on success', async () => {
    const Page = (await import('./page')).default;
    render(<Page />);

    await userEvent.click(screen.getByRole('button', { name: /continuer avec google/i }));

    expect(signInWithGoogle).toHaveBeenCalled();
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/'));
  });

  it('submits email/password to signUpWithEmail when in inscription mode and redirects home', async () => {
    const Page = (await import('./page')).default;
    render(<Page />);

    // Toggle to inscription mode
    await userEvent.click(screen.getByRole('button', { name: /créer un compte/i }));

    await userEvent.type(screen.getByLabelText(/email/i), 'newchef@example.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'newpassword123');
    await userEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    expect(signUpWithEmail).toHaveBeenCalledWith('newchef@example.com', 'newpassword123');
    expect(signInWithEmail).not.toHaveBeenCalled();
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/'));
  });

  it('displays error message and does not redirect when signInWithEmail rejects', async () => {
    signInWithEmail.mockRejectedValue(new Error('Wrong password'));

    const Page = (await import('./page')).default;
    render(<Page />);

    await userEvent.type(screen.getByLabelText(/email/i), 'chef@example.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText(/wrong password/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('displays error message and does not redirect when signInWithGoogle rejects', async () => {
    signInWithGoogle.mockRejectedValue(new Error('Popup closed'));

    const Page = (await import('./page')).default;
    render(<Page />);

    await userEvent.click(screen.getByRole('button', { name: /continuer avec google/i }));

    expect(await screen.findByText(/popup closed/i)).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('shows the signed-in state with a working sign-out button when already authenticated', async () => {
    mockUser = { uid: 'user1', email: 'chef@example.com' };
    const Page = (await import('./page')).default;
    render(<Page />);

    expect(screen.getByText('Connecté en tant que chef@example.com')).toBeInTheDocument();
    expect(screen.queryByLabelText(/mot de passe/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /se déconnecter/i }));

    expect(signOutUser).toHaveBeenCalledTimes(1);
  });
});
