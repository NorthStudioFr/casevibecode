-- casevibecode : schéma initial (migration depuis Firestore).
--
-- Principes :
--  * RLS activée sur chaque table ;
--  * aucun accès par défaut : revoke all puis grant ciblés ;
--  * le droit « administrateur » se lit UNIQUEMENT dans app_metadata (modifiable
--    seulement côté serveur), jamais dans user_metadata (que l'utilisateur peut écrire) ;
--  * le vote se fait sans compte, via les connexions ANONYMES de Supabase Auth
--    (rôle `authenticated`, jeton avec is_anonymous = true) : un anonyme vote pour
--    lui-même, mais l'écriture sur `logiciels` lui est explicitement refusée.

-- ---------------------------------------------------------------------------
-- logiciels : fiches éditoriales (clé = slug, identique à l'ancien id Firestore)
-- ---------------------------------------------------------------------------
create table public.logiciels (
  slug text primary key,
  nom text not null,
  categorie text not null
    check (categorie in ('caisse', 'reservation', 'livraison', 'compta', 'autre')),
  description text not null,
  verdict_editeur text not null
    check (verdict_editeur in ('YES', 'KINDA', 'NOT_REALLY')),
  justification_editeur text not null,
  domaine text not null,
  prix text,
  prix_mensuel numeric check (prix_mensuel is null or prix_mensuel >= 0),
  ce_que_vous_perdez jsonb check (ce_que_vous_perdez is null or jsonb_typeof(ce_que_vous_perdez) = 'array'),
  alternatives jsonb check (alternatives is null or jsonb_typeof(alternatives) = 'array'),
  date_ajout timestamptz not null default now(),
  date_maj timestamptz not null default now()
);

alter table public.logiciels enable row level security;

create function public.set_date_maj()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.date_maj := now();
  return new;
end;
$$;

revoke all on function public.set_date_maj() from public, anon, authenticated;

create trigger logiciels_set_date_maj
  before update on public.logiciels
  for each row execute function public.set_date_maj();

revoke all on table public.logiciels from anon, authenticated;
grant select on table public.logiciels to anon, authenticated;
grant insert, update on table public.logiciels to authenticated;

create policy "logiciels : lecture publique"
  on public.logiciels for select
  to anon, authenticated
  using (true);

create policy "logiciels : insertion réservée aux administrateurs"
  on public.logiciels for insert
  to authenticated
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

create policy "logiciels : modification réservée aux administrateurs"
  on public.logiciels for update
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

-- ---------------------------------------------------------------------------
-- votes : un vote par utilisateur et par logiciel
-- ---------------------------------------------------------------------------
create table public.votes (
  user_id uuid not null references auth.users (id) on delete cascade,
  logiciel_slug text not null references public.logiciels (slug),
  valeur text not null check (valeur in ('remplace', 'pas_remplacable')),
  horodatage timestamptz not null default now(),
  primary key (user_id, logiciel_slug)
);

alter table public.votes enable row level security;

-- L'horodatage est toujours posé par la base : un client ne peut pas le falsifier.
create function public.set_vote_horodatage()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.horodatage := now();
  return new;
end;
$$;

revoke all on function public.set_vote_horodatage() from public, anon, authenticated;

create trigger votes_set_horodatage
  before insert or update on public.votes
  for each row execute function public.set_vote_horodatage();

revoke all on table public.votes from anon, authenticated;
grant select, insert, update on table public.votes to authenticated;

create policy "votes : lecture de ses propres votes"
  on public.votes for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "votes : insertion de ses propres votes"
  on public.votes for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "votes : modification de ses propres votes"
  on public.votes for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Pas de policy de suppression : personne ne supprime un vote côté client.

-- Compteurs publics : agrégat seul, aucun identifiant d'utilisateur n'est renvoyé.
create function public.vote_counts(p_slug text)
returns table (remplace integer, pas_remplacable integer)
language sql
stable
security definer
set search_path = public
as $$
  select
    (count(*) filter (where v.valeur = 'remplace'))::integer,
    (count(*) filter (where v.valeur = 'pas_remplacable'))::integer
  from public.votes v
  where v.logiciel_slug = p_slug;
$$;

-- Les privilèges par défaut de Supabase accordent EXECUTE à anon/authenticated sur
-- toute nouvelle fonction : on les retire explicitement avant le grant ciblé.
revoke all on function public.vote_counts(text) from public, anon, authenticated;
grant execute on function public.vote_counts(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- abonnes_newsletter : insertion seule, aucune lecture publique
-- ---------------------------------------------------------------------------
create table public.abonnes_newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null
    check (char_length(email) < 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  date_inscription timestamptz not null default now()
);

-- Déduplication insensible à la casse.
create unique index abonnes_newsletter_email_unique
  on public.abonnes_newsletter (lower(email));

alter table public.abonnes_newsletter enable row level security;

revoke all on table public.abonnes_newsletter from anon, authenticated;
grant insert on table public.abonnes_newsletter to anon, authenticated;

create policy "abonnes_newsletter : insertion seule"
  on public.abonnes_newsletter for insert
  to anon, authenticated
  with check (true);
