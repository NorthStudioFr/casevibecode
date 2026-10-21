'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Categorie, Secteur } from '@/types/logiciel';
import { CATEGORIE_EMOJI } from '@/lib/categories';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { formatEuros } from '@/lib/ticker';
import { LogoEditeur } from '@/components/LogoEditeur';

export interface LogicielLeger {
  id: string;
  nom: string;
  slug: string;
  secteur: Secteur;
  domaine: string;
}
export interface PolyvalenteLegere {
  nom: string;
  url: string;
  totalMensuel: number;
  remplace: LogicielLeger[];
}
export interface GroupeLeger {
  categorie: Categorie;
  logiciels: (LogicielLeger & { nbAlternatives: number })[];
}

const normaliser = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Recherche et filtre par secteur côté navigateur : la page reste rendue côté serveur (SEO),
// le filtre ne fait que masquer des lignes déjà présentes.
export function AlternativesExplorer({ polyvalentes, groupes }: { polyvalentes: PolyvalenteLegere[]; groupes: GroupeLeger[] }) {
  const { t, lang } = useLocale();
  const [requete, setRequete] = useState('');
  const [secteur, setSecteur] = useState<Secteur | 'tous'>('tous');
  const q = normaliser(requete.trim());

  const polyFiltrees = useMemo(
    () =>
      polyvalentes
        .map((a) => ({ ...a, remplace: a.remplace.filter((l) => secteur === 'tous' || l.secteur === secteur) }))
        .filter((a) => a.remplace.length > 0)
        .filter((a) => !q || normaliser(a.nom).includes(q) || a.remplace.some((l) => normaliser(l.nom).includes(q))),
    [polyvalentes, q, secteur],
  );
  const groupesFiltres = useMemo(
    () =>
      groupes
        .map((g) => ({
          ...g,
          logiciels: g.logiciels.filter((l) => (secteur === 'tous' || l.secteur === secteur) && (!q || normaliser(l.nom).includes(q))),
        }))
        .filter((g) => g.logiciels.length > 0),
    [groupes, q, secteur],
  );

  const choix: { valeur: Secteur | 'tous'; label: string }[] = [
    { valeur: 'tous', label: t.grid.allSectors },
    { valeur: 'chr', label: t.secteur.chr },
    { valeur: 'saas', label: t.secteur.saas },
  ];
  const href = (chemin: string) => (lang === 'fr' ? chemin : `/${lang}${chemin}`);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={requete}
          onChange={(e) => setRequete(e.target.value)}
          placeholder={t.alternatives.searchPlaceholder}
          aria-label={t.alternatives.searchPlaceholder}
          className="min-w-0 flex-1 rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
        />
        <div role="group" aria-label={t.grid.sectorGroup} className="flex flex-wrap gap-2">
          {choix.map((c) => (
            <button
              key={c.valeur}
              type="button"
              aria-pressed={secteur === c.valeur}
              onClick={() => setSecteur(c.valeur)}
              className={`rounded-sm border px-3 py-1.5 text-xs transition-colors ${secteur === c.valeur ? 'border-primary bg-primary text-primary-ink' : 'border-slate-300 text-slate-700 hover:border-primary'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {polyFiltrees.length === 0 && groupesFiltres.length === 0 && <p className="mt-8 text-sm text-slate-500">{t.alternatives.noResult}</p>}

      {polyFiltrees.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-slate-800">{t.alternatives.polyTitle}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {polyFiltrees.map((a) => (
              <li key={a.url} className="rounded-sm border border-slate-200 p-4">
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="font-serif text-lg font-semibold text-slate-800 underline decoration-primary hover:text-primary">
                  {a.nom}
                </a>
                <p className="mt-1 text-xs text-slate-500">
                  {t.alternatives.polyNeeds(a.remplace.length)}
                  {a.totalMensuel > 0 && t.alternatives.polyTotal(formatEuros(a.totalMensuel, lang))}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {a.remplace.map((l) => (
                    <li key={l.id}>
                      <Link href={href(`/logiciel/${l.slug}`)} className="inline-block rounded-sm border border-slate-200 px-2 py-0.5 text-xs text-slate-700 hover:border-primary hover:text-primary">
                        {l.nom}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      {groupesFiltres.map((groupe) => (
        <section key={groupe.categorie} className="mt-10">
          <h2 className="text-sm font-medium text-slate-700">
            {CATEGORIE_EMOJI[groupe.categorie]} {t.categories[groupe.categorie]}
          </h2>
          <ul className="mt-2 border-t border-slate-200">
            {groupe.logiciels.map((l) => (
              <li key={l.id} className="border-b border-slate-200">
                <Link href={href(`/logiciel/${l.slug}/alternatives`)} className="flex items-center justify-between gap-3 py-2 text-slate-800 hover:text-primary">
                  <span className="flex min-w-0 items-center gap-2">
                    <LogoEditeur domaine={l.domaine} taille={20} />
                    <span className="truncate font-medium">{l.nom}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-500">{t.alternatives.altCount(l.nbAlternatives)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
