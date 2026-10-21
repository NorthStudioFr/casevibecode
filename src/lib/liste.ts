import type { Lang } from '@/lib/i18n/config';
import type { LogicielListe, Secteur } from '@/types/logiciel';
import { getLogiciels, getNbConstruits, getVoteCounts } from '@/lib/logiciels-server';
import { computeVerdictDisplay } from '@/lib/verdict';

// La liste affichée (accueil et pages par secteur) : le verdict est celui de la communauté quand elle a
// pris le relais, comme sur la fiche. Seuls les champs que la liste affiche sont conservés, pour ne pas
// envoyer au navigateur les fiches complètes (justification, prompt, alternatives).
// Une lecture des votes par fiche : amortie par la fenêtre de revalidation des pages.
export async function chargerListe(lang: Lang, secteur?: Secteur): Promise<LogicielListe[]> {
  const fiches = (await getLogiciels(lang)).filter((l) => !secteur || l.secteur === secteur);
  const construits = await getNbConstruits();
  return Promise.all(
    fiches.map(async (l) => {
      const display = computeVerdictDisplay(l.verdictEditeur, await getVoteCounts(l.id));
      return {
        id: l.id,
        nom: l.nom,
        slug: l.slug,
        categorie: l.categorie,
        secteur: l.secteur,
        description: l.description,
        domaine: l.domaine,
        prix: l.prix,
        prixMensuel: l.prixMensuel,
        verdictEditeur: l.verdictEditeur,
        displayVerdict: display.verdict,
        totalVotes: display.totalVotes,
        nbConstruits: construits[l.slug] ?? 0,
      };
    }),
  );
}
