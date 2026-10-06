'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/lib/i18n/LocaleProvider';
import { envoyerContribution, ContributionError } from '@/lib/contribution-client';

const CHAMP = 'mt-1 w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-secondary focus:outline-none';

// Chemin transmis par le lien du pied de page (?page=/logiciel/tally) ; seul un chemin interne est repris.
function pageDuLien(brut: string | null): string {
  return brut && brut.startsWith('/') && !brut.startsWith('//') && brut.length <= 200 && !/\s/.test(brut) ? brut : '';
}

function Formulaire() {
  const { t, lang } = useLocale();
  const pageInitiale = pageDuLien(useSearchParams().get('page'));
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(pageInitiale);
  const [piege, setPiege] = useState('');
  const [etat, setEtat] = useState<'repos' | 'envoi' | 'ok'>('repos');
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEtat('envoi');
    try {
      await envoyerContribution({ kind: 'bug', message, page, langue: lang, site: piege });
      setEtat('ok');
    } catch (err) {
      setEtat('repos');
      const code = err instanceof ContributionError ? err.code : 'indisponible';
      setErreur(code === 'texte' ? t.signaler.errorTexte : t.retours.errors[code]);
    }
  }

  if (etat === 'ok') {
    return (
      <p role="status" className="mt-6 text-sm text-green-700">
        {t.signaler.thanks}
      </p>
    );
  }

  return (
    <form onSubmit={envoyer} className="mt-6 max-w-xl space-y-4">
      <div>
        <label htmlFor="bug-message" className="block text-sm text-slate-700">
          {t.signaler.messageLabel}
        </label>
        <textarea
          id="bug-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={15}
          maxLength={800}
          rows={6}
          aria-describedby="bug-hint"
          className={CHAMP}
        />
        <p id="bug-hint" className="mt-1 text-xs text-slate-500">
          {message.length}/800 · {t.signaler.messageHint}
        </p>
      </div>
      <div>
        <label htmlFor="bug-page" className="block text-sm text-slate-700">
          {t.signaler.pageLabel}
        </label>
        <input id="bug-page" value={page} onChange={(e) => setPage(e.target.value)} maxLength={200} placeholder="/logiciel/tally" className={CHAMP} />
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
          {etat === 'envoi' ? t.signaler.sending : t.signaler.submit}
        </button>
        <p className="text-xs text-slate-500">{t.signaler.privacy}</p>
      </div>
    </form>
  );
}

export function BugForm() {
  return (
    <Suspense fallback={null}>
      <Formulaire />
    </Suspense>
  );
}
