import type { Metadata } from 'next';
import { langOf } from '@/lib/i18n/config';
import { SecteurLanding, secteurMetadata } from '@/components/SecteurLanding';

// Comme l'accueil : régénérée au plus une fois par heure (une lecture de votes par fiche).
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang?: string }> }): Promise<Metadata> {
  return secteurMetadata(langOf(await params), 'chr');
}

export default async function Page({ params }: { params?: Promise<{ lang?: string }> } = {}) {
  return <SecteurLanding lang={langOf(params && (await params))} secteur="chr" />;
}
