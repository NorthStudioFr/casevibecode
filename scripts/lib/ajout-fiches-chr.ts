const VERDICTS = ['YES', 'KINDA', 'NOT_REALLY'];

// Contrôles d'une fiche CHR à insérer (forme de la base : snake_case).
export function problemesNouvelleFiche(f: Record<string, unknown>): string[] {
  const p: string[] = [];
  for (const k of ['slug', 'nom', 'categorie', 'description', 'justification_editeur', 'domaine']) {
    if (typeof f[k] !== 'string' || !(f[k] as string).trim()) p.push(`« ${k} » manquant`);
  }
  if (f.secteur !== 'chr' && f.secteur !== 'saas') p.push('secteur ≠ chr/saas');
  if (!VERDICTS.includes(f.verdict_editeur as string)) p.push('verdict invalide');
  if (typeof f.slug === 'string' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) p.push('slug invalide');
  if (f.source_verdict !== 'casevibecode') p.push('source_verdict attendu : casevibecode');
  return p;
}
