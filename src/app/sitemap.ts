import type { MetadataRoute } from 'next';
import { getLogiciels } from '@/lib/logiciels-server';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const logiciels = await getLogiciels();

  const alternativesFiches: MetadataRoute.Sitemap = logiciels
    .filter((l) => l.alternatives && l.alternatives.length > 0)
    .map((l) => ({
      url: `${SITE_URL}/logiciel/${l.slug}/alternatives`,
      lastModified: new Date(l.dateMaj),
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  const fiches: MetadataRoute.Sitemap = logiciels.map((l) => ({
    url: `${SITE_URL}/logiciel/${l.slug}`,
    lastModified: new Date(l.dateMaj),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...fiches,
    ...alternativesFiches,
    {
      url: `${SITE_URL}/alternatives`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/confidentialite`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];
}
