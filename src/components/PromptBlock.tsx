'use client';

import { useState } from 'react';
import type { Logiciel } from '@/types/logiciel';
import { AGENTS } from '@/lib/agents';
import { useLocale } from '@/lib/i18n/LocaleProvider';

const BUTTON =
  'inline-flex items-center gap-1.5 rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary active:scale-[0.97]';

export function PromptBlock({ logiciel }: { logiciel: Logiciel }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  // Les fiches reprises de canivibecodeit portent leur propre prompt, rédigé
  // pour cet outil ; sinon on génère le prompt CHR standard.
  const prompt = logiciel.prompt ?? t.prompt.build(logiciel.nom, logiciel.description, logiciel.justificationEditeur);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API indisponible (contexte non sécurisé) : le texte reste sélectionnable.
    }
  }

  return (
    <div className="mt-4 rounded-sm border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-800">{t.prompt.title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copy} className={BUTTON}>
          {copied ? t.prompt.copied : t.prompt.copy}
        </button>
        {AGENTS.map((agent) => (
          <a
            key={agent.id}
            href={agent.href(prompt)}
            onClick={copy}
            {...(agent.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={agent.desktopOnly ? `${BUTTON} max-md:hidden` : BUTTON}
          >
            {t.prompt.openIn(agent.label)}
          </a>
        ))}
      </div>
      <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-slate-200 bg-white p-3 text-xs text-slate-600">
        {prompt}
      </pre>
    </div>
  );
}
