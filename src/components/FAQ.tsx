import type { Logiciel, VerdictEditeur } from '@/types/logiciel';
import { VERDICT_LABEL } from '@/lib/verdict';
import { TYPE_ALTERNATIVE_LABEL } from '@/lib/alternatives';

export function FAQ({ logiciel, verdict }: { logiciel: Logiciel; verdict: VerdictEditeur }) {
  const items: { question: string; reponse: string }[] = [
    {
      question: `${logiciel.nom} est-il remplaçable par un outil sur mesure ?`,
      reponse: `Verdict casevibecode : ${VERDICT_LABEL[verdict]}. ${logiciel.justificationEditeur}`,
    },
    {
      question: `À quoi sert ${logiciel.nom} ?`,
      reponse: logiciel.description,
    },
  ];

  if (logiciel.alternatives && logiciel.alternatives.length > 0) {
    const noms = logiciel.alternatives
      .slice(0, 3)
      .map((a) => `${a.nom} (${TYPE_ALTERNATIVE_LABEL[a.type].toLowerCase()})`)
      .join(', ');
    items.push({
      question: `Quelles alternatives existent déjà à ${logiciel.nom} ?`,
      reponse: `${noms}. Des options à comparer avant de vous lancer dans un développement sur mesure.`,
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
      <h2 className="font-serif text-xl font-semibold text-slate-800">Questions fréquentes</h2>
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
