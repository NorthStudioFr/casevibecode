import type { Langue } from './contribution';

export type ErreurContribution = 'trop' | 'texte' | 'lien' | 'nom' | 'raison' | 'fiche' | 'type' | 'page' | 'invalide' | 'indisponible' | 'reseau';

export class ContributionError extends Error {
  constructor(public code: ErreurContribution) {
    super(code);
  }
}

// Envoie un retour ou une proposition ; lève ContributionError avec un code que
// l'interface traduit.
export async function envoyerContribution(corps: Record<string, unknown> & { langue: Langue }): Promise<void> {
  let res: Response;
  try {
    res = await fetch('/api/contribution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps),
    });
  } catch {
    throw new ContributionError('reseau');
  }
  if (res.ok) return;
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  const connu: ErreurContribution[] = ['trop', 'texte', 'lien', 'nom', 'raison', 'fiche', 'type', 'page', 'invalide'];
  if (res.status === 429) throw new ContributionError('trop');
  if (res.status === 503) throw new ContributionError('indisponible');
  throw new ContributionError(connu.find((c) => c === data.error) ?? 'indisponible');
}
