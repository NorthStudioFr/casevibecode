'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stripLang } from '@/lib/i18n/config';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const CLASS = 'text-sm text-slate-500 transition-colors hover:text-primary aria-[current=page]:text-primary';

// `proposerHref` : lien « Proposer un logiciel » (mailto: de l'éditeur), fourni par le
// serveur ; sans lui, l'onglet n'est pas affiché.
export function NavLinks({ proposerHref }: { proposerHref?: string }) {
  const { t, href } = useLocale();
  // Le chemin est comparé sans préfixe de langue : /en/alternatives et /alternatives sont le même onglet.
  const pathname = stripLang(usePathname() ?? '');
  const links = [
    { to: '/', label: t.nav.list, isActive: pathname === '/' || pathname.startsWith('/logiciel/') },
    { to: '/alternatives', label: t.nav.alternatives, isActive: pathname.startsWith('/alternatives') },
  ];
  return (
    <nav aria-label={t.nav.main} className="flex flex-wrap items-center gap-x-5 gap-y-1">
      {links.map((link) => (
        <Link
          key={link.to}
          href={href(link.to)}
          aria-current={link.isActive ? 'page' : undefined}
          className={CLASS}
        >
          {link.label}
        </Link>
      ))}
      {proposerHref && (
        <a href={proposerHref} className={CLASS}>
          {t.nav.propose}
        </a>
      )}
    </nav>
  );
}
