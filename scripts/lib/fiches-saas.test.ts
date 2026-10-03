import { describe, expect, it } from 'vitest';
import { githubRepo, licenceLibreDepuisTexte, nettoyerPrix, normaliserFiche, type FicheBrute } from './fiches-saas';

const base: FicheBrute = {
  slug: 'notion', nom: 'Notion', domaine: 'notion.com', categorie: 'notes',
  description: 'Espace de travail pour notes, bases de données et wikis.',
  verdictEditeur: 'KINDA',
  justificationEditeur: 'Un éditeur de notes simple se code vite, mais pas les bases relationnelles ni la collaboration.',
  ceQueVousPerdez: ['La collaboration en temps réel'],
  prompt: 'Construis un espace de notes personnel avec Next.js et PostgreSQL, sans fonctionnalité de plus.',
  prix: 'gratuit (plans payants à partir de 10 €/mois/utilisateur)', prixSource: 'https://www.notion.com/fr/pricing', prixMensuel: null,
  alternatives: [{ nom: 'AFFiNE', url: 'https://github.com/toeverything/AFFiNE', type: 'open-source', description: 'Espace de travail local-first.' }],
};

describe('normaliserFiche', () => {
  it('accepte une fiche complète et la marque saas / canivibecodeit', () => {
    const { fiche, problemes } = normaliserFiche(base);
    expect(problemes).toEqual([]);
    expect(fiche).toMatchObject({ secteur: 'saas', sourceVerdict: 'canivibecodeit', slug: 'notion' });
    expect(fiche?.prixMensuel).toBeUndefined();
  });

  it('déduit prixMensuel du texte (forfait fixe) et refuse une valeur incohérente', () => {
    expect(normaliserFiche({ ...base, prix: 'à partir de 29 €/mois', prixMensuel: 29 }).fiche?.prixMensuel).toBe(29);
    expect(normaliserFiche({ ...base, prix: 'à partir de 29 €/mois', prixMensuel: 30 }).problemes.join()).toMatch(/incohérent/);
    expect(normaliserFiche({ ...base, prix: 'à partir de 12 €/mois/utilisateur', prixMensuel: 12 }).problemes.join()).toMatch(/incohérent/);
  });

  it.each(['12 $/mois', '9 USD par mois', 'environ 10 euros'])('refuse le prix %s', (prix) => {
    expect(normaliserFiche({ ...base, prix }).problemes.length).toBeGreaterThan(0);
  });

  it('refuse un prix sans page tarifs source', () => {
    expect(normaliserFiche({ ...base, prixSource: null }).problemes.join()).toMatch(/source/);
  });

  it('accepte l’absence de prix (null) sans rien chiffrer', () => {
    const { fiche, problemes } = normaliserFiche({ ...base, prix: null, prixSource: null });
    expect(problemes).toEqual([]);
    expect(fiche?.prix).toBeUndefined();
  });

  it('refuse catégorie, verdict, domaine invalides et textes vides', () => {
    const p = normaliserFiche({ ...base, categorie: 'caisse', verdictEditeur: 'yes', domaine: 'pas un domaine', ceQueVousPerdez: [] }).problemes.join();
    expect(p).toMatch(/catégorie/);
    expect(p).toMatch(/verdict/);
    expect(p).toMatch(/domaine/);
    expect(p).toMatch(/ceQueVousPerdez/);
  });

  it('dédoublonne les alternatives et ignore http://', () => {
    const a = { nom: 'X', url: 'https://x.io/', type: 'gratuit' as const, description: 'Un outil.' };
    const r = normaliserFiche({ ...base, alternatives: [a, { ...a, url: 'https://www.x.io' }] });
    expect(r.fiche?.alternatives).toHaveLength(1);
    expect(normaliserFiche({ ...base, alternatives: [{ ...a, url: 'http://x.io' }] }).problemes.join()).toMatch(/alternative invalide/);
  });
});

describe('githubRepo', () => {
  it('extrait owner/repo', () => {
    expect(githubRepo('https://github.com/knadh/listmonk')).toBe('knadh/listmonk');
    expect(githubRepo('https://github.com/a/b.git')).toBe('a/b');
    expect(githubRepo('https://gitlab.com/a/b')).toBeNull();
  });
});

describe('nettoyerPrix', () => {
  it('garde un prix valide', () => {
    expect(nettoyerPrix(base).avertissement).toBeUndefined();
  });
  it('retire un prix hors format sans bloquer la fiche', () => {
    const r = nettoyerPrix({ ...base, prix: 'à partir de 20 € (facturation annuelle)', prixMensuel: null });
    expect(r.fiche.prix).toBeNull();
    expect(r.avertissement).toMatch(/format non reconnu/);
    expect(normaliserFiche(r.fiche).problemes).toEqual([]);
  });
});

describe('licenceLibreDepuisTexte', () => {
  it('reconnaît une licence libre', () => {
    expect(licenceLibreDepuisTexte('GNU GENERAL PUBLIC LICENSE Version 3')).toBe('GPL');
    expect(licenceLibreDepuisTexte('Permission is hereby granted, free of charge, to any person')).toBe('MIT');
    expect(licenceLibreDepuisTexte('Content outside enterprise/ is available under the "MIT" license')).toBe('MIT');
  });
  it('refuse les licences non libres, même mélangées à une licence libre', () => {
    expect(licenceLibreDepuisTexte('AGPL ... or the Mattermost Source Available License')).toBeNull();
    expect(licenceLibreDepuisTexte('Permission is hereby granted, free of charge ... Commons Clause')).toBeNull();
    expect(licenceLibreDepuisTexte('Sustainable Use License')).toBeNull();
    expect(licenceLibreDepuisTexte('All rights reserved')).toBeNull();
  });
});
