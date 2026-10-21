import type { Metadata } from 'next';
import Link from 'next/link';

// Next ne transmet pas la langue à un not-found : la page est volontairement bilingue.
export const metadata: Metadata = {
  title: 'Page introuvable · Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-2xl p-8">
      <p className="text-sm text-slate-500">404</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-800">Page introuvable</h1>
      <p className="mt-3 text-slate-600">Cette adresse n’existe pas ou a été déplacée. Les fiches retirées ne sont plus en ligne.</p>
      <p className="mt-1 text-sm text-slate-500">This page does not exist or has moved.</p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/" className="rounded-sm bg-primary px-4 py-2 font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50">
          Voir la liste des logiciels
        </Link>
        <Link href="/alternatives" className="rounded-sm border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-primary hover:text-primary">
          Les alternatives
        </Link>
        <Link href="/en" className="rounded-sm border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:border-primary hover:text-primary">
          English
        </Link>
      </div>
    </main>
  );
}
