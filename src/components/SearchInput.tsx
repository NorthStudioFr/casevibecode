'use client';

import { useEffect, useRef } from 'react';
import { useLocale } from '@/lib/i18n/LocaleProvider';

export function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useLocale();
  const ref = useRef<HTMLInputElement>(null);

  // « / » place le curseur dans la recherche (sauf pendant une saisie ailleurs).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const cible = e.target as HTMLElement | null;
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (cible && (cible.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(cible.tagName))) return;
      e.preventDefault();
      ref.current?.focus();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <input
      ref={ref}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t.grid.searchPlaceholder}
      aria-label={t.grid.searchLabel}
      className="w-full rounded-sm border border-slate-200 bg-white px-4 py-2 text-base text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:outline-none"
    />
  );
}
