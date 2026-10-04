import type { Metadata } from 'next';
import Link from 'next/link';
import { getLogiciels } from '@/lib/logiciels-server';
import { alternativesPolyvalentes, compteAlternatives, logicielsParCategorie } from '@/lib/alternatives';
import { formatEuros } from '@/lib/ticker';
import { CATEGORIE_EMOJI } from '@/lib/categories';
import { getDict } from '@/lib/i18n/dictionaries';
import { alternatesFor, langOf, localePath } from '@/lib/i18n/config';
import { LogoEditeur } from '@/components/LogoEditeur';

// La liste des logiciels vient du cache partagé de 1 h (getLogiciels) : cette
// page ne coûte aucune lecture de base de plus.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  const t = getDict(lang);
  return {
    title: t.alternatives.indexTitle,
    description: t.alternatives.indexDescription,
    alternates: alternatesFor(lang, '/alternatives'),
  };
}

export default async function AlternativesPage({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang = langOf(params && (await params));
  const t = getDict(lang);
  const logiciels = await getLogiciels(lang);
  const compte = compteAlternatives(logiciels);
  const polyvalentes = alternativesPolyvalentes(logiciels);
  const parCategorie = logicielsParCategorie(logiciels);

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="font-serif text-4xl font-semibold text-slate-800">{t.alternatives.indexHeading}</h1>
        <p className="text-sm text-slate-500">
          {t.alternatives.indexCount(compte.alternatives, compte.logiciels)}
        </p>
      </div>
      <p className="mt-2 max-w-2xl text-slate-600">
        {t.alternatives.indexIntro}
      </p>

      {polyvalentes.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-slate-800">{t.alternatives.polyTitle}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {polyvalentes.map((a) => (
              <li key={a.url} className="rounded-sm border border-slate-200 p-4">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-lg font-semibold text-slate-800 underline decoration-primary hover:text-primary"
                >
                  {a.nom}
                </a>
                <p className="mt-1 text-xs text-slate-500">
                  {t.alternatives.polyNeeds(a.remplace.length)}
                  {a.totalMensuel > 0 && t.alternatives.polyTotal(formatEuros(a.totalMensuel, lang))}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {a.remplace.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={localePath(lang, `/logiciel/${l.slug}`)}
                        className="inline-block rounded-sm border border-slate-200 px-2 py-0.5 text-xs text-slate-700 hover:border-primary hover:text-primary"
                      >
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

      {parCategorie.map((groupe) => (
        <section key={groupe.categorie} className="mt-10">
          <h2 className="text-sm font-medium text-slate-700">
            {CATEGORIE_EMOJI[groupe.categorie]} {t.categories[groupe.categorie]}
          </h2>
          <ul className="mt-2 border-t border-slate-200">
            {groupe.logiciels.map((l) => (
              <li key={l.id} className="border-b border-slate-200">
                <Link
                  href={localePath(lang, `/logiciel/${l.slug}/alternatives`)}
                  className="flex items-center justify-between gap-3 py-2 text-slate-800 hover:text-primary"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <LogoEditeur domaine={l.domaine} taille={20} />
                    <span className="truncate font-medium">{l.nom}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-500">
                    {t.alternatives.altCount(l.alternatives.length)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
