import type { MetadataRoute } from 'next';
import { getLogiciels } from '@/lib/logiciels-server';
import { SITE_URL } from '@/lib/site';
import { localePath } from '@/lib/i18n/config';
import { traductionDe } from '@/lib/traductions';
import { SECTEURS, SECTEUR_PAGE } from '@/lib/secteurs';

type Entree = MetadataRoute.Sitemap[number];

// Une entrée par page, avec ses versions dans l'autre langue (hreflang) quand elles
// existent : les pages anglaises d'une fiche non traduite ne sont pas publiées.
function entree(chemin: string, extra: Omit<Entree, 'url' | 'alternates'>, anglais: boolean): Entree[] {
  const fr = SITE_URL + localePath('fr', chemin);
  if (!anglais) return [{ url: fr, ...extra }];
  const en = SITE_URL + localePath('en', chemin);
  const alternates = { languages: { fr, en } };
  return [
    { url: fr, ...extra, alternates },
    { url: en, ...extra, alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const logiciels = await getLogiciels();

  const alternativesFiches = logiciels
    .filter((l) => l.alternatives && l.alternatives.length > 0)
    .flatMap((l) =>
      entree(
        `/logiciel/${l.slug}/alternatives`,
        { lastModified: new Date(l.dateMaj), changeFrequency: 'monthly', priority: 0.5 },
        Boolean(traductionDe(l.slug, 'en')),
      ),
    );

  const fiches = logiciels.flatMap((l) =>
    entree(
      `/logiciel/${l.slug}`,
      { lastModified: new Date(l.dateMaj), changeFrequency: 'weekly', priority: 0.7 },
      Boolean(traductionDe(l.slug, 'en')),
    ),
  );

  // Pages par public : dernière modification = la plus récente des fiches du secteur.
  const pagesSecteur = SECTEURS.flatMap((s) => {
    const dates = logiciels.filter((l) => l.secteur === s).map((l) => l.dateMaj);
    return entree(
      SECTEUR_PAGE[s],
      { ...(dates.length ? { lastModified: new Date(Math.max(...dates)) } : {}), changeFrequency: 'weekly', priority: 0.8 },
      true,
    );
  });

  return [
    ...entree('/', { lastModified: new Date(), changeFrequency: 'daily', priority: 1 }, true),
    ...pagesSecteur,
    ...entree('/methode', { changeFrequency: 'monthly', priority: 0.5 }, true),
    ...fiches,
    ...alternativesFiches,
    ...entree('/proposer', { changeFrequency: 'yearly', priority: 0.3 }, true),
    ...entree('/audit', { changeFrequency: 'weekly', priority: 0.6 }, true),
    ...entree('/alternatives', { changeFrequency: 'weekly', priority: 0.6 }, true),
    ...entree('/mentions-legales', { changeFrequency: 'yearly', priority: 0.2 }, true),
    ...entree('/confidentialite', { changeFrequency: 'yearly', priority: 0.2 }, true),
  ];
}
