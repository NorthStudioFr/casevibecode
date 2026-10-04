import { getDict } from './i18n/dictionaries';
import type { Lang } from './i18n/config';

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

export function formatEuros(value: number, lang: Lang = 'fr'): string {
  return value.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 2 });
}

export function tapeItems(logiciels: (Priced & { nom: string })[], lang: Lang = 'fr'): string[] {
  return logiciels
    .filter((l): l is { nom: string; prixMensuel: number } => typeof l.prixMensuel === 'number' && l.prixMensuel > 0)
    .sort((a, b) => b.prixMensuel - a.prixMensuel)
    .map((l) => getDict(lang).ticker.tapeItem(l.nom, formatEuros(l.prixMensuel, lang)));
}

// Le ruban défile d'une copie complète par cycle : une durée fixe ferait varier
// la vitesse avec le nombre de fiches. Police mono ≈ 7,9 px par caractère,
// visée ≈ 60 px/s quel que soit le nombre de fiches.
export function tapeDurationSeconds(text: string): number {
  return Math.max(20, Math.round((text.length * 7.9 + 48) / 60));
}
