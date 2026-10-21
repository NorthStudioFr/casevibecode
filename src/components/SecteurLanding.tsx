import Link from 'next/link';
import type { Metadata } from 'next';
import type { Lang } from '@/lib/i18n/config';
import { alternatesFor, localePath } from '@/lib/i18n/config';
import { getDict } from '@/lib/i18n/dictionaries';
import { SECTEURS, SECTEUR_PAGE } from '@/lib/secteurs';
import { chargerListe } from '@/lib/liste';
import { getLogiciels } from '@/lib/logiciels-server';
import { formatEuros, totalMensuel } from '@/lib/ticker';
import { collectionPageJsonLd, pageBreadcrumbJsonLd } from '@/lib/jsonld';
import type { Secteur, VerdictEditeur } from '@/types/logiciel';
import { LogicielGrid } from '@/components/LogicielGrid';
import { VerdictBadge } from '@/components/VerdictBadge';
import { NewsletterForm } from '@/components/NewsletterForm';

export function secteurMetadata(lang: Lang, secteur: Secteur): Metadata {
  const t = getDict(lang).secteurPage[secteur];
  const chemin = SECTEUR_PAGE[secteur];
  return {
    title: t.title,
    description: t.description,
    alternates: alternatesFor(lang, chemin),
    openGraph: { type: 'website', title: t.title, description: t.description, url: localePath(lang, chemin) },
  };
}

// Page d'atterrissage d'un public (restauration, outils du quotidien) : sa question, ses chiffres réels, sa
// liste filtrable. Même catalogue et même système graphique que le reste du site : le secteur se lit par le
// titre et l'étiquette, pas par un thème propre.
export async function SecteurLanding({ lang, secteur }: { lang: Lang; secteur: Secteur }) {
  const t = getDict(lang);
  const page = t.secteurPage[secteur];
  const chemin = SECTEUR_PAGE[secteur];
  const [logiciels, fiches] = await Promise.all([chargerListe(lang, secteur), getLogiciels(lang)]);
  const dateMaj = Math.max(0, ...fiches.filter((l) => l.secteur === secteur).map((l) => l.dateMaj));
  const parVerdict = (v: VerdictEditeur) => logiciels.filter((l) => l.displayVerdict === v).length;
  const autre = SECTEURS.find((s) => s !== secteur) as Secteur;

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <h1 className="font-serif text-4xl font-semibold text-slate-800">{page.heading}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{page.intro}</p>
      <p className="mt-3 text-sm text-slate-500">{t.secteurPage.stats(logiciels.length, formatEuros(totalMensuel(logiciels), lang))}</p>

      <section aria-label={t.secteurPage.verdictsTitle} className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        {(['YES', 'KINDA', 'NOT_REALLY'] as VerdictEditeur[]).map((v) => (
          <span key={v} className="inline-flex items-center gap-2">
            <VerdictBadge verdict={v} />
            <span>{parVerdict(v)}</span>
          </span>
        ))}
      </section>

      <div className="mt-8">
        <LogicielGrid logiciels={logiciels} />
      </div>

      <p className="mt-10 text-sm text-slate-600">
        {t.secteurPage.alsoSee} :{' '}
        <Link href={localePath(lang, SECTEUR_PAGE[autre])} className="underline hover:text-primary">
          {t.secteurPage[autre].crumb}
        </Link>
        {' · '}
        <Link href={localePath(lang, '/methode')} className="underline hover:text-primary">
          {t.secteurPage.method}
        </Link>
      </p>
      <footer className="mt-10 border-t border-slate-200 pt-6">
        <NewsletterForm />
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageJsonLd({ lang, chemin, name: page.title, description: page.description, logiciels, dateMaj }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(lang, chemin, page.crumb)) }}
      />
    </main>
  );
}
