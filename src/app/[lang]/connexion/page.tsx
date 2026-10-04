'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

// This page uses AuthProvider, which relies on the Supabase browser client (public env vars absent at build time).
// Prerendering at build time would fail without them.
// Force dynamic rendering to prevent prerendering.
export const dynamic = 'force-dynamic';

export default function ConnexionPage() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'connexion' | 'inscription'>('connexion');
  const [error, setError] = useState<string | null>(null);

  function showError(err: unknown) {
    const message = err instanceof Error ? err.message : 'Une erreur s\'est produite';
    setError(message);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'connexion') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      router.push('/');
    } catch (err) {
      showError(err);
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err) {
      showError(err);
    }
  }

  async function handleSignOut() {
    setError(null);
    try {
      await signOutUser();
    } catch (err) {
      showError(err);
    }
  }

  // Un votant anonyme a une session sans e-mail : il voit le formulaire, pas « connecté en tant que ».
  if (user?.email) {
    return (
      <main className="min-h-screen p-8 max-w-md mx-auto">
        <h1 className="font-serif text-2xl font-semibold text-slate-800">Connexion</h1>
        <p className="mt-6 text-slate-700">Connecté en tant que {user.email}</p>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-4 rounded-sm border border-slate-300 px-4 py-2 transition-colors hover:border-secondary hover:text-secondary"
        >
          Se déconnecter
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-md mx-auto">
      <h1 className="font-serif text-2xl font-semibold text-slate-800">Connexion</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          />
        </label>
        <label className="text-slate-700">
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="rounded-sm bg-primary px-4 py-2 font-sans text-sm font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50"
        >
          {mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={() => setMode(mode === 'connexion' ? 'inscription' : 'connexion')}
        className="mt-2 text-sm text-slate-600 underline"
      >
        {mode === 'connexion' ? "Créer un compte" : 'Déjà un compte ? Se connecter'}
      </button>
      <button
        type="button"
        onClick={handleGoogle}
        className="mt-6 w-full rounded-sm border border-slate-300 px-4 py-2 transition-colors hover:border-secondary hover:text-secondary"
      >
        Continuer avec Google
      </button>
    </main>
  );
}
