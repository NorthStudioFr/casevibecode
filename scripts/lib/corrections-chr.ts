// Corrections ciblées de fiches CHR : logique pure, sans réseau. Seules les
// colonnes de COLONNES_AUTORISEES peuvent être modifiées ; prix et domaine
// peuvent être mis à null (« mieux vaut pas de prix qu'un prix faux »).
export const COLONNES_AUTORISEES = ['description', 'justification_editeur', 'verdict_editeur', 'prix', 'prix_mensuel', 'domaine', 'prompt', 'ce_que_vous_perdez'] as const;
export type ColonneAutorisee = (typeof COLONNES_AUTORISEES)[number];

export interface Correction {
  slug: string;
  [colonne: string]: unknown;
}

export function colonnesInterdites(c: Correction): string[] {
  return Object.keys(c).filter((k) => k !== 'slug' && !(COLONNES_AUTORISEES as readonly string[]).includes(k));
}

const egal = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export function diffCorrection(c: Correction, ligne: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const col of COLONNES_AUTORISEES) {
    if (col in c && !egal(c[col], ligne[col])) out[col] = c[col];
  }
  return out;
}
