'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/lib/auth/useAuth';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const CLASS = 'text-sm text-slate-500 transition-colors hover:text-primary';

// Les votants ont une session anonyme (pas d'e-mail) : le bandeau public n'affiche aucun lien de
// connexion, qui laisserait croire à un compte visiteur. L'accès à /connexion reste dans le pied de page.
export function AccountNav() {
  const auth = useContext(AuthContext);
  const { t, href } = useLocale();
  const email = auth?.user?.email;
  if (!email) return null;
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
