// Identité de l'éditeur du site. Rien n'est écrit dans le code (le dépôt est
// public) : tout vient de variables d'environnement posées sur l'hébergement, et
// une information absente n'est simplement pas affichée.
//
//   EDITEUR_MARQUE, EDITEUR_NOM, EDITEUR_URL, EDITEUR_CONTACT_URL, EDITEUR_EMAIL,
//   EDITEUR_SIRET, EDITEUR_APE, EDITEUR_FORME, EDITEUR_TVA, EDITEUR_ADRESSE,
//   EDITEUR_SAMEAS (profils de la marque, adresses https séparées par des virgules),
//   EDITEUR_FONDATEUR (nom) et EDITEUR_FONDATEUR_URL (son profil), pour les données structurées
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
  sameAs?: string[];
  fondateur?: string;
  fondateurUrl?: string;
}

// Seules les adresses https valides sont gardées : une variable mal saisie ne produit rien de faux.
export function adressesHttps(brut: string | undefined): string[] {
  return (brut ?? '')
    .split(',')
    .map((u) => u.trim())
    .filter((u) => {
      try {
        return new URL(u).protocol === 'https:';
      } catch {
        return false;
      }
    });
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
    sameAs: adressesHttps(lire('EDITEUR_SAMEAS')).length ? adressesHttps(lire('EDITEUR_SAMEAS')) : undefined,
    fondateur: lire('EDITEUR_FONDATEUR'),
    fondateurUrl: adressesHttps(lire('EDITEUR_FONDATEUR_URL'))[0],
  };
}

// Nom à utiliser dans les phrases : marque, sinon nom, sinon formule neutre.
export function libelleEditeur(e: Editeur): string {
  return e.marque ?? e.nom ?? "l'éditeur du site";
}
