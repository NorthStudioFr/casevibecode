import type { Metadata } from 'next';
import { getLogiciels } from '@/lib/logiciels-server';
import { alternativesPolyvalentes, compteAlternatives, logicielsParCategorie } from '@/lib/alternatives';
import { getDict } from '@/lib/i18n/dictionaries';
import { alternatesFor, langOf } from '@/lib/i18n/config';
import { AlternativesExplorer } from '@/components/AlternativesExplorer';

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

      <AlternativesExplorer
        polyvalentes={polyvalentes.map((a) => ({
          nom: a.nom,
          url: a.url,
          totalMensuel: a.totalMensuel,
          remplace: a.remplace.map((l) => ({ id: l.id, nom: l.nom, slug: l.slug, secteur: l.secteur, domaine: l.domaine })),
        }))}
        groupes={parCategorie.map((g) => ({
          categorie: g.categorie,
          logiciels: g.logiciels.map((l) => ({ id: l.id, nom: l.nom, slug: l.slug, secteur: l.secteur, domaine: l.domaine, nbAlternatives: l.alternatives.length })),
        }))}
      />
    </main>
  );
}
