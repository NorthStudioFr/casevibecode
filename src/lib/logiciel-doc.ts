import type { Alternative, Categorie, Logiciel, NouveauLogicielInput, Secteur, VerdictEditeur } from '@/types/logiciel';

export interface LogicielRow {
  slug: string;
  nom: string;
  categorie: Categorie;
  secteur: Secteur;
  description: string;
  verdict_editeur: VerdictEditeur;
  justification_editeur: string;
  domaine: string;
  prix: string | null;
  prix_mensuel: number | string | null;
  ce_que_vous_perdez: string[] | null;
  alternatives: Alternative[] | null;
  prompt: string | null;
  source_verdict: string | null;
  date_ajout: string;
  date_maj: string;
}

function toEpochMillis(iso: string): number {
  return new Date(iso).getTime();
}

export function mapLogicielRow(row: LogicielRow): Logiciel {
  const logiciel: Logiciel = {
    id: row.slug,
    nom: row.nom,
    slug: row.slug,
    categorie: row.categorie,
    secteur: row.secteur || 'chr',
    description: row.description,
    verdictEditeur: row.verdict_editeur,
    justificationEditeur: row.justification_editeur,
    domaine: row.domaine,
    dateAjout: toEpochMillis(row.date_ajout),
    dateMaj: toEpochMillis(row.date_maj),
  };

  if (row.prix) logiciel.prix = row.prix;
  if (row.prix_mensuel !== null) logiciel.prixMensuel = Number(row.prix_mensuel);
  if (row.ce_que_vous_perdez) logiciel.ceQueVousPerdez = row.ce_que_vous_perdez;
  if (row.alternatives) logiciel.alternatives = row.alternatives;
  if (row.prompt) logiciel.prompt = row.prompt;
  if (row.source_verdict) logiciel.sourceVerdict = row.source_verdict;

  return logiciel;
}

export function mapNouveauLogicielToRow(logiciel: NouveauLogicielInput): Omit<LogicielRow, 'date_ajout' | 'date_maj'> {
  return {
    slug: logiciel.slug,
    nom: logiciel.nom,
    categorie: logiciel.categorie,
    secteur: logiciel.secteur ?? 'chr',
    description: logiciel.description,
    verdict_editeur: logiciel.verdictEditeur,
    justification_editeur: logiciel.justificationEditeur,
    domaine: logiciel.domaine,
    prix: logiciel.prix ?? null,
    prix_mensuel: logiciel.prixMensuel ?? null,
    ce_que_vous_perdez: logiciel.ceQueVousPerdez ?? null,
    alternatives: logiciel.alternatives ?? null,
    prompt: logiciel.prompt ?? null,
    source_verdict: logiciel.sourceVerdict ?? null,
  };
}
