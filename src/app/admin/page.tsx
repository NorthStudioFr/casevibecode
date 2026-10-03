'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';
import { listLogicielsClient } from '@/lib/logiciels-admin-client';
import type { Logiciel } from '@/types/logiciel';

// This page uses AuthProvider, which relies on the Supabase browser client (public env vars absent at build time).
// Prerendering at build time would fail without them.
// Force dynamic rendering to prevent prerendering.
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) {
      router.push('/connexion');
      return;
    }
    listLogicielsClient().then(setLogiciels);
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) return null;

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl font-semibold text-slate-800">Admin — logiciels</h1>
        <Link
          href="/admin/logiciels/nouveau"
          className="rounded-sm bg-primary px-4 py-2 font-sans text-sm font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50"
        >
          Nouvelle fiche
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-slate-200">
        {logiciels.map((l) => (
          <li key={l.id} className="py-3 flex justify-between text-slate-700">
            <span>{l.nom}</span>
            <Link href={`/admin/logiciels/${l.id}`} className="text-sm text-secondary underline">
              Modifier
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
