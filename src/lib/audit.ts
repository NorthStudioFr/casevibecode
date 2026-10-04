import type { VerdictEditeur } from '@/types/logiciel';

export interface AuditItem {
  slug: string;
  nom: string;
  verdict: VerdictEditeur;
  prixMensuel?: number;
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

// « ?t=notion,canva » → ['notion', 'canva'] ; ignore ce qui n'est pas un slug valide.
export function lireSelection(parametre: string | null | undefined): string[] {
  if (!parametre) return [];
  const vus = new Set<string>();
  for (const brut of parametre.split(',')) {
    const s = brut.trim().toLowerCase();
    if (SLUG.test(s) && s.length <= 60) vus.add(s);
    if (vus.size >= MAX_SELECTION) break;
  }
  return [...vus];
}

export function ecrireSelection(slugs: Iterable<string>): string {
  return [...slugs].join(',');
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
    const prix = typeof l.prixMensuel === 'number' && Number.isFinite(l.prixMensuel) && l.prixMensuel > 0 ? l.prixMensuel : 0;
    parVerdict[l.verdict].nombre += 1;
    parVerdict[l.verdict].mensuel += prix;
    mensuel += prix;
    if (prix === 0) sansPrix += 1;
  }
  return { nombre: choisis.length, mensuel, annuel: mensuel * 12, parVerdict, sansPrix };
}
