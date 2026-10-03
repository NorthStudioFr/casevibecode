-- Retirer les droits d'insertion au public (désormais géré côté serveur)
revoke insert on table public.abonnes_newsletter from anon, authenticated;

drop policy "abonnes_newsletter : insertion seule" on public.abonnes_newsletter;
