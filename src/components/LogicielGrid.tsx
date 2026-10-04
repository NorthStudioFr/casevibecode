'use client';

import { useMemo, useState } from 'react';
import type { Categorie, LogicielAvecVerdict, Secteur, VerdictEditeur } from '@/types/logiciel';
import { CategoryFilter } from './CategoryFilter';
import { SecteurFilter } from './SecteurFilter';
import { VerdictFilter } from './VerdictFilter';
import { SearchInput } from './SearchInput';
import { SortControl, type SortOption } from './SortControl';
import { LogicielRow } from './LogicielRow';
import { CATEGORIE_LABEL } from '@/lib/categories';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { normaliser as normalize } from '@/lib/texte';

export function LogicielGrid({ logiciels }: { logiciels: LogicielAvecVerdict[] }) {
  const { t, lang } = useLocale();
  const [secteur, setSecteur] = useState<Secteur | 'tous'>('tous');
  const [categorie, setCategorie] = useState<Categorie | 'toutes'>('toutes');
  const [verdict, setVerdict] = useState<VerdictEditeur | 'tous'>('tous');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('votes');

  // Les pastilles ne proposent que ce qui existe : un secteur ou une catégorie
  // sans fiche n'apparaît pas.
  const secteurs = useMemo(
    () => (['chr', 'saas'] as Secteur[]).filter((s) => logiciels.some((l) => l.secteur === s)),
    [logiciels],
  );
  const categories = useMemo(() => {
    const presentes = new Set(logiciels.filter((l) => secteur === 'tous' || l.secteur === secteur).map((l) => l.categorie));
    return (Object.keys(CATEGORIE_LABEL) as Categorie[]).filter((c) => presentes.has(c));
  }, [logiciels, secteur]);

  function changerSecteur(s: Secteur | 'tous') {
    setSecteur(s);
    setCategorie('toutes');
  }

  function reinitialiser() {
    setSecteur('tous');
    setCategorie('toutes');
    setVerdict('tous');
    setQuery('');
  }

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const result = logiciels
      .filter((l) => secteur === 'tous' || l.secteur === secteur)
      .filter((l) => categorie === 'toutes' || l.categorie === categorie)
      .filter((l) => verdict === 'tous' || l.displayVerdict === verdict)
      .filter((l) => normalizedQuery === '' || (normalize(l.nom).includes(normalizedQuery) || normalize(l.description).includes(normalizedQuery)));

    return [...result].sort((a, b) =>
      sort === 'votes' ? b.totalVotes - a.totalVotes || a.nom.localeCompare(b.nom, lang) : a.nom.localeCompare(b.nom, lang)
    );
  }, [logiciels, secteur, categorie, verdict, query, sort, lang]);

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      <div className="mt-3 flex flex-col gap-3">
        {secteurs.length > 1 && <SecteurFilter selected={secteur} secteurs={secteurs} onChange={changerSecteur} />}
        <CategoryFilter selected={categorie} onChange={setCategorie} categories={categories} />
        <VerdictFilter selected={verdict} onChange={setVerdict} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {t.grid.count(filtered.length)}
        </p>
        <SortControl value={sort} onChange={setSort} />
      </div>
      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          {t.grid.empty}{' '}
          <button type="button" onClick={reinitialiser} className="text-secondary underline">
            {t.grid.reset}
          </button>
        </p>
      ) : (
        <div className="mt-4 border-t border-slate-200">
          <div
            aria-hidden="true"
            className="hidden grid-cols-[2.5rem_minmax(0,1fr)_9rem_11rem_11rem_4rem_5rem] gap-x-3 border-b border-slate-200 px-2 py-2 text-xs uppercase tracking-wider text-slate-500 md:grid"
          >
            <span>#</span>
            <span>{t.grid.colApp}</span>
            <span>{t.grid.colCategory}</span>
            <span>{t.grid.colPrice}</span>
            <span>{t.grid.colVerdict}</span>
            <span className="text-right">{t.grid.colVotes}</span>
            <span className="text-right">{t.grid.colBuilt}</span>
          </div>
          {filtered.map((l, i) => (
            <LogicielRow key={l.id} logiciel={l} verdict={l.displayVerdict} totalVotes={l.totalVotes} nbConstruits={l.nbConstruits} rang={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
