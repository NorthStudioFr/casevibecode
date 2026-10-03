// Appel à l'action vers l'éditeur du site ; affiché seulement si EDITEUR_CONTACT_URL
// est défini (le dépôt public ne contient aucune adresse de contact).
import { editeur } from '@/lib/editeur';

export function CtaEditeur() {
  const { contactUrl } = editeur();
  if (!contactUrl) return null;
  return (
    <a
      href={contactUrl}
      className="inline-block rounded-sm bg-primary px-4 py-2 text-center font-sans text-xs font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      Vous voulez qu&apos;on regarde vos outils et automatise ce qui peut l&apos;être ?
    </a>
  );
}
