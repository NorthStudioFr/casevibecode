import { describe, it, expect, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  JetBrains_Mono: () => ({ variable: 'font-sans' }),
  Space_Grotesk: () => ({ variable: 'font-serif' }),
}));
vi.mock('@/lib/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('./globals.css', () => ({}));

describe('Root layout', () => {
  it('declares real French site metadata instead of the create-next-app defaults', async () => {
    const { metadata } = await import('./layout');
    expect(metadata.title).toEqual({
      default: 'casevibecode — le verdict sur vos logiciels : remplaçables ou pas ?',
      template: '%s | casevibecode',
    });
    expect(metadata.description).toMatch(/logiciels/i);
    expect(JSON.stringify(metadata)).not.toMatch(/create next app/i);
  });

  it('renders <html lang="fr">', async () => {
    const RootLayout = (await import('./layout')).default;
    const tree = RootLayout({ children: null, params: Promise.resolve({}) } as never);
    expect(tree.props.lang).toBe('fr');
  });
});
