import Link from 'next/link';
import type { Metadata } from 'next';
import { getDict } from '@/lib/i18n/dictionaries';
import { alternatesFor, langOf, localePath } from '@/lib/i18n/config';
import { VerdictBadge } from '@/components/VerdictBadge';

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  const t = getDict(lang);
  return {
    title: t.methode.title,
    description: t.methode.description,
    alternates: alternatesFor(lang, '/methode'),
  };
}

export default async function MethodePage({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang = langOf(params && (await params));
  const t = getDict(lang);
  const m = t.methode;

  const h2 = 'mt-8 font-serif text-xl font-semibold text-slate-800';
  const p = 'mt-3 text-sm text-slate-700 leading-relaxed';

  return (
    <main className="mx-auto min-h-screen max-w-2xl p-8">
      <Link href={localePath(lang, '/')} className="text-sm text-slate-500 hover:text-slate-800">
        {t.fiche.back}
      </Link>

      <h1 className="mt-4 font-serif text-4xl font-semibold text-slate-800">{m.heading}</h1>
      <p className="mt-3 text-base text-slate-600 leading-relaxed">{m.intro}</p>

      <section>
        <h2 className={h2}>{m.whoTitle}</h2>
        <p className={p}>{m.whoContent}</p>
      </section>

      <section>
        <h2 className={h2}>{m.dataTitle}</h2>
        <p className={p}>{m.dataContent}</p>
      </section>

      <section>
        <h2 className={h2}>{m.verdictsTitle}</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <VerdictBadge verdict="YES" />
              <h3 className="font-serif text-base font-semibold text-slate-800">{m.replaceableTitle}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-700">{m.replaceableContent}</p>
          </div>

          <div className="rounded-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <VerdictBadge verdict="KINDA" />
              <h3 className="font-serif text-base font-semibold text-slate-800">{m.kindaTitle}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-700">{m.kindaContent}</p>
          </div>

          <div className="rounded-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <VerdictBadge verdict="NOT_REALLY" />
              <h3 className="font-serif text-base font-semibold text-slate-800">{m.notReallyTitle}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-700">{m.notReallyContent}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className={h2}>{m.communityTitle}</h2>
        <p className={p}>{m.communityContent}</p>
      </section>

      <section>
        <h2 className={h2}>{m.editorTitle}</h2>
        <p className={p}>{m.editorContent}</p>
        <div className="mt-4">
          <Link
            href={localePath(lang, '/signaler')}
            className="inline-block rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50"
          >
            {t.footer.report} →
          </Link>
        </div>
      </section>

      <section>
        <h2 className={h2}>{m.linksTitle}</h2>
        <p className={p}>{m.linksContent}</p>
      </section>
    </main>
  );
}
