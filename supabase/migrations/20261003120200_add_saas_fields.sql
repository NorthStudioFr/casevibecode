alter table public.logiciels
  drop constraint logiciels_categorie_check;

-- On ne remet pas de contrainte stricte sur la catégorie car le secteur SaaS
-- aura de nombreuses catégories.
-- alter table public.logiciels add constraint logiciels_categorie_check check (...);

alter table public.logiciels
  add column secteur text not null default 'chr' check (secteur in ('chr', 'saas')),
  add column prompt text,
  add column source_verdict text;
