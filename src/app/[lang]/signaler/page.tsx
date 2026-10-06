import type { Metadata } from 'next';
import { BugForm } from '@/components/BugForm';
import { getDict } from '@/lib/i18n/dictionaries';
import { alternatesFor, langOf } from '@/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  const t = getDict(lang);
  return { title: t.signaler.title, description: t.signaler.description, alternates: alternatesFor(lang, '/signaler'), robots: { index: false } };
}

export default async function SignalerPage({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang = langOf(params && (await params));
  const t = getDict(lang);
  return (
    <main className="mx-auto min-h-screen max-w-2xl p-8">
      <h1 className="font-serif text-4xl font-semibold text-slate-800">{t.signaler.heading}</h1>
      <p className="mt-2 text-slate-600">{t.signaler.intro}</p>
      <BugForm />
    </main>
  );
}
