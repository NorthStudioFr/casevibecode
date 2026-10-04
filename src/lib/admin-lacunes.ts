import type { Logiciel } from '@/types/logiciel';

export type Lacune = 'prix' | 'domaine' | 'alternatives' | 'prompt';

export const LACUNE_LABEL: Record<Lacune, string> = {
  prix: 'sans prix',
  domaine: 'sans domaine',
  alternatives: 'sans alternative',
  prompt: 'sans prompt',
};

// Ce qui manque à une fiche pour être complète. Un prompt n'est attendu que si une
// version maison est conseillée (verdict « remplaçable » ou « partiellement »).
export function lacunesDe(l: Logiciel): Lacune[] {
  const manques: Lacune[] = [];
  if (!l.prix) manques.push('prix');
  if (!l.domaine) manques.push('domaine');
  if (!l.alternatives || l.alternatives.length === 0) manques.push('alternatives');
  if (l.verdictEditeur !== 'NOT_REALLY' && !l.prompt) manques.push('prompt');
  return manques;
}
