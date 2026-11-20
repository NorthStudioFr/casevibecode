import Link from 'next/link';
import type { Metadata } from 'next';
import { alternatesFor, langOf, localePath, type Lang } from '@/lib/i18n/config';
import { editeur } from '@/lib/editeur';
import { OFFRE, OFFRE_PUBLIQUE, PLACES_MAX } from '@/lib/sponsors';

const TEXTES = {
  fr: {
    title: 'Offre éditeur : un emplacement sponsorisé',
    description: "Un emplacement clairement étiqueté « Sponsorisé » sur casevibecode, séparé des verdicts. Les fiches restent gratuites et leur verdict indépendant.",
    back: '← Retour à toutes les fiches',
    heading: 'Offre éditeur',
    intro: "Les fiches ajoutées restent gratuites et leur verdict est indépendant : il ne change jamais avec un paiement. En plus, un emplacement distinct, étiqueté « Sponsorisé », peut être acheté.",
    whatTitle: "Ce que comprend l'emplacement",
    what: [
      `Une des ${PLACES_MAX} places au maximum, sur la page d'accueil, au-dessus de la liste des fiches.`,
      "Le nom de votre outil, une phrase de 140 caractères au plus et un lien vers votre site, avec l'étiquette « Sponsorisé » (lien marqué rel=\"sponsored\").",
      'Une durée convenue par écrit avant le paiement.',
    ],
    notTitle: 'Ce qui n’est pas promis',
    not: [
      'Aucun changement de verdict, de texte de fiche, de classement ni d’alternatives : le verdict reste notre avis indépendant.',
      'Aucune promesse de visites, de clics, d’inscriptions ou de ventes. Nous ne publions aucun chiffre de trafic qui ne soit pas daté et issu de nos propres relevés.',
      'Aucun texte invérifiable (« n°1 », « le meilleur ») : nous relisons la phrase avant publication.',
    ],
    priceTitle: 'Prix',
    price: (n: number) => `${n} € par mois.`,
    priceNone: 'Le tarif est communiqué par écrit, avant tout engagement.',
    pay: 'Payer en ligne',
    condTitle: 'Conditions',
    cond: [
      'Chaque emplacement est examiné avant publication ; nous pouvons refuser ou retirer une mention (outil hors sujet, promesse fausse, contenu illicite).',
      'Si l’emplacement n’est pas mis en ligne dans les 7 jours après paiement, ou si nous le retirons, la période non utilisée est remboursée.',
    ],
    contactTitle: 'Nous écrire',
    contactEmail: (e: string) => `Écrivez-nous à ${e}.`,
    contactNone: "Proposez d'abord votre outil, avec un e-mail de contact facultatif :",
    contactLink: 'Proposer un logiciel',
    free: "Ajouter votre outil à la liste reste gratuit, avec ou sans emplacement sponsorisé.",
  },
  en: {
    title: 'Publisher offer: a sponsored slot',
    description: 'A slot clearly labelled “Sponsored” on casevibecode, kept apart from the verdicts. Listings stay free and their verdict independent.',
    back: '← Back to all listings',
    heading: 'Publisher offer',
    intro: 'Listings added to the site stay free and their verdict is independent: it never changes with a payment. In addition, a separate slot, labelled “Sponsored”, can be bought.',
    whatTitle: 'What the slot includes',
    what: [
      `One of at most ${PLACES_MAX} places, on the home page, above the list of tools.`,
      'Your tool’s name, a sentence of at most 140 characters and a link to your site, with the “Sponsored” label (link marked rel="sponsored").',
      'A duration agreed in writing before payment.',
    ],
    notTitle: 'What is not promised',
    not: [
      'No change to a verdict, a listing’s text, the ranking or the alternatives: the verdict stays our independent opinion.',
      'No promise of visits, clicks, sign-ups or sales. We publish no traffic figure that is not dated and taken from our own records.',
      'No unverifiable claim (“No. 1”, “the best”): we read the sentence before publishing it.',
    ],
    priceTitle: 'Price',
    price: (n: number) => `€${n} per month.`,
    priceNone: 'The price is given in writing, before any commitment.',
    pay: 'Pay online',
    condTitle: 'Terms',
    cond: [
      'Each slot is reviewed before publication; we may refuse or remove a mention (off-topic tool, false claim, unlawful content).',
      'If the slot is not live within 7 days of payment, or if we remove it, the unused period is refunded.',
    ],
    contactTitle: 'Contact us',
    contactEmail: (e: string) => `Write to us at ${e}.`,
    contactNone: 'First suggest your tool, with an optional contact email:',
    contactLink: 'Suggest a tool',
    free: 'Adding your tool to the list stays free, with or without a sponsored slot.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  const x = TEXTES[lang];
  return {
    title: x.title,
    description: x.description,
    alternates: alternatesFor(lang, '/offre-editeur'),
    // Tant que le prix n'est pas fixé, la page n'est pas à référencer.
    robots: OFFRE_PUBLIQUE ? undefined : { index: false, follow: true },
  };
}

export default async function OffreEditeurPage({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang: Lang = langOf(params && (await params));
  const x = TEXTES[lang];
  const e = editeur();
  const h2 = 'mt-8 font-serif text-xl font-semibold text-slate-800';
  const p = 'mt-3 text-sm text-slate-700 leading-relaxed';
  const ul = 'mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 leading-relaxed';
  return (
    <main className="mx-auto min-h-screen max-w-2xl p-8">
      <Link href={localePath(lang, '/')} className="inline-block py-1 text-sm text-slate-500 hover:text-slate-800">
        {x.back}
      </Link>
      <h1 className="mt-4 font-serif text-4xl font-semibold text-slate-800">{x.heading}</h1>
      <p className="mt-3 text-base text-slate-600 leading-relaxed">{x.intro}</p>

      <section>
        <h2 className={h2}>{x.whatTitle}</h2>
        <ul className={ul}>{x.what.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>
      <section>
        <h2 className={h2}>{x.notTitle}</h2>
        <ul className={ul}>{x.not.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>
      <section>
        <h2 className={h2}>{x.priceTitle}</h2>
        <p className={p}>{OFFRE.prixMensuelEur ? x.price(OFFRE.prixMensuelEur) : x.priceNone}</p>
        {OFFRE.lienPaiement && OFFRE_PUBLIQUE && (
          <p className={p}>
            <a href={OFFRE.lienPaiement} target="_blank" rel="noopener noreferrer" className="underline hover:text-secondary">
              {x.pay}
            </a>
          </p>
        )}
      </section>
      <section>
        <h2 className={h2}>{x.condTitle}</h2>
        <ul className={ul}>{x.cond.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>
      <section>
        <h2 className={h2}>{x.contactTitle}</h2>
        {e.email ? (
          <p className={p}>{x.contactEmail(e.email)}</p>
        ) : (
          <p className={p}>
            {x.contactNone}{' '}
            <Link href={localePath(lang, '/proposer')} className="underline hover:text-secondary">
              {x.contactLink}
            </Link>
            .
          </p>
        )}
        <p className={p}>{x.free}</p>
      </section>
    </main>
  );
}
