# Brief Antigravity : crédibilité de casevibecode (2026-10-20)

Contexte : Zelty (éditeur de caisse) a demandé des corrections de sa fiche et pourrait relayer le site. Objectif : rendre le site plus citable et plus crédible. Projet Next.js (lire `node_modules/next/dist/docs/` avant de coder, cf. AGENTS.md). Base Supabase, fiches dans la table `logiciels`. Le thème sombre remplace certaines couleurs Tailwind (`--color-white` dans `src/app/[lang]/globals.css`).

Règles : honnêteté stricte (aucun faux avis, aucune fausse date, aucune donnée inventée), FR + EN (dictionnaires dans `src/lib/i18n/dictionaries.ts`), tests Vitest qui passent (`npx vitest run`), un commit par étape. Vérifier chaque changement dans le navigateur, thème sombre ET clair, avant de dire « fait ».

## Étapes, par ordre de priorité

1. **Page « Méthode »** (FR + EN, liée dans le pied de page et la FAQ) : comment un verdict est établi, qui l'écrit, ce que signifient Remplaçable / Partiellement / Pas remplaçable, comment corriger une fiche. Une seule formule partout : « verdict casevibecode » (aujourd'hui l'en-tête dit « verdict éditeur » et la FAQ « verdict casevibecode »).
2. **Date de vérification** : colonne `verifie_le` (date) sur `logiciels`, migration rétrocompatible dans `supabase/migrations`, affichée sur la fiche (« Vérifié le … »). Ne remplir que les fiches réellement revérifiées (Zelty, L'Addition, Lightspeed, Innovorder le 2026-10-20) ; les autres restent vides et n'affichent rien.
3. **Lien « Vous êtes l'éditeur ? »** sur chaque fiche, vers le formulaire de signalement existant (BugForm) pré-rempli avec le nom de la fiche, pour qu'un éditeur propose une correction. Rien n'est publié sans vérification.
4. **Colonne « Remplacé » à 0 partout** dans la liste : masquer la colonne ou afficher « — » quand le total des votes est 0, au lieu d'un mur de zéros.
5. **Badge « Partiellement remplaçable »** passe sur deux lignes dans la liste (`src/components/VerdictBadge.tsx`) : hauteurs de lignes irrégulières. Trouver une solution propre (libellé court dans la liste, ou colonne plus large).

## Déjà fait (ne pas refaire)

Fiche Zelty corrigée, Zelty ajouté en 2e position avec le type « Concurrent » sur L'Addition, Lightspeed et Innovorder, lien « Site officiel » sur toutes les fiches, logo sombre rendu visible (fond clair fixe).
