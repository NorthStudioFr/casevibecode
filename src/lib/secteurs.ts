import type { Secteur } from '@/types/logiciel';

// Une page d'atterrissage par public. Les chemins sont les mêmes dans les deux langues (l'anglais est préfixé /en).
export const SECTEUR_PAGE: Record<Secteur, string> = { chr: '/restauration', saas: '/outils' };
export const SECTEURS: Secteur[] = ['chr', 'saas'];
