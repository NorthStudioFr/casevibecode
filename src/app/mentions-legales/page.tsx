import type { Metadata } from 'next';
import { editeur, libelleEditeur } from '@/lib/editeur';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: "Mentions légales du site casevibecode.",
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegalesPage() {
  const e = editeur();
  const nomEditeur = libelleEditeur(e);
  // Chaque ligne n'est affichée que si l'information est fournie par l'environnement.
  const lignes: [string, string][] = (
    [
      ['Nom / Dénomination', e.marque && e.nom ? `${e.marque} — ${e.nom}` : (e.marque ?? e.nom)],
      ['Forme juridique', e.forme],
      ['SIRET', e.siret],
      ['Code APE', e.ape],
      ['Responsable de la publication', e.nom && e.marque ? `${e.nom}, ${e.marque}` : e.nom],
      ['Adresse', e.adresse],
      ['Email', e.email],
      ['TVA', e.tva],
    ] as [string, string | undefined][]
  ).filter((l): l is [string, string] => Boolean(l[1]));
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl font-semibold text-slate-800">Mentions légales</h1>
      <p className="mt-4 text-sm text-slate-600">
        Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance
        dans l&apos;économie numérique, il est précisé aux utilisateurs du site casevibecode
        l&apos;identité des différents intervenants dans le cadre de sa réalisation et de son
        suivi.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">Éditeur du site</h2>
      <dl className="mt-3 space-y-1 text-sm text-slate-700">
        {lignes.map(([label, valeur]) => (
          <div key={label}>
            <dt className="inline font-medium">{label} : </dt>
            <dd className="inline">{valeur}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">Hébergement</h2>
      <p className="mt-3 text-sm text-slate-700">
        Hébergeur du site (application) : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
        USA — vercel.com
        <br />
        Hébergeur des données (comptes, votes, fiches) : Supabase, Inc. (base de données et
        authentification Supabase), projet configuré sur une région de l&apos;Union européenne
        (Paris) — supabase.com
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">Nom de domaine</h2>
      <p className="mt-3 text-sm text-slate-700">
        casevibecode.fr est un nom de domaine enregistré auprès
        d&apos;OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">
        Conception et réalisation
      </h2>
      <p className="mt-3 text-sm text-slate-700">Le site casevibecode a été conçu et réalisé par {nomEditeur}.</p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">
        Propriété intellectuelle
      </h2>
      <p className="mt-3 text-sm text-slate-700">
        L&apos;ensemble des éléments présents sur ce site (textes, code source, structure,
        identité visuelle) sont protégés par le droit de la propriété intellectuelle et sont la
        propriété exclusive de {nomEditeur}, sauf mention contraire. Les verdicts, notes et
        commentaires publiés par les utilisateurs restent la propriété de leurs auteurs ; en les
        publiant, l&apos;utilisateur autorise {nomEditeur} à les afficher sur le site.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">Responsabilité</h2>
      <p className="mt-3 text-sm text-slate-700">
        {nomEditeur} s&apos;efforce de fournir des informations aussi précises que possible, mais
        les verdicts affichés (éditeur ou communauté) reflètent des avis, pas une vérité absolue
        sur les logiciels évoqués. L&apos;éditeur ne pourra être tenu responsable des omissions,
        inexactitudes ou décisions prises sur la base des informations du site. Le site peut
        contenir des liens vers des sites externes ; {nomEditeur} ne saurait être tenu responsable
        de leur contenu.
      </p>

      <h2 className="mt-8 font-serif text-xl font-semibold text-slate-800">Droit applicable</h2>
      <p className="mt-3 text-sm text-slate-700">
        Les présentes mentions légales sont soumises au droit français. En cas de litige, les
        tribunaux français seront seuls compétents.
      </p>
    </main>
  );
}
