-- Signalements de bugs envoyés par les visiteurs (sans compte, sans e-mail).
--
-- * Aucune écriture publique directe : les envois passent par /api/contribution
--   (rôle service_role, limite de débit, champ piège), comme les retours.
-- * Lecture et traitement réservés aux administrateurs.
-- * L'empreinte d'adresse IP (salée) n'est jamais lisible côté navigateur et est
--   vidée au bout de 13 mois.

create table public.bugs (
  id uuid primary key default gen_random_uuid(),
  message text not null check (char_length(message) between 15 and 800),
  page text check (page is null or (page ~ '^/[^[:space:]]*$' and left(page, 2) <> '//' and char_length(page) <= 200)),
  langue text not null default 'fr' check (langue in ('fr', 'en')),
  traite boolean not null default false,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.bugs enable row level security;
revoke all on table public.bugs from public, anon, authenticated;
grant select (id, message, page, langue, traite, created_at) on table public.bugs to authenticated;
grant update (traite) on table public.bugs to authenticated;

create policy "bugs : lecture réservée aux administrateurs"
  on public.bugs for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

create policy "bugs : traitement réservé aux administrateurs"
  on public.bugs for update
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'admin') = 'true'
    and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  );

select cron.schedule(
  'purge-bugs-casevibecode',
  '27 3 * * *',
  $$ update public.bugs set ip_hash = '' where created_at < now() - interval '13 months' and ip_hash <> ''; $$
);
