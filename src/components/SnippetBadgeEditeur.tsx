'use client';

import { useState } from 'react';
import type { VerdictEditeur } from '@/types/logiciel';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { SITE_URL } from '@/lib/site';

export function SnippetBadgeEditeur({
  slug,
  verdict,
}: {
  nom: string;
  slug: string;
  verdict: VerdictEditeur;
}) {
  const { t, lang, href } = useLocale();
  const [copied, setCopied] = useState(false);

  const verdictLabel = t.verdict[verdict];
  const pageUrl = `${SITE_URL}${href(`/logiciel/${slug}`)}`;
  const badgeImgUrl = `${SITE_URL}/api/badge/${slug}?lang=${lang}`;
  const altText = t.fiche.badgeEditeurLabel(verdictLabel);

  const snippetHtml = `<a href="${pageUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeImgUrl}" alt="${altText}" /></a>`;

  async function copierSnippet() {
    try {
      await navigator.clipboard.writeText(snippetHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Si presse-papiers indisponible, le texte reste sélectionnable
    }
  }

  return (
    <div className="mt-8 rounded-sm border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-slate-800">{t.fiche.badgeEditeurTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{t.fiche.badgeEditeurDesc}</p>
        </div>
        <button
          type="button"
          onClick={copierSnippet}
          className="inline-flex items-center rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary active:scale-[0.97]"
        >
          {copied ? t.fiche.badgeEditeurCopied : t.fiche.badgeEditeurCopy}
        </button>
      </div>

      <div className="mt-3 flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/badge/${slug}?lang=${lang}`}
          alt={altText}
          height={20}
          className="h-5"
        />
      </div>

      <pre className="mt-3 overflow-x-auto rounded-sm border border-slate-200 bg-white p-2.5 text-[11px] font-mono text-slate-600">
        <code>{snippetHtml}</code>
      </pre>
    </div>
  );
}
