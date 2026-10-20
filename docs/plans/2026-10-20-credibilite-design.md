# Conception : Crédibilité et transparence de casevibecode (2026-10-20)

## Contexte et Objectifs

L'éditeur de caisse Zelty a demandé des corrections sur sa fiche (intégrées dans un lot précédent) et est susceptible de relayer le site. L'objectif est de rendre casevibecode pleinement citable, crédible et irréprochable sur le plan de la transparence et de l'honnêteté des données.

### Principes directeurs
1. **Honnêteté stricte** : Aucun faux avis, aucune fausse date, aucune donnée inventée. Les dates de vérification ne concernent que les fiches réellement contrôlées point par point.
2. **Transparence éditoriale** : Exposer fidèlement qui édite le site (North Studio, studio créant des sites et automatisations CHR), la provenance des données initiales (recherches IA recoupées et canivibecodeit.com) et le mécanisme de vote communautaire.
3. **Bilinguisme intégral (FR + EN)** : Tous les textes et libellés disposent de leur équivalent dans `src/lib/i18n/dictionaries.ts`.
4. **Qualité et tests** : 100 % de tests Vitest au vert (`npx vitest run`), types stricts TypeScript, compatibilité thème clair et sombre.
5. **Déploiement ordonné** : Un commit atomique par étape, migration appliquée et vérifiée en base avant déploiement du code dépendant.

---

## 1. Page « Méthode » et harmonisation des verdicts

### 1.1 Harmonisation du vocabulaire
- Aujourd'hui, l'en-tête de fiche mentionne « verdict éditeur » tandis que la FAQ et le reste mentionnent « verdict casevibecode ».
- Remplacement systématique de « verdict éditeur » par **« verdict casevibecode »** (FR) et « editor verdict » par **« casevibecode verdict »** (EN) dans `src/lib/i18n/dictionaries.ts` (`sourceEditor`, descriptions par défaut).
- Le nom de colonne technique en base (`verdict_editeur`) reste inchangé pour préserver la rétrocompatibilité des données.

### 1.2 Route et contenu de la page `/methode`
- Fichier : `src/app/[lang]/methode/page.tsx` avec `generateMetadata` (titre, description, balises `alternates`).
- Contenu bilingue sans promesse exagérée :
  - **Qui édite casevibecode** : Le site est édité par North Studio (représenté par Mickaël Gallego), studio spécialisé dans la création de sites et l'automatisation pour le secteur de l'hôtellerie-restauration (CHR). Cette activité est explicitée en toute transparence (encart présent sur le site).
  - **D'où viennent les données initiales** :
    - *CHR (restauration/hôtellerie)* : Issus de recherches IA croisées et recoupées (GPT, Mistral, Gemini fin septembre 2026), avec vérification des obligations légales françaises (ex. certification NF525 / LNE pour les caisses enregistreuses conformément à l'article 286 du CGI).
    - *Outils du quotidien (SaaS)* : Repris, traduits et adaptés de l'initiative open source canivibecodeit.com (licence MIT), comme déjà mentionné sur chaque fiche concernée et dans les crédits.
  - **La signification des trois verdicts** :
    - *Remplaçable* : L'outil peut être recréé ou substitué par un développement vibe coding sans obstacle réglementaire majeur ni dépendance matérielle bloquante.
    - *Partiellement remplaçable* : Remplaçable pour des besoins basiques (usage individuel, MVP), mais pas pour des cas critiques, certifiés ou multi-utilisateurs.
    - *Pas remplaçable* : Barrière réglementaire stricte (amendes fiscales, agrément bancaire/TVA), risque opérationnel fort (double réservation hôtelière) ou intégrations matérielles lourdes.
  - **Prise de relais par la communauté** :
    - Seuil codé dans `src/lib/verdict.ts` (`SEUIL_VOTES_COMMUNAUTE = 20`) : à partir de 20 votes (empreintes IP salées et hachées, sans cookie), la majorité des votes de la communauté remplace automatiquement le verdict casevibecode par « Remplaçable » ou « Pas remplaçable ».
  - **Droit de signalement et corrections pour les éditeurs** :
    - Tout éditeur de logiciel ou utilisateur peut proposer une correction via le formulaire dédié.
    - Nous vérifions chaque proposition manuellement avant publication (aucune publication directe, aucun engagement de délai irréaliste).
  - **Liens vers les éditeurs** :
    - Les fiches comportent des liens directs vers les sites officiels des éditeurs, sans commission d'affiliation ni sponsoring. Si un éditeur choisit de mentionner casevibecode, cela n'altère en rien l'objectivité de son verdict.

### 1.3 Maillage interne
- Ajout du lien dans `SiteFooter.tsx` : `t.footer.method` pointant vers `/methode`.
- Ajout d'une question/réponse ou d'un lien d'approfondissement dans `FAQ.tsx`.

---

## 2. Date de vérification (`verifie_le`)

### 2.1 Modèle de données & Migration
- Fichier : `supabase/migrations/20261020150000_add_verifie_le.sql`
- Schéma :
  ```sql
  alter table public.logiciels add column if not exists verifie_le date;

  -- Seule la fiche Zelty a fait l'objet d'une revérification complète de son contenu le 2026-10-20.
  -- L'Addition, Lightspeed et Innovorder ont seulement reçu Zelty en alternative, leur contenu n'a pas été revérifié.
  update public.logiciels
    set verifie_le = '2026-10-20'
    where slug = 'zelty';
  ```
- **Ordre opérationnel strict** :
  1. Exécution de la migration en base.
  2. Contrôle SQL explicite (`select slug, verifie_le from public.logiciels where slug = 'zelty';`).
  3. Déploiement du code applicatif.

### 2.2 Typage & Mapping
- `src/types/logiciel.ts` : ajout de `verifieLe?: string | null;` (au format ISO `YYYY-MM-DD`).
- `src/lib/logiciel-doc.ts` : mise à jour de l'interface `LogicielRow` et mapping dans `mapLogicielRow` / `mapNouveauLogicielToRow`.

### 2.3 Rendu sur la fiche
- Sur `src/app/[lang]/logiciel/[slug]/page.tsx`, si `logiciel.verifieLe` est présent :
  - Affichage discret dans l'en-tête : « Vérifié le 20 octobre 2026 » (FR) ou « Verified on October 20, 2026 » (EN).
  - Formatage via l'API standard `Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' })`.
  - Si absent : aucun affichage (pas de mention trompeuse).

---

## 3. Lien « Vous êtes l'éditeur ? »

### 3.1 Emplacement
- Dans l'en-tête de la fiche logicielle (`src/app/[lang]/logiciel/[slug]/page.tsx`), à proximité du lien « Site officiel » et de la ligne d'état du verdict.
- Libellé : `t.fiche.editorNotice` (« Vous êtes l’éditeur ? Proposer une mise à jour » / « Are you the software publisher? Suggest an update »).

### 3.2 Transmission et assainissement dans BugForm
- Cible du lien : `href('/signaler') + ?page=/logiciel/${logiciel.slug}&sujet=editeur`.
- Dans `BugForm.tsx` :
  - Assainissement strict du paramètre `page` : validation de préfixe `/`, interdiction des doubles slashes `//` et des caractères d'espacement.
  - Assainissement strict du paramètre `sujet` : acceptation uniquement de la valeur blanche `'editeur'` (sinon ignoré).
  - Quand `sujet === 'editeur'`, adaptation contextuelle du titre / aide du formulaire :
    - « Vous représentez l’éditeur : indiquez les points factuels à corriger ou compléter avec sources à l’appui. »
    - Mention explicite : « Rien n’est publié sans vérification par notre équipe. »

---

## 4. Affichage de la liste : « Remplacé » et Badge compact

### 4.1 Colonne « Remplacé » à zéro
- Dans `src/components/LogicielRow.tsx` :
  - Lorsque `nbConstruits === 0` (ou indéfini), remplacer le chiffre `0` par un tiret discret `—` avec la classe `text-slate-400`.
  - Conserver l'attribut `aria-label={t.grid.built(nbConstruits)}` pour l'accessibilité des lecteurs d'écran (ex. « 0 personne a remplacé cet outil »).
  - Les valeurs supérieures à 0 continuent d'afficher le nombre en gras/sombre (`font-medium text-slate-800`).

### 4.2 Badge « Partiellement remplaçable » sur une seule ligne
- Problème : « Partiellement remplaçable » comporte 24 caractères et passe sur deux lignes dans les colonnes étroites de la liste desktop (`LogicielGrid`) et sur certaines résolutions, créant des hauteurs de lignes inégales.
- Solution retenue :
  - Dans `src/components/VerdictBadge.tsx` : ajout d'une prop optionnelle `court?: boolean` et de la classe `whitespace-nowrap`.
  - Dans `src/lib/i18n/dictionaries.ts` : ajout de `verdictCourt` :
    - FR : `{ YES: 'Remplaçable', KINDA: 'Partiel', NOT_REALLY: 'Pas remplaçable' }`
    - EN : `{ YES: 'Replaceable', KINDA: 'Partial', NOT_REALLY: 'Not really' }`
  - Utilisation du mode `court` dans `LogicielRow.tsx` pour le tableau d'accueil.
  - Maintien du libellé complet « Partiellement remplaçable » sur la fiche individuelle et dans les filtres.
  - Vérification en vue tableau desktop, vue mobile et vue grille « Mon audit ».

---

## 5. Stratégie de validation & Commits

### 5.1 Plan de commits
1. `docs: plan de conception crédibilité et méthode`
2. `feat: page méthode et harmonisation du verdict casevibecode`
3. `feat: date de vérification sur les fiches revérifiées (migration et affichage)`
4. `feat: lien vous êtes l'éditeur vers le formulaire de signalement pré-rempli`
5. `fix: tiret pour remplacé à 0 et badge partiel compact dans le tableau`

### 5.2 Critères de validation
- `npx vitest run` : tous les tests existants et nouveaux passent.
- `npx next typegen && npx tsc --noEmit` : aucune erreur de typage.
- Inspection visuelle dans le navigateur :
  - Thème clair et thème sombre (contraste, lisibilité des badges et liens).
  - Vue desktop et vue mobile.
