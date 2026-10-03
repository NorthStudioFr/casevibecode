'use client';

import { useState } from 'react';
import type { Logiciel } from '@/types/logiciel';
import { AGENTS } from '@/lib/agents';

function buildPrompt(logiciel: Logiciel): string {
  return `Construis un outil qui remplace ${logiciel.nom} pour un restaurant, bar ou hôtel en France.

Ce que ${logiciel.nom} fait aujourd'hui : ${logiciel.description}

Pourquoi c'est un bon candidat au sur-mesure : ${logiciel.justificationEditeur}

Contraintes :
- Reste sur le strict nécessaire décrit ci-dessus, pas de fonctionnalité en plus
- Stack simple, hébergement gratuit ou pas cher (ex. Next.js + Supabase sur Vercel)
- Interface en français, utilisable par un restaurateur non technique
- Pas de compte ni d'abonnement tiers payant`;
}

const BUTTON =
  'inline-flex items-center gap-1.5 rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary active:scale-[0.97]';

export function PromptBlock({ logiciel }: { logiciel: Logiciel }) {
  const [copied, setCopied] = useState(false);
  // Les fiches reprises de canivibecodeit portent leur propre prompt, rédigé
  // pour cet outil ; sinon on génère le prompt CHR standard.
  const prompt = logiciel.prompt ?? buildPrompt(logiciel);

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
      <p className="text-sm font-medium text-slate-800">Le prompt pour le construire vous-même</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copy} className={BUTTON}>
          {copied ? 'Copié !' : 'Copier le prompt'}
        </button>
        {AGENTS.map((agent) => (
          <a
            key={agent.id}
            href={agent.href(prompt)}
            onClick={copy}
            {...(agent.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={BUTTON}
          >
            Ouvrir dans {agent.label}
          </a>
        ))}
      </div>
      <pre className="mt-3 whitespace-pre-wrap rounded-sm border border-slate-200 bg-white p-3 text-xs text-slate-600">
        {prompt}
      </pre>
    </div>
  );
}
