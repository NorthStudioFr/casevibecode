// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { AccountNav } from './AccountNav';
import { AuthContext, type AuthContextValue } from '@/lib/auth/useAuth';

const base: AuthContextValue = {
  user: null,
  loading: false,
  isAdmin: false,
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signOutUser: vi.fn().mockResolvedValue(undefined),
};

const wrap = (v: Partial<AuthContextValue>) =>
  render(
    <AuthContext.Provider value={{ ...base, ...v }}>
      <AccountNav />
    </AuthContext.Provider>,
  );

describe('AccountNav', () => {
  it("n'affiche aucun lien de connexion hors AuthProvider", () => {
    const { container } = render(<AccountNav />);
    expect(container).toBeEmptyDOMElement();
  });

  it("n'affiche rien à un votant anonyme (session sans e-mail)", () => {
    const { container } = wrap({ user: { uid: 'a', email: undefined } });
    expect(container).toBeEmptyDOMElement();
  });

  it('propose « Se déconnecter » à un compte et déconnecte au clic, sans lien Admin', () => {
    const signOutUser = vi.fn().mockResolvedValue(undefined);
    wrap({ user: { uid: 'u', email: 'a@b.fr' }, signOutUser });
    fireEvent.click(screen.getByRole('button', { name: /déconnecter/i }));
    expect(signOutUser).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('link', { name: 'Admin' })).toBeNull();
  });

  it('affiche le lien Admin uniquement pour un administrateur', () => {
    wrap({ user: { uid: 'u', email: 'a@b.fr' }, isAdmin: true });
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin');
  });
});
