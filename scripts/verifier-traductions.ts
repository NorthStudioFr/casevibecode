// Usage : npx --yes tsx scripts/verifier-traductions.ts
//
// Compare la base aux traductions anglaises (src/content/en/fiches.json) : fiches
// sans traduction, listes dont la longueur diffère de la fiche française, prompt
// manquant. À lancer après chaque ajout de fiches. Lecture seule.
import fiches from '../src/content/en/fiches.json';
import { getServiceClient } from './lib/supabase-admin';

type Tr = { description?: string; justification?: string; perdez?: string[]; prompt?: string; alternatives?: string[] };

async function main() {
  const client = getServiceClient();
  const { data, error } = await client.from('logiciels').select('slug, ce_que_vous_perdez, prompt, alternatives');
  if (error) throw error;
  const tr = fiches as Record<string, Tr>;
  const problemes: string[] = [];
  for (const l of data as { slug: string; ce_que_vous_perdez: string[] | null; prompt: string | null; alternatives: unknown[] | null }[]) {
    const t = tr[l.slug];
    if (!t) { problemes.push(`${l.slug} : pas de traduction`); continue; }
    if (!t.description || !t.justification) problemes.push(`${l.slug} : description ou justification manquante`);
    if ((l.ce_que_vous_perdez?.length ?? 0) !== (t.perdez?.length ?? 0)) problemes.push(`${l.slug} : « ce que vous perdez » ne correspond pas`);
    if ((l.alternatives?.length ?? 0) !== (t.alternatives?.length ?? 0)) problemes.push(`${l.slug} : alternatives ne correspondent pas`);
    if (Boolean(l.prompt) !== Boolean(t.prompt)) problemes.push(`${l.slug} : prompt présent d'un seul côté`);
  }
  const slugs = new Set((data as { slug: string }[]).map((l) => l.slug));
  for (const s of Object.keys(tr)) if (!slugs.has(s)) problemes.push(`${s} : traduction orpheline (fiche absente de la base)`);
  console.log(problemes.length ? problemes.join('\n') : `OK : ${slugs.size} fiches traduites.`);
  process.exit(problemes.length ? 1 : 0);
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
