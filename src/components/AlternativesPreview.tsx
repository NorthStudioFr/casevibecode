import Link from 'next/link';
import type { Alternative } from '@/types/logiciel';
import { AlternativeItem } from './AlternativeItem';

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
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <section className="mt-4 rounded-sm border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-sm font-medium text-slate-800">Alternatives à {nom} qui existent déjà</h2>
      <ul className="mt-3 space-y-3">
        {alternatives.slice(0, APERCU).map((a) => (
          <li key={a.url}>
            <AlternativeItem alternative={a} />
          </li>
        ))}
      </ul>
      <Link
        href={`/logiciel/${slug}/alternatives`}
        className="mt-3 inline-block text-sm text-primary underline hover:no-underline"
      >
        {alternatives.length > 1
          ? `Voir toutes les ${alternatives.length} alternatives`
          : "Voir l'alternative en détail"}
      </Link>
    </section>
  );
}
