import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { NavLinks } from './NavLinks';
import { AccountNav } from './AccountNav';
import { editeur } from '@/lib/editeur';

export function SiteHeader() {
  const { email } = editeur();
  const proposerHref = email
    ? `mailto:${email}?subject=Proposer%20un%20logiciel%20sur%20casevibecode`
    : undefined;
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-8 py-3">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-slate-800">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-primary text-xs font-bold text-primary"
          >
            cv
          </span>
          casevibecode
        </Link>
        <div className="order-3 w-full md:order-none md:w-auto md:flex-1">
          <NavLinks proposerHref={proposerHref} />
        </div>
        <div className="flex items-center gap-x-4">
          <AccountNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
