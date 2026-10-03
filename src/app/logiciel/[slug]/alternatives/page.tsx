import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLogiciels } from '@/lib/logiciels-server';
import { AlternativeItem } from '@/components/AlternativeItem';
import { LogoEditeur } from '@/components/LogoEditeur';

// Lecture depuis le cache partagé de la liste (aucune lecture de base de
// plus) ; même logique que la fiche : générée à la première visite.
export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

async function trouverFiche(slug: string) {
  const logiciels = await getLogiciels();
  const logiciel = logiciels.find((l) => l.slug === slug);
  // Sans alternative vérifiée, la page n'existe pas : mieux vaut un 404 net
  // qu'une page vide indexée.
  if (!logiciel || !logiciel.alternatives || logiciel.alternatives.length === 0) return null;
  return { ...logiciel, alternatives: logiciel.alternatives };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const logiciel = await trouverFiche(slug);
  if (!logiciel) return { title: 'Alternatives introuvables' };
  return {
    title: `Alternatives à ${logiciel.nom} : open source, gratuites et plus petites`,
    description: `${logiciel.alternatives.length} alternative${logiciel.alternatives.length > 1 ? 's' : ''} qui existent déjà à ${logiciel.nom} : projets open source, outils gratuits ou éditeurs plus petits.`,
    alternates: { canonical: `/logiciel/${slug}/alternatives` },
  };
}

export default async function AlternativesDeLaFichePage({ params }: Props) {
  const { slug } = await params;
  const logiciel = await trouverFiche(slug);
  if (!logiciel) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-2xl p-8">
      <Link href={`/logiciel/${logiciel.slug}`} className="text-sm text-slate-500 hover:text-slate-800">
        ← Retour à la fiche {logiciel.nom}
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <LogoEditeur domaine={logiciel.domaine} taille={40} />
        <h1 className="font-serif text-3xl font-semibold text-slate-800">Alternatives à {logiciel.nom}</h1>
      </div>
      <p className="mt-3 text-slate-600">
        {logiciel.alternatives.length} option{logiciel.alternatives.length > 1 ? 's' : ''} qui existent déjà, à
        comparer avant de vous lancer dans un développement sur mesure.
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
