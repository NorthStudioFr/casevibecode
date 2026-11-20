import Link from 'next/link';
import { localePath, type Lang } from '@/lib/i18n/config';
import { getSponsors, type Sponsor } from '@/lib/sponsors';

const TEXTES = {
  fr: { label: 'Sponsorisé', aria: 'Emplacements sponsorisés', note: "Emplacement payant, séparé des verdicts : il n'en change aucun.", more: "Comment ça marche" },
  en: { label: 'Sponsored', aria: 'Sponsored slots', note: 'Paid slot, kept apart from the verdicts: it never changes one.', more: 'How it works' },
} as const;

// N'affiche rien tant qu'aucun sponsor n'est déclaré (src/content/sponsors.json).
export function SponsorBlock({ lang, sponsors = getSponsors() }: { lang: Lang; sponsors?: Sponsor[] }) {
  if (sponsors.length === 0) return null;
  const x = TEXTES[lang];
  return (
    <aside aria-label={x.aria} className="mt-6 rounded-sm border border-dashed border-slate-300 p-4">
      <ul className="space-y-3">
        {sponsors.map((s) => (
          <li key={s.url} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="rounded-sm border border-slate-300 px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide text-slate-600">
              {x.label}
            </span>
            <a href={s.url} target="_blank" rel="sponsored noopener noreferrer" className="font-serif text-base font-semibold text-slate-800 underline hover:text-secondary">
              {s.nom}
            </a>
            <span className="text-sm text-slate-600">{lang === 'en' && s.descriptionEn ? s.descriptionEn : s.description}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500">
        {x.note}{' '}
        <Link href={localePath(lang, '/offre-editeur')} className="underline hover:text-secondary">
          {x.more}
        </Link>
      </p>
    </aside>
  );
}
