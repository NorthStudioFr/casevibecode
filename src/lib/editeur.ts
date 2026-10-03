// Identité de l'éditeur du site. Rien n'est écrit dans le code (le dépôt est
// public) : tout vient de variables d'environnement posées sur l'hébergement, et
// une information absente n'est simplement pas affichée.
//
//   EDITEUR_MARQUE, EDITEUR_NOM, EDITEUR_URL, EDITEUR_CONTACT_URL, EDITEUR_EMAIL,
//   EDITEUR_SIRET, EDITEUR_APE, EDITEUR_FORME, EDITEUR_TVA, EDITEUR_ADRESSE
export interface Editeur {
  marque?: string;
  nom?: string;
  url?: string;
  contactUrl?: string;
  email?: string;
  siret?: string;
  ape?: string;
  forme?: string;
  tva?: string;
  adresse?: string;
}

function lire(nom: string): string | undefined {
  const valeur = process.env[nom]?.trim();
  return valeur ? valeur : undefined;
}

export function editeur(): Editeur {
  return {
    marque: lire('EDITEUR_MARQUE'),
    nom: lire('EDITEUR_NOM'),
    url: lire('EDITEUR_URL'),
    contactUrl: lire('EDITEUR_CONTACT_URL'),
    email: lire('EDITEUR_EMAIL'),
    siret: lire('EDITEUR_SIRET'),
    ape: lire('EDITEUR_APE'),
    forme: lire('EDITEUR_FORME'),
    tva: lire('EDITEUR_TVA'),
    adresse: lire('EDITEUR_ADRESSE'),
  };
}

// Nom à utiliser dans les phrases : marque, sinon nom, sinon formule neutre.
export function libelleEditeur(e: Editeur): string {
  return e.marque ?? e.nom ?? "l'éditeur du site";
}
