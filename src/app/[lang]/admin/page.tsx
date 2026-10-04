'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';
import { listLogicielsClient } from '@/lib/logiciels-admin-client';
import type { Logiciel } from '@/types/logiciel';
import { ModerationPanel } from '@/components/ModerationPanel';
import { lacunesDe, LACUNE_LABEL } from '@/lib/admin-lacunes';
import { normaliser } from '@/lib/texte';

// This page uses AuthProvider, which relies on the Supabase browser client (public env vars absent at build time).
// Prerendering at build time would fail without them.
// Force dynamic rendering to prevent prerendering.
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [query, setQuery] = useState('');
  const [secteur, setSecteur] = useState<'tous' | 'chr' | 'saas'>('tous');
  const [aCompleter, setACompleter] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) {
      router.push('/connexion');
      return;
    }
    listLogicielsClient().then(setLogiciels);
  }, [user, isAdmin, loading, router]);

  const visibles = useMemo(() => {
    const q = normaliser(query.trim());
    return logiciels
      .map((l) => ({ l, manques: lacunesDe(l) }))
      .filter(({ l }) => secteur === 'tous' || l.secteur === secteur)
      .filter(({ l }) => q === '' || normaliser(l.nom).includes(q) || normaliser(l.slug).includes(q))
      .filter(({ manques }) => !aCompleter || manques.length > 0);
  }, [logiciels, query, secteur, aCompleter]);
  const nbACompleter = useMemo(() => logiciels.filter((l) => lacunesDe(l).length > 0).length, [logiciels]);

  if (loading || !isAdmin) return null;

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl font-semibold text-slate-800">Admin — logiciels</h1>
        <Link
          href="/admin/logiciels/nouveau"
          className="rounded-sm bg-primary px-4 py-2 font-sans text-sm font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50"
        >
          Nouvelle fiche
        </Link>
      </div>
      <ModerationPanel />
      <section className="mt-10 border-t border-slate-200 pt-6">
        <h2 className="font-serif text-xl font-semibold text-slate-800">Fiches ({logiciels.length})</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une fiche"
            aria-label="Rechercher une fiche"
            className="min-w-48 flex-1 rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-secondary focus:outline-none"
          />
          <select
            value={secteur}
            onChange={(e) => setSecteur(e.target.value as 'tous' | 'chr' | 'saas')}
            aria-label="Secteur"
            className="rounded-sm border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700"
          >
            <option value="tous">Tous les secteurs</option>
            <option value="chr">CHR</option>
            <option value="saas">Outils du quotidien</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={aCompleter} onChange={(e) => setACompleter(e.target.checked)} />
            À compléter ({nbACompleter})
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-500">{visibles.length} fiche(s) affichée(s)</p>
        <ul className="mt-2 divide-y divide-slate-200">
          {visibles.map(({ l, manques }) => (
            <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-slate-700">
              <span className="min-w-0">
                <span className="font-medium">{l.nom}</span>
                {manques.map((m) => (
                  <span key={m} className="ml-2 rounded-sm bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                    {LACUNE_LABEL[m]}
                  </span>
                ))}
              </span>
              <span className="flex shrink-0 gap-3 text-sm">
                <Link href={`/logiciel/${l.slug}`} className="text-slate-500 underline" target="_blank" rel="noopener">
                  Voir
                </Link>
                <Link href={`/admin/logiciels/${l.id}`} className="text-secondary underline">
                  Modifier
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
