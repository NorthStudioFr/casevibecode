'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'La liste', isActive: (p: string) => p === '/' || p.startsWith('/logiciel/') },
  { href: '/alternatives', label: 'Alternatives', isActive: (p: string) => p.startsWith('/alternatives') },
] as const;

const CLASS = 'text-sm text-slate-500 transition-colors hover:text-primary aria-[current=page]:text-primary';

// `proposerHref` : lien « Proposer un logiciel » (mailto: de l'éditeur), fourni par le
// serveur ; sans lui, l'onglet n'est pas affiché.
export function NavLinks({ proposerHref }: { proposerHref?: string }) {
  const pathname = usePathname() ?? '';
  return (
    <nav aria-label="Navigation principale" className="flex flex-wrap items-center gap-x-5 gap-y-1">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={link.isActive(pathname) ? 'page' : undefined}
          className={CLASS}
        >
          {link.label}
        </Link>
      ))}
      {proposerHref && (
        <a href={proposerHref} className={CLASS}>
          Proposer un logiciel
        </a>
      )}
    </nav>
  );
}
