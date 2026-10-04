// Comparaison de texte insensible aux accents et à la casse : « cegid » trouve « Cégid ».
export function normaliser(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
