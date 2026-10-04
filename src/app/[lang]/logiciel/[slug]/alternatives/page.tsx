import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLogiciels } from '@/lib/logiciels-server';
import { AlternativeItem } from '@/components/AlternativeItem';
import { LogoEditeur } from '@/components/LogoEditeur';
import { getDict } from '@/lib/i18n/dictionaries';
import { langOf, localePath, type Lang } from '@/lib/i18n/config';
import { traductionDe } from '@/lib/traductions';

// Lecture depuis le cache partagé de la liste (aucune lecture de base de
// plus) ; même logique que la fiche : générée à la première visite.
export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ lang?: string; slug: string }> };

async function trouverFiche(slug: string, lang: Lang) {
  const logiciels = await getLogiciels(lang);
  const logiciel = logiciels.find((l) => l.slug === slug);
  // Sans alternative vérifiée, la page n'existe pas : mieux vaut un 404 net
  // qu'une page vide indexée.
  if (!logiciel || !logiciel.alternatives || logiciel.alternatives.length === 0) return null;
  return { ...logiciel, alternatives: logiciel.alternatives };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = langOf({ lang: langParam });
  const t = getDict(lang);
  const logiciel = await trouverFiche(slug, lang);
  if (!logiciel) return { title: t.alternatives.pageNotFound };
  const chemin = `/logiciel/${slug}/alternatives`;
  const traduite = Boolean(traductionDe(slug, 'en'));
  return {
    title: t.alternatives.pageTitle(logiciel.nom),
    description: t.alternatives.pageDescription(logiciel.nom, logiciel.alternatives.length),
    alternates: {
      canonical: localePath(lang, chemin),
      ...(traduite ? { languages: { fr: localePath('fr', chemin), en: localePath('en', chemin), 'x-default': localePath('fr', chemin) } } : {}),
    },
    ...(lang !== 'fr' && logiciel.traduit === false ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function AlternativesDeLaFichePage({ params }: Props) {
  const { lang: langParam, slug } = await params;
  const lang = langOf({ lang: langParam });
  const t = getDict(lang);
  const logiciel = await trouverFiche(slug, lang);
  if (!logiciel) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-2xl p-8">
      <Link href={localePath(lang, `/logiciel/${logiciel.slug}`)} className="text-sm text-slate-500 hover:text-slate-800">
        {t.alternatives.backToFiche(logiciel.nom)}
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <LogoEditeur domaine={logiciel.domaine} taille={40} />
        <h1 className="font-serif text-3xl font-semibold text-slate-800">{t.alternatives.heading(logiciel.nom)}</h1>
      </div>
      <p className="mt-3 text-slate-600">
        {t.alternatives.intro(logiciel.alternatives.length)}
      </p>
      <ul className="mt-6 space-y-5">
        {logiciel.alternatives.map((a) => (
          <li key={a.url} className="border-b border-slate-200 pb-5">
            <AlternativeItem alternative={a} />
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-slate-500">
        Chaque lien est contrôlé (projet actif et sous licence libre, offre gratuite lue chez l&apos;éditeur, site en
        ligne). Aucune alternative n&apos;est sponsorisée.
      </p>
    </main>
  );
}
