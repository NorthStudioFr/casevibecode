# Plan d'implémentation : Crédibilité de casevibecode (2026-10-20)

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Rendre casevibecode pleinement crédible, citable et transparent en publiant la page Méthode, la date de vérification réelle pour Zelty, le lien éditeur vers le formulaire de signalement, et en soignant l'affichage du tableau d'accueil (tiret pour zéro et badge compact sans coupure de ligne).

**Architecture:** Application Next.js 16 (App Router) bilingue FR/EN avec Supabase PostgreSQL en backend. Les données de fiches sont typées dans `src/types/logiciel.ts` et projetées via `src/lib/logiciel-doc.ts`. Le dictionnaire `src/lib/i18n/dictionaries.ts` centralise tous les textes bilingues.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase (PostgreSQL), Vitest, TypeScript.

---

### Task 1: Page « Méthode » et harmonisation « verdict casevibecode »

**Files:**
- Modify: `src/lib/i18n/dictionaries.ts`
- Create: `src/app/[lang]/methode/page.tsx`
- Create: `src/app/[lang]/methode/page.test.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/components/SiteFooter.test.tsx`
- Modify: `src/components/FAQ.tsx`
- Modify: `src/components/FAQ.test.tsx`

**Step 1: Write the failing tests**
- Créer `src/app/[lang]/methode/page.test.tsx` pour tester le rendu de la page en FR et en EN, la présence des sections (qui édite, d'où viennent les données, signification des 3 verdicts, seuil communauté 20 votes, corrections éditeurs), et les métadonnées.
- Mettre à jour `src/components/SiteFooter.test.tsx` pour tester la présence du lien vers `/methode`.
- Mettre à jour `src/components/FAQ.test.tsx` pour tester la formulation « verdict casevibecode » et le lien vers la méthode.

**Step 2: Run tests to verify they fail**
Run: `npx vitest run src/app/[lang]/methode/page.test.tsx src/components/SiteFooter.test.tsx src/components/FAQ.test.tsx`
Expected: FAIL (modules / textes manquants)

**Step 3: Implement minimal code**
- Dans `src/lib/i18n/dictionaries.ts` :
  - Remplacer `sourceEditor: 'verdict éditeur'` par `'verdict casevibecode'` (FR) et `'casevibecode verdict'` (EN).
  - Remplacer dans `fallbackDescription` « Verdict éditeur » par « Verdict casevibecode ».
  - Ajouter la clé `footer.method`: « Méthode » (FR) / « Methodology » (EN).
  - Ajouter les clés de contenu de la page `methode` (FR et EN).
- Créer `src/app/[lang]/methode/page.tsx` avec Next.js App Router (React Server Component), typage propre des params (`lang`), métadonnées et contenu transparent (North Studio, recherche IA recoupée, canivibecodeit, seuil 20 votes, vérification humaine).
- Ajouter le lien dans `src/components/SiteFooter.tsx` vers `href('/methode')`.
- Mettre à jour `src/components/FAQ.tsx` pour inclure la référence à la méthode.

**Step 4: Run tests to verify they pass**
Run: `npx vitest run src/app/[lang]/methode/page.test.tsx src/components/SiteFooter.test.tsx src/components/FAQ.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/i18n/dictionaries.ts src/app/[lang]/methode/ src/components/SiteFooter.tsx src/components/SiteFooter.test.tsx src/components/FAQ.tsx src/components/FAQ.test.tsx
git commit -m "feat: page méthode et harmonisation du verdict casevibecode"
```

---

### Task 2: Date de vérification (`verifie_le`) sur les fiches

**Files:**
- Create: `supabase/migrations/20261020150000_add_verifie_le.sql`
- Modify: `src/types/logiciel.ts`
- Modify: `src/lib/logiciel-doc.ts`
- Modify: `src/lib/logiciel-doc.test.ts`
- Modify: `src/lib/i18n/dictionaries.ts`
- Modify: `src/app/[lang]/logiciel/[slug]/page.tsx`
- Modify: `src/app/[lang]/logiciel/[slug]/page.test.tsx`

**Step 1: Write the failing tests**
- Dans `src/lib/logiciel-doc.test.ts`, tester que `mapLogicielRow` mappe bien `verifie_le` vers `verifieLe`.
- Dans `src/app/[lang]/logiciel/[slug]/page.test.tsx`, tester :
  - qu'une fiche avec `verifieLe: '2026-10-20'` affiche « Vérifié le 20 octobre 2026 » (FR) / « Verified on October 20, 2026 » (EN).
  - qu'une fiche sans `verifieLe` n'affiche aucune mention de vérification.

**Step 2: Run tests to verify they fail**
Run: `npx vitest run src/lib/logiciel-doc.test.ts src/app/[lang]/logiciel/[slug]/page.test.tsx`
Expected: FAIL

**Step 3: Implement minimal code**
- Écrire la migration SQL `supabase/migrations/20261020150000_add_verifie_le.sql` :
  ```sql
  alter table public.logiciels add column if not exists verifie_le date;
  update public.logiciels set verifie_le = '2026-10-20' where slug = 'zelty';
  ```
- Ajouter `verifieLe?: string | null;` dans `src/types/logiciel.ts`.
- Mettre à jour `LogicielRow` et `mapLogicielRow` dans `src/lib/logiciel-doc.ts`.
- Ajouter dans `src/lib/i18n/dictionaries.ts` le formateur de date : `verifiedOn: (date: string) => string`.
- Dans `src/app/[lang]/logiciel/[slug]/page.tsx`, afficher conditionnellement la date formatée sous l'en-tête de la fiche.

**Step 4: Run tests to verify they pass**
Run: `npx vitest run src/lib/logiciel-doc.test.ts src/app/[lang]/logiciel/[slug]/page.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add supabase/migrations/20261020150000_add_verifie_le.sql src/types/logiciel.ts src/lib/logiciel-doc.ts src/lib/logiciel-doc.test.ts src/lib/i18n/dictionaries.ts src/app/[lang]/logiciel/[slug]/page.tsx src/app/[lang]/logiciel/[slug]/page.test.tsx
git commit -m "feat: date de vérification sur les fiches revérifiées (migration et affichage)"
```

---

### Task 3: Lien « Vous êtes l'éditeur ? » vers le formulaire de signalement

**Files:**
- Modify: `src/lib/i18n/dictionaries.ts`
- Modify: `src/app/[lang]/logiciel/[slug]/page.tsx`
- Modify: `src/components/BugForm.tsx`
- Modify: `src/components/BugForm.test.tsx`
- Modify: `src/app/[lang]/logiciel/[slug]/page.test.tsx`

**Step 1: Write the failing tests**
- Dans `src/components/BugForm.test.tsx` :
  - Tester la désérialisation et l'assainissement strict des query params `page` et `sujet`.
  - Tester que lorsque `sujet=editeur`, le formulaire affiche une consigne adaptée et la mention « Rien n'est publié sans vérification par notre équipe ».
- Dans `src/app/[lang]/logiciel/[slug]/page.test.tsx` :
  - Tester la présence du lien « Vous êtes l'éditeur ? » dans l'en-tête de la fiche pointant vers `/signaler?page=/logiciel/[slug]&sujet=editeur`.

**Step 2: Run tests to verify they fail**
Run: `npx vitest run src/components/BugForm.test.tsx src/app/[lang]/logiciel/[slug]/page.test.tsx`
Expected: FAIL

**Step 3: Implement minimal code**
- Dans `src/lib/i18n/dictionaries.ts` : ajouter les textes `fiche.editorLink` (« Vous êtes l’éditeur ? »), `signaler.editorNotice`, etc.
- Dans `src/components/BugForm.tsx` :
  - Ajouter la fonction d'assainissement de `sujet` (`sujetDuLien(brut)` n'acceptant que `'editeur'`).
  - Adapter le formulaire quand `sujet === 'editeur'`.
- Dans `src/app/[lang]/logiciel/[slug]/page.tsx` :
  - Ajouter le lien discret dans l'en-tête à proximité du lien site officiel et du verdict.

**Step 4: Run tests to verify they pass**
Run: `npx vitest run src/components/BugForm.test.tsx src/app/[lang]/logiciel/[slug]/page.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/i18n/dictionaries.ts src/app/[lang]/logiciel/[slug]/page.tsx src/components/BugForm.tsx src/components/BugForm.test.tsx src/app/[lang]/logiciel/[slug]/page.test.tsx
git commit -m "feat: lien vous êtes l'éditeur vers le formulaire de signalement pré-rempli"
```

---

### Task 4: Tableau d'accueil : Remplacé avec tiret « — » et badge compact « Partiel »

**Files:**
- Modify: `src/lib/i18n/dictionaries.ts`
- Modify: `src/components/VerdictBadge.tsx`
- Modify: `src/components/VerdictBadge.test.tsx`
- Modify: `src/components/LogicielRow.tsx`
- Modify: `src/components/LogicielRow.test.tsx`

**Step 1: Write the failing tests**
- Dans `src/components/VerdictBadge.test.tsx` :
  - Tester le rendu standard vs rendu compact (`court=true` : « Partiel » au lieu de « Partiellement remplaçable »).
  - Tester la présence de `whitespace-nowrap`.
- Dans `src/components/LogicielRow.test.tsx` :
  - Tester que quand `nbConstruits === 0` (ou indéfini), le texte affiché est « — » tout en conservant `aria-label="0 personne a remplacé cet outil"`.
  - Tester que quand `nbConstruits === 3`, le texte affiché est « 3 ».
  - Tester que le badge de verdict dans la ligne utilise le format compact.

**Step 2: Run tests to verify they fail**
Run: `npx vitest run src/components/VerdictBadge.test.tsx src/components/LogicielRow.test.tsx`
Expected: FAIL

**Step 3: Implement minimal code**
- Dans `src/lib/i18n/dictionaries.ts` : ajouter `verdictCourt` (FR : `Partiel`, EN : `Partial`).
- Dans `src/components/VerdictBadge.tsx` : ajouter prop `court?: boolean`, utiliser `t.verdictCourt` quand activé, et ajouter la classe `whitespace-nowrap`.
- Dans `src/components/LogicielRow.tsx` :
  - Passer `court` à `<VerdictBadge verdict={verdict} court />`.
  - Afficher `<span className={nbConstruits > 0 ? 'font-medium text-slate-800' : 'text-slate-400'}>{nbConstruits > 0 ? nbConstruits : '—'}</span>`.

**Step 4: Run tests to verify they pass**
Run: `npx vitest run src/components/VerdictBadge.test.tsx src/components/LogicielRow.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/i18n/dictionaries.ts src/components/VerdictBadge.tsx src/components/VerdictBadge.test.tsx src/components/LogicielRow.tsx src/components/LogicielRow.test.tsx
git commit -m "fix: tiret pour remplacé à 0 et badge partiel compact dans le tableau"
```

---

### Task 5: Vérification d'ensemble, régression globale et inspection navigateur

**Files:**
- N/A (contrôle d'intégrité globale)

**Step 1: Run complete test suite**
Run: `npx vitest run`
Expected: 100% PASS (tous les fichiers de tests au vert)

**Step 2: Run TypeScript and build check**
Run: `npx next typegen && npx tsc --noEmit`
Expected: 0 type errors

**Step 3: Visual inspection on local dev server (Browser QA)**
- Lancer le serveur de développement : `npm run dev`
- Inspecter via le navigateur :
  1. `http://localhost:3000/fr` : Vérifier la colonne « Remplacé » avec tirets `—`, le badge « Partiel » sur une seule ligne (aucun saut de ligne), tester le changement de thème (clair et sombre).
  2. `http://localhost:3000/fr/logiciel/zelty` : Vérifier la date « Vérifié le 20 octobre 2026 », le lien « Vous êtes l'éditeur ? », le « verdict casevibecode » (thème clair et sombre).
  3. `http://localhost:3000/fr/logiciel/notion` : Vérifier qu'aucune date de vérification n'est affichée.
  4. `http://localhost:3000/fr/methode` : Vérifier la clarté du texte, les liens, le contraste thème clair/sombre.
  5. `http://localhost:3000/fr/signaler?page=/logiciel/zelty&sujet=editeur` : Vérifier la bonne prise en compte du sujet éditeur et la mention de vérification.
