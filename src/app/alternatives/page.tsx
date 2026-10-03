import type { Metadata } from 'next';
import Link from 'next/link';
import { getLogiciels } from '@/lib/logiciels-server';
import { alternativesPolyvalentes, compteAlternatives, logicielsParCategorie } from '@/lib/alternatives';
import { formatEuros } from '@/lib/ticker';
import { CATEGORIE_EMOJI, CATEGORIE_LABEL } from '@/lib/categories';
import { LogoEditeur } from '@/components/LogoEditeur';

// La liste des logiciels vient du cache partagé de 1 h (getLogiciels) : cette
// page ne coûte aucune lecture de base de plus.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Alternatives open source, gratuites ou plus petites aux logiciels payants',
  description:
    'Pour chaque logiciel payant référencé (CHR et outils du quotidien), les alternatives qui existent déjà : projets open source maintenus, outils gratuits ou éditeurs plus petits.',
  alternates: { canonical: '/alternatives' },
};

export default async function AlternativesPage() {
  const logiciels = await getLogiciels();
  const compte = compteAlternatives(logiciels);
  const polyvalentes = alternativesPolyvalentes(logiciels);
  const parCategorie = logicielsParCategorie(logiciels);

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="font-serif text-4xl font-semibold text-slate-800">Les alternatives</h1>
        <p className="text-sm text-slate-500">
          {compte.alternatives} alternative{compte.alternatives > 1 ? 's' : ''} · {compte.logiciels} logiciel
          {compte.logiciels > 1 ? 's' : ''}
        </p>
      </div>
      <p className="mt-2 max-w-2xl text-slate-600">
        Pas envie de tout recoder ? Pour chaque logiciel payant, ce qui existe déjà : projets open source
        maintenus, outils gratuits ou éditeurs plus petits. Chaque lien est contrôlé (dépôt actif et sous licence
        libre, offre gratuite lue chez l&apos;éditeur, site en ligne), sans vote et sans lien sponsorisé.
      </p>

      {polyvalentes.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-slate-800">Un outil, plusieurs abonnements</h2>
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
                  besoin proche de {a.remplace.length} logiciels
                  {a.totalMensuel > 0 && ` · ${formatEuros(a.totalMensuel)} €/mois d'abonnements`}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {a.remplace.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/logiciel/${l.slug}`}
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
            {CATEGORIE_EMOJI[groupe.categorie]} {CATEGORIE_LABEL[groupe.categorie]}
          </h2>
          <ul className="mt-2 border-t border-slate-200">
            {groupe.logiciels.map((l) => (
              <li key={l.id} className="border-b border-slate-200">
                <Link
                  href={`/logiciel/${l.slug}/alternatives`}
                  className="flex items-center justify-between gap-3 py-2 text-slate-800 hover:text-primary"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <LogoEditeur domaine={l.domaine} taille={20} />
                    <span className="truncate font-medium">{l.nom}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-500">
                    {l.alternatives.length} alternative{l.alternatives.length > 1 ? 's' : ''}
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
