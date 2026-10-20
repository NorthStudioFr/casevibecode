-- Ajout de la date de revérification complète de la fiche.
-- Seule la fiche Zelty a fait l'objet d'une revérification complète de son contenu le 2026-10-20.
-- Les autres fiches restent à null (aucune fausse date).

alter table public.logiciels add column if not exists verifie_le date;

update public.logiciels
  set verifie_le = '2026-10-20'
  where slug = 'zelty';
