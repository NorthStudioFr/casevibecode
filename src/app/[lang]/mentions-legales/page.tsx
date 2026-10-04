import { use } from 'react';
import type { Metadata } from 'next';
import { editeur, libelleEditeur } from '@/lib/editeur';
import { alternatesFor, langOf, type Lang } from '@/lib/i18n/config';

const TEXTES = {
  fr: {
    title: 'Mentions légales',
    description: 'Mentions légales du site casevibecode.',
    intro:
      "Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site casevibecode l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.",
    editeurTitre: 'Éditeur du site',
    champs: {
      nom: 'Nom / Dénomination',
      forme: 'Forme juridique',
      siret: 'SIRET',
      ape: 'Code APE',
      resp: 'Responsable de la publication',
      adresse: 'Adresse',
      email: 'Email',
      tva: 'TVA',
    },
    hebergementTitre: 'Hébergement',
    hebergement: (
      <>
        Hébergeur du site (application) : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA — vercel.com
        <br />
        Hébergeur des données (comptes, votes, fiches) : Supabase, Inc. (base de données et authentification Supabase),
        projet configuré sur une région de l&apos;Union européenne (Paris) — supabase.com
      </>
    ),
    domaineTitre: 'Nom de domaine',
    domaine:
      "casevibecode.fr est un nom de domaine enregistré auprès d'OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.",
    conceptionTitre: 'Conception et réalisation',
    conception: (nom: string) => `Le site casevibecode a été conçu et réalisé par ${nom}.`,
    pieTitre: 'Propriété intellectuelle',
    pie: (nom: string) =>
      `L'ensemble des éléments présents sur ce site (textes, code source, structure, identité visuelle) sont protégés par le droit de la propriété intellectuelle et sont la propriété exclusive de ${nom}, sauf mention contraire. Les verdicts, notes et commentaires publiés par les utilisateurs restent la propriété de leurs auteurs ; en les publiant, l'utilisateur autorise ${nom} à les afficher sur le site.`,
    respTitre: 'Responsabilité',
    resp: (nom: string) =>
      `${nom} s'efforce de fournir des informations aussi précises que possible, mais les verdicts affichés (éditeur ou communauté) reflètent des avis, pas une vérité absolue sur les logiciels évoqués. L'éditeur ne pourra être tenu responsable des omissions, inexactitudes ou décisions prises sur la base des informations du site. Le site peut contenir des liens vers des sites externes ; ${nom} ne saurait être tenu responsable de leur contenu.`,
    droitTitre: 'Droit applicable',
    droit:
      'Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.',
    note: null as string | null,
  },
  en: {
    title: 'Legal notice',
    description: 'Legal notice of the casevibecode website.',
    intro:
      'In accordance with French law no. 2004-575 of 21 June 2004 on confidence in the digital economy, users of the casevibecode site are informed of the identity of the parties involved in its creation and operation.',
    editeurTitre: 'Site publisher',
    champs: {
      nom: 'Name',
      forme: 'Legal form',
      siret: 'SIRET',
      ape: 'APE code',
      resp: 'Publication manager',
      adresse: 'Address',
      email: 'Email',
      tva: 'VAT',
    },
    hebergementTitre: 'Hosting',
    hebergement: (
      <>
        Site (application) host: Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA — vercel.com
        <br />
        Data host (accounts, votes, entries): Supabase, Inc. (Supabase database and authentication), project configured
        in a European Union region (Paris) — supabase.com
      </>
    ),
    domaineTitre: 'Domain name',
    domaine: 'casevibecode.fr is a domain name registered with OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.',
    conceptionTitre: 'Design and development',
    conception: (nom: string) => `The casevibecode site was designed and built by ${nom}.`,
    pieTitre: 'Intellectual property',
    pie: (nom: string) =>
      `All elements of this site (text, source code, structure, visual identity) are protected by intellectual property law and are the exclusive property of ${nom}, unless stated otherwise. Verdicts, ratings and comments published by users remain the property of their authors; by publishing them, users authorise ${nom} to display them on the site.`,
    respTitre: 'Liability',
    resp: (nom: string) =>
      `${nom} strives to provide information that is as accurate as possible, but the verdicts shown (editor or community) reflect opinions, not an absolute truth about the software mentioned. The publisher cannot be held liable for omissions, inaccuracies or decisions made on the basis of the site's information. The site may contain links to external sites; ${nom} cannot be held liable for their content.`,
    droitTitre: 'Governing law',
    droit: 'This legal notice is governed by French law. In the event of a dispute, the French courts have sole jurisdiction.',
    note: 'This English text is a courtesy translation; the French version prevails.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  return { title: TEXTES[lang].title, description: TEXTES[lang].description, alternates: alternatesFor(lang, '/mentions-legales') };
}

export default function MentionsLegalesPage({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang: Lang = langOf(params ? use(params) : undefined);
  const x = TEXTES[lang];
  const e = editeur();
  const nomEditeur = libelleEditeur(e);
  // Chaque ligne n'est affichée que si l'information est fournie par l'environnement.
  const lignes: [string, string][] = (
    [
      [x.champs.nom, e.marque && e.nom ? `${e.marque} — ${e.nom}` : (e.marque ?? e.nom)],
      [x.champs.forme, e.forme],
      [x.champs.siret, e.siret],
      [x.champs.ape, e.ape],
      [x.champs.resp, e.nom && e.marque ? `${e.nom}, ${e.marque}` : e.nom],
      [x.champs.adresse, e.adresse],
      [x.champs.email, e.email],
      [x.champs.tva, e.tva],
    ] as [string, string | undefined][]
  ).filter((l): l is [string, string] => Boolean(l[1]));
  const h2 = 'mt-8 font-serif text-xl font-semibold text-slate-800';
  const p = 'mt-3 text-sm text-slate-700';
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl font-semibold text-slate-800">{x.title}</h1>
      {x.note && <p className="mt-2 text-xs text-slate-500">{x.note}</p>}
      <p className="mt-4 text-sm text-slate-600">{x.intro}</p>

      <h2 className={h2}>{x.editeurTitre}</h2>
      <dl className="mt-3 space-y-1 text-sm text-slate-700">
        {lignes.map(([label, valeur]) => (
          <div key={label}>
            <dt className="inline font-medium">{label} : </dt>
            <dd className="inline">{valeur}</dd>
          </div>
        ))}
      </dl>

      <h2 className={h2}>{x.hebergementTitre}</h2>
      <p className={p}>{x.hebergement}</p>

      <h2 className={h2}>{x.domaineTitre}</h2>
      <p className={p}>{x.domaine}</p>

      <h2 className={h2}>{x.conceptionTitre}</h2>
      <p className={p}>{x.conception(nomEditeur)}</p>

      <h2 className={h2}>{x.pieTitre}</h2>
      <p className={p}>{x.pie(nomEditeur)}</p>

      <h2 className={h2}>{x.respTitre}</h2>
      <p className={p}>{x.resp(nomEditeur)}</p>

      <h2 className={h2}>{x.droitTitre}</h2>
      <p className={p}>{x.droit}</p>
    </main>
  );
}
