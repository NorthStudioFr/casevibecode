-- Limite de débit partagée entre toutes les instances serverless (la version
-- en mémoire de chaque instance ne limitait rien) + purge des empreintes d'IP.

create table public.rate_limits (
  cle text not null,
  fenetre timestamptz not null,
  compte integer not null default 0,
  primary key (cle, fenetre)
);

alter table public.rate_limits enable row level security;
revoke all on table public.rate_limits from public, anon, authenticated;

-- Fenêtre fixe : incrémente le compteur de la fenêtre courante et dit si la
-- limite est respectée. Réservée au serveur (service_role).
create function public.rate_limit_hit(p_cle text, p_max integer, p_fenetre_secondes integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  debut timestamptz := to_timestamp(floor(extract(epoch from now()) / p_fenetre_secondes) * p_fenetre_secondes);
  n integer;
begin
  insert into public.rate_limits as r (cle, fenetre, compte)
  values (p_cle, debut, 1)
  on conflict (cle, fenetre) do update set compte = r.compte + 1
  returning r.compte into n;
  return n <= p_max;
end;
$$;

revoke all on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;

-- Purge quotidienne : votes (empreinte d'IP salée) conservés 13 mois après leur
-- dernière modification, compteurs de limitation 2 jours.
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'purge-casevibecode',
  '17 3 * * *',
  $$
    delete from public.votes where updated_at < now() - interval '13 months';
    delete from public.rate_limits where fenetre < now() - interval '2 days';
  $$
);
