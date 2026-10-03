drop function if exists public.vote_counts(text);
-- Supprimer la table emporte son trigger (votes_set_horodatage) ; ensuite
-- seulement, la fonction qu'il appelait n'a plus de dépendant.
drop table if exists public.votes;
drop function if exists public.set_vote_horodatage();

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  logiciel_slug text not null references public.logiciels (slug) on delete cascade,
  valeur text not null check (valeur in ('remplace', 'pas_remplacable')),
  ip_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (logiciel_slug, ip_hash)
);

alter table public.votes enable row level security;

-- Aucune politique : seul le serveur (service_role) insère/met à jour.
revoke all on table public.votes from anon, authenticated;

-- Fonction exposant le strict nécessaire
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

revoke all on function public.vote_counts(text) from public, anon, authenticated;
grant execute on function public.vote_counts(text) to anon, authenticated;
