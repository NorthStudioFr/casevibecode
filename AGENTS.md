<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CONSIGNES DE MÉTHODE (prioritaires sur tout le reste)

- **Commits atomiques sans push** : Un commit par lot (ou par sous-lot), sans `git push` : relecture humaine avant de pousser.
- **Préservation stricte du référencement** : Ne modifie AUCUNE URL ni canonique existante. Si un slug ou une route change, ajoute une redirection 301 et garde le sitemap cohérent. Le site a 339 pages indexées à ne pas perdre.
- **Sécurité et intégrité de la base de données** : Toute modification de données en base (recatégorisation, par exemple WordPress hors « Autre ») passe par un script en simulation d'abord, avec sauvegarde avant écriture, comme les scripts existants de `scripts/`.
- **Gestion stricte des secrets** : N'écris jamais de clé secrète (service role, jetons) dans `.env.local` ni dans le dépôt. Si tu as besoin de la base en lecture, utilise la clé publique (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Plafonnement des montants dans /audit** : Les montants saisis dans /audit : valide et plafonne (nombres positifs, valeur maximale raisonnable, plafond par défaut à 100 000 €/mois) avant de les lire dans l'URL de partage, pour ne pas casser la page avec une URL manipulée.
- **Snippet badge éditeur (lot 3.3)** : Le snippet « badge éditeur » doit afficher le verdict réel de la fiche, proposé sur toutes les fiches de façon identique, et pas seulement sur « Pas remplaçable ». Formulation neutre : « Verdict casevibecode : … ». Pas de « recommandé par ».
- **Vérification visuelle rigoureuse** : Vérifie chaque lot dans le navigateur, thèmes clair et sombre, ordinateur et mobile (390 px), et dis explicitement ce que tu n'as pas pu vérifier. Pas de « c'est fait » sans test réel.
- **Validation technique systématique** : Lance `npx vitest run` et `npm run build` à chaque lot.

