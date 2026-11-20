-- E-mail de contact facultatif sur les propositions de logiciels.
-- Usage unique : recontacter la personne à propos de cette fiche. Visible des
-- administrateurs seulement (aucun droit pour anon) ; vidé au bout de 13 mois,
-- comme l'empreinte d'adresse IP.

alter table public.propositions
  add column contact_email text
  check (contact_email is null or (char_length(contact_email) between 5 and 120 and contact_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'));

grant select (contact_email) on table public.propositions to authenticated;

-- Remplace la tâche de purge existante (même nom) : l'e-mail part avec l'empreinte d'IP.
select cron.schedule(
  'purge-contributions-casevibecode',
  '23 3 * * *',
  $$
    update public.retours set ip_hash = '' where created_at < now() - interval '13 months' and ip_hash <> '';
    update public.propositions set ip_hash = '', contact_email = null
      where created_at < now() - interval '13 months' and (ip_hash <> '' or contact_email is not null);
  $$
);
