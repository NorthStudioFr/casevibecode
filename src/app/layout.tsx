import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { THEME_SCRIPT } from "@/components/ThemeToggle";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { editeur } from "@/lib/editeur";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-serif",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Logiciels de restauration et d'hôtellerie (caisse, réservation, livraison, compta) et outils du quotidien (Notion, Canva, Shopify…) : lesquels un outil sur mesure peut-il remplacer ? Verdict éditeur et vote de la communauté.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "casevibecode — le verdict sur vos logiciels : remplaçables ou pas ?",
    template: "%s | casevibecode",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "casevibecode — le verdict sur vos logiciels : remplaçables ou pas ?",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "casevibecode — le verdict sur vos logiciels : remplaçables ou pas ?",
    description: DESCRIPTION,
  },
  verification: {
    google: "5g87acDF9CwHLtUZPMkeIqWMAYOVgTkVVblVa4iRCKI",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DESCRIPTION,
    inLanguage: "fr-FR",
  },
  // L'éditeur n'est déclaré que si l'environnement le fournit.
  ...(editeur().marque
    ? [{ "@context": "https://schema.org", "@type": "Organization", name: editeur().marque, url: editeur().url }]
    : []),
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      suppressHydrationWarning
      className={`${jetBrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-slate-800">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <AuthProvider>
          <SiteHeader />
          {/* min-w-0 overrides the flex item's default content-based min-width:
              without it, any unbreakable inline content inside a page forces
              body (flex flex-col) wider than the viewport on mobile. */}
          <div className="min-w-0 flex-1">{children}</div>
        </AuthProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
