import type { Metadata } from 'next';
import { getLogiciels, getVoteCounts } from '@/lib/logiciels-server';
import { computeVerdictDisplay } from '@/lib/verdict';
import type { LogicielAvecVerdict } from '@/types/logiciel';
import { LogicielGrid } from '@/components/LogicielGrid';
import { NewsletterForm } from '@/components/NewsletterForm';
import { Ticker } from '@/components/Ticker';
import { itemListJsonLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Regenerate at most once every 5 min (ISR) instead of rendering per
// request: this page's own regeneration runs one vote-count query per
// fiche (133+), so a crawl spike or a traffic spike would multiply the
// database work at a shorter window.
// Admin edits and new votes show up within 5 min. VoteButton updates its
// own count optimistically, so a voter still sees their vote immediately.
export const revalidate = 300;

export default async function Page() {
  const fiches = await getLogiciels();
  // Show the same community-aware verdict as the fiche page, not the raw
  // editor verdict. This is N+1 work (getVoteCounts = one RPC per fiche);
  // amortized by the page's revalidation window. Revisit (one grouped query)
  // if the catalogue grows significantly.
  const logiciels: LogicielAvecVerdict[] = await Promise.all(
    fiches.map(async (l) => {
      const counts = await getVoteCounts(l.id);
      const display = computeVerdictDisplay(l.verdictEditeur, counts);
      return { ...l, displayVerdict: display.verdict, totalVotes: display.totalVotes };
    })
  );

  return (
    <>
      <Ticker logiciels={logiciels} />
      <main className="min-h-screen p-8 max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl font-semibold text-slate-800">casevibecode</h1>
        <p className="mt-2 text-slate-600">
          {logiciels.length} logiciels, du CHR aux outils du quotidien. Un verdict par outil : est-ce remplaçable par du sur-mesure, ou pas ?
        </p>
        <div className="mt-8">
          <LogicielGrid logiciels={logiciels} />
        </div>
        <footer className="mt-16 border-t border-slate-200 pt-6">
          <NewsletterForm />
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(logiciels)) }}
        />
      </main>
    </>
  );
}
