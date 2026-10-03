// Tests d'intégration des règles d'accès (RLS) contre la pile Supabase LOCALE.
// Prérequis : `supabase start` dans ce dépôt. Les clés de la pile locale sont
// lues à l'exécution (`supabase status -o env`) ou, à défaut, dans les variables
// SUPABASE_TEST_URL / SUPABASE_TEST_ANON_KEY / SUPABASE_TEST_SERVICE_ROLE_KEY :
// aucune clé n'est écrite dans le dépôt.
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

function localStack(): { url: string; anonKey: string; serviceKey: string } {
  const { SUPABASE_TEST_URL: url, SUPABASE_TEST_ANON_KEY: anonKey, SUPABASE_TEST_SERVICE_ROLE_KEY: serviceKey } =
    process.env;
  if (url && anonKey && serviceKey) return { url, anonKey, serviceKey };
  const out = execSync('supabase status -o env', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    env: { ...process.env, PATH: `/opt/homebrew/bin:${process.env.PATH}` },
  });
  const env = Object.fromEntries(
    out
      .split('\n')
      .filter((l) => l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^"|"$/g, '')]),
  );
  return { url: env.API_URL, anonKey: env.ANON_KEY, serviceKey: env.SERVICE_ROLE_KEY };
}

const stack = localStack();
const PASSWORD = 'Mot-de-passe-de-test-1!';
const run = randomUUID().slice(0, 8);

const noSession = { auth: { persistSession: false, autoRefreshToken: false } };
const newClient = (key: string) => createClient(stack.url, key, noSession);

const service = newClient(stack.serviceKey);
const anon = newClient(stack.anonKey);

async function createUser(label: string, meta: { app?: Record<string, unknown>; user?: Record<string, unknown> } = {}) {
  const email = `${label}-${run}@test.invalid`;
  const { data, error } = await service.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    app_metadata: meta.app,
    user_metadata: meta.user,
  });
  if (error) throw error;
  const client = newClient(stack.anonKey);
  const { error: signInError } = await client.auth.signInWithPassword({ email, password: PASSWORD });
  if (signInError) throw signInError;
  return { id: data.user.id, email, client };
}

type TestUser = Awaited<ReturnType<typeof createUser>>;

const SLUG = `test-${run}`;
const SLUG_2 = `test2-${run}`;
const fiche = (slug: string) => ({
  slug,
  nom: `Logiciel ${slug}`,
  categorie: 'caisse',
  description: 'desc',
  verdict_editeur: 'KINDA',
  justification_editeur: 'just',
  domaine: 'exemple.test',
});

let alice: TestUser;
let bob: TestUser;
let admin: TestUser;
let fakeAdmin: TestUser; // user_metadata.admin = true (sans effet attendu)
const anonIds: string[] = [];

// Session anonyme Supabase Auth (vote sans compte) ; `data` = user_metadata.
async function anonymousUser(data?: Record<string, unknown>) {
  const client = newClient(stack.anonKey);
  const { data: res, error } = await client.auth.signInAnonymously(data ? { options: { data } } : undefined);
  if (error) throw error;
  anonIds.push(res.user!.id);
  return { id: res.user!.id, client };
}
const emailsCrees: string[] = [];

beforeAll(async () => {
  alice = await createUser('alice');
  bob = await createUser('bob');
  admin = await createUser('admin', { app: { admin: true } });
  fakeAdmin = await createUser('fake', { user: { admin: true } });
  const { error } = await service.from('logiciels').insert([fiche(SLUG), fiche(SLUG_2)]);
  if (error) throw error;
});

afterAll(async () => {
  await service.from('votes').delete().in('logiciel_slug', [SLUG, SLUG_2]);
  await service.from('logiciels').delete().like('slug', `%-${run}`);
  for (const email of emailsCrees) await service.from('abonnes_newsletter').delete().ilike('email', email);
  for (const u of [alice, bob, admin, fakeAdmin]) await service.auth.admin.deleteUser(u.id);
  for (const id of anonIds) await service.auth.admin.deleteUser(id);
});

describe('logiciels', () => {
  it('lecture publique sans compte', async () => {
    const { data, error } = await anon.from('logiciels').select('slug').eq('slug', SLUG);
    expect(error).toBeNull();
    expect(data).toEqual([{ slug: SLUG }]);
  });

  it("refuse l'écriture sans compte", async () => {
    const { error } = await anon.from('logiciels').insert(fiche(`anon-${run}`));
    expect(error).not.toBeNull();
  });

  it("refuse l'insertion à un utilisateur ordinaire", async () => {
    const { error } = await alice.client.from('logiciels').insert(fiche(`alice-${run}`));
    expect(error).not.toBeNull();
    const { data } = await service.from('logiciels').select('slug').eq('slug', `alice-${run}`);
    expect(data).toEqual([]);
  });

  it("refuse la modification à un utilisateur ordinaire (aucune ligne modifiée)", async () => {
    const { data } = await alice.client.from('logiciels').update({ nom: 'piraté' }).eq('slug', SLUG).select();
    expect(data ?? []).toEqual([]);
    const { data: lu } = await service.from('logiciels').select('nom').eq('slug', SLUG).single();
    expect(lu?.nom).toBe(`Logiciel ${SLUG}`);
  });

  it("accepte l'insertion et la modification par un administrateur (app_metadata.admin)", async () => {
    const slug = `admin-${run}`;
    const ins = await admin.client.from('logiciels').insert(fiche(slug));
    expect(ins.error).toBeNull();
    const upd = await admin.client.from('logiciels').update({ nom: 'modifié' }).eq('slug', slug).select();
    expect(upd.error).toBeNull();
    expect(upd.data).toHaveLength(1);
    expect(upd.data?.[0].nom).toBe('modifié');
  });

  it('user_metadata.admin ne donne aucun droit', async () => {
    const ins = await fakeAdmin.client.from('logiciels').insert(fiche(`fake-${run}`));
    expect(ins.error).not.toBeNull();
    const upd = await fakeAdmin.client.from('logiciels').update({ nom: 'piraté' }).eq('slug', SLUG).select();
    expect(upd.data ?? []).toEqual([]);
    const { data } = await service.from('logiciels').select('nom').eq('slug', SLUG).single();
    expect(data?.nom).toBe(`Logiciel ${SLUG}`);
  });

  it("un utilisateur ne peut pas s'accorder le droit admin via updateUser (user_metadata)", async () => {
    const { error } = await alice.client.auth.updateUser({ data: { admin: true } });
    expect(error).toBeNull();
    await alice.client.auth.refreshSession();
    const ins = await alice.client.from('logiciels').insert(fiche(`alice2-${run}`));
    expect(ins.error).not.toBeNull();
  });

  it("date_maj est mise à jour par la base à chaque modification, date_ajout reste", async () => {
    const slug = `date-${run}`;
    await service.from('logiciels').insert(fiche(slug));
    const avant = (await service.from('logiciels').select('date_ajout, date_maj').eq('slug', slug).single()).data!;
    await new Promise((r) => setTimeout(r, 50));
    await service.from('logiciels').update({ nom: 'x' }).eq('slug', slug);
    const apres = (await service.from('logiciels').select('date_ajout, date_maj').eq('slug', slug).single()).data!;
    expect(apres.date_ajout).toBe(avant.date_ajout);
    expect(new Date(apres.date_maj).getTime()).toBeGreaterThan(new Date(avant.date_maj).getTime());
  });
});

describe('votes', () => {
  it('un utilisateur vote et relit son vote', async () => {
    const ins = await alice.client
      .from('votes')
      .upsert({ user_id: alice.id, logiciel_slug: SLUG, valeur: 'remplace' });
    expect(ins.error).toBeNull();
    const { data } = await alice.client.from('votes').select('valeur').eq('logiciel_slug', SLUG);
    expect(data).toEqual([{ valeur: 'remplace' }]);
  });

  it('revoter remplace le vote précédent (un seul vote par fiche)', async () => {
    const r = await alice.client
      .from('votes')
      .upsert({ user_id: alice.id, logiciel_slug: SLUG, valeur: 'pas_remplacable' });
    expect(r.error).toBeNull();
    const { data } = await alice.client.from('votes').select('valeur').eq('logiciel_slug', SLUG);
    expect(data).toEqual([{ valeur: 'pas_remplacable' }]);
  });

  it("refuse de voter au nom d'un autre", async () => {
    const { error } = await alice.client
      .from('votes')
      .insert({ user_id: bob.id, logiciel_slug: SLUG_2, valeur: 'remplace' });
    expect(error).not.toBeNull();
    const { data } = await service.from('votes').select('*').eq('user_id', bob.id);
    expect(data).toEqual([]);
  });

  it('ne permet pas de lire ni de modifier le vote des autres', async () => {
    await bob.client.from('votes').upsert({ user_id: bob.id, logiciel_slug: SLUG, valeur: 'remplace' });
    const lecture = await alice.client.from('votes').select('user_id').eq('user_id', bob.id);
    expect(lecture.data ?? []).toEqual([]);
    const maj = await alice.client
      .from('votes')
      .update({ valeur: 'pas_remplacable' })
      .eq('user_id', bob.id)
      .select();
    expect(maj.data ?? []).toEqual([]);
    const { data } = await service.from('votes').select('valeur').eq('user_id', bob.id).eq('logiciel_slug', SLUG).single();
    expect(data?.valeur).toBe('remplace');
  });

  it("refuse de réattribuer son vote à un autre utilisateur par modification", async () => {
    const { error, data } = await alice.client
      .from('votes')
      .update({ user_id: bob.id })
      .eq('user_id', alice.id)
      .eq('logiciel_slug', SLUG)
      .select();
    expect(error !== null || (data ?? []).length === 0).toBe(true);
    const { data: verif } = await service.from('votes').select('user_id').eq('logiciel_slug', SLUG).eq('user_id', alice.id);
    expect(verif).toHaveLength(1);
  });

  it('refuse une valeur de vote invalide', async () => {
    const { error } = await alice.client
      .from('votes')
      .upsert({ user_id: alice.id, logiciel_slug: SLUG_2, valeur: 'peut-etre' });
    expect(error).not.toBeNull();
  });

  it('refuse le vote sans compte', async () => {
    const { error } = await anon
      .from('votes')
      .insert({ user_id: alice.id, logiciel_slug: SLUG_2, valeur: 'remplace' });
    expect(error).not.toBeNull();
  });

  it('refuse la suppression de vote côté client', async () => {
    const { data } = await alice.client.from('votes').delete().eq('user_id', alice.id).select();
    expect(data ?? []).toEqual([]);
    const { data: reste } = await service.from('votes').select('*').eq('user_id', alice.id).eq('logiciel_slug', SLUG);
    expect(reste).toHaveLength(1);
  });

  it("l'horodatage ne peut pas être falsifié par le client", async () => {
    const r = await alice.client.from('votes').upsert({
      user_id: alice.id,
      logiciel_slug: SLUG_2,
      valeur: 'remplace',
      horodatage: '2000-01-01T00:00:00Z',
    });
    expect(r.error).toBeNull();
    const { data } = await service.from('votes').select('horodatage').eq('user_id', alice.id).eq('logiciel_slug', SLUG_2).single();
    expect(new Date(data!.horodatage).getFullYear()).toBeGreaterThan(2020);
  });

  it('refuse un vote sur une fiche inexistante', async () => {
    const { error } = await alice.client
      .from('votes')
      .insert({ user_id: alice.id, logiciel_slug: `inexistant-${run}`, valeur: 'remplace' });
    expect(error).not.toBeNull();
  });
});

describe('votes sans compte (connexion anonyme)', () => {
  it('un anonyme vote pour lui-même, et un second vote sur la même fiche met à jour (pas de doublon)', async () => {
    const u = await anonymousUser();
    const premier = await u.client
      .from('votes')
      .upsert({ user_id: u.id, logiciel_slug: SLUG_2, valeur: 'remplace' }, { onConflict: 'user_id,logiciel_slug' });
    expect(premier.error).toBeNull();
    const second = await u.client
      .from('votes')
      .upsert({ user_id: u.id, logiciel_slug: SLUG_2, valeur: 'pas_remplacable' }, { onConflict: 'user_id,logiciel_slug' });
    expect(second.error).toBeNull();
    const { data } = await service.from('votes').select('valeur').eq('user_id', u.id).eq('logiciel_slug', SLUG_2);
    expect(data).toEqual([{ valeur: 'pas_remplacable' }]);
    const relu = await u.client.from('votes').select('valeur').eq('logiciel_slug', SLUG_2);
    expect(relu.data).toEqual([{ valeur: 'pas_remplacable' }]);
  });

  it("un anonyme ne peut pas voter au nom d'un autre, ni lire ou modifier le vote d'un autre", async () => {
    const u = await anonymousUser();
    const usurpe = await u.client
      .from('votes')
      .insert({ user_id: alice.id, logiciel_slug: `x-${run}`, valeur: 'remplace' });
    expect(usurpe.error).not.toBeNull();
    const lecture = await u.client.from('votes').select('user_id').eq('user_id', bob.id);
    expect(lecture.data ?? []).toEqual([]);
    const maj = await u.client.from('votes').update({ valeur: 'remplace' }).eq('user_id', bob.id).select();
    expect(maj.data ?? []).toEqual([]);
  });

  it('un anonyme ne peut rien écrire dans logiciels, même avec user_metadata.admin = true', async () => {
    const u = await anonymousUser({ admin: true });
    const ins = await u.client.from('logiciels').insert(fiche(`anon-meta-${run}`));
    expect(ins.error).not.toBeNull();
    const upd = await u.client.from('logiciels').update({ nom: 'piraté' }).eq('slug', SLUG).select();
    expect(upd.data ?? []).toEqual([]);
    const { data } = await service.from('logiciels').select('nom').eq('slug', SLUG).single();
    expect(data?.nom).toBe(`Logiciel ${SLUG}`);
  });

  it('un anonyme ne peut rien écrire dans logiciels, même avec app_metadata.admin = true (condition is_anonymous)', async () => {
    const u = await anonymousUser();
    const { error: e } = await service.auth.admin.updateUserById(u.id, { app_metadata: { admin: true } });
    expect(e).toBeNull();
    await u.client.auth.refreshSession(); // le nouveau jeton porte app_metadata.admin ET is_anonymous
    const ins = await u.client.from('logiciels').insert(fiche(`anon-app-${run}`));
    expect(ins.error).not.toBeNull();
    const upd = await u.client.from('logiciels').update({ nom: 'piraté' }).eq('slug', SLUG).select();
    expect(upd.data ?? []).toEqual([]);
    const { data } = await service.from('logiciels').select('nom').eq('slug', SLUG).single();
    expect(data?.nom).toBe(`Logiciel ${SLUG}`);
  });

  it("un anonyme lit les fiches, n'a pas accès à la liste des abonnés, et lit vote_counts", async () => {
    const u = await anonymousUser();
    const fiches = await u.client.from('logiciels').select('slug').eq('slug', SLUG);
    expect(fiches.data).toEqual([{ slug: SLUG }]);
    const abonnes = await u.client.from('abonnes_newsletter').select('*');
    expect(abonnes.error !== null || (abonnes.data ?? []).length === 0).toBe(true);
    const counts = await u.client.rpc('vote_counts', { p_slug: SLUG });
    expect(counts.error).toBeNull();
  });
});

describe('vote_counts', () => {
  it('est accessible sans compte et renvoie les compteurs agrégés', async () => {
    // État : alice -> pas_remplacable (SLUG), bob -> remplace (SLUG)
    const { data, error } = await anon.rpc('vote_counts', { p_slug: SLUG });
    expect(error).toBeNull();
    expect(data).toEqual([{ remplace: 1, pas_remplacable: 1 }]);
  });

  it('renvoie 0/0 pour une fiche sans vote', async () => {
    const { data, error } = await anon.rpc('vote_counts', { p_slug: `vide-${run}` });
    expect(error).toBeNull();
    expect(data).toEqual([{ remplace: 0, pas_remplacable: 0 }]);
  });

  it("ne révèle aucun identifiant d'utilisateur", async () => {
    const { data } = await anon.rpc('vote_counts', { p_slug: SLUG });
    const json = JSON.stringify(data);
    expect(json).not.toContain(alice.id);
    expect(json).not.toContain(bob.id);
    expect(Object.keys(data![0]).sort()).toEqual(['pas_remplacable', 'remplace']);
  });

  it('un anonyme ne peut pas lire la table votes directement', async () => {
    const { data, error } = await anon.from('votes').select('*');
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });
});

describe('abonnes_newsletter', () => {
  const email = (l: string) => {
    const e = `${l}-${run}@exemple.test`;
    emailsCrees.push(e);
    return e;
  };

  it("accepte l'inscription sans compte", async () => {
    const { error } = await anon.from('abonnes_newsletter').insert({ email: email('ok') });
    expect(error).toBeNull();
  });

  it("accepte l'inscription d'un utilisateur connecté", async () => {
    const { error } = await alice.client.from('abonnes_newsletter').insert({ email: email('connecte') });
    expect(error).toBeNull();
  });

  it.each(['pas-un-email', 'a@b', '@x.fr', 'a b@x.fr', 'a@@x.fr', ''])('refuse un e-mail invalide : %j', async (e) => {
    const { error } = await anon.from('abonnes_newsletter').insert({ email: e });
    expect(error).not.toBeNull();
  });

  it('refuse un e-mail trop long', async () => {
    const { error } = await anon.from('abonnes_newsletter').insert({ email: `${'a'.repeat(250)}@x.fr` });
    expect(error).not.toBeNull();
  });

  it('refuse un doublon, même avec une casse différente', async () => {
    const e = email('doublon');
    expect((await anon.from('abonnes_newsletter').insert({ email: e })).error).toBeNull();
    const memeCasse = await anon.from('abonnes_newsletter').insert({ email: e });
    expect(memeCasse.error?.code).toBe('23505');
    const autreCasse = await anon.from('abonnes_newsletter').insert({ email: e.toUpperCase() });
    expect(autreCasse.error?.code).toBe('23505');
  });

  it('ne permet aucune lecture de la liste, ni anonyme ni connecté', async () => {
    for (const c of [anon, alice.client, admin.client]) {
      const { data, error } = await c.from('abonnes_newsletter').select('*');
      expect(error !== null || (data ?? []).length === 0).toBe(true);
    }
    const { count } = await service.from('abonnes_newsletter').select('*', { count: 'exact', head: true });
    expect(count).toBeGreaterThan(0);
  });

  it('ne permet ni modification ni suppression côté client', async () => {
    const e = email('immuable');
    await anon.from('abonnes_newsletter').insert({ email: e });
    const maj = await alice.client.from('abonnes_newsletter').update({ email: `x-${e}` }).eq('email', e).select();
    expect(maj.data ?? []).toEqual([]);
    const sup = await alice.client.from('abonnes_newsletter').delete().eq('email', e).select();
    expect(sup.data ?? []).toEqual([]);
    const { data } = await service.from('abonnes_newsletter').select('email').eq('email', e);
    expect(data).toHaveLength(1);
  });
});

describe('RLS activée partout', () => {
  it('aucune table du schéma public sans RLS', () => {
    const sql =
      "select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace " +
      "where n.nspname = 'public' and c.relkind in ('r','p') and not c.relrowsecurity";
    const out = execSync(`docker exec supabase_db_casevibecode psql -U postgres -tA -c "${sql}"`, {
      encoding: 'utf8',
      env: { ...process.env, PATH: `/usr/local/bin:/opt/homebrew/bin:${process.env.PATH}` },
    });
    expect(out.trim()).toBe('');
  });
});
