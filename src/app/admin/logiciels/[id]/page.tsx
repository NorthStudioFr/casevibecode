'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLogicielClient, saveLogiciel } from '@/lib/logiciels-admin-client';
import type { Categorie, NouveauLogiciel, VerdictEditeur } from '@/types/logiciel';

// This page reads and writes through the Supabase browser client, which needs
// the public Supabase env vars. They are absent at build time (CI), so
// prerendering must not run: force dynamic rendering.
export const dynamic = 'force-dynamic';

const CATEGORIES: Categorie[] = ['caisse', 'reservation', 'livraison', 'compta', 'autre'];
const VERDICTS: VerdictEditeur[] = ['YES', 'KINDA', 'NOT_REALLY'];

const BLANK_FORM: NouveauLogiciel = {
  nom: '',
  slug: '',
  categorie: 'caisse',
  secteur: 'chr',
  description: '',
  verdictEditeur: 'KINDA',
  justificationEditeur: '',
  domaine: '',
  prix: '',
};

export default function LogicielFormPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'nouveau';
  // The primary key of `logiciels` IS the slug (saveLogiciel and the seed script
  // both key on it). When editing, the slug is therefore locked to the route id:
  // letting it change would make saveLogiciel create a second doc under the
  // new slug and orphan every vote pointing at the old id.
  const [form, setForm] = useState<NouveauLogiciel>(
    isNew || !id ? BLANK_FORM : { ...BLANK_FORM, slug: id }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // "nouveau" is the create route (see the admin list page's "Nouvelle
  // fiche" link) — only fetch when editing an existing fiche, and only
  // populate the form if the doc actually exists (a stale/mistyped id
  // keeps the blank form, with the slug still locked to the route id).
  useEffect(() => {
    if (!id || isNew) return;
    let cancelled = false;
    getLogicielClient(id).then((data) => {
      if (cancelled || !data) return;
      // On repart de TOUTE la fiche : les champs sans champ de formulaire
      // (alternatives, ceQueVousPerdez, prompt, secteur…) doivent survivre à
      // l'enregistrement, sinon la mise à jour les écraserait par null.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, dateAjout: _ajout, dateMaj: _maj, ...rest } = data;
      setForm({ ...rest, slug: id, prix: data.prix ?? '' });
    });
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const slug = isNew ? form.slug.trim() : id;
    if (!slug) {
      setError('Le slug est obligatoire.');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        // saveLogiciel updates the row for this slug: without this check, creating a
        // "new" fiche with an existing slug would silently overwrite it.
        const existing = await getLogicielClient(slug);
        if (existing) {
          setError(`Une fiche avec le slug « ${slug} » existe déjà. Choisissez un autre slug ou modifiez la fiche existante.`);
          return;
        }
      }
      await saveLogiciel({ ...form, slug });
      router.push('/admin');
    } catch (err) {
      console.error('saveLogiciel failed', err);
      setError("L'enregistrement a échoué. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="font-serif text-2xl font-semibold text-slate-800">Fiche logiciel</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label>
          Nom
          <input
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          />
        </label>
        <label>
          Slug (identifiant URL)
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            disabled={!isNew}
            aria-describedby={isNew ? undefined : 'slug-verrouille'}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none disabled:bg-slate-100"
          />
        </label>
        {!isNew && (
          <p id="slug-verrouille" className="-mt-3 text-xs text-slate-500">
            Le slug ne peut plus être modifié une fois la fiche créée.
          </p>
        )}
        <label>
          Catégorie
          <select
            value={form.categorie}
            onChange={(e) => setForm({ ...form, categorie: e.target.value as Categorie })}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          />
        </label>
        <label>
          Verdict éditeur
          <select
            value={form.verdictEditeur}
            onChange={(e) => setForm({ ...form, verdictEditeur: e.target.value as VerdictEditeur })}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          >
            {VERDICTS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Justification éditeur
          <textarea
            value={form.justificationEditeur}
            onChange={(e) => setForm({ ...form, justificationEditeur: e.target.value })}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          />
        </label>
        <label>
          Domaine du site (ex: zenchef.com)
          <input
            value={form.domaine}
            onChange={(e) => setForm({ ...form, domaine: e.target.value })}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          />
        </label>
        <label>
          Prix (optionnel, ex: 29 €/mois)
          <input
            value={form.prix}
            onChange={(e) => setForm({ ...form, prix: e.target.value })}
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          />
        </label>
        <label>
          Prix mensuel en € (nombre, optionnel)
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.prixMensuel ?? ''}
            onChange={(e) =>
              setForm({ ...form, prixMensuel: e.target.value === '' ? undefined : Number(e.target.value) })
            }
            className="mt-1 w-full rounded-sm border border-slate-300 px-3 py-2 focus:border-secondary focus:outline-none"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button type="submit" disabled={saving} className="rounded-sm bg-primary px-4 py-2 font-sans text-sm font-medium text-primary-ink transition-colors hover:bg-secondary hover:text-stone-50 disabled:opacity-50">
          Enregistrer
        </button>
      </form>
    </main>
  );
}
