import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logiciel introuvable',
};

export default function NotFound() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Logiciel introuvable</h1>
    </main>
  );
}
