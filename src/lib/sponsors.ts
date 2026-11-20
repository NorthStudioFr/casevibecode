import sponsorsBruts from '@/content/sponsors.json';

// Emplacement « Sponsorisé » : 1 à 3 places, visibles et étiquetées, jamais mêlées aux verdicts ni au
// classement. Les sponsors se déclarent à la main dans src/content/sponsors.json (tableau vide = aucun
// emplacement affiché). Un sponsor n'influence jamais le verdict d'une fiche.
export const PLACES_MAX = 3;
export const DESCRIPTION_MAX = 140;

// Paramètres de l'offre, à compléter par l'éditeur. Tant que le prix est vide, la page « Offre éditeur »
// reste hors sitemap et en noindex, et indique que le tarif est communiqué par écrit.
export const OFFRE = {
  prixMensuelEur: null as number | null,
  lienPaiement: null as string | null,
};

export const OFFRE_PUBLIQUE = OFFRE.prixMensuelEur !== null && OFFRE.prixMensuelEur > 0;

export interface Sponsor {
  nom: string;
  url: string;
  description: string;
  descriptionEn?: string;
  debut: string;
  fin: string;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function https(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && !u.username && !u.password;
  } catch {
    return false;
  }
}

// Garde les sponsors bien formés dont la période couvre `maintenant`, dans l'ordre du fichier, 3 au plus.
export function sponsorsActifs(liste: unknown, maintenant: Date = new Date()): Sponsor[] {
  if (!Array.isArray(liste)) return [];
  const jour = maintenant.toISOString().slice(0, 10);
  const valides = liste.filter((s): s is Sponsor => {
    if (!s || typeof s !== 'object') return false;
    const x = s as Record<string, unknown>;
    return (
      typeof x.nom === 'string' &&
      x.nom.trim() !== '' &&
      https(x.url) &&
      typeof x.description === 'string' &&
      x.description.trim() !== '' &&
      x.description.length <= DESCRIPTION_MAX &&
      (x.descriptionEn === undefined || (typeof x.descriptionEn === 'string' && x.descriptionEn.length <= DESCRIPTION_MAX)) &&
      typeof x.debut === 'string' &&
      DATE.test(x.debut) &&
      typeof x.fin === 'string' &&
      DATE.test(x.fin) &&
      x.debut <= jour &&
      jour <= x.fin
    );
  });
  return valides.slice(0, PLACES_MAX);
}

export function getSponsors(maintenant?: Date): Sponsor[] {
  return sponsorsActifs(sponsorsBruts, maintenant);
}
