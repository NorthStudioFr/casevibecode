# casevibecode

Annuaire communautaire et gratuit : pour chaque logiciel (caisse, réservation, livraison, compta du CHR, puis
les outils du quotidien comme Notion ou Shopify), **peut-on le remplacer par un outil sur mesure, ou pas ?**
Chaque fiche donne un verdict (remplaçable, partiellement, pas remplaçable), ce qu'on y perd, des alternatives
contrôlées (open source, gratuites, plus petites) et un prompt prêt à coller dans un agent de code.

Site : <https://casevibecode.fr>.

## Ce que fait le site

- **Verdict éditeur** puis **verdict communautaire** : le vote est ouvert sans compte, limité à un vote par
  fiche et par adresse IP (empreinte salée, jamais l'IP en clair, purgée après 13 mois). Le verdict de la
  communauté remplace celui de l'éditeur à partir de 20 votes.
- **Alternatives vérifiées** : dépôt actif et non archivé, licence libre lue dans le fichier de licence,
  site en ligne. Mieux vaut aucune alternative qu'une approximative.
- **Prix en euros** lus sur la page tarifs de l'éditeur, sinon absents (aucune conversion de dollars). Le
  bandeau du haut additionne uniquement les forfaits fixes « N €/mois ».
- Thème sombre ou clair, sans cookie ni traceur.

## Stack

Next.js 16 (App Router, ISR) · React 19 · Tailwind CSS 4 · Supabase (Postgres + RLS + Auth) · Vitest · Vercel.

## Lancer en local

```bash
npm install
cp .env.local.example .env.local   # puis renseigner les variables (voir docs/DEPLOIEMENT.md)
npm run dev                        # http://localhost:3000
```

Sans variables Supabase, `npm run build` réussit mais les pages sont vides : il faut une base.

## Vérifications

```bash
npx vitest run        # tests unitaires et composants
npx next typegen && npx tsc --noEmit   # types (typegen génère les types de routes)
npx eslint            # style
npx next build        # build de production
npm run test:rules    # RLS contre une base Supabase locale (supabase start)
```

## Organisation

| Dossier | Contenu |
| --- | --- |
| `src/app` | pages, routes API (`/api/vote`, `/api/newsletter`), sitemap, `llms.txt` |
| `src/components`, `src/lib` | composants et logique (prix, verdict, alternatives, empreinte d'IP) |
| `supabase/migrations` | schéma, RLS, limite de débit, purge quotidienne |
| `scripts` | import et validation de fiches (`import-fiches-saas.ts`), seed, droit admin |
| `scripts/data` | fiches « outils du quotidien » validées et leur rapport de contrôle |

## Contribuer

Proposer un logiciel ou corriger une fiche : ouvrir une issue sur ce dépôt. Les fiches
suivent le format de `src/types/logiciel.ts` ; une alternative doit avoir un dépôt actif sous licence libre, ou
un outil réellement gratuit, ou un éditeur plus petit, avec une source lisible.

## Crédits et licences

Code sous licence MIT (voir `LICENSE`), © 2026 casevibecode contributors. Une partie des fiches « outils du quotidien » (verdicts initiaux, prompts, alternatives) est reprise de
[canivibecodeit](https://github.com/canivibecodeit/canivibecodeit), licence MIT, © 2026 Rob Hallam, traduite
et adaptée. Voir `THIRD_PARTY_NOTICES.md`. Le logo et la marque de canivibecodeit ne sont pas repris.
