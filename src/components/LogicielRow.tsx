'use client';

import Link from 'next/link';
import type { Logiciel, VerdictEditeur } from '@/types/logiciel';
import { CATEGORIE_EMOJI } from '@/lib/categories';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { formatPrix } from '@/lib/prix';
import { VerdictBadge } from './VerdictBadge';
import { LogoEditeur } from './LogoEditeur';

// Ligne de la « Death List » : rang, logo, nom, catégorie, prix, verdict, votes.
// En mobile la catégorie et le prix passent sous le nom.
export function LogicielRow({
  logiciel,
  verdict,
  totalVotes,
  nbConstruits = 0,
  rang,
}: {
  logiciel: Logiciel;
  verdict: VerdictEditeur;
  totalVotes: number;
  nbConstruits?: number;
  rang: number;
}) {
  const { t, lang, href } = useLocale();
  const prix = formatPrix(logiciel.prix, lang);
  return (
    <Link
      href={href(`/logiciel/${logiciel.slug}`)}
      className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1 border-b border-slate-200 px-2 py-3 transition-colors hover:bg-slate-100 md:grid-cols-[2.5rem_minmax(0,1fr)_9rem_11rem_11rem_4rem_5rem]"
    >
      <span className="text-xs text-slate-500">{String(rang).padStart(2, '0')}</span>
      <span className="flex min-w-0 items-center gap-2">
        <LogoEditeur domaine={logiciel.domaine} taille={24} />
        <h2 className="truncate font-serif text-base font-semibold text-slate-800">{logiciel.nom}</h2>
      </span>
      <span className="col-start-2 row-start-3 text-xs text-slate-500 md:col-start-auto md:row-start-auto">
        {CATEGORIE_EMOJI[logiciel.categorie]} {t.categories[logiciel.categorie]}
      </span>
      <span className="hidden text-sm text-slate-600 md:block">{prix ?? ''}</span>
      <span className="col-start-2 row-start-2 justify-self-start md:col-start-auto md:row-start-auto">
        <VerdictBadge verdict={verdict} />
      </span>
      <span
        className="hidden text-right text-sm text-slate-600 md:block"
        aria-label={t.grid.votes(totalVotes)}
      >
        {totalVotes}
      </span>
      <span
        className="hidden text-right text-sm md:block"
        aria-label={t.grid.built(nbConstruits)}
      >
        <span className={nbConstruits > 0 ? 'font-medium text-slate-800' : 'text-slate-400'}>{nbConstruits}</span>
      </span>
      {prix && (
        <span className="col-start-2 row-start-4 text-xs text-slate-600 md:hidden">{prix}</span>
      )}
    </Link>
  );
}
