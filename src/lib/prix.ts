// Ne reconnaît que « [à partir de] N €/mois » exact. Les prix par employé, par
// jour, uniques ou gratuits ne s'additionnent pas honnêtement dans un total
// mensuel : ils restent affichés en texte mais sans valeur chiffrée.
const PRIX_MENSUEL = /^(?:à partir de\s+)?(\d+(?:[.,]\d+)?)\s*€\s*\/\s*mois(?:\s*\(converti de [^)]*\))?$/i;

export function parsePrixMensuel(prix: string | undefined): number | undefined {
  if (!prix) return undefined;
  const match = prix.trim().match(PRIX_MENSUEL);
  if (!match) return undefined;
  const value = Number(match[1].replace(',', '.'));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

// Les prix sont stockés en français (« gratuit (plans payants à partir de 9,99 €/mois) »).
// En anglais on les traduit à l'affichage : seuls quelques motifs existent, tous listés
// dans le test. Un texte inconnu est renvoyé tel quel plutôt que mal traduit.
const MOTS_PRIX: [RegExp, string][] = [
  [/forfaits Pro\/Enterprise sur devis/gi, 'Pro/Enterprise plans on request'],
  [/version payante à partir de/gi, 'paid version from'],
  [/plans payants à partir de/gi, 'paid plans from'],
  [/plans dès/gi, 'plans from'],
  [/options payantes/gi, 'paid options'],
  [/Premium à/g, 'Premium at'],
  [/sur devis/gi, 'on request'],
  [/à partir de/gi, 'from'],
  [/converti de (\d+(?:[.,]\d+)?) \$, cours du (\d+) (\S+) (\d{4})/gi, 'converted from $$$1, rate of $2 $3 $4'],
  [/gratuit/gi, 'free'],
];

export function formatPrix(prix: string | undefined, lang: 'fr' | 'en'): string | undefined {
  if (!prix || lang === 'fr') return prix;
  let sortie = prix;
  for (const [motif, remplacement] of MOTS_PRIX) sortie = sortie.replace(motif, remplacement);
  sortie = sortie
    .replace(/(\d+(?:,\d+)?)\s*€/g, (_, n: string) => `€${n.replace(',', '.')}`)
    .replace(/\/mois/g, '/month')
    .replace(/\/jour/g, '/day')
    .replace(/\/tablette/g, '/tablet')
    .replace(/\/utilisateur/g, '/user')
    .replace(/\/employé/g, '/employee');
  return sortie;
}
