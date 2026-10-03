'use client';

import type { VerdictEditeur } from '@/types/logiciel';

const OPTIONS: { value: VerdictEditeur | 'tous'; label: string; dotClassName: string }[] = [
  { value: 'tous', label: 'Tous les verdicts', dotClassName: 'bg-slate-400' },
  { value: 'YES', label: 'Remplaçable', dotClassName: 'bg-primary' },
  { value: 'KINDA', label: 'Partiellement remplaçable', dotClassName: 'bg-kinda' },
  { value: 'NOT_REALLY', label: 'Pas remplaçable', dotClassName: 'bg-no' },
];

export function VerdictFilter({
  selected,
  onChange,
}: {
  selected: VerdictEditeur | 'tous';
  onChange: (verdict: VerdictEditeur | 'tous') => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
            selected === opt.value
              ? 'border-primary bg-primary text-primary-ink'
              : 'border-slate-200 bg-white text-slate-700 hover:border-secondary hover:text-secondary'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${opt.dotClassName}`} aria-hidden="true" />
          {opt.label}
        </button>
      ))}
    </div>
  );
}
