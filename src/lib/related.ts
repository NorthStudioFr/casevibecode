import type { Logiciel } from '@/types/logiciel';

// « Dans la même veine » : d'abord les fiches qui partagent le plus d'alternatives avec la courante
// (proximité fonctionnelle réelle), puis la même catégorie, puis le même secteur. La catégorie
// « autre » est un fourre-tout : elle ne prouve aucune proximité, on ne s'en sert pas.
const url = (u: string) => u.toLowerCase().replace(/\/+$/, '');

export function relatedFiches(all: Logiciel[], current: Logiciel, count = 3): Logiciel[] {
  const mesAlternatives = new Set((current.alternatives ?? []).map((a) => url(a.url)));
  const communes = (l: Logiciel) => (l.alternatives ?? []).filter((a) => mesAlternatives.has(url(a.url))).length;
  const rang = (l: Logiciel) => {
    if (communes(l) > 0) return 0;
    if (l.categorie === current.categorie && current.categorie !== 'autre') return 1;
    if (l.secteur === current.secteur) return 2;
    return 3;
  };
  return all
    .filter((l) => l.id !== current.id)
    .sort((a, b) => rang(a) - rang(b) || communes(b) - communes(a) || a.nom.localeCompare(b.nom, 'fr'))
    .slice(0, count);
}

// Précédent / suivant : on boucle dans la même catégorie métier, par ordre alphabétique.
// Pour la catégorie fourre-tout « autre », on se limite au même secteur.
export function voisinsCategorie(all: Logiciel[], current: Logiciel, lang: string) {
  const memeGroupe = all
    .filter((l) => (current.categorie === 'autre' ? l.categorie === 'autre' && l.secteur === current.secteur : l.categorie === current.categorie))
    .sort((a, b) => a.nom.localeCompare(b.nom, lang));
  const i = memeGroupe.findIndex((l) => l.id === current.id);
  if (i < 0 || memeGroupe.length < 2) return { precedent: null, suivant: null };
  const n = memeGroupe.length;
  return { precedent: memeGroupe[(i - 1 + n) % n], suivant: memeGroupe[(i + 1) % n] };
}
