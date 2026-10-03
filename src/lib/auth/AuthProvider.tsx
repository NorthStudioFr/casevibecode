'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '../supabase/client';
import { AuthContext, type AuthUser } from './useAuth';

function toAuthUser(user: User | null | undefined): AuthUser | null {
  return user ? { uid: user.id, email: user.email } : null;
}

// Le droit administrateur se lit dans app_metadata (posé côté serveur par le
// script set-admin), JAMAIS dans user_metadata que l'utilisateur peut écrire.
// Ce n'est qu'un confort d'affichage : la base fait foi (RLS).
function readIsAdmin(user: User | null | undefined): boolean {
  return user?.app_metadata?.admin === true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // INITIAL_SESSION est émis à l'abonnement, puis chaque changement de session.
    const { data } = getSupabaseBrowser().auth.onAuthStateChange((_event, session) => {
      setUser(toAuthUser(session?.user));
      setIsAdmin(readIsAdmin(session?.user));
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
    signInWithGoogle: async () => {
      // Redirection vers Google puis retour sur /connexion (session reprise au retour).
      const { error } = await getSupabaseBrowser().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/connexion` },
      });
      if (error) throw error;
    },
    signInWithEmail: async (email: string, password: string) => {
      const { error } = await getSupabaseBrowser().auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signUpWithEmail: async (email: string, password: string) => {
      const { error } = await getSupabaseBrowser().auth.signUp({ email, password });
      if (error) throw error;
    },
    signOutUser: async () => {
      const { error } = await getSupabaseBrowser().auth.signOut();
      if (error) throw error;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
