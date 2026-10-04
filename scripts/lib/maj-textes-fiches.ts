// Mise à jour ciblée des textes éditoriaux des fiches : logique pure, sans
// réseau. Le script scripts/maj-textes-fiches-saas.ts lit la base et applique.
// Seules ces colonnes peuvent changer : prix, alternatives et votes ne sont
// jamais touchés.
import type { VerdictEditeur } from '../../src/types/logiciel';

export const CHAMPS = {
  description: 'description',
  justificationEditeur: 'justification_editeur',
  ceQueVousPerdez: 'ce_que_vous_perdez',
  prompt: 'prompt',
  verdictEditeur: 'verdict_editeur',
  sourceVerdict: 'source_verdict',
} as const;

export type ChampJson = keyof typeof CHAMPS;
export type Colonne = (typeof CHAMPS)[ChampJson];

export interface FicheTextes {
  slug?: string;
  description?: string;
  justificationEditeur?: string;
  ceQueVousPerdez?: string[];
  prompt?: string;
  verdictEditeur?: string;
  sourceVerdict?: string;
}

export type LigneBase = Partial<Record<Colonne, unknown>>;
export type Changement = Partial<Record<Colonne, unknown>>;

const VERDICTS: VerdictEditeur[] = ['YES', 'KINDA', 'NOT_REALLY'];

export function validerTextes(f: FicheTextes): string[] {
  const p: string[] = [];
  const long = (v: unknown, nom: string, min: number) => {
    if (typeof v !== 'string' || v.trim().length < min) p.push(`${nom} trop court ou absent`);
  };
  if (!f.slug) p.push('slug absent');
  long(f.description, 'description', 20);
  long(f.justificationEditeur, 'justification', 40);
  long(f.prompt, 'prompt', 40);
  if (!Array.isArray(f.ceQueVousPerdez) || f.ceQueVousPerdez.length === 0 || f.ceQueVousPerdez.some((x) => typeof x !== 'string' || !x.trim())) {
    p.push('ceQueVousPerdez vide ou invalide');
  }
  if (!VERDICTS.includes(f.verdictEditeur as VerdictEditeur)) p.push(`verdict invalide (${f.verdictEditeur})`);
  if (!f.sourceVerdict) p.push('sourceVerdict absent');
  return p;
}

function egal(a: unknown, b: unknown): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

// Retourne uniquement les colonnes dont la valeur diffère de la base.
export function calculerChangement(fiche: FicheTextes, ligne: LigneBase): Changement {
  const out: Changement = {};
  for (const [cleJson, colonne] of Object.entries(CHAMPS) as [ChampJson, Colonne][]) {
    const nouvelle = fiche[cleJson];
    if (!egal(nouvelle, ligne[colonne])) out[colonne] = nouvelle;
  }
  return out;
}
