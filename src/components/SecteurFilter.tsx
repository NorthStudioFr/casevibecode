'use client';

import type { Secteur } from '@/types/logiciel';

export const SECTEUR_LABEL: Record<Secteur, string> = {
  chr: '🍽️ CHR',
  saas: '💼 Outils du quotidien',
};

export function SecteurFilter({
  selected,
  secteurs,
  onChange,
}: {
  selected: Secteur | 'tous';
  secteurs: Secteur[];
  onChange: (secteur: Secteur | 'tous') => void;
}) {
  const options: { value: Secteur | 'tous'; label: string }[] = [
    { value: 'tous', label: 'Tous les secteurs' },
    ...secteurs.map((value) => ({ value, label: SECTEUR_LABEL[value] })),
  ];
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Secteur">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={selected === opt.value}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
            selected === opt.value
              ? 'border-primary bg-primary text-primary-ink'
              : 'border-slate-200 bg-white text-slate-700 hover:border-secondary hover:text-secondary'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
