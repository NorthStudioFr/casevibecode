'use client';

import type { Categorie } from '@/types/logiciel';
import { CATEGORIE_EMOJI, CATEGORIE_LABEL } from '@/lib/categories';

const TOUTES = Object.keys(CATEGORIE_LABEL) as Categorie[];

// `categories` : celles qui ont au moins une fiche dans la liste affichée (les
// pastilles vides ne servent à rien). Par défaut, toutes.
export function CategoryFilter({
  selected,
  onChange,
  categories = TOUTES,
}: {
  selected: Categorie | 'toutes';
  onChange: (categorie: Categorie | 'toutes') => void;
  categories?: Categorie[];
}) {
  const OPTIONS: { value: Categorie | 'toutes'; label: string }[] = [
    { value: 'toutes', label: '⚡ Toutes' },
    ...categories.map((value) => ({ value, label: `${CATEGORIE_EMOJI[value]} ${CATEGORIE_LABEL[value]}` })),
  ];
  return (
    <div className="flex gap-2 flex-wrap">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
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
