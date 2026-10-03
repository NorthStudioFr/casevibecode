import type { Alternative } from '@/types/logiciel';
import { TYPE_ALTERNATIVE_LABEL } from '@/lib/alternatives';

export function AlternativeItem({ alternative }: { alternative: Alternative }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={alternative.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-slate-800 underline decoration-primary hover:text-primary"
        >
          {alternative.nom}
        </a>
        <span className="rounded-sm border border-slate-200 px-1.5 py-0.5 text-xs text-slate-500">
          {TYPE_ALTERNATIVE_LABEL[alternative.type]}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{alternative.description}</p>
    </div>
  );
}
