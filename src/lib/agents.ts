// Chaque agent expose un lien qui ouvre son outil avec le prompt prérempli
// (jamais envoyé automatiquement). Formats repris de canivibecodeit (MIT).
export const AGENTS = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    href: (prompt: string) => `claude-cli://open?q=${encodeURIComponent(prompt)}`,
    newTab: false,
  },
  {
    id: 'codex',
    label: 'Codex',
    href: (prompt: string) => `https://chatgpt.com/codex/deeplink?prompt=${encodeURIComponent(prompt)}`,
    newTab: true,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    href: (prompt: string) => `https://cursor.com/link/prompt?text=${encodeURIComponent(prompt)}`,
    newTab: true,
  },
] as const;
