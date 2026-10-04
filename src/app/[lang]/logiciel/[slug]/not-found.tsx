import type { Metadata } from 'next';

// Page 404 d'une fiche : volontairement bilingue, car Next ne transmet pas la langue
// à un not-found.
export const metadata: Metadata = {
  title: 'Logiciel introuvable · Tool not found',
};

export default function NotFound() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Logiciel introuvable</h1>
      <p className="mt-2 text-slate-600">Tool not found</p>
    </main>
  );
}
