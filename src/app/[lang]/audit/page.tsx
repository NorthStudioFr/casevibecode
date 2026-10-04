import type { Metadata } from 'next';
import { getLogiciels } from '@/lib/logiciels-server';
import { AuditClient, type AuditLogiciel } from '@/components/AuditClient';
import { getDict } from '@/lib/i18n/dictionaries';
import { alternatesFor, langOf } from '@/lib/i18n/config';

// La liste vient du cache partagé de getLogiciels : cette page ne coûte aucune lecture de plus.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  const lang = langOf(await params);
  const t = getDict(lang);
  return { title: t.audit.title, description: t.audit.description, alternates: alternatesFor(lang, '/audit') };
}

export default async function AuditPage({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  const lang = langOf(params && (await params));
  const t = getDict(lang);
  const logiciels = await getLogiciels(lang);
  const items: AuditLogiciel[] = logiciels.map((l) => ({
    slug: l.slug,
    nom: l.nom,
    domaine: l.domaine,
    categorie: l.categorie,
    secteur: l.secteur,
    verdict: l.verdictEditeur,
    prix: l.prix,
    prixMensuel: l.prixMensuel,
  }));
  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <h1 className="font-serif text-4xl font-semibold text-slate-800">{t.audit.heading}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{t.audit.intro}</p>
      <AuditClient logiciels={items} />
    </main>
  );
}
