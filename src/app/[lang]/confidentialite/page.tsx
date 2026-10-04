import { use } from 'react';
import type { Metadata } from 'next';
import { editeur, libelleEditeur } from '@/lib/editeur';
import { alternatesFor, langOf, type Lang } from '@/lib/i18n/config';

const TEXTES = {
  fr: {
    title: 'Politique de confidentialité',
    description: 'Comment casevibecode collecte et utilise les données des comptes, des votes et de la newsletter.',
    intro: (responsable: string) =>
      `Cette page explique quelles données casevibecode collecte, pourquoi, et comment les exercer vos droits. Le responsable du traitement est ${responsable}.`,
    contactDefaut: "l'adresse indiquée dans les mentions légales",
    collecteesTitre: 'Quelles données sont collectées',
    compteTitre: 'Compte (connexion par email ou Google)',
    compte: (editeurNom: string) =>
      `Email, et pour un compte Google : nom et photo de profil si votre compte Google en fournit une. Le mot de passe (connexion par email) est géré par le service d'authentification de Supabase et n'est jamais stocké en clair par ${editeurNom}. La connexion est réservée à l'administration du site : voter ne demande aucun compte.`,
    votesTitre: 'Votes communautaires',
    votes:
      "Voter ne demande ni compte ni email. Lors de votre vote, une empreinte chiffrée (hachage cryptographique salé) de votre adresse IP est enregistrée. L'adresse IP brute n'est jamais stockée ni lisible. Cette empreinte permet de limiter strictement à un seul vote par utilisateur et par fiche, afin de prévenir la fraude.",
    newsletterTitre: 'Newsletter',
    newsletter: "Votre email, si vous vous inscrivez au formulaire de newsletter du site.",
    contribTitre: 'Retours et propositions de logiciels',
    contrib:
      "Si vous envoyez un retour ou proposez un logiciel : le texte que vous écrivez, le lien éventuel, la langue de la page et la date. Aucun nom ni e-mail n'est demandé : n'en mettez pas dans votre texte. Un retour n'est publié qu'après relecture, sans nom d'auteur. Une empreinte chiffrée de votre adresse IP est conservée 13 mois contre les abus.",
    auditTitre: 'Mon audit',
    audit: "Le calcul de la page « Mon audit » se fait dans votre navigateur : la sélection n'est ni envoyée ni enregistrée. Le lien de partage contient seulement les noms des outils cochés.",
    baseTitre: 'Pourquoi, et sur quelle base légale',
    base: [
      "Le traitement de l'empreinte IP pour les votes repose sur notre ",
      'intérêt légitime',
      " (lutte contre la fraude et maintien de l'intégrité des compteurs). Les données de compte (administration) sont traitées pour fournir le service demandé. L'email de newsletter est traité sur la base de votre ",
      'consentement',
      " ; vous pouvez vous désinscrire à tout moment.",
    ],
    destTitre: 'Qui reçoit ces données',
    dest: "Vos données sont hébergées par Supabase (base de données et authentification), qui agit comme sous-traitant ; le projet est configuré sur une région de l'Union européenne (Paris). Le site lui-même est hébergé par Vercel Inc. L'envoi de la newsletter passe par Resend. Vos données ne sont ni vendues, ni cédées, ni utilisées à des fins commerciales non consenties.",
    dureeTitre: 'Combien de temps sont-elles conservées',
    duree: (contact: string) => [
      "Les données de compte sont conservées tant que votre compte existe. L'empreinte IP des votes est conservée pour une durée maximale de ",
      '13 mois',
      ` (une tâche automatisée de purge supprime régulièrement les votes plus anciens). Les emails de newsletter sont conservés jusqu'à votre désinscription. Vous pouvez demander la suppression de votre compte et de vos données à tout moment en écrivant à ${contact}.`,
    ],
    droitsTitre: 'Vos droits',
    droits: (contact: string) =>
      `Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression, de limitation et d'opposition concernant vos données, exerçable en écrivant à ${contact}. Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (cnil.fr).`,
    cookiesTitre: 'Cookies',
    cookies:
      "casevibecode n'utilise aucun cookie publicitaire, aucun outil de mesure d'audience, et ne dépose aucun cookie ou stockage local pour les votes (système sans cookie limité par empreinte IP). Seule la connexion au panneau d'administration nécessite le stockage technique sécurisé d'une session Supabase.",
    langueNote: null as string | null,
  },
  en: {
    title: 'Privacy policy',
    description: 'How casevibecode collects and uses account, vote and newsletter data.',
    intro: (responsable: string) =>
      `This page explains what data casevibecode collects, why, and how to exercise your rights. The data controller is ${responsable}.`,
    contactDefaut: 'the address given in the legal notice',
    collecteesTitre: 'What data is collected',
    compteTitre: 'Account (sign-in by email or Google)',
    compte: (editeurNom: string) =>
      `Email and, for a Google account, your name and profile picture if your Google account provides one. The password (email sign-in) is handled by Supabase’s authentication service and is never stored in plain text by ${editeurNom}. Sign-in is reserved for site administration: voting does not require an account.`,
    votesTitre: 'Community votes',
    votes:
      'Voting requires neither an account nor an email. When you vote, an encrypted fingerprint (salted cryptographic hash) of your IP address is recorded. The raw IP address is never stored or readable. This fingerprint strictly limits voting to one vote per user and per entry, to prevent fraud.',
    newsletterTitre: 'Newsletter',
    newsletter: 'Your email, if you sign up through the site’s newsletter form.',
    contribTitre: 'Feedback and tool suggestions',
    contrib:
      'If you send feedback or suggest a tool: the text you write, the optional link, the page language and the date. No name or email is asked: do not put any in your text. Feedback is only published after review, without an author’s name. An encrypted fingerprint of your IP address is kept for 13 months against abuse.',
    auditTitre: 'My audit',
    audit: 'The calculation on the “My audit” page happens in your browser: the selection is neither sent nor saved. The share link only contains the names of the ticked tools.',
    baseTitre: 'Why, and on what legal basis',
    base: [
      'Processing the IP fingerprint for votes rests on our ',
      'legitimate interest',
      ' (fraud prevention and keeping the counters reliable). Account data (administration) is processed to provide the requested service. The newsletter email is processed on the basis of your ',
      'consent',
      '; you can unsubscribe at any time.',
    ],
    destTitre: 'Who receives this data',
    dest: 'Your data is hosted by Supabase (database and authentication), which acts as a processor; the project is configured in a European Union region (Paris). The site itself is hosted by Vercel Inc. The newsletter is sent through Resend. Your data is neither sold, nor transferred, nor used for commercial purposes you have not consented to.',
    dureeTitre: 'How long it is kept',
    duree: (contact: string) => [
      'Account data is kept as long as your account exists. The vote IP fingerprint is kept for a maximum of ',
      '13 months',
      ` (an automated purge job regularly deletes older votes). Newsletter emails are kept until you unsubscribe. You can ask for your account and data to be deleted at any time by writing to ${contact}.`,
    ],
    droitsTitre: 'Your rights',
    droits: (contact: string) =>
      `Under the GDPR, you have the right to access, rectify, erase, restrict and object to the processing of your data, exercisable by writing to ${contact}. You also have the right to lodge a complaint with the CNIL, the French data protection authority (cnil.fr).`,
    cookiesTitre: 'Cookies',
    cookies:
      'casevibecode uses no advertising cookies and no audience-measurement tools, and sets no cookie or local storage for votes (a cookie-free system limited by IP fingerprint). Only signing in to the admin panel requires the secure technical storage of a Supabase session.',
    langueNote: 'This English text is a courtesy translation; the French version prevails.',
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  return { title: TEXTES[lang].title, description: TEXTES[lang].description, alternates: alternatesFor(lang, '/confidentialite') };
}

export default function ConfidentialitePage({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang: Lang = langOf(params ? use(params) : undefined);
  const x = TEXTES[lang];
  const e = editeur();
  // Responsable du traitement : seulement ce que l'environnement fournit.
  const responsable = [e.marque && e.nom ? `${e.marque} — ${e.nom}` : libelleEditeur(e), e.adresse, e.email]
    .filter(Boolean)
    .join(', ');
  const contact = e.email ?? x.contactDefaut;
  const h2 = 'mt-8 font-serif text-xl font-semibold text-slate-800';
  const p = 'mt-3 text-sm text-slate-700';
  const [base1, base2, base3, base4, base5] = x.base;
  const [duree1, duree2, duree3] = x.duree(contact);
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl font-semibold text-slate-800">{x.title}</h1>
      {x.langueNote && <p className="mt-2 text-xs text-slate-500">{x.langueNote}</p>}
      <p className="mt-4 text-sm text-slate-600">{x.intro(responsable)}</p>

      <h2 className={h2}>{x.collecteesTitre}</h2>
      <div className="mt-3 space-y-4 text-sm text-slate-700">
        <div>
          <p className="font-medium">{x.compteTitre}</p>
          <p>{x.compte(libelleEditeur(e))}</p>
        </div>
        <div>
          <p className="font-medium">{x.votesTitre}</p>
          <p>{x.votes}</p>
        </div>
        <div>
          <p className="font-medium">{x.newsletterTitre}</p>
          <p>{x.newsletter}</p>
        </div>
        <div>
          <p className="font-medium">{x.contribTitre}</p>
          <p>{x.contrib}</p>
        </div>
        <div>
          <p className="font-medium">{x.auditTitre}</p>
          <p>{x.audit}</p>
        </div>
      </div>

      <h2 className={h2}>{x.baseTitre}</h2>
      <p className={p}>
        {base1}
        <strong>{base2}</strong>
        {base3}
        <strong>{base4}</strong>
        {base5}
      </p>

      <h2 className={h2}>{x.destTitre}</h2>
      <p className={p}>{x.dest}</p>

      <h2 className={h2}>{x.dureeTitre}</h2>
      <p className={p}>
        {duree1}
        <strong>{duree2}</strong>
        {duree3}
      </p>

      <h2 className={h2}>{x.droitsTitre}</h2>
      <p className={p}>{x.droits(contact)}</p>

      <h2 className={h2}>{x.cookiesTitre}</h2>
      <p className={p}>{x.cookies}</p>
    </main>
  );
}
