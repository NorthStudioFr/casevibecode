'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/lib/auth/useAuth';

const CLASS = 'text-sm text-slate-500 transition-colors hover:text-primary';

// Les votants sans compte ont une session anonyme (pas d'e-mail) : ils voient « Connexion ».
// Hors AuthProvider (tests, pages statiques) on retombe aussi sur le lien « Connexion ».
export function AccountNav() {
  const auth = useContext(AuthContext);
  const email = auth?.user?.email;
  if (!email) {
    return (
      <Link href="/connexion" className={CLASS}>
        Connexion
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-x-4">
      {auth?.isAdmin && (
        <Link href="/admin" className={CLASS}>
          Admin
        </Link>
      )}
      <button type="button" onClick={() => void auth?.signOutUser()} className={CLASS} title={email}>
        Se déconnecter
      </button>
    </div>
  );
}
