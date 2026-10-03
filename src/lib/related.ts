import type { Logiciel } from '@/types/logiciel';

// Même catégorie d'abord, puis même secteur, puis le reste ; ordre alphabétique pour que la page
// générée soit stable d'une régénération à l'autre.
export function relatedFiches(all: Logiciel[], current: Logiciel, count = 3): Logiciel[] {
  const others = all
    .filter((l) => l.id !== current.id)
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  const sameCategorie = others.filter((l) => l.categorie === current.categorie);
  const sameSecteur = others.filter((l) => l.categorie !== current.categorie && l.secteur === current.secteur);
  const rest = others.filter((l) => l.categorie !== current.categorie && l.secteur !== current.secteur);
  return [...sameCategorie, ...sameSecteur, ...rest].slice(0, count);
}
