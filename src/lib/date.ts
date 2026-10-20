import type { Lang } from './i18n/config';

export function formaterDateVerifie(dateStr: string, lang: Lang = 'fr'): string {
  const [annee, mois, jour] = dateStr.split('-').map(Number);
  if (!annee || !mois || !jour) return dateStr;
  const d = new Date(Date.UTC(annee, mois - 1, jour));
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}
