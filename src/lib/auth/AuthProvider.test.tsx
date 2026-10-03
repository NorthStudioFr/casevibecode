// @vitest-environment jsdom
import { render, screen, waitFor, act } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from './useAuth';

type Listener = (event: string, session: unknown) => void;
let listener: Listener = () => {};
const unsubscribeMock = vi.fn();
const authMock = {
  onAuthStateChange: vi.fn((cb: Listener) => {
    listener = cb;
    return { data: { subscription: { unsubscribe: unsubscribeMock } } };
  }),
  signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
  signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
  signUp: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
};
vi.mock('../supabase/client', () => ({ getSupabaseBrowser: () => ({ auth: authMock }) }));

function Consumer() {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <p>chargement</p>;
  return <p>{user ? `connecté:${user.uid}:${isAdmin}` : 'déconnecté'}</p>;
}

function Actions() {
  const a = useAuth();
  return (
    <>
      <button onClick={() => a.signInWithGoogle()}>google</button>
      <button onClick={() => a.signInWithEmail('a@b.fr', 'pw')}>email</button>
      <button onClick={() => a.signUpWithEmail('a@b.fr', 'pw')}>inscription</button>
      <button onClick={() => a.signOutUser()}>sortir</button>
    </>
  );
}

async function renderProvider(children = <Consumer />) {
  const { AuthProvider } = await import('./AuthProvider');
  return render(<AuthProvider>{children}</AuthProvider>);
}

describe('AuthProvider', () => {
  beforeEach(() => {
    unsubscribeMock.mockClear();
    Object.values(authMock).forEach((m) => 'mockClear' in m && m.mockClear());
  });

  it('exposes isAdmin true when app_metadata.admin is true', async () => {
    await renderProvider();
    act(() => listener('INITIAL_SESSION', { user: { id: 'u1', email: 'a@b.fr', app_metadata: { admin: true } } }));
    await waitFor(() => expect(screen.getByText('connecté:u1:true')).toBeInTheDocument());
  });

  it('ignores user_metadata.admin: a user-writable field never grants admin', async () => {
    await renderProvider();
    act(() =>
      listener('INITIAL_SESSION', {
        user: { id: 'u2', email: 'a@b.fr', app_metadata: {}, user_metadata: { admin: true } },
      }),
    );
    await waitFor(() => expect(screen.getByText('connecté:u2:false')).toBeInTheDocument());
  });

  it('is signed out and not loading when there is no session', async () => {
    await renderProvider();
    expect(screen.getByText('chargement')).toBeInTheDocument();
    act(() => listener('INITIAL_SESSION', null));
    await waitFor(() => expect(screen.getByText('déconnecté')).toBeInTheDocument());
  });

  it('drops admin on sign-out', async () => {
    await renderProvider();
    act(() => listener('SIGNED_IN', { user: { id: 'u1', app_metadata: { admin: true } } }));
    await waitFor(() => expect(screen.getByText('connecté:u1:true')).toBeInTheDocument());
    act(() => listener('SIGNED_OUT', null));
    await waitFor(() => expect(screen.getByText('déconnecté')).toBeInTheDocument());
  });

  it('unsubscribes on unmount', async () => {
    const { unmount } = await renderProvider();
    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('maps the four flows to Supabase Auth', async () => {
    await renderProvider(<Actions />);
    const click = async (name: string) => {
      await act(async () => screen.getByText(name).click());
    };
    await click('google');
    expect(authMock.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/connexion` },
    });
    await click('email');
    expect(authMock.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.fr', password: 'pw' });
    await click('inscription');
    expect(authMock.signUp).toHaveBeenCalledWith({ email: 'a@b.fr', password: 'pw' });
    await click('sortir');
    expect(authMock.signOut).toHaveBeenCalled();
  });

  it('surfaces Supabase auth errors to the caller', async () => {
    authMock.signInWithPassword.mockResolvedValueOnce({ error: new Error('Invalid login credentials') });
    function Failing() {
      const { signInWithEmail } = useAuth();
      const [message, setMessage] = useState('');
      return (
        <>
          <button onClick={() => signInWithEmail('a@b.fr', 'mauvais').catch((e: Error) => setMessage(e.message))}>go</button>
          <p>{message}</p>
        </>
      );
    }
    await renderProvider(<Failing />);
    await act(async () => screen.getByText('go').click());
    expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
  });
});
