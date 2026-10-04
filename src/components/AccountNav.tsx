'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/lib/auth/useAuth';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const CLASS = 'text-sm text-slate-500 transition-colors hover:text-primary';

// Les votants sans compte ont une session anonyme (pas d'e-mail) : ils voient « Connexion ».
// Hors AuthProvider (tests, pages statiques) on retombe aussi sur le lien « Connexion ».
export function AccountNav() {
  const auth = useContext(AuthContext);
  const { t, href } = useLocale();
  const email = auth?.user?.email;
  if (!email) {
    return (
      <Link href={href('/connexion')} className={CLASS}>
        {t.nav.login}
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-x-4">
      {auth?.isAdmin && (
        <Link href={href('/admin')} className={CLASS}>
          {t.nav.admin}
        </Link>
      )}
      <button type="button" onClick={() => void auth?.signOutUser()} className={CLASS} title={email}>
        {t.nav.signOut}
      </button>
    </div>
  );
}
