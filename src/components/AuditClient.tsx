'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Categorie, Secteur, VerdictEditeur } from '@/types/logiciel';
import { CATEGORIE_EMOJI } from '@/lib/categories';
import { calculerAudit, ecrireSelection, lireSelection } from '@/lib/audit';
import { formatEuros } from '@/lib/ticker';
import { formatPrix } from '@/lib/prix';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { LogoEditeur } from './LogoEditeur';
import { VerdictBadge } from './VerdictBadge';

export interface AuditLogiciel {
  slug: string;
  nom: string;
  domaine: string;
  categorie: Categorie;
  secteur: Secteur;
  verdict: VerdictEditeur;
  prix?: string;
  prixMensuel?: number;
}

function normaliser(v: string): string {
  return v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function AuditClient({ logiciels }: { logiciels: AuditLogiciel[] }) {
  const { t, lang, href } = useLocale();
  const [choisis, setChoisis] = useState<Set<string>>(new Set());
  const [filtre, setFiltre] = useState('');
  const [copie, setCopie] = useState(false);

  // La sélection d'un lien partagé (?t=a,b) est lue une fois au chargement.
  useEffect(() => {
    const connus = new Set(logiciels.map((l) => l.slug));
    const depuisUrl = lireSelection(new URLSearchParams(window.location.search).get('t')).filter((s) => connus.has(s));
    if (depuisUrl.length > 0) setChoisis(new Set(depuisUrl));
  }, [logiciels]);

  // L'adresse suit la sélection (sans navigation) : on peut copier l'URL telle quelle.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (choisis.size > 0) url.searchParams.set('t', ecrireSelection(choisis));
    else url.searchParams.delete('t');
    window.history.replaceState(null, '', url);
  }, [choisis]);

  const visibles = useMemo(() => {
    const q = normaliser(filtre.trim());
    return logiciels
      .filter((l) => q === '' || normaliser(l.nom).includes(q))
      .sort((a, b) => a.nom.localeCompare(b.nom, lang));
  }, [logiciels, filtre, lang]);

  const resume = useMemo(
    () => calculerAudit(logiciels.filter((l) => choisis.has(l.slug))),
    [logiciels, choisis],
  );

  function basculer(slug: string) {
    setChoisis((prev) => {
      const suivant = new Set(prev);
      if (suivant.has(slug)) suivant.delete(slug);
      else suivant.add(slug);
      return suivant;
    });
  }

  async function copierLien() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers indisponible : l'adresse de la barre du navigateur contient déjà la sélection.
    }
  }

  return (
    <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_18rem]">
      <div>
        <input
          type="search"
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          placeholder={t.audit.search}
          aria-label={t.audit.search}
          className="w-full rounded-sm border border-slate-200 bg-white px-4 py-2 text-base text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:outline-none"
        />
        {visibles.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t.audit.empty}</p>
        ) : (
          <ul className="mt-3 border-t border-slate-200">
            {visibles.map((l) => {
              const prix = formatPrix(l.prix, lang);
              return (
                <li key={l.slug} className="flex items-center gap-3 border-b border-slate-200 py-2">
                  <input
                    id={`audit-${l.slug}`}
                    type="checkbox"
                    checked={choisis.has(l.slug)}
                    onChange={() => basculer(l.slug)}
                    className="h-4 w-4 shrink-0 accent-primary"
                  />
                  <label htmlFor={`audit-${l.slug}`} className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                    <LogoEditeur domaine={l.domaine} taille={20} />
                    <span className="truncate text-slate-800">{l.nom}</span>
                    <span className="hidden text-xs text-slate-500 sm:inline">{CATEGORIE_EMOJI[l.categorie]}</span>
                  </label>
                  <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">
                    {l.prixMensuel ? prix : (prix ?? t.audit.priceUnknown)}
                  </span>
                  <VerdictBadge verdict={l.verdict} />
                  <Link
                    href={href(`/logiciel/${l.slug}`)}
                    className="shrink-0 text-xs text-slate-500 underline hover:text-primary"
                    aria-label={`${t.audit.openFiche} : ${l.nom}`}
                  >
                    ↗
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <aside className="md:sticky md:top-4 md:self-start">
        <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">{t.audit.selected(resume.nombre)}</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-slate-800" aria-live="polite">
            {formatEuros(resume.mensuel, lang)} €
            <span className="ml-1 text-sm font-normal text-slate-500">{t.audit.perMonth}</span>
          </p>
          <p className="text-sm text-slate-600">
            {formatEuros(resume.annuel, lang)} € {t.audit.perYear}
          </p>
          <dl className="mt-4 space-y-1 text-sm">
            {(
              [
                ['YES', t.audit.replaceable, 'bg-primary'],
                ['KINDA', t.audit.partly, 'bg-kinda'],
                ['NOT_REALLY', t.audit.notReplaceable, 'bg-no'],
              ] as const
            ).map(([verdict, label, dot]) => (
              <div key={verdict} className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-2 text-slate-700">
                  <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
                  {label} ({resume.parVerdict[verdict].nombre})
                </dt>
                <dd className="text-slate-800">{formatEuros(resume.parVerdict[verdict].mensuel, lang)} €</dd>
              </div>
            ))}
          </dl>
          {resume.sansPrix > 0 && <p className="mt-3 text-xs text-slate-500">{t.audit.unpriced(resume.sansPrix)}</p>}
          <p className="mt-3 text-xs text-slate-500">{t.audit.caveat}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copierLien}
              disabled={resume.nombre === 0}
              className="rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {copie ? t.audit.shared : t.audit.share}
            </button>
            <button
              type="button"
              onClick={() => setChoisis(new Set())}
              disabled={resume.nombre === 0}
              className="rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {t.audit.clear}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
