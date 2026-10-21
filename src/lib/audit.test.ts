import { describe, expect, it } from 'vitest';
import {
  calculerAudit,
  ecrireSelection,
  lireSelection,
  lireSelectionAvecMontants,
  validerEtPlafonnerMontant,
  PLAFOND_MONTANT_MENSUEL,
} from './audit';

describe('validerEtPlafonnerMontant', () => {
  it('accepte les montants positifs entiers et décimaux', () => {
    expect(validerEtPlafonnerMontant(25)).toBe(25);
    expect(validerEtPlafonnerMontant(12.5)).toBe(12.5);
    expect(validerEtPlafonnerMontant('29.90')).toBe(29.9);
    expect(validerEtPlafonnerMontant(' 15,50 ')).toBe(15.5);
  });

  it('arrondit au centime', () => {
    expect(validerEtPlafonnerMontant(10.555)).toBe(10.56);
    expect(validerEtPlafonnerMontant('10.551')).toBe(10.55);
  });

  it('rejette les montants nuls, négatifs ou arrondis à zéro', () => {
    expect(validerEtPlafonnerMontant(0)).toBeUndefined();
    expect(validerEtPlafonnerMontant(-10)).toBeUndefined();
    expect(validerEtPlafonnerMontant('-50')).toBeUndefined();
    expect(validerEtPlafonnerMontant('0')).toBeUndefined();
    expect(validerEtPlafonnerMontant(0.001)).toBeUndefined();
    expect(validerEtPlafonnerMontant('0.004')).toBeUndefined();
    expect(validerEtPlafonnerMontant(0.005)).toBe(0.01);
  });

  it('rejette les valeurs non numériques, NaN, Infinity et injections', () => {
    expect(validerEtPlafonnerMontant(NaN)).toBeUndefined();
    expect(validerEtPlafonnerMontant(Infinity)).toBeUndefined();
    expect(validerEtPlafonnerMontant(-Infinity)).toBeUndefined();
    expect(validerEtPlafonnerMontant('abc')).toBeUndefined();
    expect(validerEtPlafonnerMontant('<script>alert(1)</script>')).toBeUndefined();
    expect(validerEtPlafonnerMontant(null)).toBeUndefined();
    expect(validerEtPlafonnerMontant(undefined)).toBeUndefined();
    expect(validerEtPlafonnerMontant({})).toBeUndefined();
    expect(validerEtPlafonnerMontant([])).toBeUndefined();
  });

  it('plafonne à la valeur maximale raisonnable', () => {
    expect(validerEtPlafonnerMontant(999_999_999)).toBe(PLAFOND_MONTANT_MENSUEL);
    expect(validerEtPlafonnerMontant('500000', 500)).toBe(500);
    expect(validerEtPlafonnerMontant(100_000)).toBe(100_000);
  });
});

describe('lireSelection', () => {
  it('lit une liste de slugs et ignore le reste', () => {
    expect(lireSelection('notion, canva,NOTION,<script>,a_b,')).toEqual(['notion', 'canva']);
    expect(lireSelection(null)).toEqual([]);
    expect(lireSelection('')).toEqual([]);
  });
  it('supporte le format slug:montant sans casser l’extraction des slugs', () => {
    expect(lireSelection('notion:25,canva:12,airtable')).toEqual(['notion', 'canva', 'airtable']);
  });
  it('plafonne la taille de la sélection', () => {
    const beaucoup = Array.from({ length: 200 }, (_, i) => `outil-${i}`).join(',');
    expect(lireSelection(beaucoup)).toHaveLength(80);
  });
  it('relit ce qu’elle a écrit', () => {
    expect(lireSelection(ecrireSelection(['a-b', 'c']))).toEqual(['a-b', 'c']);
  });
});

describe('lireSelectionAvecMontants', () => {
  it('lit les slugs et valide/plafonne les montants personnalisés', () => {
    const res = lireSelectionAvecMontants('notion:29.90,canva:9999999,airtable:-50,slack:abc,tally');
    expect(res.slugs).toEqual(['notion', 'canva', 'airtable', 'slack', 'tally']);
    expect(res.montants).toEqual({
      notion: 29.9,
      canva: PLAFOND_MONTANT_MENSUEL,
    });
  });

  it('gère les paramètres vides ou nuls', () => {
    expect(lireSelectionAvecMontants(null)).toEqual({ slugs: [], montants: {} });
    expect(lireSelectionAvecMontants('')).toEqual({ slugs: [], montants: {} });
  });

  it('sérialise et désérialise avec les montants', () => {
    const ecrit = ecrireSelection(['notion', 'canva'], { notion: 25, canva: 12.5 });
    expect(ecrit).toBe('notion:25,canva:12.5');
    expect(lireSelectionAvecMontants(ecrit)).toEqual({
      slugs: ['notion', 'canva'],
      montants: { notion: 25, canva: 12.5 },
    });
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

  it('utilise le montant personnalisé valide s’il est fourni', () => {
    const r = calculerAudit([
      { slug: 'a', nom: 'A', verdict: 'YES', prixMensuel: 10, montantPersonnalise: 40 },
      { slug: 'b', nom: 'B', verdict: 'KINDA', prixMensuel: 20, montantPersonnalise: -999 }, // rejeté -> prixMensuel 20
      { slug: 'c', nom: 'C', verdict: 'NOT_REALLY', montantPersonnalise: 50 }, // outil sans prixMensuel -> compte 50
    ]);
    expect(r.mensuel).toBe(110);
    expect(r.sansPrix).toBe(0);
  });

  it('renvoie des zéros pour une sélection vide', () => {
    const r = calculerAudit([]);
    expect(r).toMatchObject({ nombre: 0, mensuel: 0, annuel: 0, sansPrix: 0 });
  });
});
