'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleProvider';

export function SiteFooter() {
  const { t, href } = useLocale();
  return (
    <footer className="mt-auto border-t border-slate-200 px-8 py-6 text-center text-sm text-slate-500">
      <nav className="flex justify-center gap-4">
        <Link href={href('/mentions-legales')} className="hover:text-secondary">
          {t.footer.legal}
        </Link>
        <Link href={href('/confidentialite')} className="hover:text-secondary">
          {t.footer.privacy}
        </Link>
      </nav>
      <p className="mt-3 text-xs">
        {t.footer.designBefore}{' '}
        <a
          href="https://canivibecodeit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-secondary"
        >
          canivibecodeit.com
        </a>{' '}
        {t.footer.designAfter}
      </p>
    </footer>
  );
}
