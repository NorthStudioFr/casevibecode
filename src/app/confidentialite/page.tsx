import type { Metadata } from 'next';
import { editeur, libelleEditeur } from '@/lib/editeur';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    "Comment casevibecode collecte et utilise les données des comptes, des votes et de la newsletter.",
  alternates: { canonical: '/confidentialite' },
};

export default function ConfidentialitePage() {
  const e = editeur();
  // Responsable du traitement : seulement ce que l'environnement fournit.
  const responsable = [
    e.marque && e.nom ? `${e.marque} — ${e.nom}` : libelleEditeur(e),
    e.adresse,
    e.email,
  ]
    .filter(Boolean)
    .join(', ');
  const contact = e.email ?? "l'adresse indiquée dans les mentions légales";
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl font-semibold text-slate-800">
        Politique de confidentialité
      </h1>
      <p className="mt-4 text-sm text-slate-600">
        Cette page explique quelles données casevibecode collecte, pourquoi, et comment les
        exercer vos droits. Le responsable du traitement est {responsable}.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">
        Quelles données sont collectées
      </h2>
      <div className="mt-3 space-y-4 text-sm text-slate-700">
        <div>
          <p className="font-medium">Compte (connexion par email ou Google)</p>
          <p>
            Email, et pour un compte Google : nom et photo de profil si votre compte Google en
            fournit une. Le mot de passe (connexion par email) est géré par le service
            d&apos;authentification de Supabase et n&apos;est jamais stocké en clair par North
            Studio. La connexion est réservée à l&apos;administration du site : voter ne demande
            aucun compte.
          </p>
        </div>
        <div>
          <p className="font-medium">Votes communautaires</p>
          <p>
            Voter ne demande ni compte ni email. Lors de votre vote, une empreinte chiffrée 
            (hachage cryptographique salé) de votre adresse IP est enregistrée. L&apos;adresse IP
            brute n&apos;est jamais stockée ni lisible. Cette empreinte permet de limiter
            strictement à un seul vote par utilisateur et par fiche, afin de prévenir la fraude.
          </p>
        </div>
        <div>
          <p className="font-medium">Newsletter</p>
          <p>Votre email, si vous vous inscrivez au formulaire de newsletter du site.</p>
        </div>
      </div>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">
        Pourquoi, et sur quelle base légale
      </h2>
      <p className="mt-3 text-sm text-slate-700">
        Le traitement de l&apos;empreinte IP pour les votes repose sur notre <strong>intérêt légitime</strong> 
        (lutte contre la fraude et maintien de l&apos;intégrité des compteurs). Les données de compte 
        (administration) sont traitées pour fournir le service demandé. L&apos;email de newsletter est traité 
        sur la base de votre <strong>consentement</strong> ; vous pouvez vous désinscrire à tout moment.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">
        Qui reçoit ces données
      </h2>
      <p className="mt-3 text-sm text-slate-700">
        Vos données sont hébergées par Supabase (base de données et authentification), qui agit
        comme sous-traitant ; le projet est configuré sur une région de l&apos;Union européenne
        (Paris). Le site lui-même est hébergé par Vercel Inc. L&apos;envoi de la newsletter passe
        par Resend. Vos données ne sont ni vendues, ni cédées, ni utilisées à des fins commerciales non consenties.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">
        Combien de temps sont-elles conservées
      </h2>
      <p className="mt-3 text-sm text-slate-700">
        Les données de compte sont conservées tant que votre compte existe. L&apos;empreinte IP des votes 
        est conservée pour une durée maximale de <strong>13 mois</strong> (une tâche automatisée de purge 
        supprime régulièrement les votes plus anciens). Les emails de newsletter sont conservés jusqu&apos;à 
        votre désinscription. Vous pouvez demander la suppression de votre compte et de vos données à tout moment 
        en écrivant à {contact}.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">Vos droits</h2>
      <p className="mt-3 text-sm text-slate-700">
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de
        suppression, de limitation et d&apos;opposition concernant vos données, exerçable en
        écrivant à {contact}. Vous disposez également du droit d&apos;introduire une
        réclamation auprès de la CNIL (cnil.fr).
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">Cookies</h2>
      <p className="mt-3 text-sm text-slate-700">
        casevibecode n&apos;utilise aucun cookie publicitaire, aucun outil de mesure d&apos;audience, 
        et ne dépose aucun cookie ou stockage local pour les votes (système sans cookie limité par empreinte IP). 
        Seule la connexion au panneau d&apos;administration nécessite le stockage technique sécurisé 
        d&apos;une session Supabase.
      </p>
    </main>
  );
}
