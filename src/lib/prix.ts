// Ne reconnaît que « [à partir de] N €/mois » exact. Les prix par employé, par
// jour, uniques ou gratuits ne s'additionnent pas honnêtement dans un total
// mensuel : ils restent affichés en texte mais sans valeur chiffrée.
const PRIX_MENSUEL = /^(?:à partir de\s+)?(\d+(?:[.,]\d+)?)\s*€\s*\/\s*mois$/i;

export function parsePrixMensuel(prix: string | undefined): number | undefined {
  if (!prix) return undefined;
  const match = prix.trim().match(PRIX_MENSUEL);
  if (!match) return undefined;
  const value = Number(match[1].replace(',', '.'));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}
