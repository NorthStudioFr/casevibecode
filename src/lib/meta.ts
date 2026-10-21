// Une meta description de plus de ~155 caractères est tronquée dans les résultats : on coupe au dernier mot.
export function tronquer(texte: string, max = 155): string {
  if (texte.length <= max) return texte;
  const coupe = texte.slice(0, max - 1);
  return `${coupe.slice(0, coupe.lastIndexOf(' ') > 40 ? coupe.lastIndexOf(' ') : coupe.length).replace(/[\s.,;:]+$/, '')}…`;
}
