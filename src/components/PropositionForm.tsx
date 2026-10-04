'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { envoyerContribution, ContributionError } from '@/lib/contribution-client';

const CHAMP = 'mt-1 w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-secondary focus:outline-none';

export function PropositionForm() {
  const { t, lang } = useLocale();
  const [nom, setNom] = useState('');
  const [url, setUrl] = useState('');
  const [raison, setRaison] = useState('');
  const [piege, setPiege] = useState('');
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'ok'>('repos');
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEtat('envoi');
    try {
      await envoyerContribution({ kind: 'proposition', nom, url, raison, langue: lang, site: piege });
      setEtat('ok');
    } catch (err) {
      setEtat('repos');
      setErreur(t.retours.errors[err instanceof ContributionError ? err.code : 'indisponible']);
    }
  }

  if (etat === 'ok') {
    return (
      <p role="status" className="mt-6 text-sm text-green-700">
        {t.proposer.thanks}
      </p>
    );
  }

  return (
    <form onSubmit={envoyer} className="mt-6 max-w-xl space-y-4">
      <div>
        <label htmlFor="prop-nom" className="block text-sm text-slate-700">
          {t.proposer.nameLabel}
        </label>
        <input id="prop-nom" value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} maxLength={80} className={CHAMP} />
      </div>
      <div>
        <label htmlFor="prop-url" className="block text-sm text-slate-700">
          {t.proposer.urlLabel}
        </label>
        <input id="prop-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} maxLength={200} className={CHAMP} />
      </div>
      <div>
        <label htmlFor="prop-raison" className="block text-sm text-slate-700">
          {t.proposer.reasonLabel}
        </label>
        <textarea id="prop-raison" value={raison} onChange={(e) => setRaison(e.target.value)} maxLength={500} rows={4} className={CHAMP} />
      </div>
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
        <button
          type="submit"
          disabled={etat === 'envoi'}
          className="rounded-sm bg-primary px-4 py-2 font-sans text-sm font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50 disabled:opacity-60"
        >
          {etat === 'envoi' ? t.proposer.sending : t.proposer.submit}
        </button>
        <p className="text-xs text-slate-500">{t.proposer.privacy}</p>
      </div>
    </form>
  );
}
