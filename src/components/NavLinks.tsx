'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stripLang } from '@/lib/i18n/config';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const CLASS = 'inline-block py-1 text-sm text-slate-500 transition-colors hover:text-primary aria-[current=page]:text-primary';

export function NavLinks() {
  const { t, href } = useLocale();
  // Le chemin est comparé sans préfixe de langue : /en/alternatives et /alternatives sont le même onglet.
  const pathname = stripLang(usePathname() ?? '');
  const links = [
    { to: '/', label: t.nav.list, isActive: pathname === '/' || pathname.startsWith('/logiciel/') },
    { to: '/audit', label: t.nav.audit, isActive: pathname.startsWith('/audit') },
    { to: '/alternatives', label: t.nav.alternatives, isActive: pathname.startsWith('/alternatives') },
    { to: '/proposer', label: t.nav.propose, isActive: pathname.startsWith('/proposer') },
    { to: '/methode', label: t.footer.method, isActive: pathname.startsWith('/methode') },
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
    </nav>
  );
}
