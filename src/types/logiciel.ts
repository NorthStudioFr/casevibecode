export type Categorie = 
  | 'caisse' | 'reservation' | 'livraison' | 'compta' | 'autre'
  | 'finance-compta' | 'rh-paie' | 'marketing' | 'vente-crm' 
  | 'communication' | 'productivite' | 'ecommerce' | 'assurance-sante' 
  | 'dev-tools' | 'design' | 'notes' | 'evenementiel'
  | 'hotellerie' | 'hygiene' | 'stocks' | 'avis' | 'commande' | 'pourboire' | 'fidelite' | 'achats' | 'paiement' | 'reseau';

export type Secteur = 'chr' | 'saas';
export type VerdictEditeur = 'YES' | 'KINDA' | 'NOT_REALLY';

export type TypeAlternative = 'open-source' | 'gratuit' | 'plus-petit' | 'concurrent';

// Modèle d'une alternative libre ou gratuite : tout le code est libre et s'installe chez soi, le code est
// libre mais l'éditeur vend aussi une version hébergée, ou l'offre est gratuite sans que le code soit libre.
export type ModeleAlternative = 'libre-auto-heberge' | 'libre-cloud-payant' | 'freemium';

export interface Alternative {
  nom: string;
  url: string;
  type: TypeAlternative;
  description: string;
  // Faits relevés sur le dépôt ou le site de l'éditeur, toujours datés (facultatifs).
  licence?: string;
  depot?: string;
  etoiles?: { nombre: number; releveLe: string };
  derniereVersion?: { version: string; date: string };
  modele?: ModeleAlternative;
}

export interface Logiciel {
  id: string;
  nom: string;
  slug: string;
  categorie: Categorie;
  secteur: Secteur;
  description: string;
  verdictEditeur: VerdictEditeur;
  justificationEditeur: string;
  domaine: string;
  prix?: string;
  prixMensuel?: number;
  ceQueVousPerdez?: string[];
  dateAjout: number; // epoch millis
  dateMaj: number; // epoch millis
  alternatives?: Alternative[];
  prompt?: string;
  sourceVerdict?: string;
  verifieLe?: string | null;
  // Renseigné pour les pages non françaises : le texte a-t-il été traduit ? (sinon, texte d'origine)
  traduit?: boolean;
}

export type NouveauLogiciel = Omit<Logiciel, 'id' | 'dateAjout' | 'dateMaj'>;

// Les fiches CHR n'ont pas à répéter `secteur` : il vaut 'chr' par défaut.
export type NouveauLogicielInput = Omit<NouveauLogiciel, 'secteur'> & { secteur?: Secteur };
// nbConstruits : retours publiés « je l'ai construit » (personnes qui disent l'avoir remplacé).
// Ce que la liste d'accueil affiche : les champs lourds (justification, prompt, alternatives, ce que
// vous perdez) restent côté serveur, sinon les 270+ fiches complètes sont envoyées au navigateur.
export type LogicielListe = Pick<Logiciel, 'id' | 'nom' | 'slug' | 'categorie' | 'secteur' | 'description' | 'domaine' | 'prix' | 'prixMensuel' | 'verdictEditeur'> & {
  displayVerdict: VerdictEditeur;
  totalVotes: number;
  nbConstruits?: number;
};
export type LogicielAvecVerdict = Logiciel & { displayVerdict: VerdictEditeur; totalVotes: number; nbConstruits?: number };
