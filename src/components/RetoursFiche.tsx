'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { envoyerContribution, ContributionError } from '@/lib/contribution-client';

export interface RetourAffiche {
  id: string;
  type: 'construit' | 'casse';
  texte: string;
  lien: string | null;
  createdAt: number;
}

const BTN =
  'rounded-sm bg-primary px-4 py-2 font-sans text-sm font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50 disabled:opacity-60';
const CHAMP = 'w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-secondary focus:outline-none';

// Retours publiés d'une fiche + formulaire pour en proposer un. Les textes des
// visiteurs sont affichés en texte brut (React échappe) et les liens en nofollow.
export function RetoursFiche({ logicielId, retours }: { logicielId: string; retours: RetourAffiche[] }) {
  const { t, lang } = useLocale();
  const [type, setType] = useState<'construit' | 'casse'>('construit');
  const [texte, setTexte] = useState('');
  const [lien, setLien] = useState('');
  const [piege, setPiege] = useState('');
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'ok'>('repos');
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEtat('envoi');
    try {
      await envoyerContribution({ kind: 'retour', logicielId, type, texte, lien, langue: lang, site: piege });
      setEtat('ok');
    } catch (err) {
      setEtat('repos');
      const code = err instanceof ContributionError ? err.code : 'indisponible';
      setErreur(t.retours.errors[code]);
    }
  }

  return (
    <section className="mt-10 border-t border-slate-200 pt-6" aria-labelledby="retours-titre">
      <h2 id="retours-titre" className="font-serif text-xl font-semibold text-slate-800">
        {t.retours.title}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{t.retours.intro}</p>

      {retours.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{t.retours.empty}</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {retours.map((r) => (
            <li key={r.id} className="rounded-sm border border-slate-200 p-3">
              <p className="text-xs font-medium text-slate-500">
                <span className={r.type === 'construit' ? 'text-primary' : 'text-no'}>
                  {r.type === 'construit' ? t.retours.construit : t.retours.casse}
                </span>
                {' · '}
                {new Date(r.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{r.texte}</p>
              {r.lien && (
                <a
                  href={r.lien}
                  target="_blank"
                  rel="nofollow ugc noopener noreferrer"
                  className="mt-1 inline-block text-xs text-primary underline hover:no-underline"
                >
                  {t.retours.link}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-sm border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-medium text-slate-800">{t.retours.formTitle}</h3>
        {etat === 'ok' ? (
          <p role="status" className="mt-3 text-sm text-green-700">
            {t.retours.thanks}
          </p>
        ) : (
          <form onSubmit={envoyer} className="mt-3 space-y-3">
            <fieldset>
              <legend className="sr-only">{t.retours.typeLabel}</legend>
              <div className="flex gap-4 text-sm text-slate-700">
                {(['construit', 'casse'] as const).map((v) => (
                  <label key={v} className="flex items-center gap-2">
                    <input type="radio" name="type" value={v} checked={type === v} onChange={() => setType(v)} className="accent-primary" />
                    {v === 'construit' ? t.retours.construit : t.retours.casse}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="retour-texte" className="block text-sm text-slate-700">
                {t.retours.textLabel}
              </label>
              <textarea
                id="retour-texte"
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                required
                minLength={20}
                maxLength={600}
                rows={4}
                className={`mt-1 ${CHAMP}`}
              />
              <p className="mt-1 text-xs text-slate-500">{t.retours.textHint(texte.length)}</p>
            </div>
            <div>
              <label htmlFor="retour-lien" className="block text-sm text-slate-700">
                {t.retours.linkLabel}
              </label>
              <input id="retour-lien" type="url" value={lien} onChange={(e) => setLien(e.target.value)} maxLength={200} className={`mt-1 ${CHAMP}`} />
            </div>
            {/* Champ piège : invisible pour une personne, rempli par certains robots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Site
                <input type="text" name="site" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} />
              </label>
            </div>
            {erreur && (
              <p role="alert" className="text-sm text-red-600">
                {erreur}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={etat === 'envoi'} className={BTN}>
                {etat === 'envoi' ? t.retours.sending : t.retours.submit}
              </button>
              <p className="text-xs text-slate-500">{t.retours.moderation}</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
