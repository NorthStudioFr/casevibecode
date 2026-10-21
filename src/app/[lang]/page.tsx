import type { Metadata } from 'next';
import { alternatesFor, langOf, localePath } from '@/lib/i18n/config';
import { getDict } from '@/lib/i18n/dictionaries';
import Link from 'next/link';
import { chargerListe } from '@/lib/liste';
import { SECTEURS, SECTEUR_PAGE } from '@/lib/secteurs';
import { LogicielGrid } from '@/components/LogicielGrid';
import { NewsletterForm } from '@/components/NewsletterForm';
import { Ticker } from '@/components/Ticker';
import { itemListJsonLd } from '@/lib/jsonld';

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  return { alternates: alternatesFor(langOf(await params), '/') };
}

// Regenerate at most once an hour (ISR) instead of rendering per
// request: this page's own regeneration runs one vote-count query per
// fiche (133+), so a crawl spike or a traffic spike would multiply the
// database work at a shorter window.
// Admin edits and new votes show up within an hour. VoteButton updates its
// own count optimistically, so a voter still sees their vote immediately.
export const revalidate = 3600;

export default async function Page({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang = langOf(params && (await params));
  const t = getDict(lang);
  const logiciels = await chargerListe(lang);

  return (
    <>
      <Ticker logiciels={logiciels} />
      <main className="min-h-screen p-8 max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl font-semibold text-slate-800">casevibecode</h1>
        <p className="mt-2 text-slate-600">
          {t.home.intro(logiciels.length)}
        </p>
        <nav aria-label={t.secteurPage.entryLabel} className="mt-5 grid gap-3 sm:grid-cols-2">
          {SECTEURS.map((s) => (
            <Link
              key={s}
              href={localePath(lang, SECTEUR_PAGE[s])}
              className="rounded-sm border border-slate-200 p-4 transition-colors hover:border-primary"
            >
              <span className="block text-sm text-slate-500">
                {t.secteur[s]} · {logiciels.filter((l) => l.secteur === s).length}
              </span>
              <span className="mt-1 block font-serif text-lg font-semibold text-slate-800">{t.secteurPage[s].heading} →</span>
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <LogicielGrid logiciels={logiciels} />
        </div>
        <footer className="mt-16 border-t border-slate-200 pt-6">
          <NewsletterForm />
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(logiciels, lang)) }}
        />
      </main>
    </>
  );
}
