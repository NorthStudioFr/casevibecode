'use client';

import Link from 'next/link';
import type { Alternative } from '@/types/logiciel';
import { AlternativeItem } from './AlternativeItem';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const APERCU = 3;

export function AlternativesPreview({
  nom,
  slug,
  alternatives,
}: {
  nom: string;
  slug: string;
  alternatives?: Alternative[];
}) {
  const { t, href } = useLocale();
  if (!alternatives || alternatives.length === 0) {
    return (
      <section className="mt-4 rounded-sm border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-medium text-slate-800">{t.alternatives.previewTitle(nom)}</h2>
        <p className="mt-2 text-sm text-slate-600">{t.alternatives.none}</p>
      </section>
    );
  }

  return (
    <section className="mt-4 rounded-sm border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-medium text-slate-800">{t.alternatives.previewTitle(nom)}</h2>
      <ul className="mt-3 space-y-3">
        {alternatives.slice(0, APERCU).map((a) => (
          <li key={a.url}>
            <AlternativeItem alternative={a} />
          </li>
        ))}
      </ul>
      <Link
        href={href(`/logiciel/${slug}/alternatives`)}
        className="mt-3 inline-block text-sm text-primary underline hover:no-underline"
      >
        {t.alternatives.seeAll(alternatives.length)}
      </Link>
    </section>
  );
}
