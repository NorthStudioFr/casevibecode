import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLogicielBySlug, getVoteCounts, getLogiciels, getRetours } from '@/lib/logiciels-server';
import { computeVerdictDisplay } from '@/lib/verdict';
import { relatedFiches } from '@/lib/related';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { SITE_URL } from '@/lib/site';
import { getDict } from '@/lib/i18n/dictionaries';
import { langOf, localePath, type Lang } from '@/lib/i18n/config';
import { traductionDe } from '@/lib/traductions';
import { formatPrix } from '@/lib/prix';
import { ShareOnX } from '@/components/ShareOnX';
import { CeQueVousPerdez } from '@/components/CeQueVousPerdez';
import { VerdictBadge } from '@/components/VerdictBadge';
import { VoteButton } from '@/components/VoteButton';
import { AlternativesPreview } from '@/components/AlternativesPreview';
import { PromptBlock } from '@/components/PromptBlock';
import { FAQ } from '@/components/FAQ';
import { CtaEditeur } from '@/components/CtaEditeur';
import { NewsletterForm } from '@/components/NewsletterForm';
import { LogoEditeur } from '@/components/LogoEditeur';
import { RetoursFiche } from '@/components/RetoursFiche';

// Regenerate at most once every 5 min (ISR) instead of rendering per
// request, to keep database reads within the free-plan limits under
// crawl/traffic spikes. Admin edits and new votes show up within 5 min.
// VoteButton updates its own count optimistically, so a voter still sees
// their vote immediately.
export const revalidate = 300;

// Required for `revalidate` to actually cache this dynamic route: without
// generateStaticParams the route stays dynamically rendered on every request
// (see Next's generate-static-params docs, "All paths at runtime"). An empty
// list renders each fiche on its first visit rather than at build time.
export async function generateStaticParams() {
  return [];
}

// Deduplicates the database lookup between generateMetadata and the page
// within a single render.
const getFiche = cache(getLogicielBySlug);

type Props = { params: Promise<{ lang?: string; slug: string }> };

// Les liens hreflang et l'indexation ne concernent que les fiches réellement traduites.
function alternatesFiche(lang: Lang, slug: string) {
  const chemin = `/logiciel/${slug}`;
  const traduite = Boolean(traductionDe(slug, 'en'));
  return {
    canonical: localePath(lang, chemin),
    ...(traduite
      ? { languages: { fr: localePath('fr', chemin), en: localePath('en', chemin), 'x-default': localePath('fr', chemin) } }
      : {}),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  const lang = langOf({ lang: langParam });
  const t = getDict(lang);
  const logiciel = await getFiche(slug, lang);
  if (!logiciel) {
    return { title: t.fiche.notFound };
  }
  const title = t.fiche.titleSuffix(logiciel.nom);
  const description = logiciel.description || t.fiche.fallbackDescription(logiciel.nom);
  return {
    title,
    description,
    alternates: alternatesFiche(lang, slug),
    openGraph: { type: 'website', title, description, url: localePath(lang, `/logiciel/${slug}`) },
    twitter: { card: 'summary_large_image', title, description },
    // Page anglaise dont le texte n'est pas encore traduit : on évite le contenu dupliqué.
    ...(lang !== 'fr' && logiciel.traduit === false ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function FicheLogicielPage({ params }: Props) {
  const { lang: langParam, slug } = await params;
  const lang = langOf({ lang: langParam });
  const t = getDict(lang);
  const href = (chemin: string) => localePath(lang, chemin);
  const logiciel = await getFiche(slug, lang);
  if (!logiciel) notFound();

  const [counts, tousLogiciels, retours] = await Promise.all([getVoteCounts(logiciel.id), getLogiciels(lang), getRetours(logiciel.id)]);
  const display = computeVerdictDisplay(logiciel.verdictEditeur, counts);

  // Alphabetical order gives a stable, predictable prev/next sequence
  // regardless of the database's read order.
  const tries = [...tousLogiciels].sort((a, b) => a.nom.localeCompare(b.nom, lang));
  const index = tries.findIndex((l) => l.id === logiciel.id);
  const precedent = index > 0 ? tries[index - 1] : null;
  const suivant = index >= 0 && index < tries.length - 1 ? tries[index + 1] : null;

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <Link href={href('/')} className="text-sm text-slate-500 hover:text-slate-800">
        {t.fiche.back}
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <LogoEditeur domaine={logiciel.domaine} taille={48} />
        <h1 className="font-serif text-4xl font-semibold text-slate-800">{logiciel.nom}</h1>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <VerdictBadge verdict={display.verdict} big />
        {logiciel.prix && <span className="text-sm text-slate-700">{formatPrix(logiciel.prix, lang)}</span>}
        <span className="text-sm text-slate-500">
          {display.source === 'communaute'
            ? t.fiche.sourceCommunity
            : logiciel.sourceVerdict === 'canivibecodeit'
              ? t.fiche.sourceCanivibecodeit
              : t.fiche.sourceEditor}{' '}
          · {t.fiche.votes(display.totalVotes)}
        </span>
      </div>
      {logiciel.sourceVerdict === 'canivibecodeit' && display.source !== 'communaute' && (
        <p className="mt-2 text-xs text-slate-500">
          {t.fiche.attributionBefore}{' '}
          <a
            href="https://canivibecodeit.com"
            className="underline hover:text-slate-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            canivibecodeit.com
          </a>{' '}
          {t.fiche.attributionAfter}
        </p>
      )}
      <p className="mt-4 text-slate-700">{logiciel.description}</p>
      <p className="mt-4 text-slate-700">{logiciel.justificationEditeur}</p>
      <CeQueVousPerdez items={logiciel.ceQueVousPerdez} />
      <AlternativesPreview nom={logiciel.nom} slug={logiciel.slug} alternatives={logiciel.alternatives} />
      {display.verdict !== 'NOT_REALLY' && <PromptBlock logiciel={logiciel} />}
      <div className="mt-6">
        <VoteButton logicielId={logiciel.id} initialCounts={counts} />
      </div>
      <div className="mt-4">
        <ShareOnX
          nom={logiciel.nom}
          verdictLabel={t.verdict[display.verdict]}
          url={`${SITE_URL}${href(`/logiciel/${logiciel.slug}`)}`}
        />
      </div>
      <div className="mt-10">
        <NewsletterForm />
      </div>
      <FAQ logiciel={logiciel} verdict={display.verdict} />
      <RetoursFiche logicielId={logiciel.id} retours={retours} />
      <div className="mt-10">
        <CtaEditeur lang={lang} secteur={logiciel.secteur} />
      </div>
      <section className="mt-10 border-t border-slate-200 pt-6">
        <h2 className="font-serif text-xl font-semibold text-slate-800">{t.fiche.related}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {relatedFiches(tousLogiciels, logiciel).map((l) => (
            <li key={l.id}>
              <Link href={href(`/logiciel/${l.slug}`)} className="text-slate-700 hover:text-primary">
                {l.nom} <span className="text-slate-500">· {formatPrix(l.prix, lang) ?? t.categories[l.categorie]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <nav className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6 text-sm">
        {precedent ? (
          <Link href={href(`/logiciel/${precedent.slug}`)} className="text-slate-600 hover:text-slate-900">
            ← {precedent.nom}
          </Link>
        ) : (
          <span />
        )}
        {suivant ? (
          <Link href={href(`/logiciel/${suivant.slug}`)} className="text-slate-600 hover:text-slate-900 text-right">
            {suivant.nom} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(logiciel.nom, logiciel.slug, lang)) }}
      />
    </main>
  );
}
