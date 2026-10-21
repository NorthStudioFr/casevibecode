import { getLogiciels } from '@/lib/logiciels-server';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { editeur, libelleEditeur } from '@/lib/editeur';
import { SECTEUR_PAGE } from '@/lib/secteurs';

// Refreshed hourly rather than on the fiche revalidate window (60s): this
// route reads the full collection like the homepage does, and crawlers
// consuming llms.txt don't need minute-level freshness.
export const revalidate = 3600;

export async function GET() {
  const logiciels = await getLogiciels();
  const sorted = [...logiciels].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  const lines = sorted.map((l) => `- [${l.nom}](${SITE_URL}/logiciel/${l.slug}): ${l.description}`);

  const body = `# ${SITE_NAME}

> Verdicts communautaires sur les logiciels métier du CHR (cafés, hôtels, restaurants) et sur les outils du quotidien : pour chaque outil, est-il remplaçable par une solution sur mesure, ou pas ?

${libelleEditeur(editeur())} édite ce site pour aider les restaurateurs et hôteliers français à distinguer les logiciels qu'un outil sur-mesure simple peut remplacer, de ceux qui nécessitent une vraie solution du marché (certification NF525, conformité réglementaire, effets de réseau, sécurité des paiements). Une partie des fiches d'outils du quotidien reprend le verdict initial de canivibecodeit.com (licence MIT), traduit et adapté. Chaque fiche donne un verdict, un vote communautaire, et pour certains outils des alternatives dont le dépôt, la licence ou le site ont été contrôlés.

## Par public

- [Restauration et hôtellerie](${SITE_URL}${SECTEUR_PAGE.chr}) : les logiciels du métier (caisse, réservation, livraison, compta…) et leur verdict.
- [Outils du quotidien](${SITE_URL}${SECTEUR_PAGE.saas}) : les abonnements courants (notes, design, facturation, e-commerce…) et leur verdict.
- [Méthode](${SITE_URL}/methode) : comment les verdicts sont établis.

## Logiciels référencés (${sorted.length})

${lines.join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
