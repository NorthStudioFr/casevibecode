import type { Categorie, Secteur, TypeAlternative, VerdictEditeur } from '@/types/logiciel';
import type { Lang } from './config';

const plur = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

export const fr = {
  site: {
    titleDefault: 'casevibecode — le verdict sur vos logiciels : remplaçables ou pas ?',
    titleTemplate: '%s | casevibecode',
    description:
      "Logiciels de restauration et d'hôtellerie (caisse, réservation, livraison, compta) et outils du quotidien (Notion, Canva, Shopify…) : lesquels un outil sur mesure peut-il remplacer ? Verdict éditeur et vote de la communauté.",
    tagline: 'Le verdict sur vos logiciels, du CHR aux outils du quotidien : remplaçable par du sur-mesure, ou pas ?',
    ogAlt: 'casevibecode — le verdict sur vos logiciels',
    ogAltFiche: 'Verdict casevibecode',
  },
  nav: {
    main: 'Navigation principale',
    list: 'La liste',
    alternatives: 'Alternatives',
    propose: 'Proposer un logiciel',
    audit: 'Mon audit',
    login: 'Connexion',
    admin: 'Admin',
    signOut: 'Se déconnecter',
    theme: 'Basculer le thème clair/sombre',
    language: 'Langue',
    switchTo: 'English',
    switchLabel: 'Read this page in English',
  },
  footer: {
    legal: 'Mentions légales',
    privacy: 'Confidentialité',
    designBefore: 'Design inspiré de',
    designAfter: '(licence MIT)',
  },
  home: {
    intro: (n: number) =>
      `${n} logiciels, du CHR aux outils du quotidien. Un verdict par outil : est-ce remplaçable par du sur-mesure, ou pas ?`,
  },
  grid: {
    searchPlaceholder: 'Rechercher un logiciel…',
    searchLabel: 'Rechercher un logiciel',
    all: '⚡ Toutes',
    allSectors: 'Tous les secteurs',
    sectorGroup: 'Secteur',
    allVerdicts: 'Tous les verdicts',
    count: (n: number) => `${n} ${plur(n, 'fiche', 'fiches')}`,
    sortBy: 'trier par',
    sortVotes: 'Les plus votés',
    sortName: 'Nom (A→Z)',
    empty: 'Aucune fiche ne correspond à ces filtres.',
    reset: 'Réinitialiser les filtres',
    votes: (n: number) => `${n} ${plur(n, 'vote', 'votes')}`,
  },
  verdict: {
    YES: 'Remplaçable',
    KINDA: 'Partiellement remplaçable',
    NOT_REALLY: 'Pas remplaçable',
  } as Record<VerdictEditeur, string>,
  secteur: {
    chr: '🍽️ CHR',
    saas: '💼 Outils du quotidien',
  } as Record<Secteur, string>,
  typeAlt: {
    'open-source': 'Open source',
    gratuit: 'Gratuit',
    'plus-petit': 'Plus petit',
  } as Record<TypeAlternative, string>,
  categories: {
    caisse: 'Caisse',
    reservation: 'Réservation',
    livraison: 'Livraison',
    compta: 'Comptabilité',
    autre: 'Autre',
    'finance-compta': 'Finance & Compta',
    'rh-paie': 'RH & Paie',
    marketing: 'Marketing',
    'vente-crm': 'Vente & CRM',
    communication: 'Communication',
    productivite: 'Productivité',
    ecommerce: 'E-commerce',
    'assurance-sante': 'Assurance & Santé',
    'dev-tools': 'Dev Tools',
    design: 'Design',
    notes: 'Notes',
    evenementiel: 'Événementiel & privatisation',
    hotellerie: 'Hôtellerie (PMS, channel managers)',
    hygiene: 'Hygiène & HACCP',
    stocks: 'Stocks & food cost',
    avis: 'Avis & visibilité locale',
    commande: 'Menus & commande QR',
    pourboire: 'Pourboires',
    fidelite: 'Fidélité & CRM',
    achats: 'Achats & marketplaces',
    paiement: 'Paiement en ligne',
    reseau: 'Réseau & infrastructure',
  } as Record<Categorie, string>,
  fiche: {
    back: '← Retour à toutes les fiches',
    notFound: 'Logiciel introuvable',
    titleSuffix: (nom: string) => `${nom} : remplaçable ou pas ?`,
    fallbackDescription: (nom: string) =>
      `${nom} peut-il être remplacé par un outil sur mesure ? Verdict éditeur et vote de la communauté.`,
    sourceCommunity: 'verdict communauté',
    sourceCanivibecodeit: 'verdict d’après canivibecodeit',
    sourceEditor: 'verdict éditeur',
    votes: (n: number) => `${n} votes`,
    attributionBefore: 'Verdict initial repris de',
    attributionAfter: '(licence MIT), traduit et adapté. Votez pour le corriger.',
    related: 'Dans la même veine',
    loseTitle: 'Ce que vous perdez',
  },
  alternatives: {
    previewTitle: (nom: string) => `Alternatives à ${nom} qui existent déjà`,
    seeAll: (n: number) => (n > 1 ? `Voir toutes les ${n} alternatives` : "Voir l'alternative en détail"),
    pageTitle: (nom: string) => `Alternatives à ${nom} : open source, gratuites et plus petites`,
    pageDescription: (nom: string, n: number) =>
      `${n} alternative${n > 1 ? 's' : ''} qui existent déjà à ${nom} : projets open source, outils gratuits ou éditeurs plus petits.`,
    pageNotFound: 'Alternatives introuvables',
    backToFiche: (nom: string) => `← Retour à la fiche ${nom}`,
    heading: (nom: string) => `Alternatives à ${nom}`,
    intro: (n: number) =>
      `${n} option${n > 1 ? 's' : ''} qui existent déjà, à comparer avant de vous lancer dans un développement sur mesure.`,
    checked:
      "Chaque lien est contrôlé (projet actif et sous licence libre, offre gratuite lue chez l'éditeur, site en ligne). Aucune alternative n'est sponsorisée.",
    indexTitle: 'Alternatives open source, gratuites ou plus petites aux logiciels payants',
    indexDescription:
      'Pour chaque logiciel payant référencé (CHR et outils du quotidien), les alternatives qui existent déjà : projets open source maintenus, outils gratuits ou éditeurs plus petits.',
    indexHeading: 'Les alternatives',
    indexCount: (a: number, l: number) => `${a} alternative${a > 1 ? 's' : ''} · ${l} logiciel${l > 1 ? 's' : ''}`,
    indexIntro:
      "Pas envie de tout recoder ? Pour chaque logiciel payant, ce qui existe déjà : projets open source maintenus, outils gratuits ou éditeurs plus petits. Chaque lien est contrôlé (dépôt actif et sous licence libre, offre gratuite lue chez l'éditeur, site en ligne), sans vote et sans lien sponsorisé.",
    polyTitle: 'Un outil, plusieurs abonnements',
    polyNeeds: (n: number) => `besoin proche de ${n} logiciels`,
    polyTotal: (formatted: string) => ` · ${formatted} €/mois d'abonnements`,
    altCount: (n: number) => `${n} alternative${n > 1 ? 's' : ''}`,
  },
  prompt: {
    title: 'Le prompt pour le construire vous-même',
    copy: 'Copier le prompt',
    copied: 'Copié !',
    openIn: (agent: string) => `Ouvrir dans ${agent}`,
    build: (nom: string, description: string, justification: string) => `Construis un outil qui remplace ${nom} pour un restaurant, bar ou hôtel en France.

Ce que ${nom} fait aujourd'hui : ${description}

Pourquoi c'est un bon candidat au sur-mesure : ${justification}

Contraintes :
- Reste sur le strict nécessaire décrit ci-dessus, pas de fonctionnalité en plus
- Stack simple, hébergement gratuit ou pas cher (ex. Next.js + Supabase sur Vercel)
- Interface en français, utilisable par un restaurateur non technique
- Pas de compte ni d'abonnement tiers payant`,
  },
  vote: {
    replaced: "Je l'ai remplacé",
    notReplaceable: 'Pas remplaçable',
    failed: "Votre vote n'a pas pu être enregistré. Réessayez plus tard.",
  },
  newsletter: {
    thanks: 'Merci, vous êtes inscrit à la newsletter.',
    emailLabel: 'Email',
    placeholder: 'votre@email.fr',
    subscribe: "S'abonner",
    error: "L'inscription a échoué. Vérifiez votre adresse email et réessayez.",
  },
  cta: { editeur: "Vous voulez qu'on regarde vos outils et automatise ce qui peut l'être ?" },
  share: {
    button: 'Partager sur X',
    text: (nom: string, verdict: string, url: string) => `${nom} : ${verdict} ? Le verdict casevibecode ${url}`,
  },
  faq: {
    title: 'Questions fréquentes',
    replaceable: (nom: string) => `${nom} est-il remplaçable par un outil sur mesure ?`,
    verdictAnswer: (verdict: string, justification: string) => `Verdict casevibecode : ${verdict}. ${justification}`,
    what: (nom: string) => `À quoi sert ${nom} ?`,
    alternatives: (nom: string) => `Quelles alternatives existent déjà à ${nom} ?`,
    alternativesAnswer: (noms: string) => `${noms}. Des options à comparer avant de vous lancer dans un développement sur mesure.`,
  },
  ticker: {
    label1: 'abonnements',
    label2: 'passés au crible',
    perMonth: '/mois',
    ariaTotal: (formatted: string) => `${formatted} € par mois`,
    tapeItem: (nom: string, formatted: string) => `${nom.toUpperCase()} −${formatted} €/mois`,
  },
  audit: {
    title: 'Mon audit : combien coûtent vos abonnements, et lesquels sont remplaçables ?',
    description:
      "Cochez les logiciels que vous payez : casevibecode additionne les abonnements et sépare ce qui est remplaçable par du sur-mesure de ce qui ne l'est pas.",
    heading: 'Mon audit',
    intro:
      "Cochez les outils que vous payez. Le total se calcule dans votre navigateur : rien n'est envoyé, rien n'est enregistré. Le lien de partage contient seulement votre sélection.",
    search: 'Filtrer les outils…',
    empty: 'Aucun outil ne correspond.',
    selected: (n: number) => (n > 1 ? `${n} outils choisis` : n === 1 ? '1 outil choisi' : 'Aucun outil choisi'),
    perMonth: 'par mois',
    perYear: 'par an',
    priceUnknown: 'prix non chiffré',
    replaceable: 'Remplaçables',
    partly: 'Partiellement',
    notReplaceable: 'À garder',
    unpriced: (n: number) =>
      `${n} outil${n > 1 ? 's' : ''} sans prix mensuel chiffré (gratuit, sur devis, par employé…) ${n > 1 ? 'ne sont' : "n'est"} pas compté${n > 1 ? 's' : ''}.`,
    caveat:
      "Estimation indicative : le temps de développement, l'hébergement et la maintenance d'un outil sur mesure ne sont pas comptés. Un verdict « remplaçable » n'est pas une promesse d'économie.",
    share: 'Copier le lien de mon audit',
    shared: 'Lien copié !',
    clear: 'Tout décocher',
    openFiche: 'Voir la fiche',
  },
  retours: {
    title: 'Retours de la communauté',
    intro: "Des lecteurs racontent ce qu'ils ont construit à la place de cet outil, ou ce qui a cassé en route. Chaque retour est relu avant publication.",
    empty: "Aucun retour publié pour l'instant. Vous avez essayé de remplacer cet outil ? Racontez-le.",
    construit: "Je l'ai construit",
    casse: 'Ça a cassé',
    link: 'Voir le projet',
    formTitle: 'Partager un retour',
    typeLabel: 'Votre retour',
    textLabel: 'Ce que vous avez fait (ou ce qui a cassé)',
    textHint: (n: number) => `${n}/600 caractères, 20 minimum. Pas de données personnelles ni de clés.`,
    linkLabel: 'Lien vers votre projet (facultatif, https)',
    submit: 'Envoyer pour relecture',
    sending: 'Envoi…',
    thanks: 'Merci ! Votre retour sera publié après relecture.',
    moderation: "Publié après relecture. Seule une empreinte de votre adresse IP est conservée 13 mois contre les abus.",
    errors: {
      trop: 'Trop d\'envois récents. Réessayez dans une heure.',
      texte: 'Le texte doit faire entre 20 et 600 caractères.',
      lien: 'Le lien doit être une adresse https valide.',
      nom: 'Le nom doit faire entre 2 et 80 caractères.',
      raison: 'Le message est trop long (500 caractères maximum).',
      fiche: 'Fiche inconnue.',
      type: 'Choisissez un type de retour.',
      invalide: 'Envoi invalide.',
      indisponible: 'Service momentanément indisponible. Réessayez plus tard.',
      reseau: 'Connexion impossible. Vérifiez votre réseau.',
    },
  },
  proposer: {
    title: 'Proposer un logiciel',
    description: "Un outil manque à la liste ? Proposez-le : nous vérifions son site avant de l'ajouter.",
    heading: 'Proposer un logiciel',
    intro: "Un outil manque à la liste ? Dites-nous lequel. Nous lisons son site officiel avant d'écrire la fiche : rien n'est ajouté sans vérification.",
    nameLabel: "Nom de l'outil",
    urlLabel: 'Site officiel (facultatif, https)',
    reasonLabel: 'Pourquoi cet outil ? (facultatif)',
    submit: 'Envoyer la proposition',
    sending: 'Envoi…',
    thanks: 'Merci ! Nous regarderons cet outil.',
    privacy: "Aucun e-mail demandé. Seule une empreinte de votre adresse IP est conservée 13 mois contre les abus.",
  },
  breadcrumbHome: 'Accueil',
};

export type Dict = typeof fr;

export const en: Dict = {
  site: {
    titleDefault: 'casevibecode — the verdict on your software: replaceable or not?',
    titleTemplate: '%s | casevibecode',
    description:
      'Software for restaurants and hotels (point of sale, reservations, delivery, accounting) and everyday tools (Notion, Canva, Shopify…): which ones can a custom-built tool replace? Editor verdict and community vote.',
    tagline: 'The verdict on your software, from restaurants and hotels to everyday tools: replaceable by a custom build, or not?',
    ogAlt: 'casevibecode — the verdict on your software',
    ogAltFiche: 'casevibecode verdict',
  },
  nav: {
    main: 'Main navigation',
    list: 'The list',
    alternatives: 'Alternatives',
    propose: 'Suggest a tool',
    audit: 'My audit',
    login: 'Log in',
    admin: 'Admin',
    signOut: 'Sign out',
    theme: 'Toggle light/dark theme',
    language: 'Language',
    switchTo: 'Français',
    switchLabel: 'Lire cette page en français',
  },
  footer: {
    legal: 'Legal notice',
    privacy: 'Privacy',
    designBefore: 'Design inspired by',
    designAfter: '(MIT licence)',
  },
  home: {
    intro: (n: number) =>
      `${n} tools, from restaurants and hotels to everyday software. One verdict per tool: can a custom build replace it, or not?`,
  },
  grid: {
    searchPlaceholder: 'Search for a tool…',
    searchLabel: 'Search for a tool',
    all: '⚡ All',
    allSectors: 'All sectors',
    sectorGroup: 'Sector',
    allVerdicts: 'All verdicts',
    count: (n: number) => `${n} ${plur(n, 'tool', 'tools')}`,
    sortBy: 'sort by',
    sortVotes: 'Most voted',
    sortName: 'Name (A→Z)',
    empty: 'No tool matches these filters.',
    reset: 'Reset filters',
    votes: (n: number) => `${n} ${plur(n, 'vote', 'votes')}`,
  },
  verdict: {
    YES: 'Replaceable',
    KINDA: 'Partly replaceable',
    NOT_REALLY: 'Not replaceable',
  },
  secteur: {
    chr: '🍽️ Hospitality',
    saas: '💼 Everyday tools',
  },
  typeAlt: {
    'open-source': 'Open source',
    gratuit: 'Free',
    'plus-petit': 'Smaller vendor',
  },
  categories: {
    caisse: 'Point of sale',
    reservation: 'Reservations',
    livraison: 'Delivery',
    compta: 'Accounting',
    autre: 'Other',
    'finance-compta': 'Finance & accounting',
    'rh-paie': 'HR & payroll',
    marketing: 'Marketing',
    'vente-crm': 'Sales & CRM',
    communication: 'Communication',
    productivite: 'Productivity',
    ecommerce: 'E-commerce',
    'assurance-sante': 'Insurance & health',
    'dev-tools': 'Dev tools',
    design: 'Design',
    notes: 'Notes',
    evenementiel: 'Events & private hire',
    hotellerie: 'Hotels (PMS, channel managers)',
    hygiene: 'Hygiene & HACCP',
    stocks: 'Stock & food cost',
    avis: 'Reviews & local visibility',
    commande: 'QR menus & ordering',
    pourboire: 'Tipping',
    fidelite: 'Loyalty & CRM',
    achats: 'Purchasing & marketplaces',
    paiement: 'Online payments',
    reseau: 'Networking & infrastructure',
  },
  fiche: {
    back: '← Back to all tools',
    notFound: 'Tool not found',
    titleSuffix: (nom: string) => `${nom}: replaceable or not?`,
    fallbackDescription: (nom: string) =>
      `Can ${nom} be replaced by a custom-built tool? Editor verdict and community vote.`,
    sourceCommunity: 'community verdict',
    sourceCanivibecodeit: 'verdict based on canivibecodeit',
    sourceEditor: 'editor verdict',
    votes: (n: number) => `${n} votes`,
    attributionBefore: 'Initial verdict taken from',
    attributionAfter: '(MIT licence), translated and adapted. Vote to correct it.',
    related: 'More like this',
    loseTitle: 'What you lose',
  },
  alternatives: {
    previewTitle: (nom: string) => `Existing alternatives to ${nom}`,
    seeAll: (n: number) => (n > 1 ? `See all ${n} alternatives` : 'See the alternative in detail'),
    pageTitle: (nom: string) => `Alternatives to ${nom}: open source, free and smaller vendors`,
    pageDescription: (nom: string, n: number) =>
      `${n} existing alternative${n > 1 ? 's' : ''} to ${nom}: open-source projects, free tools or smaller vendors.`,
    pageNotFound: 'Alternatives not found',
    backToFiche: (nom: string) => `← Back to the ${nom} page`,
    heading: (nom: string) => `Alternatives to ${nom}`,
    intro: (n: number) => `${n} existing option${n > 1 ? 's' : ''} to compare before committing to a custom build.`,
    checked:
      'Every link is checked (active project under a free licence, free plan read on the vendor’s own site, site online). No alternative is sponsored.',
    indexTitle: 'Open-source, free or smaller alternatives to paid software',
    indexDescription:
      'For each paid tool listed (hospitality and everyday tools), the alternatives that already exist: maintained open-source projects, free tools or smaller vendors.',
    indexHeading: 'The alternatives',
    indexCount: (a: number, l: number) => `${a} alternative${a > 1 ? 's' : ''} · ${l} tool${l > 1 ? 's' : ''}`,
    indexIntro:
      'Not keen on rebuilding everything? For each paid tool, what already exists: maintained open-source projects, free tools or smaller vendors. Every link is checked (active repository under a free licence, free plan read on the vendor’s own site, site online), with no voting and no sponsored links.',
    polyTitle: 'One tool, several subscriptions',
    polyNeeds: (n: number) => `covers a need close to ${n} tools`,
    polyTotal: (formatted: string) => ` · €${formatted}/month in subscriptions`,
    altCount: (n: number) => `${n} alternative${n > 1 ? 's' : ''}`,
  },
  prompt: {
    title: 'The prompt to build it yourself',
    copy: 'Copy the prompt',
    copied: 'Copied!',
    openIn: (agent: string) => `Open in ${agent}`,
    build: (nom: string, description: string, justification: string) => `Build a tool that replaces ${nom} for a restaurant, bar or hotel.

What ${nom} does today: ${description}

Why it is a good candidate for a custom build: ${justification}

Constraints:
- Stick to the bare essentials described above, no extra features
- Simple stack, free or cheap hosting (e.g. Next.js + Supabase on Vercel)
- Interface usable by a non-technical restaurant owner
- No account or paid third-party subscription`,
  },
  vote: {
    replaced: 'I replaced it',
    notReplaceable: 'Not replaceable',
    failed: 'Your vote could not be recorded. Please try again later.',
  },
  newsletter: {
    thanks: 'Thanks, you are subscribed to the newsletter.',
    emailLabel: 'Email',
    placeholder: 'you@email.com',
    subscribe: 'Subscribe',
    error: 'Subscription failed. Check your email address and try again.',
  },
  cta: { editeur: 'Want us to look at your tools and automate what can be automated?' },
  share: {
    button: 'Share on X',
    text: (nom: string, verdict: string, url: string) => `${nom}: ${verdict}? The casevibecode verdict ${url}`,
  },
  faq: {
    title: 'Frequently asked questions',
    replaceable: (nom: string) => `Can ${nom} be replaced by a custom-built tool?`,
    verdictAnswer: (verdict: string, justification: string) => `casevibecode verdict: ${verdict}. ${justification}`,
    what: (nom: string) => `What is ${nom} used for?`,
    alternatives: (nom: string) => `What alternatives to ${nom} already exist?`,
    alternativesAnswer: (noms: string) => `${noms}. Options to compare before committing to a custom build.`,
  },
  ticker: {
    label1: 'subscriptions',
    label2: 'put under the microscope',
    perMonth: '/month',
    ariaTotal: (formatted: string) => `€${formatted} per month`,
    tapeItem: (nom: string, formatted: string) => `${nom.toUpperCase()} −€${formatted}/month`,
  },
  audit: {
    title: 'My audit: how much do your subscriptions cost, and which are replaceable?',
    description:
      'Tick the software you pay for: casevibecode adds up the subscriptions and separates what a custom build can replace from what it cannot.',
    heading: 'My audit',
    intro:
      'Tick the tools you pay for. The total is calculated in your browser: nothing is sent, nothing is saved. The share link only contains your selection.',
    search: 'Filter the tools…',
    empty: 'No tool matches.',
    selected: (n: number) => (n > 1 ? `${n} tools selected` : n === 1 ? '1 tool selected' : 'No tool selected'),
    perMonth: 'per month',
    perYear: 'per year',
    priceUnknown: 'price not quantified',
    replaceable: 'Replaceable',
    partly: 'Partly',
    notReplaceable: 'Keep',
    unpriced: (n: number) =>
      `${n} tool${n > 1 ? 's' : ''} without a quantified monthly price (free, on quote, per employee…) ${n > 1 ? 'are' : 'is'} not counted.`,
    caveat:
      'Indicative estimate: development time, hosting and maintenance of a custom tool are not counted. A “replaceable” verdict is not a promise of savings.',
    share: 'Copy my audit link',
    shared: 'Link copied!',
    clear: 'Untick all',
    openFiche: 'See the page',
  },
  retours: {
    title: 'Community feedback',
    intro: 'Readers tell what they built instead of this tool, or what broke along the way. Every entry is reviewed before publication.',
    empty: 'No feedback published yet. Have you tried replacing this tool? Tell us about it.',
    construit: 'I built it',
    casse: 'It broke',
    link: 'See the project',
    formTitle: 'Share your feedback',
    typeLabel: 'Your feedback',
    textLabel: 'What you did (or what broke)',
    textHint: (n: number) => `${n}/600 characters, 20 minimum. No personal data or keys.`,
    linkLabel: 'Link to your project (optional, https)',
    submit: 'Send for review',
    sending: 'Sending…',
    thanks: 'Thank you! Your feedback will be published after review.',
    moderation: 'Published after review. Only a fingerprint of your IP address is kept for 13 months against abuse.',
    errors: {
      trop: 'Too many recent submissions. Try again in an hour.',
      texte: 'The text must be between 20 and 600 characters.',
      lien: 'The link must be a valid https address.',
      nom: 'The name must be between 2 and 80 characters.',
      raison: 'The message is too long (500 characters maximum).',
      fiche: 'Unknown tool.',
      type: 'Choose a type of feedback.',
      invalide: 'Invalid submission.',
      indisponible: 'Service temporarily unavailable. Try again later.',
      reseau: 'Cannot connect. Check your network.',
    },
  },
  proposer: {
    title: 'Suggest a tool',
    description: 'A tool missing from the list? Suggest it: we check its website before adding it.',
    heading: 'Suggest a tool',
    intro: 'A tool missing from the list? Tell us which one. We read its official site before writing the page: nothing is added without checking.',
    nameLabel: "Tool's name",
    urlLabel: 'Official website (optional, https)',
    reasonLabel: 'Why this tool? (optional)',
    submit: 'Send the suggestion',
    sending: 'Sending…',
    thanks: 'Thank you! We will look at this tool.',
    privacy: 'No email asked. Only a fingerprint of your IP address is kept for 13 months against abuse.',
  },
  breadcrumbHome: 'Home',
};

const DICTS: Record<Lang, Dict> = { fr, en };
export function getDict(lang: Lang): Dict {
  return DICTS[lang];
}
