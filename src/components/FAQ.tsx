'use client';

import type { Logiciel, VerdictEditeur } from '@/types/logiciel';
import { useLocale } from '@/lib/i18n/LocaleProvider';

export function FAQ({ logiciel, verdict }: { logiciel: Logiciel; verdict: VerdictEditeur }) {
  const { t } = useLocale();
  const items: { question: string; reponse: string }[] = [
    {
      question: t.faq.replaceable(logiciel.nom),
      reponse: t.faq.verdictAnswer(t.verdict[verdict], logiciel.justificationEditeur),
    },
    {
      question: t.faq.what(logiciel.nom),
      reponse: logiciel.description,
    },
  ];

  if (logiciel.alternatives && logiciel.alternatives.length > 0) {
    const noms = logiciel.alternatives
      .slice(0, 3)
      .map((a) => `${a.nom} (${t.typeAlt[a.type].toLowerCase()})`)
      .join(', ');
    items.push({
      question: t.faq.alternatives(logiciel.nom),
      reponse: t.faq.alternativesAnswer(noms),
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.reponse },
    })),
  };

  return (
    <div className="mt-10 border-t border-slate-200 pt-6">
      <h2 className="font-serif text-xl font-semibold text-slate-800">{t.faq.title}</h2>
      <dl className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="text-sm font-medium text-slate-800">{item.question}</dt>
            <dd className="mt-1 text-sm text-slate-600">{item.reponse}</dd>
          </div>
        ))}
      </dl>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
