type Priced = { prixMensuel?: number };

export function totalMensuel(logiciels: Priced[]): number {
  return logiciels.reduce(
    (sum, l) =>
      typeof l.prixMensuel === 'number' && Number.isFinite(l.prixMensuel) && l.prixMensuel > 0
        ? sum + l.prixMensuel
        : sum,
    0
  );
}

export function formatEuros(value: number): string {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
}

export function tapeItems(logiciels: (Priced & { nom: string })[]): string[] {
  return logiciels
    .filter((l): l is { nom: string; prixMensuel: number } => typeof l.prixMensuel === 'number' && l.prixMensuel > 0)
    .sort((a, b) => b.prixMensuel - a.prixMensuel)
    .map((l) => `${l.nom.toUpperCase()} −${formatEuros(l.prixMensuel)} €/mois`);
}

// Le ruban défile d'une copie complète par cycle : une durée fixe ferait varier
// la vitesse avec le nombre de fiches. Police mono ≈ 7,9 px par caractère,
// visée ≈ 60 px/s quel que soit le nombre de fiches.
export function tapeDurationSeconds(text: string): number {
  return Math.max(20, Math.round((text.length * 7.9 + 48) / 60));
}
