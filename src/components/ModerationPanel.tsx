'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  listerPropositions,
  listerRetoursEnAttente,
  marquerTraitee,
  moderer,
  type PropositionATraiter,
  type RetourAModerer,
} from '@/lib/moderation-client';

const BTN = 'rounded-sm border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:border-primary hover:text-primary';

// Panneau d'administration : retours à publier et propositions de logiciels.
// Le contenu des visiteurs est affiché en texte brut ; les liens ne sont pas cliquables
// avant relecture (on les copie à la main).
export function ModerationPanel() {
  const [retours, setRetours] = useState<RetourAModerer[]>([]);
  const [propositions, setPropositions] = useState<PropositionATraiter[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    try {
      const [r, p] = await Promise.all([listerRetoursEnAttente(), listerPropositions()]);
      setRetours(r);
      setPropositions(p);
      setErreur(null);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Chargement impossible.');
    }
  }, []);

  useEffect(() => {
    void charger();
  }, [charger]);

  async function agir(action: () => Promise<void>) {
    try {
      await action();
      await charger();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Action impossible.');
    }
  }

  return (
    <section className="mt-8">
      <h2 className="font-serif text-xl font-semibold text-slate-800">Modération</h2>
      {erreur && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {erreur}
        </p>
      )}

      <h3 className="mt-4 text-sm font-medium text-slate-800">Retours en attente ({retours.length})</h3>
      {retours.length === 0 ? (
        <p className="mt-1 text-sm text-slate-500">Rien à relire.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {retours.map((r) => (
            <li key={r.id} className="rounded-sm border border-slate-200 p-3 text-sm text-slate-700">
              <p className="text-xs text-slate-500">
                <Link href={`/logiciel/${r.logiciel_slug}`} className="underline">
                  {r.logiciel_slug}
                </Link>{' '}
                · {r.type === 'construit' ? 'construit' : 'cassé'} · {r.langue} · {new Date(r.created_at).toLocaleString('fr-FR')}
              </p>
              <p className="mt-1 whitespace-pre-line">{r.texte}</p>
              {r.lien && <p className="mt-1 break-all text-xs text-slate-500">{r.lien}</p>}
              <div className="mt-2 flex gap-2">
                <button type="button" className={BTN} onClick={() => agir(() => moderer(r.id, 'publie'))}>
                  Publier
                </button>
                <button type="button" className={BTN} onClick={() => agir(() => moderer(r.id, 'refuse'))}>
                  Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-6 text-sm font-medium text-slate-800">Propositions de logiciels ({propositions.length})</h3>
      {propositions.length === 0 ? (
        <p className="mt-1 text-sm text-slate-500">Aucune proposition à traiter.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {propositions.map((p) => (
            <li key={p.id} className="rounded-sm border border-slate-200 p-3 text-sm text-slate-700">
              <p className="font-medium">{p.nom}</p>
              {p.url && <p className="break-all text-xs text-slate-500">{p.url}</p>}
              {p.raison && <p className="mt-1 whitespace-pre-line">{p.raison}</p>}
              <p className="mt-1 text-xs text-slate-500">
                {p.langue} · {new Date(p.created_at).toLocaleString('fr-FR')}
              </p>
              <button type="button" className={`mt-2 ${BTN}`} onClick={() => agir(() => marquerTraitee(p.id))}>
                Marquer comme traitée
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
