import { describe, expect, it } from 'vitest';
import { calculerAudit, ecrireSelection, lireSelection } from './audit';

describe('lireSelection', () => {
  it('lit une liste de slugs et ignore le reste', () => {
    expect(lireSelection('notion, canva,NOTION,<script>,a_b,')).toEqual(['notion', 'canva']);
    expect(lireSelection(null)).toEqual([]);
    expect(lireSelection('')).toEqual([]);
  });
  it('plafonne la taille de la sélection', () => {
    const beaucoup = Array.from({ length: 200 }, (_, i) => `outil-${i}`).join(',');
    expect(lireSelection(beaucoup)).toHaveLength(80);
  });
  it('relit ce qu’elle a écrit', () => {
    expect(lireSelection(ecrireSelection(['a-b', 'c']))).toEqual(['a-b', 'c']);
  });
});

describe('calculerAudit', () => {
  it('additionne par verdict et compte les outils sans prix chiffré', () => {
    const r = calculerAudit([
      { slug: 'a', nom: 'A', verdict: 'YES', prixMensuel: 10 },
      { slug: 'b', nom: 'B', verdict: 'KINDA', prixMensuel: 29.5 },
      { slug: 'c', nom: 'C', verdict: 'NOT_REALLY' },
      { slug: 'd', nom: 'D', verdict: 'YES', prixMensuel: 0 },
    ]);
    expect(r.nombre).toBe(4);
    expect(r.mensuel).toBeCloseTo(39.5);
    expect(r.annuel).toBeCloseTo(474);
    expect(r.parVerdict.YES).toEqual({ nombre: 2, mensuel: 10 });
    expect(r.parVerdict.KINDA.mensuel).toBe(29.5);
    expect(r.sansPrix).toBe(2);
  });
  it('renvoie des zéros pour une sélection vide', () => {
    const r = calculerAudit([]);
    expect(r).toMatchObject({ nombre: 0, mensuel: 0, annuel: 0, sansPrix: 0 });
  });
});
