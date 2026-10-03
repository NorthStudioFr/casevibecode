export type ValeurVote = 'remplace' | 'pas_remplacable';

export interface Vote {
  userId: string;
  logicielId: string;
  valeur: ValeurVote;
  horodatage: number; // epoch millis
}
