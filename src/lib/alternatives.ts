import type { Alternative, Categorie, Logiciel, TypeAlternative } from '@/types/logiciel';
import { CATEGORIE_LABEL } from '@/lib/categories';

export const TYPE_ALTERNATIVE_LABEL: Record<TypeAlternative, string> = {
  'open-source': 'Open source',
  gratuit: 'Gratuit',
  'plus-petit': 'Plus petit',
  concurrent: 'Concurrent',
};

// Même projet, écrit « https://www.x.io/ » ou « https://x.io » : une seule clé.
function cleUrl(url: string): string {
  return url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
}

function aDesAlternatives(l: Logiciel): l is Logiciel & { alternatives: Alternative[] } {
  return Array.isArray(l.alternatives) && l.alternatives.length > 0;
}

export function compteAlternatives(logiciels: Logiciel[]): { alternatives: number; logiciels: number } {
  const urls = new Set<string>();
  let avecAlternatives = 0;
  for (const l of logiciels) {
    if (!aDesAlternatives(l)) continue;
    avecAlternatives++;
    l.alternatives.forEach((a) => urls.add(cleUrl(a.url)));
  }
  return { alternatives: urls.size, logiciels: avecAlternatives };
}

export interface AlternativePolyvalente extends Alternative {
  remplace: Logiciel[];
  // Somme des prix mensuels chiffrés des logiciels concernés : un minimum
  // (« sur devis » et prix par employé n'y figurent pas).
  totalMensuel: number;
}

// « Un outil, plusieurs abonnements » : alternatives qui couvrent le besoin de
// plusieurs logiciels payants à la fois.
export function alternativesPolyvalentes(logiciels: Logiciel[], minimum = 2): AlternativePolyvalente[] {
  const parCle = new Map<string, AlternativePolyvalente>();
  for (const l of [...logiciels].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))) {
    if (!aDesAlternatives(l)) continue;
    for (const a of l.alternatives) {
      const cle = cleUrl(a.url);
      const entree = parCle.get(cle) ?? { ...a, remplace: [], totalMensuel: 0 };
      entree.remplace.push(l);
      entree.totalMensuel += l.prixMensuel ?? 0;
      parCle.set(cle, entree);
    }
  }
  return [...parCle.values()]
    .filter((a) => a.remplace.length >= minimum)
    .sort((a, b) => b.remplace.length - a.remplace.length || a.nom.localeCompare(b.nom, 'fr'));
}

export interface GroupeCategorie {
  categorie: Categorie;
  logiciels: (Logiciel & { alternatives: Alternative[] })[];
}

const ORDRE_CATEGORIES = Object.keys(CATEGORIE_LABEL) as Categorie[];

export function logicielsParCategorie(logiciels: Logiciel[]): GroupeCategorie[] {
  return ORDRE_CATEGORIES.map((categorie) => ({
    categorie,
    logiciels: logiciels
      .filter(aDesAlternatives)
      .filter((l) => l.categorie === categorie)
      .sort((a, b) => b.alternatives.length - a.alternatives.length || a.nom.localeCompare(b.nom, 'fr')),
  })).filter((g) => g.logiciels.length > 0);
}
