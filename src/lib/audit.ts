import type { VerdictEditeur } from '@/types/logiciel';

export interface AuditItem {
  slug: string;
  nom: string;
  verdict: VerdictEditeur;
  prixMensuel?: number;
  montantPersonnalise?: number;
}

export interface AuditResume {
  nombre: number;
  mensuel: number;
  annuel: number;
  // Total mensuel et nombre d'outils par verdict.
  parVerdict: Record<VerdictEditeur, { nombre: number; mensuel: number }>;
  // Outils choisis dont le prix n'est pas chiffrable (gratuit, sur devis, par employé…) : non comptés.
  sansPrix: number;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SELECTION = 80;

// Plafond mensuel par défaut pour un abonnement (100 000 €/mois).
// Évite les débordements d'affichage et les calculs absurdes en cas d'URL manipulée.
export const PLAFOND_MONTANT_MENSUEL = 100_000;

/**
 * Valide et plafonne un montant saisi ou lu dans l'URL.
 * - Rejette les valeurs non numériques, NaN, Infinity, négatives ou nulles.
 * - Arrondit au centime (2 décimales).
 * - Plafonne à la valeur maximale raisonnable (par défaut 100 000 €).
 */
export function validerEtPlafonnerMontant(valeur: unknown, max = PLAFOND_MONTANT_MENSUEL): number | undefined {
  if (typeof valeur === 'number') {
    if (!Number.isFinite(valeur) || valeur <= 0) return undefined;
    const arrondi = Math.round(valeur * 100) / 100;
    return Math.min(arrondi, max);
  }
  if (typeof valeur === 'string') {
    const propre = valeur.trim().replace(',', '.');
    if (!/^\d+(?:\.\d+)?$/.test(propre)) return undefined;
    const n = Number(propre);
    if (!Number.isFinite(n) || n <= 0) return undefined;
    const arrondi = Math.round(n * 100) / 100;
    return Math.min(arrondi, max);
  }
  return undefined;
}

// « ?t=notion,canva » ou « ?t=notion:25,canva » → ['notion', 'canva'] ; ignore ce qui n'est pas un slug valide.
export function lireSelection(parametre: string | null | undefined): string[] {
  if (!parametre) return [];
  const vus = new Set<string>();
  for (const brut of parametre.split(',')) {
    const deuxPoints = brut.indexOf(':');
    const slugBrut = deuxPoints >= 0 ? brut.slice(0, deuxPoints) : brut;
    const s = slugBrut.trim().toLowerCase();
    if (SLUG.test(s) && s.length <= 60) vus.add(s);
    if (vus.size >= MAX_SELECTION) break;
  }
  return [...vus];
}

// Lit les slugs et leurs montants personnalisés éventuels depuis « ?t=notion:25,canva:12 »
export function lireSelectionAvecMontants(parametre: string | null | undefined): {
  slugs: string[];
  montants: Record<string, number>;
} {
  if (!parametre) return { slugs: [], montants: {} };
  const vus = new Set<string>();
  const montants: Record<string, number> = {};
  for (const brut of parametre.split(',')) {
    const deuxPoints = brut.indexOf(':');
    const slugBrut = deuxPoints >= 0 ? brut.slice(0, deuxPoints) : brut;
    const s = slugBrut.trim().toLowerCase();
    if (SLUG.test(s) && s.length <= 60) {
      if (!vus.has(s)) {
        vus.add(s);
        if (deuxPoints >= 0) {
          const montantValide = validerEtPlafonnerMontant(brut.slice(deuxPoints + 1));
          if (montantValide !== undefined) {
            montants[s] = montantValide;
          }
        }
      }
    }
    if (vus.size >= MAX_SELECTION) break;
  }
  return { slugs: [...vus], montants };
}

export function ecrireSelection(slugs: Iterable<string>, montants?: Record<string, number>): string {
  const elements: string[] = [];
  for (const s of slugs) {
    const m = montants && s in montants ? validerEtPlafonnerMontant(montants[s]) : undefined;
    elements.push(m !== undefined ? `${s}:${m}` : s);
  }
  return elements.join(',');
}

export function calculerAudit(choisis: AuditItem[]): AuditResume {
  const parVerdict: AuditResume['parVerdict'] = {
    YES: { nombre: 0, mensuel: 0 },
    KINDA: { nombre: 0, mensuel: 0 },
    NOT_REALLY: { nombre: 0, mensuel: 0 },
  };
  let mensuel = 0;
  let sansPrix = 0;
  for (const l of choisis) {
    const montantPerso = validerEtPlafonnerMontant(l.montantPersonnalise);
    const prixDeBase = typeof l.prixMensuel === 'number' && Number.isFinite(l.prixMensuel) && l.prixMensuel > 0 ? l.prixMensuel : 0;
    const prix = montantPerso !== undefined ? montantPerso : prixDeBase;
    parVerdict[l.verdict].nombre += 1;
    parVerdict[l.verdict].mensuel += prix;
    mensuel += prix;
    if (prix === 0) sansPrix += 1;
  }
  return { nombre: choisis.length, mensuel, annuel: mensuel * 12, parVerdict, sansPrix };
}
