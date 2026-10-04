'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';

export function CeQueVousPerdez({ items }: { items?: string[] }) {
  const { t } = useLocale();
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-4 rounded-sm border border-no/40 p-4">
      <h2 className="font-serif text-lg font-semibold text-slate-800">{t.fiche.loseTitle}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
