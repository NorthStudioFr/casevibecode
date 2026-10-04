'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localePath, stripLang } from '@/lib/i18n/config';
import { useLocale } from '@/lib/i18n/LocaleProvider';

// Même page dans l'autre langue (FR ⇄ EN).
export function LangSwitch() {
  const { lang, t } = useLocale();
  const pathname = stripLang(usePathname() ?? '/');
  const autre = lang === 'fr' ? 'en' : 'fr';
  return (
    <Link
      href={localePath(autre, pathname)}
      hrefLang={autre}
      lang={autre}
      aria-label={t.nav.switchLabel}
      className="text-sm text-slate-500 transition-colors hover:text-primary"
    >
      {t.nav.switchTo}
    </Link>
  );
}
