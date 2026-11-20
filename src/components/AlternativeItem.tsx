'use client';

import type { Alternative } from '@/types/logiciel';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { formaterDateVerifie } from '@/lib/date';

export function AlternativeItem({ alternative }: { alternative: Alternative }) {
  const { t, lang } = useLocale();
  const f = t.alternatives.facts;
  const faits: string[] = [];
  if (alternative.licence) faits.push(f.licence(alternative.licence));
  if (alternative.modele) faits.push(f.modele[alternative.modele]);
  if (alternative.derniereVersion) {
    faits.push(f.version(alternative.derniereVersion.version, formaterDateVerifie(alternative.derniereVersion.date, lang)));
  }
  const etoiles = alternative.etoiles
    ? f.etoiles(new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(alternative.etoiles.nombre), formaterDateVerifie(alternative.etoiles.releveLe, lang))
    : null;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={alternative.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-800 underline decoration-primary hover:text-primary"
        >
          {alternative.nom}
        </a>
        <span className="rounded-sm border border-slate-200 px-1.5 py-0.5 text-xs text-slate-500">
          {t.typeAlt[alternative.type]}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{alternative.description}</p>
      {(faits.length > 0 || etoiles) && (
        <p className="mt-1 text-xs text-slate-500">
          {faits.join(' · ')}
          {etoiles && (
            <>
              {faits.length > 0 && ' · '}
              {alternative.depot ? (
                <a href={alternative.depot} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  {etoiles}
                </a>
              ) : (
                etoiles
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
}
