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
    const { generateMetadata } = await import('./layout');
    const metadata = await generateMetadata({ params: Promise.resolve({ lang: 'fr' }) });
    expect(metadata.title).toEqual({
      default: 'casevibecode — le verdict sur vos logiciels : remplaçables ou pas ?',
      template: '%s | casevibecode',
    });
    expect(metadata.description).toMatch(/logiciels/i);
    expect(JSON.stringify(metadata)).not.toMatch(/create next app/i);
  });

  it('declares English metadata for /en', async () => {
    const { generateMetadata } = await import('./layout');
    const metadata = await generateMetadata({ params: Promise.resolve({ lang: 'en' }) });
    expect(metadata.title).toEqual({
      default: 'casevibecode — the verdict on your software: replaceable or not?',
      template: '%s | casevibecode',
    });
    expect(metadata.openGraph).toMatchObject({ locale: 'en_US' });
  });

  it('renders <html lang="fr"> and <html lang="en">', async () => {
    const RootLayout = (await import('./layout')).default;
    const fr = await RootLayout({ children: null, params: Promise.resolve({ lang: 'fr' }) } as never);
    expect(fr.props.lang).toBe('fr');
    const en = await RootLayout({ children: null, params: Promise.resolve({ lang: 'en' }) } as never);
    expect(en.props.lang).toBe('en');
  });

  it('answers 404 for an unknown language', async () => {
    const RootLayout = (await import('./layout')).default;
    await expect(RootLayout({ children: null, params: Promise.resolve({ lang: 'de' }) } as never)).rejects.toThrow(/NEXT_NOT_FOUND|404/);
  });
});
