import type { Metadata } from 'next';
import { PropositionForm } from '@/components/PropositionForm';
import { getDict } from '@/lib/i18n/dictionaries';
import { alternatesFor, langOf } from '@/lib/i18n/config';

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  const t = getDict(lang);
  return { title: t.proposer.title, description: t.proposer.description, alternates: alternatesFor(lang, '/proposer') };
}

export default async function ProposerPage({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang = langOf(params && (await params));
  const t = getDict(lang);
  return (
    <main className="mx-auto min-h-screen max-w-2xl p-8">
      <h1 className="font-serif text-4xl font-semibold text-slate-800">{t.proposer.heading}</h1>
      <p className="mt-2 text-slate-600">{t.proposer.intro}</p>
      <PropositionForm />
    </main>
  );
}
