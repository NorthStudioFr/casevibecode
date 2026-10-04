// Validation des fiches « outils du quotidien » préparées à partir de
// canivibecodeit (MIT). Logique pure : le réseau (GitHub, sites) est dans
// scripts/import-fiches-saas.ts.
import { parsePrixMensuel } from '../../src/lib/prix';
import type { Alternative, Categorie, NouveauLogicielInput, TypeAlternative, VerdictEditeur } from '../../src/types/logiciel';

export const CATEGORIES_SAAS: Categorie[] = [
  'finance-compta', 'rh-paie', 'marketing', 'vente-crm', 'communication',
  'productivite', 'ecommerce', 'dev-tools', 'design', 'notes', 'reseau', 'autre',
];
const VERDICTS: VerdictEditeur[] = ['YES', 'KINDA', 'NOT_REALLY'];
const TYPES: TypeAlternative[] = ['open-source', 'gratuit', 'plus-petit'];

// Seuls formats de prix acceptés (cf. src/lib/prix.ts pour le chiffrable).
const PRIX_OK = [
  /^(?:à partir de\s+)?\d+(?:,\d+)?\s*€\s*\/\s*mois$/i,
  /^à partir de \d+(?:,\d+)? €\/mois\/utilisateur$/i,
  /^gratuit$/i,
  /^gratuit \(plans? payants? (?:à partir de|dès) \d+(?:,\d+)? €\/mois(?:\/utilisateur)?\)$/i,
  /^sur devis$/i,
];

// Un prix douteux (format libre, en dollars, sans page source) ne bloque pas la
// fiche : il est retiré et signalé. Mieux vaut pas de prix qu'un prix faux.
export function nettoyerPrix(f: FicheBrute): { fiche: FicheBrute; avertissement?: string } {
  if (f.prix == null || f.prix === '') return { fiche: f };
  const prix = f.prix.trim();
  const raisons: string[] = [];
  if (!PRIX_OK.some((r) => r.test(prix))) raisons.push('format non reconnu');
  if (/\$|usd|dollar/i.test(prix)) raisons.push('dollars');
  if (!f.prixSource || !/^https:\/\//.test(f.prixSource)) raisons.push('sans source');
  if (raisons.length === 0) return { fiche: f };
  return { fiche: { ...f, prix: null, prixSource: null, prixMensuel: null }, avertissement: `prix « ${prix} » retiré (${raisons.join(', ')})` };
}

export interface FicheBrute {
  slug?: string; nom?: string; domaine?: string; categorie?: string; description?: string;
  verdictEditeur?: string; justificationEditeur?: string; ceQueVousPerdez?: string[]; prompt?: string;
  prix?: string | null; prixSource?: string | null; prixMensuel?: number | null;
  alternatives?: Partial<Alternative>[];
}

export function cleUrl(url: string): string {
  return url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
}

export function githubRepo(url: string): string | null {
  const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  return m ? `${m[1]}/${m[2].replace(/\.git$/, '')}` : null;
}

// Retourne la fiche prête à importer (alternatives NON encore vérifiées sur le
// réseau) et la liste des problèmes bloquants.
export function normaliserFiche(f: FicheBrute): { fiche?: NouveauLogicielInput; problemes: string[] } {
  const problemes: string[] = [];
  const texte = (v: unknown, nom: string, min = 1) => {
    if (typeof v !== 'string' || v.trim().length < min) problemes.push(`${nom} manquant`);
    return typeof v === 'string' ? v.trim() : '';
  };
  const slug = texte(f.slug, 'slug');
  const nom = texte(f.nom, 'nom');
  const domaine = texte(f.domaine, 'domaine');
  if (domaine && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(domaine)) problemes.push(`domaine invalide (${domaine})`);
  const description = texte(f.description, 'description', 20);
  const justification = texte(f.justificationEditeur, 'justification', 40);
  const prompt = texte(f.prompt, 'prompt', 40);
  if (!CATEGORIES_SAAS.includes(f.categorie as Categorie)) problemes.push(`catégorie invalide (${f.categorie})`);
  if (!VERDICTS.includes(f.verdictEditeur as VerdictEditeur)) problemes.push(`verdict invalide (${f.verdictEditeur})`);

  const perdez = Array.isArray(f.ceQueVousPerdez) ? f.ceQueVousPerdez.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim()) : [];
  if (perdez.length === 0) problemes.push('ceQueVousPerdez vide');

  let prix: string | undefined;
  let prixMensuel: number | undefined;
  if (f.prix != null && f.prix !== '') {
    prix = f.prix.trim();
    if (!PRIX_OK.some((r) => r.test(prix!))) problemes.push(`format de prix non reconnu (${prix})`);
    if (!f.prixSource || !/^https:\/\//.test(f.prixSource)) problemes.push('prix sans source (page tarifs)');
    if (/\$|usd|dollar/i.test(prix)) problemes.push('prix en dollars');
    // La valeur chiffrée se déduit du texte : jamais saisie à part.
    prixMensuel = parsePrixMensuel(prix);
    if (f.prixMensuel != null && f.prixMensuel !== prixMensuel) problemes.push(`prixMensuel incohérent (${f.prixMensuel} ≠ ${prixMensuel ?? 'aucun'})`);
  } else if (f.prixMensuel != null) {
    problemes.push('prixMensuel sans prix');
  }

  const vues = new Set<string>();
  const alternatives: Alternative[] = [];
  for (const a of f.alternatives ?? []) {
    const ok = a && typeof a.nom === 'string' && a.nom.trim() && typeof a.url === 'string' && /^https:\/\//.test(a.url)
      && TYPES.includes(a.type as TypeAlternative) && typeof a.description === 'string' && a.description.trim();
    if (!ok) { problemes.push(`alternative invalide (${a?.nom ?? '?'})`); continue; }
    const cle = cleUrl(a.url!);
    if (vues.has(cle)) continue;
    vues.add(cle);
    alternatives.push({ nom: a.nom!.trim(), url: a.url!, type: a.type as TypeAlternative, description: a.description!.trim() });
  }

  if (problemes.length > 0) return { problemes };
  return {
    problemes,
    fiche: {
      nom, slug, domaine, categorie: f.categorie as Categorie, secteur: 'saas', description,
      verdictEditeur: f.verdictEditeur as VerdictEditeur, justificationEditeur: justification,
      ceQueVousPerdez: perdez.slice(0, 5), prompt, sourceVerdict: 'canivibecodeit',
      ...(prix ? { prix } : {}),
      ...(prixMensuel !== undefined ? { prixMensuel } : {}),
      ...(alternatives.length ? { alternatives: alternatives.slice(0, 5) } : {}),
    },
  };
}

// Quand GitHub ne reconnaît pas la licence (NOASSERTION : fichiers à plusieurs
// licences, cœur libre + dossier « enterprise »…), on lit le texte du fichier.
// Libre = une licence OSI reconnaissable ; tout marqueur « source available »,
// « fair-code », Commons Clause, BSL, etc. l'emporte et fait refuser.
const NON_LIBRE = /commons clause|business source license|\bBSL\b|sustainable use|elastic license|functional source|fair[- ]?code|source[- ]available|educational use|non[- ]commercial/i;
const LIBRE: [RegExp, string][] = [
  [/GNU AFFERO GENERAL PUBLIC LICENSE/i, 'AGPL'],
  [/GNU (?:LESSER|LIBRARY) GENERAL PUBLIC LICENSE/i, 'LGPL'],
  [/GNU GENERAL PUBLIC LICENSE/i, 'GPL'],
  [/Apache License,?\s+Version 2\.0/i, 'Apache-2.0'],
  [/Mozilla Public License/i, 'MPL'],
  [/Permission is hereby granted, free of charge/i, 'MIT'],
  [/Redistribution and use in source and binary forms/i, 'BSD'],
  [/\bMIT\b[^\n]{0,40}licen[sc]e|licen[sc]e[^\n]{0,40}\bMIT\b/i, 'MIT'],
];

export function licenceLibreDepuisTexte(texte: string): string | null {
  if (NON_LIBRE.test(texte)) return null;
  for (const [re, nom] of LIBRE) if (re.test(texte)) return nom;
  return null;
}
