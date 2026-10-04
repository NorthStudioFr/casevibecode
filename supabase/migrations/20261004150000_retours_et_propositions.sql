-- Retours de la communauté (« je l'ai construit », « ça a cassé ») et propositions
-- de logiciels.
--
-- * Aucune écriture publique directe : les envois passent par /api/contribution
--   (rôle service_role, limite de débit, champ piège).
-- * Un retour n'est visible qu'une fois publié par un administrateur.
-- * L'empreinte d'adresse IP (salée, comme pour les votes) n'est jamais lisible
--   côté navigateur et est vidée au bout de 13 mois.

create table public.retours (
  id uuid primary key default gen_random_uuid(),
  logiciel_slug text not null references public.logiciels (slug) on delete cascade,
  type text not null check (type in ('construit', 'casse')),
  texte text not null check (char_length(texte) between 20 and 600),
  lien text check (lien is null or (lien ~ '^https://' and char_length(lien) <= 200)),
  langue text not null default 'fr' check (langue in ('fr', 'en')),
  statut text not null default 'en_attente' check (statut in ('en_attente', 'publie', 'refuse')),
  ip_hash text not null,
  created_at timestamptz not null default now(),
  modere_le timestamptz
);

create index retours_fiche_idx on public.retours (logiciel_slug, created_at desc) where statut = 'publie';

alter table public.retours enable row level security;
revoke all on table public.retours from public, anon, authenticated;

-- Le public lit les retours publiés, colonnes limitées (ni ip_hash, ni statut).
grant select (id, logiciel_slug, type, texte, lien, langue, created_at) on table public.retours to anon, authenticated;
-- Les administrateurs voient aussi le statut et peuvent le modifier.
grant select (statut, modere_le) on table public.retours to authenticated;
grant update (statut, modere_le) on table public.retours to authenticated;

create policy "retours : lecture publique des retours publiés"
  on public.retours for select
  to anon, authenticated
  using (statut = 'publie');

create policy "retours : lecture complète réservée aux administrateurs"
  on public.retours for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

create policy "retours : modération réservée aux administrateurs"
  on public.retours for update
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

create table public.propositions (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (char_length(nom) between 2 and 80),
  url text check (url is null or (url ~ '^https://' and char_length(url) <= 200)),
  raison text check (raison is null or char_length(raison) <= 500),
  langue text not null default 'fr' check (langue in ('fr', 'en')),
  traitee boolean not null default false,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.propositions enable row level security;
revoke all on table public.propositions from public, anon, authenticated;
grant select (id, nom, url, raison, langue, traitee, created_at) on table public.propositions to authenticated;
grant update (traitee) on table public.propositions to authenticated;

create policy "propositions : lecture réservée aux administrateurs"
  on public.propositions for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

create policy "propositions : traitement réservé aux administrateurs"
  on public.propositions for update
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

-- Purge : empreintes d'IP vidées après 13 mois, comme pour les votes.
select cron.schedule(
  'purge-contributions-casevibecode',
  '23 3 * * *',
  $$
    update public.retours set ip_hash = '' where created_at < now() - interval '13 months' and ip_hash <> '';
    update public.propositions set ip_hash = '' where created_at < now() - interval '13 months' and ip_hash <> '';
  $$
);
