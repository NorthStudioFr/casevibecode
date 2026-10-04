import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { editeur } from "@/lib/editeur";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getDict } from "@/lib/i18n/dictionaries";
import { HTML_LANG, LANGS, OG_LOCALE, isLang, langOf, localePath } from "@/lib/i18n/config";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-serif",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  const { site } = getDict(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.titleDefault, template: site.titleTemplate },
    description: site.description,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[lang],
      siteName: SITE_NAME,
      url: localePath(lang, "/"),
      title: site.titleDefault,
      description: site.description,
    },
    twitter: { card: "summary_large_image", title: site.titleDefault, description: site.description },
    verification: {
      google: "5g87acDF9CwHLtUZPMkeIqWMAYOVgTkVVblVa4iRCKI",
    },
  };
}

function jsonLdFor(lang: ReturnType<typeof langOf>) {
  const { site } = getDict(lang);
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL + localePath(lang, "/"),
      description: site.description,
      inLanguage: HTML_LANG[lang],
    },
    // L'éditeur n'est déclaré que si l'environnement le fournit.
    ...(editeur().marque
      ? [{ "@context": "https://schema.org", "@type": "Organization", name: editeur().marque, url: editeur().url }]
      : []),
  ];
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: brut } = await params;
  if (!isLang(brut)) notFound();
  const lang = brut;
  return (
    <html
      lang={lang}
      data-theme="dark"
      suppressHydrationWarning
      className={`${jetBrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-slate-800">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFor(lang)) }} />
        <LocaleProvider lang={lang}>
        <AuthProvider>
          <SiteHeader lang={lang} />
          {/* min-w-0 overrides the flex item's default content-based min-width:
              without it, any unbreakable inline content inside a page forces
              body (flex flex-col) wider than the viewport on mobile. */}
          <div className="min-w-0 flex-1">{children}</div>
        </AuthProvider>
        <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
