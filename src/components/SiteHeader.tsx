import Link from 'next/link';
import { LangSwitch } from './LangSwitch';
import { ThemeToggle } from './ThemeToggle';
import { NavLinks } from './NavLinks';
import { AccountNav } from './AccountNav';
import { localePath, DEFAULT_LANG, type Lang } from '@/lib/i18n/config';

export function SiteHeader({ lang = DEFAULT_LANG }: { lang?: Lang }) {
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-8 py-3">
        <Link href={localePath(lang, '/')} className="flex items-center gap-2 font-serif text-lg font-semibold text-slate-800">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-primary text-xs font-bold text-primary"
          >
            cv
          </span>
          casevibecode
        </Link>
        <div className="order-3 w-full md:order-none md:w-auto md:flex-1">
          <NavLinks />
        </div>
        <div className="flex items-center gap-x-4">
          <AccountNav />
          <LangSwitch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
