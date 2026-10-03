# Déployer sa propre instance

## 1. Supabase

Créer un projet Supabase (région UE de préférence), puis depuis ce dépôt :

```bash
supabase login
supabase link --project-ref <ref-du-projet>
supabase db push          # applique supabase/migrations/*
```

Les migrations créent `logiciels`, `votes`, `abonnes_newsletter`, `rate_limits`, la RLS (aucun droit par
défaut, puis des `grant` ciblés), la fonction publique `vote_counts` et une purge quotidienne (`pg_cron`).

Dans **Authentication > URL Configuration** : renseigner l'URL du site et les URL de redirection. Seuls
les administrateurs ont un compte (e-mail + mot de passe) ; le vote public n'utilise pas Supabase Auth.

## 2. Variables d'environnement

| Variable | Où | Nature |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel, `.env.local` | publique |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel, `.env.local` | publique, bornée par la RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (serveur) et `.env.local` | **secrète**, contourne la RLS : réservée aux routes `/api/vote` et `/api/newsletter` et aux scripts. Jamais côté navigateur, jamais préfixée `NEXT_PUBLIC_`. |
| `EDITEUR_*`, `ANCIEN_DOMAINE` | Vercel (serveur) | **facultatives** : identité de l'éditeur pour les mentions légales (`EDITEUR_MARQUE`, `EDITEUR_NOM`, `EDITEUR_EMAIL`, `EDITEUR_SIRET`, `EDITEUR_APE`, `EDITEUR_FORME`, `EDITEUR_TVA`, `EDITEUR_ADRESSE`, `EDITEUR_URL`, `EDITEUR_CONTACT_URL`) et ancien domaine à rediriger. Absentes, les informations ne sont pas affichées. Le dépôt ne contient aucune donnée personnelle : c'est voulu. |
| `VOTE_IP_SALT` | Vercel (serveur) | **secrète**, 16 caractères minimum (`openssl rand -hex 32`). Sans elle, le vote refuse de fonctionner. |

## 3. Premier compte administrateur

1. Créer un utilisateur (e-mail + mot de passe) dans Authentication > Users.
2. Lui donner le droit admin, lu uniquement dans `app_metadata` (jamais modifiable par l'utilisateur) :

```bash
npx tsx scripts/set-admin.ts <id-utilisateur>
```

3. Se connecter sur `/connexion`, puis ouvrir `/admin`.

## 4. Contenu

```bash
npx tsx scripts/seed-logiciels.ts     # fiches CHR (scripts/seed-data.ts) + outils du quotidien (scripts/data/fiches-saas.json)
```

Pour valider un nouveau lot de fiches avant import (format `saas-output-*.json`, voir `scripts/lib/fiches-saas.ts`) :

```bash
npx tsx scripts/import-fiches-saas.ts <dossier>           # dry-run : valide et contrôle les alternatives
npx tsx scripts/import-fiches-saas.ts <dossier> --apply   # écrit en base
```

## 5. Vercel

Importer le dépôt (Next.js détecté), renseigner les variables ci-dessus pour Production et Preview, puis déployer.
Les variables `NEXT_PUBLIC_*` sont lues au build : un changement demande un redéploiement.
