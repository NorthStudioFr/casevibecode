// Appel à l'action vers l'éditeur du site ; affiché seulement si EDITEUR_CONTACT_URL
// est défini (le dépôt public ne contient aucune adresse de contact).
import { editeur } from '@/lib/editeur';
import { getDict } from '@/lib/i18n/dictionaries';
import { DEFAULT_LANG, type Lang } from '@/lib/i18n/config';

export function CtaEditeur({ lang = DEFAULT_LANG }: { lang?: Lang }) {
  const { contactUrl } = editeur();
  if (!contactUrl) return null;
  return (
    <a
      href={contactUrl}
      className="inline-block rounded-sm bg-primary px-4 py-2 text-center font-sans text-xs font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      {getDict(lang).cta.editeur}
    </a>
  );
}
