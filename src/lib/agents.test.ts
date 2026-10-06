import { AGENTS } from './agents';

describe('AGENTS', () => {
  const prompt = 'Construis un outil & "ça" 100%';
  const enc = encodeURIComponent(prompt);

  it('builds the deep link of each agent with the encoded prompt', () => {
    const byId = Object.fromEntries(AGENTS.map((a) => [a.id, a]));
    expect(byId.claude.href(prompt)).toBe(`https://claude.ai/new?q=${enc}`);
    expect(byId['claude-code'].href(prompt)).toBe(`claude-cli://open?q=${enc}`);
    expect(byId.codex.href(prompt)).toBe(`https://chatgpt.com/codex/deeplink?prompt=${enc}`);
    expect(byId.cursor.href(prompt)).toBe(`https://cursor.com/link/prompt?text=${enc}`);
  });

  it('opens web launchers in a new tab but not the local Claude Code scheme', () => {
    expect(AGENTS.find((a) => a.id === 'claude-code')?.newTab).toBe(false);
    expect(AGENTS.find((a) => a.id === 'claude')?.newTab).toBe(true);
    expect(AGENTS.find((a) => a.id === 'codex')?.newTab).toBe(true);
    expect(AGENTS.find((a) => a.id === 'cursor')?.newTab).toBe(true);
  });
});

describe('AGENTS on mobile', () => {
  it('only hides the local Claude Code scheme', () => {
    expect(AGENTS.filter((a) => a.desktopOnly).map((a) => a.id)).toEqual(['claude-code']);
  });
});
