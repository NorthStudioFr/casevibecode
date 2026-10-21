import type { Logiciel, VerdictEditeur } from '@/types/logiciel';
import { CATEGORIE_LABEL } from '@/lib/categories';
import { TYPE_ALTERNATIVE_LABEL } from '@/lib/alternatives';

export const VERDICT_LABEL_FR: Record<VerdictEditeur, string> = {
  YES: 'Remplaçable',
  KINDA: 'Partiellement remplaçable',
  NOT_REALLY: 'Pas remplaçable',
};

// Une fiche en Markdown, uniquement avec ce que la base contient : un champ vide n'est pas écrit.
export function texteFiche(l: Logiciel, siteUrl: string): string {
  const lignes = [
    `## ${l.nom}`,
    `URL : ${siteUrl}/logiciel/${l.slug}`,
    `Catégorie : ${CATEGORIE_LABEL[l.categorie]}`,
    `Verdict casevibecode : ${VERDICT_LABEL_FR[l.verdictEditeur]}`,
    l.description && `Description : ${l.description}`,
    l.justificationEditeur && `Pourquoi : ${l.justificationEditeur}`,
    l.prix && `Prix : ${l.prix}`,
    l.verifieLe && `Vérifié le : ${l.verifieLe}`,
    l.ceQueVousPerdez?.length ? `Ce que vous perdez en le remplaçant : ${l.ceQueVousPerdez.join(' ; ')}` : '',
    l.alternatives?.length
      ? `Alternatives :\n${l.alternatives.map((a) => `- ${a.nom} (${TYPE_ALTERNATIVE_LABEL[a.type]}) : ${a.description} ${a.url}`).join('\n')}`
      : '',
  ];
  return lignes.filter(Boolean).join('\n');
}
