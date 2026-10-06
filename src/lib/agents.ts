// Chaque agent expose un lien qui ouvre son outil avec le prompt prérempli
// (jamais envoyé automatiquement). Formats repris de canivibecodeit (MIT).
// `desktopOnly` : le schéma claude-cli:// n'est enregistré que par Claude Code
// sur ordinateur ; sur mobile le lien ne ferait rien, on masque le bouton.
export const AGENTS = [
  {
    id: 'claude',
    label: 'Claude',
    href: (prompt: string) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    newTab: true,
    desktopOnly: false,
  },
  {
    id: 'claude-code',
    label: 'Claude Code',
    href: (prompt: string) => `claude-cli://open?q=${encodeURIComponent(prompt)}`,
    newTab: false,
    desktopOnly: true,
  },
  {
    id: 'codex',
    label: 'Codex',
    href: (prompt: string) => `https://chatgpt.com/codex/deeplink?prompt=${encodeURIComponent(prompt)}`,
    newTab: true,
    desktopOnly: false,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    href: (prompt: string) => `https://cursor.com/link/prompt?text=${encodeURIComponent(prompt)}`,
    newTab: true,
    desktopOnly: false,
  },
] as const;
