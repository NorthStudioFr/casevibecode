import { getLogiciels } from '@/lib/logiciels-server';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { VERDICT_LABEL_FR, texteFiche } from '@/lib/llms';

// Version complète de llms.txt : le contenu de chaque fiche en Markdown, pour qu'un assistant puisse
// citer un verdict, un prix ou une alternative sans parcourir 272 pages. Rafraîchie toutes les heures.
export const revalidate = 3600;

export async function GET() {
  const logiciels = [...(await getLogiciels())].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  const body = `# ${SITE_NAME} : contenu complet

> Verdict casevibecode pour ${logiciels.length} logiciels : remplaçable par un outil sur mesure, partiellement, ou pas. Le verdict initial est un avis éditorial (voir ${SITE_URL}/methode) ; au-delà de 20 votes, celui de la communauté prend le relais. Les verdicts ne sont ni un audit technique ni un conseil juridique.

${logiciels.map((l) => texteFiche(l, SITE_URL)).join('\n\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
