'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';

export type SortOption = 'nom' | 'votes';

export function SortControl({ value, onChange }: { value: SortOption; onChange: (value: SortOption) => void }) {
  const { t } = useLocale();
  const OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'votes', label: t.grid.sortVotes },
    { value: 'nom', label: t.grid.sortName },
  ];
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      {t.grid.sortBy}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-sm border border-slate-200 bg-white px-2 py-1 text-sm text-slate-800 focus:border-secondary focus:outline-none"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
