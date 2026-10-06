import { describe, expect, it } from 'vitest';
import { lienValide, validerContribution } from './contribution';

describe('lienValide', () => {
  it('accepte un lien https public, ou rien', () => {
    expect(lienValide('https://exemple.fr/page')).toBe('https://exemple.fr/page');
    expect(lienValide('')).toBeNull();
    expect(lienValide(undefined)).toBeNull();
  });
  it.each(['http://exemple.fr', 'javascript:alert(1)', 'https://user:pw@exemple.fr', 'https://localhost', 'https://192.168.0.1', 'https://intranet', 'pas un lien', 42])(
    'refuse %s',
    (v) => expect(lienValide(v)).toBeUndefined(),
  );
});

describe('validerContribution', () => {
  const retour = { kind: 'retour', logicielId: 'notion', type: 'construit', texte: 'J’ai remplacé Notion par des fichiers Markdown, ça marche très bien.', lien: '', langue: 'fr' };

  it('valide et nettoie un retour', () => {
    const r = validerContribution({ ...retour, texte: '  Texte   avec   espaces multiples, assez long pour passer.  ' });
    expect(r).toEqual({ ok: true, valeur: expect.objectContaining({ kind: 'retour', texte: 'Texte avec espaces multiples, assez long pour passer.', lien: null }) });
  });
  it('refuse un texte trop court ou trop long, un type ou une fiche invalides', () => {
    expect(validerContribution({ ...retour, texte: 'court' })).toEqual({ ok: false, erreur: 'texte' });
    expect(validerContribution({ ...retour, texte: 'x'.repeat(601) })).toEqual({ ok: false, erreur: 'texte' });
    expect(validerContribution({ ...retour, type: 'autre' })).toEqual({ ok: false, erreur: 'type' });
    expect(validerContribution({ ...retour, logicielId: '../etc' })).toEqual({ ok: false, erreur: 'fiche' });
    expect(validerContribution({ ...retour, lien: 'http://pas-https.fr' })).toEqual({ ok: false, erreur: 'lien' });
  });
  it('rejette un envoi dont le champ piège est rempli', () => {
    expect(validerContribution({ ...retour, site: 'http://spam.example' })).toEqual({ ok: false, erreur: 'invalide' });
  });
  it('valide une proposition, avec lien et raison facultatifs', () => {
    expect(validerContribution({ kind: 'proposition', nom: ' Tilby ', url: 'https://www.tilby.com', raison: '' })).toEqual({
      ok: true,
      valeur: { kind: 'proposition', nom: 'Tilby', url: 'https://www.tilby.com/', raison: null, langue: 'fr' },
    });
    expect(validerContribution({ kind: 'proposition', nom: 'A' })).toEqual({ ok: false, erreur: 'nom' });
    expect(validerContribution({ kind: 'proposition', nom: 'Outil', raison: 'x'.repeat(501) })).toEqual({ ok: false, erreur: 'raison' });
  });
  it('refuse tout le reste', () => {
    expect(validerContribution(null)).toEqual({ ok: false, erreur: 'invalide' });
    expect(validerContribution({ kind: 'autre' })).toEqual({ ok: false, erreur: 'invalide' });
  });
});

describe('validerContribution : bug', () => {
  const bug = { kind: 'bug', message: 'Le bouton Ouvrir dans Claude ne fait rien sur mon iPhone.', page: '/logiciel/tally', langue: 'fr' };

  it('valide et nettoie un signalement', () => {
    expect(validerContribution({ ...bug, message: '  Le  bouton  ne répond pas, voilà ce que je vois.  ' })).toEqual({
      ok: true,
      valeur: { kind: 'bug', message: 'Le bouton ne répond pas, voilà ce que je vois.', page: '/logiciel/tally', langue: 'fr' },
    });
  });
  it('la page est facultative', () => {
    expect(validerContribution({ ...bug, page: '' })).toMatchObject({ ok: true, valeur: { page: null } });
    expect(validerContribution({ ...bug, page: undefined })).toMatchObject({ ok: true, valeur: { page: null } });
  });
  it('refuse un message trop court ou trop long', () => {
    expect(validerContribution({ ...bug, message: 'bug' })).toEqual({ ok: false, erreur: 'texte' });
    expect(validerContribution({ ...bug, message: 'x'.repeat(801) })).toEqual({ ok: false, erreur: 'texte' });
  });
  it.each(['https://exemple.fr/x', '//exemple.fr', 'logiciel/tally', '/a b', '/' + 'x'.repeat(200)])('refuse la page %s', (page) => {
    expect(validerContribution({ ...bug, page })).toEqual({ ok: false, erreur: 'page' });
  });
  it('refuse le champ piège rempli', () => {
    expect(validerContribution({ ...bug, site: 'http://spam' })).toEqual({ ok: false, erreur: 'invalide' });
  });
});
