'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/newsletter-client';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    try {
      await subscribeNewsletter(email);
      setSubmitted(true);
    } catch (err) {
      // e.g. the database rejects a malformed email
      console.error('subscribeNewsletter failed', err);
      setError(true);
    }
  }

  if (submitted) {
    return <p className="text-sm text-green-700">Merci, vous êtes inscrit à la newsletter.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          className="flex-1 rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-sm bg-primary px-4 py-2 font-sans text-sm font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50"
        >
          S&apos;abonner
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          L&apos;inscription a échoué. Vérifiez votre adresse email et réessayez.
        </p>
      )}
    </div>
  );
}
