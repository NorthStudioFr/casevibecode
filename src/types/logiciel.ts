export type Categorie = 
  | 'caisse' | 'reservation' | 'livraison' | 'compta' | 'autre'
  | 'finance-compta' | 'rh-paie' | 'marketing' | 'vente-crm' 
  | 'communication' | 'productivite' | 'ecommerce' | 'assurance-sante' 
  | 'dev-tools' | 'design' | 'notes' | 'evenementiel'
  | 'hotellerie' | 'hygiene' | 'stocks' | 'avis' | 'commande' | 'pourboire' | 'fidelite' | 'achats' | 'paiement' | 'reseau';

export type Secteur = 'chr' | 'saas';
export type VerdictEditeur = 'YES' | 'KINDA' | 'NOT_REALLY';

export type TypeAlternative = 'open-source' | 'gratuit' | 'plus-petit';

export interface Alternative {
  nom: string;
  url: string;
  type: TypeAlternative;
  description: string;
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
  // Renseigné pour les pages non françaises : le texte a-t-il été traduit ? (sinon, texte d'origine)
  traduit?: boolean;
}

export type NouveauLogiciel = Omit<Logiciel, 'id' | 'dateAjout' | 'dateMaj'>;

// Les fiches CHR n'ont pas à répéter `secteur` : il vaut 'chr' par défaut.
export type NouveauLogicielInput = Omit<NouveauLogiciel, 'secteur'> & { secteur?: Secteur };
export type LogicielAvecVerdict = Logiciel & { displayVerdict: VerdictEditeur; totalVotes: number };
