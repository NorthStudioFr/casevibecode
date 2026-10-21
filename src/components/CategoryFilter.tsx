'use client';

import type { Categorie } from '@/types/logiciel';
import { CATEGORIE_EMOJI, CATEGORIE_LABEL } from '@/lib/categories';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const TOUTES = Object.keys(CATEGORIE_LABEL) as Categorie[];

// Une liste déroulante plutôt qu'un mur de 24 pastilles : le premier logiciel reste visible dès le
// premier écran, y compris sur mobile. `categories` : celles qui ont au moins une fiche dans la liste
// affichée ; `counts` : le nombre de fiches de chacune, pour qu'on sache où chercher sans deviner.
export function CategoryFilter({
  selected,
  onChange,
  categories = TOUTES,
  counts,
}: {
  selected: Categorie | 'toutes';
  onChange: (categorie: Categorie | 'toutes') => void;
  categories?: Categorie[];
  counts?: Partial<Record<Categorie, number>>;
}) {
  const { t } = useLocale();
  const total = counts ? categories.reduce((n, c) => n + (counts[c] ?? 0), 0) : undefined;
  const avec = (label: string, n: number | undefined) => (n === undefined ? label : `${label} (${n})`);
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <span className="shrink-0">{t.grid.categoryLabel}</span>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Categorie | 'toutes')}
        className="min-w-0 max-w-full flex-1 rounded-sm border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-secondary focus:outline-none"
      >
        <option value="toutes">{avec(t.grid.allCategories, total)}</option>
        {categories.map((value) => (
          <option key={value} value={value}>
            {avec(`${CATEGORIE_EMOJI[value]} ${t.categories[value]}`, counts?.[value])}
          </option>
        ))}
      </select>
    </label>
  );
}
