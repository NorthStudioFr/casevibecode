// Validation des contributions de la communauté (retours et propositions).
// Logique pure : le réseau et la base sont dans src/app/api/contribution.
export type TypeRetour = 'construit' | 'casse';
export type Langue = 'fr' | 'en';

export interface RetourValide {
  kind: 'retour';
  logicielId: string;
  type: TypeRetour;
  texte: string;
  lien: string | null;
  langue: Langue;
}
export interface PropositionValide {
  kind: 'proposition';
  nom: string;
  url: string | null;
  raison: string | null;
  langue: Langue;
}
export interface BugValide {
  kind: 'bug';
  message: string;
  page: string | null;
  langue: Langue;
}
export type ContributionValide = RetourValide | PropositionValide | BugValide;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LIMITES = { texteMin: 20, texteMax: 600, nomMin: 2, nomMax: 80, urlMax: 200, raisonMax: 500, bugMin: 15, bugMax: 800, pageMax: 200 } as const;

// Lien facultatif : https uniquement, sans identifiants, sans adresse locale.
export function lienValide(brut: unknown): string | null | undefined {
  if (brut === undefined || brut === null) return null;
  if (typeof brut !== 'string') return undefined;
  const v = brut.trim();
  if (v === '') return null;
  if (v.length > LIMITES.urlMax) return undefined;
  let u: URL;
  try {
    u = new URL(v);
  } catch {
    return undefined;
  }
  if (u.protocol !== 'https:' || u.username || u.password) return undefined;
  const h = u.hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || !h.includes('.') || /^\d+\.\d+\.\d+\.\d+$/.test(h)) return undefined;
  return u.toString();
}

function texte(brut: unknown, min: number, max: number): string | undefined {
  if (typeof brut !== 'string') return undefined;
  // Espaces et sauts de ligne multiples réduits ; caractères de contrôle retirés.
  const v = brut.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return v.length >= min && v.length <= max ? v : undefined;
}

// Chemin interne facultatif (« /logiciel/tally ») : pas d'URL complète, pas d'espace.
function pageValide(brut: unknown): string | null | undefined {
  if (brut === undefined || brut === null) return null;
  if (typeof brut !== 'string') return undefined;
  const v = brut.trim();
  if (v === '') return null;
  if (v.length > LIMITES.pageMax || !v.startsWith('/') || v.startsWith('//') || /[\s\u0000-\u001f\u007f]/.test(v)) return undefined;
  return v;
}

// Renvoie la contribution nettoyée, ou un message d'erreur (code) pour la réponse 400.
export function validerContribution(corps: unknown): { ok: true; valeur: ContributionValide } | { ok: false; erreur: string } {
  if (!corps || typeof corps !== 'object') return { ok: false, erreur: 'invalide' };
  const c = corps as Record<string, unknown>;
  // Champ piège : un humain ne le remplit pas.
  if (typeof c.site === 'string' && c.site.trim() !== '') return { ok: false, erreur: 'invalide' };
  const langue: Langue = c.langue === 'en' ? 'en' : 'fr';

  if (c.kind === 'retour') {
    if (typeof c.logicielId !== 'string' || !SLUG.test(c.logicielId) || c.logicielId.length > 60) return { ok: false, erreur: 'fiche' };
    if (c.type !== 'construit' && c.type !== 'casse') return { ok: false, erreur: 'type' };
    const t = texte(c.texte, LIMITES.texteMin, LIMITES.texteMax);
    if (!t) return { ok: false, erreur: 'texte' };
    const lien = lienValide(c.lien);
    if (lien === undefined) return { ok: false, erreur: 'lien' };
    return { ok: true, valeur: { kind: 'retour', logicielId: c.logicielId, type: c.type, texte: t, lien, langue } };
  }

  if (c.kind === 'proposition') {
    const nom = texte(c.nom, LIMITES.nomMin, LIMITES.nomMax);
    if (!nom) return { ok: false, erreur: 'nom' };
    const url = lienValide(c.url);
    if (url === undefined) return { ok: false, erreur: 'lien' };
    let raison: string | null = null;
    if (c.raison !== undefined && c.raison !== null && String(c.raison).trim() !== '') {
      const r = texte(c.raison, 1, LIMITES.raisonMax);
      if (!r) return { ok: false, erreur: 'raison' };
      raison = r;
    }
    return { ok: true, valeur: { kind: 'proposition', nom, url, raison, langue } };
  }

  if (c.kind === 'bug') {
    const message = texte(c.message, LIMITES.bugMin, LIMITES.bugMax);
    if (!message) return { ok: false, erreur: 'texte' };
    const page = pageValide(c.page);
    if (page === undefined) return { ok: false, erreur: 'page' };
    return { ok: true, valeur: { kind: 'bug', message, page, langue } };
  }

  return { ok: false, erreur: 'invalide' };
}
