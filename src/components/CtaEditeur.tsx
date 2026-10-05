// Mot de l'éditeur : une ligne discrète, étiquetée, sans image ni script tiers.
// Affiché seulement si EDITEUR_CONTACT_URL est défini (le dépôt public ne contient ni
// adresse de contact ni marque : le nom vient de EDITEUR_MARQUE).
import { editeur, libelleEditeur } from '@/lib/editeur';
import { getDict } from '@/lib/i18n/dictionaries';
import { DEFAULT_LANG, type Lang } from '@/lib/i18n/config';
import type { Secteur } from '@/types/logiciel';

export function CtaEditeur({ lang = DEFAULT_LANG, secteur = 'saas' }: { lang?: Lang; secteur?: Secteur }) {
  const e = editeur();
  if (!e.contactUrl) return null;
  const t = getDict(lang).cta;
  const marque = libelleEditeur(e);
  return (
    <aside className="rounded-sm border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600">
      <p className="text-xs uppercase tracking-wide text-slate-400">{t.label}</p>
      <p className="mt-1">
        {secteur === 'chr' ? t.chr(marque) : t.saas(marque)}{' '}
        <a href={e.contactUrl} className="whitespace-nowrap text-primary underline hover:no-underline">
          {t.more} →
        </a>
      </p>
    </aside>
  );
}
