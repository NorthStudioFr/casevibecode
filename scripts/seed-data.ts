import type { NouveauLogicielInput } from '@/types/logiciel';

export const SEED_LOGICIELS: NouveauLogicielInput[] = [
  {
    nom: 'Zenchef',
    slug: 'zenchef',
    categorie: 'reservation',
    description: 'Plateforme de réservation en ligne et gestion de salle pour restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'La prise de réservation en ligne se recode facilement avec un formulaire et un agenda partagé. La gestion de salle en temps réel et la synchronisation multi-plateformes (Google, TheFork) demandent plus de travail à maintenir soi-même.',
    domaine: 'zenchef.com',
    prix: 'à partir de 129 €/mois',
    alternatives: [
      { nom: 'OpenResto', url: 'https://github.com/karanshukla/openresto', type: 'open-source', description: 'Application open source (MIT) de gestion des réservations de tables, auto-hébergeable, multi-restaurants.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Réservation de tables sans commission, offre gratuite limitée à 25 réservations par mois, interface disponible en français.' },
      { nom: 'TableMaster', url: 'https://tablemaster.fr/', type: 'plus-petit', description: 'Logiciel de réservation pour restaurants sans commission par couvert, à partir de 39 €/mois, essai de 14 jours.' },
      { nom: 'Izee Résa', url: 'https://izeeresa.fr/', type: 'plus-petit', description: 'Logiciel français de réservation hébergé en France, 60 € HT/mois, sans commission par couvert.' },
      { nom: 'Kouver', url: 'https://www.kouver.fr/', type: 'plus-petit', description: 'Logiciel français de réservation sans commission, à partir de 89 € HT/mois, avec acompte et intégration Google Réserver.' },
    ],
  },
  {
    nom: 'TheFork Manager',
    slug: 'thefork-manager',
    categorie: 'reservation',
    description: "Back-office de gestion des réservations pour les restaurants listés sur TheFork.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "L'essentiel de la valeur vient du volume d'audience de la marketplace TheFork, pas de l'outil de gestion lui-même : difficile à remplacer sans perdre l'accès à ce trafic.",
    domaine: 'theforkmanager.com',
    alternatives: [
      { nom: 'OpenResto', url: 'https://github.com/karanshukla/openresto', type: 'open-source', description: 'Application open source (MIT) de gestion des réservations de tables, auto-hébergeable, multi-restaurants.' },
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Système open source (MIT) de commande en ligne et de réservation de tables pour restaurants, sans commission.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Réservation de tables sans commission, offre gratuite limitée à 25 réservations par mois, interface disponible en français.' },
      { nom: 'TableMaster', url: 'https://tablemaster.fr/', type: 'plus-petit', description: 'Logiciel de réservation pour restaurants sans commission par couvert, à partir de 39 €/mois, essai de 14 jours.' },
      { nom: 'Izee Résa', url: 'https://izeeresa.fr/', type: 'plus-petit', description: 'Logiciel français de réservation hébergé en France, 60 € HT/mois, sans commission par couvert.' },
    ],
  },
  {
    nom: "L'Addition",
    slug: 'laddition',
    categorie: 'caisse',
    description: 'Logiciel de caisse et gestion pour restaurants et bars.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Un système de caisse certifié NF525 avec gestion des stocks, TVA et clôtures comptables représente un travail réglementaire et de fiabilité que peu de petites structures ont intérêt à recoder elles-mêmes.',
    domaine: 'laddition.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse en ligne certifiée NF525 avec une offre gratuite, utilisable en restauration comme en commerce.' },
      { nom: 'Tactill', url: 'https://www.tactill.com/', type: 'plus-petit', description: 'Caisse enregistreuse iPad certifiée, plus simple, destinée aux commerçants et aux restaurants.' },
    ],
  },
  {
    nom: 'Fudger',
    slug: 'fudger',
    categorie: 'caisse',
    description: 'Solution de caisse et pilotage pour restaurants indépendants.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même remarque que pour les autres caisses certifiées : la certification NF525 et la fiabilité transactionnelle ne sont pas un bon terrain pour du DIY.',
    domaine: '',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse en ligne certifiée NF525 avec une offre gratuite, utilisable en restauration comme en commerce.' },
      { nom: 'Tactill', url: 'https://www.tactill.com/', type: 'plus-petit', description: 'Caisse enregistreuse iPad certifiée, plus simple, destinée aux commerçants et aux restaurants.' },
    ],
  },
  {
    nom: 'Deliveroo Restaurant Hub',
    slug: 'deliveroo-restaurant-hub',
    categorie: 'livraison',
    description: 'Back-office de gestion des commandes en livraison via Deliveroo.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Comme TheFork Manager, la valeur vient de l'audience de la marketplace de livraison, pas de l'outil de gestion des commandes.",
    domaine: 'deliveroo.com',
  },
  {
    nom: 'Uber Eats Manager',
    slug: 'uber-eats-manager',
    categorie: 'livraison',
    description: 'Back-office de gestion des commandes en livraison via Uber Eats.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Même logique que Deliveroo : le remplacer ferait perdre l'accès à l'audience de la marketplace, ce qui coûte largement plus que l'abonnement.",
    domaine: 'ubereats.com',
    alternatives: [
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Système open source (MIT) de commande en ligne et de réservation de tables pour restaurants, sans commission.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'gratuit', description: 'Commande en ligne pour restaurants français, 0 % de commission, offre Starter gratuite, hébergement en France.' },
    ],
  },
  {
    nom: 'Sunday',
    slug: 'sunday',
    categorie: 'caisse',
    description: 'Paiement à table par QR code pour restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      "Un paiement par QR code lié à l'addition peut se recoder avec un prestataire de paiement (Stripe) et une app simple. La difficulté est la fiabilité en heure de rush et l'intégration avec la caisse existante.",
    domaine: 'sundayapp.com',
    prix: 'à partir de 29 €/mois',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'QR2App', url: 'https://www.qr2app.com/fr', type: 'plus-petit', description: 'Commande et paiement par QR code sans caisse à connecter ni commission, abonnement dès 19,90 €/mois hors frais Stripe.' },
      { nom: 'Qwick Order', url: 'https://qwickorder.fr/', type: 'plus-petit', description: 'Menu numérique et commande-paiement par QR code à table, abonnement dès 29 €/mois plus frais par transaction.' },
    ],
  },
  {
    nom: 'Skello',
    slug: 'skello',
    categorie: 'compta',
    description: 'Planning et gestion des plannings RH pour la restauration.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Un planning simple avec pointage se recode assez vite. La conformité au droit du travail (heures sup, repos obligatoires, export DSN) est le vrai travail derrière, et demande une maintenance juridique continue.',
    domaine: 'skello.io',
    prix: 'à partir de 79 €/mois',
    alternatives: [
      { nom: 'Combo', url: 'https://combohr.com/fr/', type: 'plus-petit', description: 'Éditeur français (ex-Snapshift) de planning, pointage et préparation de paie pour l\'hôtellerie-restauration.' },
      { nom: 'Staff', url: 'https://staffapp.fr/', type: 'plus-petit', description: 'Planning et pointage d\'équipe pour restaurants, forfait par établissement à partir de 29 € HT/mois.' },
    ],
  },
  {
    nom: 'Combo (ex-Snapshift)',
    slug: 'combo',
    categorie: 'compta',
    description: 'Gestion RH, planning et paie simplifiée pour la restauration.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      "Même verdict que Skello : la brique planning est facile, la conformité paie/droit du travail est ce qui justifie l'abonnement.",
    domaine: 'combohr.com',
    prix: 'à partir de 60 €/mois',
    alternatives: [
      { nom: 'Kimai', url: 'https://github.com/kimai/kimai', type: 'open-source', description: 'Suivi du temps libre (AGPL-3.0), auto-hébergeable, avec mode pointage entrée/sortie ; ne gère pas les plannings.' },
      { nom: 'Planesto', url: 'https://www.planesto.fr/', type: 'gratuit', description: 'Plannings de restaurant gratuits jusqu\'à 10 salariés, version payante dès 9,90 € HT/mois ; éditeur français.' },
    ],
  },
  {
    nom: 'Pennylane',
    slug: 'pennylane',
    categorie: 'compta',
    description: 'Comptabilité et pilotage financier en ligne, avec accès expert-comptable.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Une suite comptable complète avec obligations légales et lien direct avec l'expert-comptable n'est pas un bon candidat au DIY : le risque en cas d'erreur est réglementaire, pas juste fonctionnel.",
    domaine: 'pennylane.com',
    alternatives: [
      { nom: 'Dolibarr', url: 'https://www.dolibarr.org/', type: 'open-source', description: 'ERP/CRM open source d\'origine française (GPL) : devis, facturation, comptabilité, stocks et achats.' },
    ],
  },
  {
    nom: 'Innovorder',
    slug: 'innovorder',
    categorie: 'caisse',
    description: 'Bornes de commande et caisse pour la restauration rapide.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Bornes tactiles, caisse certifiée et intégrations multiples (livraison, cuisine) forment un ensemble matériel + logiciel trop lourd à recoder pour une petite structure.',
    domaine: 'innovorder.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
    ],
  },
  {
    nom: 'Resto-Flux',
    slug: 'resto-flux',
    categorie: 'autre',
    description: 'Gestion des stocks et des fournisseurs pour restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Un suivi de stock simple (quantités, seuils, alertes) se recode facilement en quelques jours. La négociation et le catalogue fournisseurs intégrés sont ce qui reste difficile à remplacer.',
    domaine: '',
    alternatives: [
      { nom: 'Dolibarr', url: 'https://www.dolibarr.org/', type: 'open-source', description: 'ERP/CRM open source d\'origine française (GPL) : devis, facturation, comptabilité, stocks et achats.' },
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source (édition Community) : facturation, gestion des stocks, achats et ventes.' },
      { nom: 'Yokitup', url: 'https://www.yokitup.com/', type: 'gratuit', description: 'Offre gratuite permanente : fiches techniques, coût par ingrédient, taux de marge, allergènes et valorisation du stock.' },
    ],
  },

  // --- Lot 2026-09-30 : fusion de 3 recherches IA (GPT, Mistral, Gemini),
  // dédupliquées par produit. Voir prompt-recherche-logiciels-chr.md pour la
  // méthode. Verdicts par archétype de catégorie (caisse -> NF525, PMS/channel
  // manager -> risque de double réservation, pourboire -> redistribution de
  // fonds réglementée, HACCP -> simple carnet de bord numérique, etc.).

  // Caisse
  {
    nom: 'Zelty',
    slug: 'zelty',
    categorie: 'caisse',
    description: 'Caisse cloud complète pour restaurants indépendants et chaînes multi-établissements.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Comme toute caisse utilisée pour l'encaissement en France, elle doit être certifiée NF525 anti-fraude TVA : la certification et la fiabilité transactionnelle pèsent plus lourd que l'interface.",
    domaine: 'zelty.fr',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Zatyoo', url: 'https://www.zatyoo.fr/', type: 'plus-petit', description: 'Logiciel de caisse certifié pour restaurants, bars et commerces, avec plan de salle, stocks et comptes clients.' },
      { nom: 'Tactill', url: 'https://www.tactill.com/', type: 'plus-petit', description: 'Caisse enregistreuse tactile sur iPad certifiée, utilisée par des restaurants et des commerces de proximité.' },
    ],
  },
  {
    nom: 'Lightspeed Restaurant',
    slug: 'lightspeed-restaurant',
    categorie: 'caisse',
    description: 'Caisse et gestion cloud (KDS, stocks, multi-sites) pour restaurants à fort volume et hôtels.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Écran cuisine, stocks et multi-sites synchronisés en temps réel, sur une base certifiée NF525 : un ensemble trop large et trop réglementé pour du sur-mesure.',
    domaine: 'lightspeedhq.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse en ligne certifiée NF525 avec une offre gratuite, utilisable en restauration comme en commerce.' },
      { nom: 'Tactill', url: 'https://www.tactill.com/', type: 'plus-petit', description: 'Caisse enregistreuse iPad certifiée, plus simple, destinée aux commerçants et aux restaurants.' },
    ],
  },
  {
    nom: 'Popina',
    slug: 'popina',
    categorie: 'caisse',
    description: "Caisse tactile sur iPad pensée pour la simplicité, utilisée par bars, cafés et restaurants indépendants.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Même logique que les autres caisses françaises : la certification NF525 et la fiabilité en heure de rush ne sont pas un bon terrain pour du sur-mesure.",
    domaine: 'popina.com',
    alternatives: [
      { nom: 'Floreant POS', url: 'https://floreant.org/', type: 'open-source', description: 'Caisse tactile open source pour restaurants et cafés (Java), gestion des tables et de la cuisine.' },
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source (édition Community) incluant caisse restaurant, plan de salle et commande à table par QR code. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Logiciel de caisse certifié NF525, version de base gratuite et options payantes, utilisable en restauration.' },
    ],
  },
  {
    nom: 'Cashpad',
    slug: 'cashpad',
    categorie: 'caisse',
    description: 'Caisse tactile pour restaurants, avec prise de commande mobile, écran cuisine et pilotage centralisé.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Écran cuisine et synchronisation multi-terminaux en temps réel demandent une infrastructure fiable ; ajouté à la certification NF525, ce n'est pas un projet de week-end.",
    domaine: 'cashpad.io',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP libre dont l\'édition Community inclut un point de vente avec mode restaurant ; la conformité NF525 reste à vérifier.' },
      { nom: 'ShopCaisse', url: 'https://www.shopcaisse.com/', type: 'gratuit', description: 'Caisse française certifiée NF525 avec plan de salle et écran cuisine, gratuite jusqu\'à 100 tickets par mois.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse en ligne certifiée NF525, gratuite avec options payantes, version pour la restauration.' },
    ],
  },
  {
    nom: 'AirKitchen',
    slug: 'airkitchen',
    categorie: 'caisse',
    description: "Caisse tactile NF525 pour la restauration et les métiers de bouche, y compris hôtels et campings.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Même raisonnement que les autres caisses : certification obligatoire et fiabilité transactionnelle priment sur la personnalisation.",
    domaine: 'airkitchen.fr',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP libre dont l\'édition Community inclut un point de vente avec mode restaurant ; la conformité NF525 reste à vérifier.' },
      { nom: 'ShopCaisse', url: 'https://www.shopcaisse.com/', type: 'gratuit', description: 'Caisse française certifiée NF525 avec plan de salle et écran cuisine, gratuite jusqu\'à 100 tickets par mois.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse en ligne certifiée NF525, gratuite avec options payantes, version pour la restauration.' },
    ],
  },
  {
    nom: 'Tactill',
    slug: 'tactill',
    categorie: 'caisse',
    description: 'Caisse sur iPad ou iPhone utilisée notamment par les commerces de bouche et les restaurants.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Même verdict que les autres caisses certifiées : la fiabilité de l'encaissement et la conformité légale priment sur la simplicité apparente de l'interface.",
    domaine: 'tactill.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Zatyoo', url: 'https://www.zatyoo.fr/', type: 'plus-petit', description: 'Logiciel de caisse certifié pour restaurants, bars et commerces, avec plan de salle, stocks et comptes clients.' },
    ],
  },
  {
    nom: 'Clyo Systems',
    slug: 'clyo-systems',
    categorie: 'caisse',
    description: 'Caisse et gestion de point de vente modulaire pour restaurants, bars et discothèques.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Un ensemble caisse + stocks + commandes en ligne certifié NF525 représente plusieurs briques réglementaires à maintenir, pas un seul outil simple à recoder.',
    domaine: 'clyosystems.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP libre dont l\'édition Community inclut un point de vente avec mode restaurant ; la conformité NF525 reste à vérifier.' },
      { nom: 'ShopCaisse', url: 'https://www.shopcaisse.com/', type: 'gratuit', description: 'Caisse française certifiée NF525 avec plan de salle et écran cuisine, gratuite jusqu\'à 100 tickets par mois.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse en ligne certifiée NF525, gratuite avec options payantes, version pour la restauration.' },
    ],
  },
  {
    nom: 'Crisalid',
    slug: 'crisalid',
    categorie: 'caisse',
    description: "Logiciel d'encaissement pour restaurants, brasseries, boulangeries et autres commerces de bouche.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Une caisse certifiée pour plusieurs métiers de bouche implique une maintenance réglementaire continue que peu de petites structures ont intérêt à internaliser.',
    domaine: 'crisalid.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP libre dont l\'édition Community inclut un point de vente avec mode restaurant ; la conformité NF525 reste à vérifier.' },
      { nom: 'ShopCaisse', url: 'https://www.shopcaisse.com/', type: 'gratuit', description: 'Caisse française certifiée NF525 avec plan de salle et écran cuisine, gratuite jusqu\'à 100 tickets par mois.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse en ligne certifiée NF525, gratuite avec options payantes, version pour la restauration.' },
    ],
  },
  {
    nom: 'Zatyoo',
    slug: 'zatyoo',
    categorie: 'caisse',
    description: 'Caisse certifiée pour restaurants et bars, avec plan de salle, stocks et comptes clients.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "La certification NF525 est explicitement mise en avant : c'est le signal classique qu'il vaut mieux payer un éditeur que recoder soi-même.",
    domaine: 'zatyoo.fr',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Tactill', url: 'https://www.tactill.com/', type: 'plus-petit', description: 'Caisse enregistreuse tactile sur iPad certifiée, utilisée par des restaurants et des commerces de proximité.' },
    ],
  },
  {
    nom: 'Hiboutik',
    slug: 'hiboutik',
    categorie: 'caisse',
    description: 'Caisse en ligne utilisée par des commerces et établissements de restauration, avec une offre freemium.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      "L'offre freemium couvre des besoins basiques qu'une petite structure sans forte contrainte spécifique pourrait recoder ; dès que le volume ou les obligations comptables augmentent, la certification NF525 reprend le dessus.",
    domaine: 'hiboutik.com',
    prix: 'gratuit (Premium à 14,90 €/mois)',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
    ],
  },
  {
    nom: 'SumUp',
    slug: 'sumup',
    categorie: 'caisse',
    description: 'Système de caisse et terminal de paiement mobile pour cafés et restaurants, avec envoi en cuisine.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Associé à un terminal de paiement physique certifié, ce n'est pas qu'un logiciel : matériel, certification et fiabilité des paiements écartent d'office la solution maison.",
    domaine: 'sumup.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Tactill', url: 'https://www.tactill.com/', type: 'plus-petit', description: 'Caisse enregistreuse tactile sur iPad certifiée, utilisée par des restaurants et des commerces de proximité.' },
    ],
  },
  {
    nom: 'Square pour restaurants',
    slug: 'square',
    categorie: 'caisse',
    description: 'Solution de caisse et de commande pour restaurants et bars, reliée aux paiements et aux ventes en ligne.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même remarque que SumUp : le logiciel est indissociable du matériel de paiement et de sa certification, ce qui écarte la solution maison.',
    domaine: 'squareup.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Zatyoo', url: 'https://www.zatyoo.fr/', type: 'plus-petit', description: 'Logiciel de caisse certifié pour restaurants, bars et commerces, avec plan de salle, stocks et comptes clients.' },
    ],
  },
  {
    nom: 'Trivec',
    slug: 'trivec',
    categorie: 'caisse',
    description: 'Système de caisse et de gestion des opérations pour restaurants, bars et établissements hôteliers.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Un système de caisse multi-établissements avec obligations réglementaires reste, comme les autres, plus sûr à acheter qu\'à recoder.',
    domaine: 'trivec.fr',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Zatyoo', url: 'https://www.zatyoo.fr/', type: 'plus-petit', description: 'Logiciel de caisse certifié pour restaurants, bars et commerces, avec plan de salle, stocks et comptes clients.' },
    ],
  },
  {
    nom: 'Tiller',
    slug: 'tiller',
    categorie: 'caisse',
    description: 'Caisse enregistreuse mobile pour restaurants et commerces, avec exploitation des données de vente.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même verdict que les autres caisses certifiées NF525 : la conformité réglementaire prime sur la simplicité apparente de l\'app.',
    domaine: 'tillersystems.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Zatyoo', url: 'https://www.zatyoo.fr/', type: 'plus-petit', description: 'Logiciel de caisse certifié pour restaurants, bars et commerces, avec plan de salle, stocks et comptes clients.' },
    ],
  },
  {
    nom: 'Squel',
    slug: 'squel',
    categorie: 'caisse',
    description: 'Logiciel de caisse cloud pour le CHR, cité dans plusieurs comparatifs indépendants.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Présence non vérifiée directement sur un site officiel au-delà des comparatifs qui le citent — à confirmer avant de s'y fier. Sous réserve, même logique NF525 que les autres caisses.",
    domaine: '',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Zatyoo', url: 'https://www.zatyoo.fr/', type: 'plus-petit', description: 'Logiciel de caisse certifié pour restaurants, bars et commerces, avec plan de salle, stocks et comptes clients.' },
    ],
  },
  {
    nom: 'iKentoo',
    slug: 'ikentoo',
    categorie: 'caisse',
    description: 'Caisse sur iPad (groupe Lightspeed) utilisée par des restaurants gastronomiques et des bars.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même famille que Lightspeed Restaurant : certification NF525 et fiabilité transactionnelle avant tout.',
    domaine: 'ikentoo.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse en ligne certifiée NF525 avec une offre gratuite, utilisable en restauration comme en commerce.' },
      { nom: 'Tactill', url: 'https://www.tactill.com/', type: 'plus-petit', description: 'Caisse enregistreuse iPad certifiée, plus simple, destinée aux commerçants et aux restaurants.' },
    ],
  },
  {
    nom: 'Revo',
    slug: 'revo',
    categorie: 'caisse',
    description: "Écosystème de caisse et de prise de commande, avec module de borne d'auto-commande (Revo Kiosk).",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Caisse certifiée et bornes matérielles forment un ensemble logiciel et hardware trop lourd à recoder pour une petite structure.',
    domaine: 'revo.works',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source (Community) avec caisse restaurant et mode borne d\'auto-commande (kiosk) ou QR code. NF525 à vérifier.' },
      { nom: 'Floreant POS', url: 'https://floreant.org/', type: 'open-source', description: 'Caisse tactile open source pour restaurants et cafés (Java), gestion des tables et de la cuisine.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Logiciel de caisse certifié NF525, version de base gratuite et options payantes, utilisable en restauration.' },
    ],
  },

  // Réservation
  {
    nom: 'Kouver',
    slug: 'kouver',
    categorie: 'reservation',
    description: "Logiciel français de réservation de tables, avec plan de salle et un agent IA vocale pour la prise d'appels.",
    verdictEditeur: 'KINDA',
    justificationEditeur:
      "Un formulaire de réservation avec plan de salle se recode assez bien. La gestion des no-shows et l'agent vocal IA qui décroche le téléphone sont ce qui reste difficile à reproduire seul.",
    domaine: 'kouver.fr',
    prix: 'à partir de 89 €/mois',
    alternatives: [
      { nom: 'OpenResto', url: 'https://github.com/karanshukla/openresto', type: 'open-source', description: 'Système de réservation de tables auto-hébergé (MIT), plan de salle, multi-restaurants, sans compte client.' },
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Commande en ligne et réservation de tables pour restaurants, open source (MIT), auto-hébergé, sans commission.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Réservation sans commission, plan gratuit jusqu\'à 25 réservations par mois, interface en français (éditeur danois).' },
      { nom: 'TableMaster', url: 'https://tablemaster.fr/', type: 'plus-petit', description: 'Réservation de restaurant sans commission, pack Gestion à 39 €/mois, essai de 14 jours.' },
    ],
  },
  {
    nom: 'CoverManager',
    slug: 'covermanager',
    categorie: 'reservation',
    description: 'Plateforme de réservation, gestion de salle et relation client pour restaurants indépendants et groupes.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      "La réservation de base est recodable ; la couche marketing et CRM (campagnes, segmentation) qui vient avec est ce qui justifie réellement l'abonnement pour un groupe.",
    domaine: 'covermanager.com',
    prix: 'sur devis',
    alternatives: [
      { nom: 'OpenResto', url: 'https://github.com/karanshukla/openresto', type: 'open-source', description: 'Système libre (MIT) de réservation de tables auto-hébergé via Docker, multi-restaurants, jeune projet actif.' },
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Commande en ligne, réservation de tables et gestion de menus, libre (MIT), auto-hébergé, sans commission.' },
      { nom: 'ViteUneTable', url: 'https://viteunetable.com/', type: 'gratuit', description: 'Réservation en ligne gratuite pour restaurants, 0 % de commission ; options payantes dès 29 € HT/mois.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Réservation de tables danoise, en français, gratuite jusqu\'à 25 réservations/mois, sans commission ni frais par couvert.' },
      { nom: 'Resatable', url: 'https://resatable.fr/', type: 'plus-petit', description: 'Réservation et plan de salle français, sans commission ni engagement, dès 39 €/mois.' },
    ],
  },
  {
    nom: 'OpenTable',
    slug: 'opentable',
    categorie: 'reservation',
    description: 'Plateforme de réservation et de découverte de restaurants, avec des outils de gestion pour les établissements.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Comme TheFork, la valeur vient du trafic apporté par la marketplace de découverte, pas de l'outil de gestion des réservations en tant que tel.",
    domaine: 'opentable.com',
    alternatives: [
      { nom: 'OpenResto', url: 'https://get.openres.to', type: 'open-source', description: 'Système de réservation de tables open source (MIT), auto-hébergé avec Docker, sans frais par couvert.' },
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Plateforme open source (MIT, Laravel) de commande en ligne, réservation de table et gestion de restaurant.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Gestion des réservations avec plan gratuit (25 réservations/mois), puis forfaits fixes dès 23 €/mois sans commission.' },
      { nom: 'resmio', url: 'https://www.resmio.com/', type: 'plus-petit', description: 'Réservation de tables en ligne, disponible en français, abonnement mensuel fixe sans frais par client.' },
      { nom: 'Tablein', url: 'https://www.tablein.com/', type: 'plus-petit', description: 'Réservation de tables avec carnet clients (Guestbook), forfaits à partir de 67 €/mois, sans engagement.' },
    ],
  },
  {
    nom: 'SevenRooms',
    slug: 'sevenrooms',
    categorie: 'reservation',
    description: 'Réservation, gestion des tables et CRM pour les restaurants et groupes hôteliers.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Pensé pour des groupes multi-établissements avec CRM et automatisations marketing poussées, c\'est une orchestration trop large pour être recodée par une seule structure.',
    domaine: 'sevenrooms.com',
    alternatives: [
      { nom: 'OpenResto', url: 'https://get.openres.to', type: 'open-source', description: 'Système de réservation de tables open source (MIT), auto-hébergé avec Docker, sans frais par couvert.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Gestion des réservations avec plan gratuit (25 réservations/mois), puis forfaits fixes dès 23 €/mois sans commission.' },
      { nom: 'Tablein', url: 'https://www.tablein.com/', type: 'plus-petit', description: 'Réservation de tables avec carnet clients (Guestbook), forfaits à partir de 67 €/mois, sans engagement.' },
      { nom: 'resmio', url: 'https://www.resmio.com/', type: 'plus-petit', description: 'Réservation de tables en ligne, disponible en français, abonnement mensuel fixe sans frais par client.' },
    ],
  },
  {
    nom: 'ResDiary',
    slug: 'resdiary',
    categorie: 'reservation',
    description: 'Système de réservation en ligne et de gestion des tables pour restaurants, bars et hôtels.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Similaire à Kouver : la prise de réservation elle-même est un projet raisonnable, la fiabilité multi-canal demande plus de maintenance.',
    domaine: 'resdiary.com',
    prix: 'à partir de 99 $/mois',
    alternatives: [
      { nom: 'OpenResto', url: 'https://get.openres.to', type: 'open-source', description: 'Système de réservation de tables open source (MIT), auto-hébergé avec Docker, sans frais par couvert.' },
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Plateforme open source (MIT, Laravel) de commande en ligne, réservation de table et gestion de restaurant.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Gestion des réservations avec plan gratuit (25 réservations/mois), puis forfaits fixes dès 23 €/mois sans commission.' },
      { nom: 'resmio', url: 'https://www.resmio.com/', type: 'plus-petit', description: 'Réservation de tables en ligne, disponible en français, abonnement mensuel fixe sans frais par client.' },
      { nom: 'Tablein', url: 'https://www.tablein.com/', type: 'plus-petit', description: 'Réservation de tables avec carnet clients (Guestbook), forfaits à partir de 67 €/mois, sans engagement.' },
    ],
  },
  {
    nom: 'Guestonline',
    slug: 'guestonline',
    categorie: 'reservation',
    description: 'Logiciel indépendant de gestion des réservations, plan de salle et fichier client, sans commission.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Même famille que Kouver : la brique réservation est raisonnable à recoder, le fichier client et le suivi des no-shows demandent plus de maintenance dans la durée.',
    domaine: 'guestonline.fr',
    alternatives: [
      { nom: 'OpenResto', url: 'https://github.com/karanshukla/openresto', type: 'open-source', description: 'Système de réservation de tables auto-hébergé (MIT), plan de salle, multi-restaurants, sans compte client.' },
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Commande en ligne et réservation de tables pour restaurants, open source (MIT), auto-hébergé, sans commission.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Réservation sans commission, plan gratuit jusqu\'à 25 réservations par mois, interface en français (éditeur danois).' },
      { nom: 'TableMaster', url: 'https://tablemaster.fr/', type: 'plus-petit', description: 'Réservation de restaurant sans commission, pack Gestion à 39 €/mois, essai de 14 jours.' },
    ],
  },
  {
    nom: 'Eat App',
    slug: 'eat-app',
    categorie: 'reservation',
    description: 'Suite réservation, gestion des tables et fidélisation pour restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      "La réservation et le plan de salle sont recodables ; la couche fidélisation qui vient avec est ce qui justifie réellement l'abonnement.",
    domaine: 'eatapp.co',
    prix: 'à partir de 99 $/mois',
    alternatives: [
      { nom: 'OpenResto', url: 'https://github.com/karanshukla/openresto', type: 'open-source', description: 'Système libre (MIT) de réservation de tables auto-hébergé via Docker, multi-restaurants, jeune projet actif.' },
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Commande en ligne, réservation de tables et gestion de menus, libre (MIT), auto-hébergé, sans commission.' },
      { nom: 'ViteUneTable', url: 'https://viteunetable.com/', type: 'gratuit', description: 'Réservation en ligne gratuite pour restaurants, 0 % de commission ; options payantes dès 29 € HT/mois.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Réservation de tables danoise, en français, gratuite jusqu\'à 25 réservations/mois, sans commission ni frais par couvert.' },
      { nom: 'Resatable', url: 'https://resatable.fr/', type: 'plus-petit', description: 'Réservation et plan de salle français, sans commission ni engagement, dès 39 €/mois.' },
    ],
  },
  {
    nom: 'PlaceYourGuest',
    slug: 'placeyourguest',
    categorie: 'reservation',
    description: 'Outil en ligne de création et d\'optimisation de plans de table pour restaurants et événements.',
    verdictEditeur: 'YES',
    justificationEditeur:
      "Un générateur de plan de table est l'un des outils les plus simples de cette liste : pas de paiement, pas de synchronisation temps réel, pas de certification — un projet de développement raisonnable.",
    domaine: '',
    prix: 'à partir de 13 € (paiement unique, hors abonnement)',
    alternatives: [
      { nom: 'HappyChef — plan de salle', url: 'https://happychef.cloud/en/tools/restaurant-floor-plan-maker/', type: 'gratuit', description: 'Éditeur gratuit sans compte pour dessiner un plan de salle : tables, zones, capacité, export PDF et lien de partage.' },
    ],
  },

  // Livraison
  {
    nom: 'Deliverect',
    slug: 'deliverect',
    categorie: 'livraison',
    description: 'Agrégateur qui centralise les commandes et les menus de plateformes de livraison et de vente directe.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Le vrai travail est de maintenir des intégrations à jour avec chaque plateforme de livraison (API qui changent régulièrement) — un projet de maintenance continue, pas un outil qu'on code une fois.",
    domaine: 'deliverect.com',
    alternatives: [
      { nom: 'HubRise', url: 'https://www.hubrise.com/', type: 'plus-petit', description: 'Hub d\'intégration entre caisses et plateformes de commande, 35 €/mois par point de vente, sans frais par commande.' },
    ],
  },
  {
    nom: 'HubRise',
    slug: 'hubrise',
    categorie: 'livraison',
    description: 'Plateforme d\'intégration qui relie caisses, plateformes de livraison, stocks et outils de commande en ligne.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même logique que Deliverect : la valeur est dans le nombre d\'intégrations maintenues à jour, pas dans une fonctionnalité isolée facile à recoder.',
    domaine: 'hubrise.com',
  },
  {
    nom: 'Otter',
    slug: 'otter',
    categorie: 'livraison',
    description: 'Outil de centralisation des commandes de livraison, de vente à emporter et de click & collect.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Centraliser plusieurs plateformes de commande fiablement, avec alertes en cas de panne d\'une intégration, est un travail d\'infrastructure continu plus qu\'un développement ponctuel.',
    domaine: 'tryotter.com',
    alternatives: [
      { nom: 'HubRise', url: 'https://www.hubrise.com/', type: 'plus-petit', description: 'Plateforme d\'intégration reliant caisses, plateformes de livraison et outils de commande en ligne, 40+ caisses compatibles.' },
    ],
  },
  {
    nom: 'Stuart',
    slug: 'stuart',
    categorie: 'livraison',
    description: 'Plateforme de livraison à la demande permettant aux restaurants d\'organiser leurs livraisons locales.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Ce n'est pas qu'un logiciel : c'est un réseau de coursiers. Aucune fiche de code ne remplace une flotte de livreurs disponible à la demande.",
    domaine: 'stuart.com',
    alternatives: [
      { nom: 'Fleetbase', url: 'https://github.com/fleetbase/fleetbase', type: 'open-source', description: 'Plateforme logistique open source (AGPL) de suivi de flotte et de dispatch pour organiser ses propres tournées de livraison.' },
      { nom: 'CoopCycle', url: 'https://coopcycle.org/', type: 'plus-petit', description: 'Fédération de coopératives de livraison à vélo, dont certaines en France assurent la livraison de repas pour les restaurants.' },
    ],
  },
  {
    nom: 'Just Eat (Pro)',
    slug: 'just-eat-pro',
    categorie: 'livraison',
    description: 'Place de marché de livraison de repas ; son extranet permet aux restaurateurs de gérer commandes et menus.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Comme Deliveroo et Uber Eats, la valeur vient de l'audience de la marketplace, pas de l'extranet de gestion des commandes en tant que tel.",
    domaine: 'just-eat.fr',
  },
  {
    nom: 'ClickEat',
    slug: 'clickeat',
    categorie: 'livraison',
    description: 'Solution française de commande en ligne, click & collect et livraison, sans commission.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Un parcours de commande en ligne sans marketplace se recode avec un prestataire de paiement classique ; la fiabilité en heure de rush et le multi-canal restent le vrai travail.',
    domaine: 'click-eat.fr',
    prix: 'à partir de 59 €/mois',
    alternatives: [
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Commande en ligne, réservation de tables et gestion de menus, libre (MIT), auto-hébergé, sans commission.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'gratuit', description: 'Menu QR code avec commande à table, gratuit jusqu\'à 20 commandes/mois sans paiement en ligne, 0 % de commission.' },
      { nom: 'Collectly', url: 'https://collectly.fr/', type: 'plus-petit', description: 'Click & collect français sans commission, abonnement fixe de 49,99 € HT/mois avec site de marque et fidélité.' },
    ],
  },
  {
    nom: 'GloriaFood',
    slug: 'gloriafood',
    categorie: 'livraison',
    description: 'Plateforme de commande en ligne gratuite (plan freemium), répandue chez les petits indépendants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Même logique que ClickEat : le formulaire de commande en ligne est un projet accessible, la fiabilité des paiements et des notifications en cuisine est ce qui demande le plus d\'attention.',
    domaine: 'gloriafood.com',
    prix: 'gratuit (options payantes dès 9 $/mois)',
    alternatives: [
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Commande en ligne et réservation de tables pour restaurants, open source (MIT), auto-hébergé, sans commission.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'gratuit', description: 'Commande en ligne sans commission, plan Starter gratuit (20 commandes/mois), hébergé en France.' },
      { nom: 'GetEat', url: 'https://geteat.fr/', type: 'gratuit', description: 'Prise de commande et click and collect gratuits, sans commission, hébergés en France.' },
    ],
  },
  {
    nom: 'OrdraFood',
    slug: 'ordrafood',
    categorie: 'livraison',
    description: 'Plateforme française de commande en ligne sans commission sur les ventes, pour restaurateurs indépendants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Même famille que ClickEat et GloriaFood : la commande en ligne de base est recodable, la fiabilité en production est le vrai enjeu.',
    domaine: 'ordrafood.fr',
    prix: 'gratuit (plans dès 19,99 €/mois)',
    alternatives: [
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Plateforme open source (MIT, Laravel) de commande en ligne, réservation de table et gestion de restaurant.' },
    ],
  },

  // Comptabilité / RH / paie (même convention que Skello et Combo, déjà en base)
  {
    nom: 'Sage 50/100',
    slug: 'sage',
    categorie: 'compta',
    description: 'Comptabilité et paie très répandues en France, souvent utilisées via les experts-comptables, y compris pour les CHR.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Une comptabilité complète avec obligations légales (FEC, TVA, liasse) n\'est pas un bon candidat au DIY : l\'erreur coûte plus cher que l\'abonnement.',
    domaine: 'sage.com',
    alternatives: [
      { nom: 'Dolibarr', url: 'https://www.dolibarr.org/', type: 'open-source', description: 'ERP/CRM open source d\'origine française (GPL) : devis, facturation, comptabilité, stocks et achats.' },
    ],
  },
  {
    nom: 'Cegid',
    slug: 'cegid',
    categorie: 'compta',
    description: 'Suite de comptabilité (Quadra, Loop) et de paie utilisée par les cabinets comptables et les PME, dont les CHR.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même remarque que pour les autres suites comptables : le risque est réglementaire, pas fonctionnel, donc pas un bon terrain pour du sur-mesure.',
    domaine: 'cegid.com',
    alternatives: [
      { nom: 'Dolibarr', url: 'https://github.com/Dolibarr/dolibarr', type: 'open-source', description: 'ERP/CRM libre d\'origine française (GPL-3.0) avec facturation et comptabilité, dépôt très actif.' },
    ],
  },
  {
    nom: 'EBP',
    slug: 'ebp',
    categorie: 'compta',
    description: 'Logiciels de comptabilité et de paie pour TPE/PME, fréquents chez les petits établissements CHR.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Comptabilité et obligations fiscales restent le cas d\'école du logiciel qu\'il vaut mieux acheter certifié que recoder soi-même.',
    domaine: 'ebp.com',
    alternatives: [
      { nom: 'Dolibarr', url: 'https://github.com/Dolibarr/dolibarr', type: 'open-source', description: 'ERP/CRM libre d\'origine française (GPL-3.0) avec facturation et comptabilité, dépôt très actif.' },
    ],
  },
  {
    nom: 'Tiime',
    slug: 'tiime',
    categorie: 'compta',
    description: 'Application de facturation et de comptabilité pour indépendants et petites entreprises, y compris en restauration.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      "La facturation seule (devis, factures, envoi) se recode assez facilement. Dès que l'outil couvre la comptabilité et les déclarations, on retombe sur les mêmes obligations légales que les autres suites.",
    domaine: 'tiime.fr',
    prix: 'gratuit (plans payants à partir de 9,99 €/mois)',
    alternatives: [
      { nom: 'Dolibarr', url: 'https://www.dolibarr.org/', type: 'open-source', description: 'ERP/CRM open source (GPL) pour devis, factures, clients et suivi comptable des petites entreprises, développé en France.' },
      { nom: 'Henrri', url: 'https://www.henrri.com/', type: 'gratuit', description: 'Logiciel français de facturation gratuit : factures, devis et utilisateurs illimités, avec facturation électronique.' },
      { nom: 'Abby', url: 'https://abby.fr/', type: 'gratuit', description: 'Facturation électronique et comptabilité simplifiée pour indépendants, offre de base gratuite sans limite de devis ni factures.' },
      { nom: 'Facture.net', url: 'https://www.facture.net/', type: 'gratuit', description: 'Outil gratuit de devis et factures en ligne, sans limite de documents ni de clients, édité en France.' },
    ],
  },
  {
    nom: 'Silae',
    slug: 'silae',
    categorie: 'compta',
    description: 'Plateforme SaaS de gestion de la paie et des déclarations sociales, utilisée par les entreprises et cabinets comptables.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "La paie et les déclarations sociales sont un terrain réglementaire mouvant (DSN, cotisations) : une erreur coûte bien plus cher que l'abonnement, ce n'est pas un projet de DIY.",
    domaine: 'silae.fr',
    alternatives: [
      { nom: 'QuickPaie', url: 'https://www.quickpaie.com/', type: 'plus-petit', description: 'Fiches de paie en ligne sans abonnement, de 3,90 à 9,90 € HT par bulletin, avec DSN et exports comptables.' },
    ],
  },
  {
    nom: 'PayFit',
    slug: 'payfit',
    categorie: 'compta',
    description: 'Logiciel RH et de paie automatisé, avec des contenus dédiés à la convention collective HCR (extras, heures sup, DSN).',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Même remarque que Silae : la paie HCR avec ses spécificités (extras, heures sup) est un sujet légal, pas un module qu'on recode pour gagner un abonnement.",
    domaine: 'payfit.com',
    alternatives: [
      { nom: 'Combo', url: 'https://combohr.com/', type: 'plus-petit', description: 'Planning, pointage, contrats et préparation de paie pour restaurants, hôtels et commerces, essai 7 jours.' },
      { nom: 'QuickPaie', url: 'https://www.quickpaie.com/', type: 'plus-petit', description: 'Fiches de paie en ligne sans abonnement, de 3,90 à 9,90 € HT par bulletin, avec DSN et exports comptables.' },
      { nom: 'Malibou', url: 'https://www.malibou.com/', type: 'plus-petit', description: 'Plateforme RH française avec paie réalisée par des gestionnaires dédiés, destinée aux TPE et PME.' },
    ],
  },
  {
    nom: 'Lucca',
    slug: 'lucca',
    categorie: 'compta',
    description: 'Suite RH SaaS modulaire (planning, congés, temps de travail, notes de frais) largement utilisée par les CHR.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Chaque brique (congés, notes de frais) est recodable isolément. Les faire fonctionner ensemble de façon fiable, avec les bonnes règles de droit du travail, est le travail qui justifie l\'outil.',
    domaine: 'lucca.fr',
    prix: 'sur devis',
    alternatives: [
      { nom: 'Frappe HR', url: 'https://github.com/frappe/hrms', type: 'open-source', description: 'RH open source (GPL-3.0) : congés, présences, plannings de postes, notes de frais et paie (paie non adaptée à la France).' },
      { nom: 'OrangeHRM', url: 'https://github.com/orangehrm/orangehrm', type: 'open-source', description: 'Suite RH open source (GPL-3.0) : fiches employés, congés, suivi du temps et notes de frais.' },
      { nom: 'Planning Restaurant', url: 'https://planning-restaurant.com/', type: 'gratuit', description: 'Planning d\'équipe pour bars et restaurants, gratuit jusqu\'à 4 employés, total d\'heures et alertes de dépassement.' },
      { nom: 'Agendrix', url: 'https://www.agendrix.com/fr-fr/industries/restauration', type: 'plus-petit', description: 'Planning, congés et pointage pour restauration, dès 3,25 $ par utilisateur et par mois (éditeur canadien).' },
    ],
  },
  {
    nom: 'Factorial',
    slug: 'factorial',
    categorie: 'compta',
    description: 'RH tout-en-un (planning, pointage, paie) avec des contenus dédiés à la convention HCR.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Même verdict que pour les autres outils de planning RH : la brique planning/pointage est abordable, la conformité paie et droit du travail est ce qui reste difficile.',
    domaine: 'factorialhr.com',
    prix: 'à partir de 5,75 €/mois/employé',
    alternatives: [
      { nom: 'Frappe HR', url: 'https://github.com/frappe/hrms', type: 'open-source', description: 'RH open source (GPL-3.0) : congés, présences, plannings de postes, notes de frais et paie (paie non adaptée à la France).' },
      { nom: 'OrangeHRM', url: 'https://github.com/orangehrm/orangehrm', type: 'open-source', description: 'Suite RH open source (GPL-3.0) : fiches employés, congés, suivi du temps et notes de frais.' },
      { nom: 'Planning Restaurant', url: 'https://planning-restaurant.com/', type: 'gratuit', description: 'Planning d\'équipe pour bars et restaurants, gratuit jusqu\'à 4 employés, total d\'heures et alertes de dépassement.' },
      { nom: 'Agendrix', url: 'https://www.agendrix.com/fr-fr/industries/restauration', type: 'plus-petit', description: 'Planning, congés et pointage pour restauration, dès 3,25 $ par utilisateur et par mois (éditeur canadien).' },
      { nom: 'Brigado', url: 'https://brigado.solutions/', type: 'plus-petit', description: 'Planning et pointage pour restaurants indépendants avec contrôles HCR, 39 €/mois forfaitaires quel que soit l\'effectif.' },
    ],
  },
  {
    nom: 'Agendrix',
    slug: 'agendrix',
    categorie: 'compta',
    description: "Logiciel de plannings, pointage et gestion des disponibilités pour les équipes de restaurants et d'hôtels.",
    verdictEditeur: 'KINDA',
    justificationEditeur:
      "Comme Skello, le planning et le pointage de base se recodent vite. La conformité au droit du travail (heures sup, repos, export paie) est ce qui demande une maintenance juridique continue.",
    domaine: 'agendrix.com',
    prix: 'à partir de 2,75 €/mois/employé',
    alternatives: [
      { nom: 'Kimai', url: 'https://github.com/kimai/kimai', type: 'open-source', description: 'Suivi du temps libre (AGPL-3.0), auto-hébergeable, avec mode pointage entrée/sortie ; ne gère pas les plannings.' },
      { nom: 'Planesto', url: 'https://www.planesto.fr/', type: 'gratuit', description: 'Plannings de restaurant gratuits jusqu\'à 10 salariés, version payante dès 9,90 € HT/mois ; éditeur français.' },
    ],
  },
  {
    nom: 'Planday',
    slug: 'planday',
    categorie: 'compta',
    description: "Plateforme de création de plannings, suivi du temps et communication avec les équipes de l'hôtellerie-restauration.",
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Même verdict que pour les autres outils de planning : la brique planning est simple, la conformité légale autour du temps de travail est le vrai travail.',
    domaine: 'planday.com',
    prix: 'à partir de 2,49 €/mois/utilisateur',
    alternatives: [
      { nom: 'Sling', url: 'https://getsling.com/', type: 'gratuit', description: 'Planification des équipes gratuite jusqu\'à 30 utilisateurs, offres payantes dès 2 $/utilisateur/mois.' },
      { nom: 'Combo', url: 'https://combohr.com/', type: 'plus-petit', description: 'Planning, pointage, contrats et préparation de paie pour restaurants, hôtels et commerces, essai 7 jours.' },
      { nom: 'Shiftbase', url: 'https://www.shiftbase.com/', type: 'plus-petit', description: 'Planning, pointage et absences pour restaurants et hôtels, interface en français, essai 14 jours.' },
    ],
  },
  {
    nom: 'Staff & Go',
    slug: 'staff-and-go',
    categorie: 'compta',
    description: 'SIRH pour gérer les plannings, temps de travail, absences et variables de paie des équipes.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Dès qu\'un outil touche aux variables de paie, le risque devient juridique et social : une erreur sur un bulletin coûte bien plus cher qu\'un abonnement SIRH.',
    domaine: 'staffngo.com',
    alternatives: [
      { nom: 'Combo', url: 'https://combohr.com/fr/', type: 'plus-petit', description: 'Éditeur français (ex-Snapshift) de planning, pointage et préparation de paie pour l\'hôtellerie-restauration.' },
      { nom: 'Staff', url: 'https://staffapp.fr/', type: 'plus-petit', description: 'Planning et pointage d\'équipe pour restaurants, forfait par établissement à partir de 29 € HT/mois.' },
    ],
  },
  {
    nom: 'Komia',
    slug: 'komia',
    categorie: 'compta',
    description: 'Plateforme tout-en-un pour la planification du personnel, le pointage et la conformité HACCP.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Le planning et le pointage se recodent raisonnablement ; le module HACCP est simple en soi, mais faire cohabiter les deux dans un seul outil fiable demande plus de travail qu\'il n\'y paraît.',
    domaine: 'komia.io',
    prix: 'à partir de 49 €/mois',
    alternatives: [
      { nom: 'Planning Restaurant', url: 'https://planning-restaurant.com/', type: 'gratuit', description: 'Planning d\'équipe pour bars et restaurants, gratuit jusqu\'à 4 employés, total d\'heures et alertes de dépassement.' },
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'Logiciel HACCP français avec plan gratuit (températures manuelles, réceptions, traçabilité) ; Pro à 49,90 € HT/mois avec planning.' },
      { nom: 'HACCP Facile', url: 'https://www.haccp-facile.com/', type: 'gratuit', description: 'Application HACCP web et mobile avec offre découverte gratuite de 4 modules (dont relevés de température).' },
      { nom: 'Brigado', url: 'https://brigado.solutions/', type: 'plus-petit', description: 'Planning et pointage pour restaurants indépendants avec contrôles HCR, 39 €/mois forfaitaires quel que soit l\'effectif.' },
    ],
  },
  {
    nom: 'Brigad',
    slug: 'brigad',
    categorie: 'compta',
    description: 'Plateforme française de mise en relation entre établissements CHR et extras qualifiés.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "C'est un marketplace à deux faces : la valeur vient du vivier d'extras disponibles à la demande, pas de l'app de mise en relation — impossible à recoder sans le réseau.",
    domaine: 'brigad.co',
  },

  // Autre — PMS / hôtellerie / channel manager
  {
    nom: 'Mews',
    slug: 'mews',
    categorie: 'autre',
    description: 'PMS cloud qui centralise réservations, opérations hôtelières, paiements et points de vente F&B.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Un PMS hôtelier touche à la facturation, aux paiements et à la synchronisation multi-canal en temps réel : une erreur peut coûter une chambre vendue deux fois, ce n'est pas un terrain pour du DIY.",
    domaine: 'mews.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS, moteur de réservation et site web pour hôtels, en open source (licence OSL 3.0), à héberger soi-même.' },
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pour hébergements, à partir de 15,50 €/mois sans engagement.' },
      { nom: 'Amenitiz', url: 'https://amenitiz.com/fr', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pensés pour les hôtels indépendants, tarif sur devis.' },
    ],
  },
  {
    nom: 'Misterbooking',
    slug: 'misterbooking',
    categorie: 'autre',
    description: 'PMS cloud français pour hôtels indépendants et groupes, avec moteur de réservation et distribution.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même remarque que pour tout PMS hôtelier : la synchronisation des disponibilités avec les canaux de distribution est un risque de surbooking qu\'on ne prend pas à la légère.',
    domaine: 'misterbooking.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS, moteur de réservation et site web pour hôtels, en open source (licence OSL 3.0), à héberger soi-même.' },
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pour hébergements, à partir de 15,50 €/mois sans engagement.' },
      { nom: 'Amenitiz', url: 'https://amenitiz.com/fr', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pensés pour les hôtels indépendants, tarif sur devis.' },
    ],
  },
  {
    nom: 'Asterio',
    slug: 'asterio',
    categorie: 'autre',
    description: 'PMS cloud pour hôtels, restaurants et spas, avec gestion multi-activité et point de vente intégré.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Gérer plusieurs activités (hébergement, restauration, spa) dans un seul système avec facturation croisée est un projet bien trop large pour du sur-mesure.',
    domaine: 'asterio.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS et moteur de réservation hôtelier libre (PHP, licence OSL-3.0), auto-hébergeable, dépôt actif.' },
      { nom: 'FewohBee', url: 'https://github.com/developeregrem/fewohbee', type: 'open-source', description: 'PMS libre (GPL-3.0) pour petits hôtels et pensions, interface en allemand et anglais, dépôt actif.' },
      { nom: 'Cudbe', url: 'https://cudbe.com/', type: 'plus-petit', description: 'PMS français pour hôtels et restaurants avec channel manager intégré, essai gratuit de 45 jours.' },
      { nom: 'Family Hotel', url: 'https://www.familyhotel.fr/', type: 'plus-petit', description: 'PMS français pour petits hôtels et chambres d\'hôtes, installé en local, essai de 60 jours, version certifiée pour la France.' },
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS et channel manager au nombre d\'unités, dès 15,50 €/mois, sans commission sur les réservations.' },
    ],
  },
  {
    nom: 'Cloudbeds',
    slug: 'cloudbeds',
    categorie: 'autre',
    description: 'Plateforme hôtelière regroupant PMS, réservations, paiements et distribution sur les canaux en ligne.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même logique que pour les autres PMS/channel managers : la synchronisation temps réel des stocks de chambres est un risque qu\'on ne prend pas en interne.',
    domaine: 'cloudbeds.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS et moteur de réservation hôtelier libre (PHP, licence OSL-3.0), auto-hébergeable, dépôt actif.' },
      { nom: 'Hoteliera', url: 'https://hoteliera.com/', type: 'gratuit', description: 'PMS gratuit sans limite de chambres (planning, réservations, facturation), en français ; channel manager payant dès 25 €/mois.' },
      { nom: 'Avirato', url: 'https://avirato.com/fr/pms-gratuit/', type: 'gratuit', description: 'Éditeur espagnol avec une version gratuite du PMS (réservations, calendrier, facturation) ; channel manager en option payante.' },
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS et channel manager au nombre d\'unités, dès 15,50 €/mois, sans commission sur les réservations.' },
      { nom: 'Octorate', url: 'https://octorate.com/', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation, sans commission sur les ventes directes, essai de 14 jours.' },
    ],
  },
  {
    nom: 'Amenitiz',
    slug: 'amenitiz',
    categorie: 'autre',
    description: 'Suite de gestion pour hôtels indépendants, avec PMS, moteur de réservation et gestion de canaux.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'PMS, moteur de réservation et distribution multicanale synchronisés en temps réel : le risque de double réservation rend ce trio impropre au fait-maison.',
    domaine: 'amenitiz.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS et moteur de réservation hôtelier libre (PHP, licence OSL-3.0), auto-hébergeable, dépôt actif.' },
      { nom: 'Hoteliera', url: 'https://hoteliera.com/', type: 'gratuit', description: 'PMS gratuit sans limite de chambres (planning, réservations, facturation), en français ; channel manager payant dès 25 €/mois.' },
      { nom: 'Avirato', url: 'https://avirato.com/fr/pms-gratuit/', type: 'gratuit', description: 'Éditeur espagnol avec une version gratuite du PMS (réservations, calendrier, facturation) ; channel manager en option payante.' },
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS et channel manager au nombre d\'unités, dès 15,50 €/mois, sans commission sur les réservations.' },
      { nom: 'Cudbe', url: 'https://cudbe.com/', type: 'plus-petit', description: 'PMS français pour hôtels et restaurants avec channel manager intégré, essai gratuit de 45 jours.' },
    ],
  },
  {
    nom: 'RoomRaccoon',
    slug: 'roomraccoon',
    categorie: 'autre',
    description: 'PMS intuitif tout-en-un dédié aux hôtels indépendants, gîtes et chambres d\'hôtes.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même famille que les autres PMS : la synchronisation temps réel des disponibilités rend le risque de double réservation trop élevé pour un outil fait maison.',
    domaine: 'roomraccoon.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS, moteur de réservation et site web pour hôtels, en open source (licence OSL 3.0), à héberger soi-même.' },
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pour hébergements, à partir de 15,50 €/mois sans engagement.' },
      { nom: 'Amenitiz', url: 'https://amenitiz.com/fr', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pensés pour les hôtels indépendants, tarif sur devis.' },
    ],
  },
  {
    nom: 'SiteMinder',
    slug: 'siteminder',
    categorie: 'autre',
    description: 'Outil de synchronisation des tarifs et disponibilités d\'hôtels sur les OTA et canaux de réservation.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Le channel manager est l\'exemple classique du logiciel où une synchronisation ratée coûte une chambre vendue en double — pas un bon candidat pour du sur-mesure.',
    domaine: 'siteminder.com',
    alternatives: [
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pour hébergements, à partir de 15,50 €/mois sans engagement.' },
      { nom: 'Octorate', url: 'https://www.octorate.com/', type: 'plus-petit', description: 'Channel manager, PMS cloud et moteur de réservation, mensuel sans engagement ni commission sur les ventes directes.' },
    ],
  },
  {
    nom: 'Thaïs-Soft',
    slug: 'thais-soft',
    categorie: 'autre',
    description: 'Logiciel SaaS de gestion hôtelière pour hôtels indépendants et résidences de tourisme.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même famille que les autres PMS : synchronisation temps réel et risque de surbooking priment sur la personnalisation.',
    domaine: 'thais-pms.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'Logiciel open source (OSL-3.0) de gestion hôtelière et de réservation, avec moteur de réservation et gestion des chambres.' },
      { nom: 'Avirato', url: 'https://avirato.com/fr/pms-gratuit/', type: 'gratuit', description: 'PMS pour petits hôtels dont la version de base est gratuite : réservations, calendrier, arrivées/départs et facturation.' },
      { nom: 'Family Hotel', url: 'https://www.familyhotel.fr/', type: 'plus-petit', description: 'PMS français pour hôteliers indépendants, essai de 60 jours, avec connexion aux plateformes de réservation.' },
    ],
  },
  {
    nom: 'Sequoiasoft',
    slug: 'sequoiasoft',
    categorie: 'autre',
    description: 'Suite logicielle pour la gestion des hôtels, hébergements de plein air et centres de bien-être.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Couvrir hôtellerie, plein air et bien-être dans un seul système avec facturation croisée est un périmètre bien trop large pour du sur-mesure.',
    domaine: 'sequoiasoft.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS, moteur de réservation et site web pour hôtels, en open source (licence OSL 3.0), à héberger soi-même.' },
      { nom: 'Inaxel (Naxi)', url: 'https://www.inaxel.com/fr', type: 'plus-petit', description: 'Suite de gestion pour l\'hôtellerie de plein air : réservations, facturation, caisse et accès, démo sur demande.' },
      { nom: 'CampinGest', url: 'https://www.o2clogiciel.com/logiciel-camping/campin-gest/', type: 'plus-petit', description: 'Logiciel de gestion de camping (réservations, plan des emplacements, facturation), licence à 750 € HT.' },
    ],
  },
  {
    nom: 'KE-booking',
    slug: 'ke-booking',
    categorie: 'autre',
    description: 'Logiciel hôtelier SaaS combinant planning, moteur de réservation et channel manager.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même famille que les autres PMS/channel managers : le risque de double réservation prime sur la simplicité apparente.',
    domaine: 'ke-booking.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS hôtelier open source (OSL-3.0) avec moteur de réservation et site web, auto-hébergé.' },
      { nom: 'Beds24', url: 'https://www.beds24.com/', type: 'plus-petit', description: 'PMS cloud, moteur de réservation et channel manager facturés à l\'usage dès 15,50 €/mois, sans engagement.' },
      { nom: 'Thaïs PMS', url: 'https://thais-pms.com/', type: 'plus-petit', description: 'PMS français pour hôtels indépendants, à partir de 65 € HT/mois pour 10 chambres, sans commission.' },
    ],
  },
  {
    nom: '5stelle',
    slug: '5stelle',
    categorie: 'autre',
    description: 'Logiciel de gestion hôtelière cloud pour le suivi des réservations, factures et arrivées.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même famille que les autres PMS : synchronisation temps réel des réservations et facturation, pas un projet de sur-mesure.',
    domaine: '',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS et moteur de réservation hôtelier libre (PHP, licence OSL-3.0), auto-hébergeable, dépôt actif.' },
      { nom: 'FewohBee', url: 'https://github.com/developeregrem/fewohbee', type: 'open-source', description: 'PMS libre (GPL-3.0) pour petits hôtels et pensions, interface en allemand et anglais, dépôt actif.' },
      { nom: 'Hoteliera', url: 'https://hoteliera.com/', type: 'gratuit', description: 'PMS gratuit sans limite de chambres (planning, réservations, facturation), en français ; channel manager payant dès 25 €/mois.' },
      { nom: 'Avirato', url: 'https://avirato.com/fr/pms-gratuit/', type: 'gratuit', description: 'Éditeur espagnol avec une version gratuite du PMS (réservations, calendrier, facturation) ; channel manager en option payante.' },
      { nom: 'Cudbe', url: 'https://cudbe.com/', type: 'plus-petit', description: 'PMS français pour hôtels et restaurants avec channel manager intégré, essai gratuit de 45 jours.' },
    ],
  },
  {
    nom: 'eviivo',
    slug: 'eviivo',
    categorie: 'autre',
    description: 'Plateforme de gestion des réservations, paiements et canaux pour hôtels indépendants et hébergements touristiques.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même verdict que les autres PMS/channel managers : synchronisation temps réel et paiements réglementés ne sont pas un bon projet de développement interne.',
    domaine: 'eviivo.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS et moteur de réservation hôtelier libre (PHP, licence OSL-3.0), auto-hébergeable, dépôt actif.' },
      { nom: 'FewohBee', url: 'https://github.com/developeregrem/fewohbee', type: 'open-source', description: 'PMS libre (GPL-3.0) pour petits hôtels et pensions, interface en allemand et anglais, dépôt actif.' },
      { nom: 'Hoteliera', url: 'https://hoteliera.com/', type: 'gratuit', description: 'PMS gratuit sans limite de chambres (planning, réservations, facturation), en français ; channel manager payant dès 25 €/mois.' },
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS et channel manager au nombre d\'unités, dès 15,50 €/mois, sans commission sur les réservations.' },
      { nom: 'Family Hotel', url: 'https://www.familyhotel.fr/', type: 'plus-petit', description: 'PMS français pour petits hôtels et chambres d\'hôtes, installé en local, essai de 60 jours, version certifiée pour la France.' },
    ],
  },
  {
    nom: 'Reservit',
    slug: 'reservit',
    categorie: 'autre',
    description: 'Solution française de réservation directe et de distribution multicanale pour hôtels et hébergements touristiques.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'La distribution multicanale en temps réel vers plusieurs OTA est précisément le genre de synchronisation fragile qu\'il vaut mieux confier à un éditeur spécialisé.',
    domaine: 'reservit.com',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS, moteur de réservation et site web pour hôtels, en open source (licence OSL 3.0), à héberger soi-même.' },
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pour hébergements, à partir de 15,50 €/mois sans engagement.' },
      { nom: 'Amenitiz', url: 'https://amenitiz.com/fr', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation pensés pour les hôtels indépendants, tarif sur devis.' },
    ],
  },
  {
    nom: 'D-EDGE',
    slug: 'd-edge',
    categorie: 'autre',
    description: 'Suite de distribution hôtelière réunissant CRS, channel manager, moteur de réservation et paiement (groupe Accor).',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Un CRS complet avec channel manager et paiement est l\'un des systèmes les plus critiques d\'un hôtel : aucune place pour l\'approximation d\'un outil fait maison.',
    domaine: 'd-edge.com',
    alternatives: [
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS et channel manager au nombre d\'unités, dès 15,50 €/mois, sans commission sur les réservations.' },
      { nom: 'WuBook', url: 'https://wubook.net/', type: 'plus-petit', description: 'Éditeur italien de PMS, channel manager et moteur de réservation pour hôtels, B&B et petites chaînes.' },
      { nom: 'Octorate', url: 'https://octorate.com/', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation, sans commission sur les ventes directes, essai de 14 jours.' },
    ],
  },
  {
    nom: 'Elloha',
    slug: 'elloha',
    categorie: 'autre',
    description: 'Channel manager français très diffusé chez les indépendants, avec moteur de réservation intégré.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même famille que les autres channel managers : la synchronisation temps réel des stocks prime sur la simplicité.',
    domaine: 'elloha.com',
    alternatives: [
      { nom: 'Beds24', url: 'https://beds24.com/', type: 'plus-petit', description: 'PMS et channel manager au nombre d\'unités, dès 15,50 €/mois, sans commission sur les réservations.' },
      { nom: 'WuBook', url: 'https://wubook.net/', type: 'plus-petit', description: 'Éditeur italien de PMS, channel manager et moteur de réservation pour hôtels, B&B et petites chaînes.' },
      { nom: 'Octorate', url: 'https://octorate.com/', type: 'plus-petit', description: 'PMS, channel manager et moteur de réservation, sans commission sur les ventes directes, essai de 14 jours.' },
    ],
  },
  {
    nom: 'Medialog',
    slug: 'medialog',
    categorie: 'autre',
    description: 'PMS historique de l\'hôtellerie indépendante française, disponible en cloud ou en local.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même famille que les autres PMS : ancienneté du produit ou non, le risque de synchronisation reste le même.',
    domaine: 'medialog.fr',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS hôtelier open source (OSL-3.0) avec moteur de réservation et site web, auto-hébergé.' },
      { nom: 'HotelDruid', url: 'https://www.hoteldruid.com/', type: 'open-source', description: 'Gestion hôtelière open source (AGPL) : planning des chambres, clients, tarifs, documents. Dernière version décembre 2025.' },
      { nom: 'Thaïs PMS', url: 'https://thais-pms.com/', type: 'plus-petit', description: 'PMS français pour hôtels indépendants, à partir de 65 € HT/mois pour 10 chambres, sans commission.' },
      { nom: 'Beds24', url: 'https://www.beds24.com/', type: 'plus-petit', description: 'PMS cloud, moteur de réservation et channel manager facturés à l\'usage dès 15,50 €/mois, sans engagement.' },
    ],
  },
  {
    nom: 'Family Hotel',
    slug: 'family-hotel',
    categorie: 'autre',
    description: 'PMS cloud indépendant pour hôtels, hôtelleries et campings.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même famille que les autres PMS : la synchronisation des réservations et de la facturation prime sur le reste.',
    domaine: 'familyhotel.fr',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS hôtelier open source (OSL-3.0) avec moteur de réservation et site web, auto-hébergé.' },
      { nom: 'HotelDruid', url: 'https://www.hoteldruid.com/', type: 'open-source', description: 'Gestion hôtelière open source (AGPL) : planning des chambres, clients, tarifs, documents. Dernière version décembre 2025.' },
      { nom: 'Beds24', url: 'https://www.beds24.com/', type: 'plus-petit', description: 'PMS cloud, moteur de réservation et channel manager facturés à l\'usage dès 15,50 €/mois, sans engagement.' },
      { nom: 'Thaïs PMS', url: 'https://thais-pms.com/', type: 'plus-petit', description: 'PMS français pour hôtels indépendants, à partir de 65 € HT/mois pour 10 chambres, sans commission.' },
    ],
  },
  {
    nom: 'Chloë',
    slug: 'chloe-my-groom-service',
    categorie: 'autre',
    description: 'PMS multi-activités (hôtel, restaurant, bar, spa, séminaires), installé en local.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'En plus des risques classiques de synchronisation d\'un PMS, la gestion croisée de plusieurs activités dans un seul outil ajoute une complexité que peu de structures ont intérêt à recoder.',
    domaine: 'logicielchloe.fr',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'PMS et moteur de réservation hôtelier libre (PHP, licence OSL-3.0), auto-hébergeable, dépôt actif.' },
      { nom: 'FewohBee', url: 'https://github.com/developeregrem/fewohbee', type: 'open-source', description: 'PMS libre (GPL-3.0) pour petits hôtels et pensions, interface en allemand et anglais, dépôt actif.' },
      { nom: 'Cudbe', url: 'https://cudbe.com/', type: 'plus-petit', description: 'PMS français pour hôtels et restaurants avec channel manager intégré, essai gratuit de 45 jours.' },
      { nom: 'Family Hotel', url: 'https://www.familyhotel.fr/', type: 'plus-petit', description: 'PMS français pour petits hôtels et chambres d\'hôtes, installé en local, essai de 60 jours, version certifiée pour la France.' },
    ],
  },
  {
    nom: 'Ulyses Suite Hotel',
    slug: 'ulyses-suite-hotel',
    categorie: 'autre',
    description: 'PMS destiné aux groupes hôteliers et établissements multi-sites pour centraliser opérations et réservations.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Un PMS pensé pour des groupes multi-sites ajoute une couche de consolidation qui rend l\'idée du DIY encore moins réaliste que pour un hôtel indépendant.',
    domaine: '',
    alternatives: [
      { nom: 'QloApps', url: 'https://github.com/Qloapps/QloApps', type: 'open-source', description: 'Logiciel open source (OSL-3.0) de gestion hôtelière et de réservation, avec moteur de réservation et gestion des chambres.' },
      { nom: 'Avirato', url: 'https://avirato.com/fr/pms-gratuit/', type: 'gratuit', description: 'PMS pour petits hôtels dont la version de base est gratuite : réservations, calendrier, arrivées/départs et facturation.' },
      { nom: 'Family Hotel', url: 'https://www.familyhotel.fr/', type: 'plus-petit', description: 'PMS français pour hôteliers indépendants, essai de 60 jours, avec connexion aux plateformes de réservation.' },
    ],
  },

  // Autre — OTA (extranets)
  {
    nom: 'Booking.com (extranet)',
    slug: 'booking-com-extranet',
    categorie: 'autre',
    description: 'Extranet de gestion des annonces, tarifs et disponibilités de l\'OTA n°1 pour les hôtels français.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "C'est l'exemple le plus extrême de dépendance à une marketplace : la valeur vient entièrement du trafic de Booking, aucun outil fait maison ne peut répliquer cette audience.",
    domaine: 'booking.com',
  },
  {
    nom: 'Expedia Partner Central',
    slug: 'expedia-partner-central',
    categorie: 'autre',
    description: 'Extranet de gestion des disponibilités, tarifs et paiements sur les OTA Expedia et Hotels.com.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: "Même logique que Booking.com : l'extranet n'a de valeur que parce qu'il donne accès à la demande de la marketplace.",
    domaine: 'expediapartnercentral.com',
  },

  // Autre — stocks / food cost / fiches techniques
  {
    nom: 'Koust',
    slug: 'koust',
    categorie: 'autre',
    description: 'Gestion des achats, stocks, ventes et coûts matière pour restaurants et groupes.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Comme Resto-Flux, un suivi de stock avec seuils et alertes se recode facilement. Le catalogue fournisseurs et les prix négociés intégrés sont la partie qui reste difficile à reproduire seul.',
    domaine: 'koust.net',
    prix: 'à partir de 80 €/mois',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) : modules Inventaire, Achats et Fabrication (nomenclatures) pour stocks et coûts.' },
      { nom: 'Yokitup', url: 'https://www.yokitup.com/', type: 'gratuit', description: 'Offre gratuite : fiches techniques, allergènes et coûts de revient ; offre complète à 159 €/mois par site.' },
      { nom: 'COS Kitchen', url: 'https://coskitchen.fr/', type: 'gratuit', description: 'Calculateur de coût matière (food cost) gratuit et illimité pour restaurants, avec export PDF.' },
      { nom: 'RestoMaestro', url: 'https://restomaestro.com/', type: 'plus-petit', description: 'Coût matière et marge par plat calculés à partir des factures scannées, dès 19 € HT/mois.' },
    ],
  },
  {
    nom: 'Yokitup',
    slug: 'yokitup',
    categorie: 'autre',
    description: 'Gestion des stocks, commandes fournisseurs, inventaires et coûts matière pour restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur: 'Même verdict que Koust : la brique stock/inventaire est abordable en DIY, la gestion fournisseurs à grande échelle l\'est moins.',
    domaine: 'yokitup.com',
    prix: 'gratuit (version payante à partir de 159 €/mois)',
    alternatives: [
      { nom: 'Koust', url: 'https://koust.net/', type: 'plus-petit', description: 'Éditeur français (Brest) de gestion de stock, fiches techniques et marges pour restaurants, à partir de 80 €/mois par site.' },
      { nom: 'Melba', url: 'https://melba.io/fr', type: 'plus-petit', description: 'ERP français pour restaurateurs en modules (stock, fiches techniques, commandes fournisseurs), dès 49 € HT/mois par module.' },
    ],
  },
  {
    nom: 'Easilys F&B',
    slug: 'easilys-fb',
    categorie: 'autre',
    description: 'Suite de gestion de la restauration pour suivre menus, achats, stocks et opérations de sites multiples.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Une suite qui couvre menus, achats, stocks et consolidation multi-sites à la fois est trop large pour être recodée et maintenue par une seule structure.',
    domaine: 'easilys.com',
    alternatives: [
      { nom: 'Melba', url: 'https://melba.io/fr', type: 'plus-petit', description: 'Fiches techniques, stocks, inventaires et commandes fournisseurs pour cuisines, modules dès 49 € HT/mois, essai gratuit.' },
      { nom: 'Koust', url: 'https://koust.net/', type: 'plus-petit', description: 'Éditeur français de fiches techniques, stocks et suivi des marges pour restaurants, dès 80 €/mois, essai de 14 jours.' },
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'plus-petit', description: 'Suite HACCP, stocks, recettes et commandes fournisseurs pour restaurants, dès 19,90 € HT/mois, plan gratuit limité.' },
    ],
  },
  {
    nom: 'Melba',
    slug: 'melba',
    categorie: 'autre',
    description: 'ERP de cuisine pour suivre recettes, fiches techniques, stocks, achats et coûts de revient.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Les fiches techniques et le calcul de coût de revient sont un modèle de données qu\'on peut recoder ; maintenir les prix d\'achat à jour et consolider plusieurs sites est le travail qui justifie l\'abonnement.',
    domaine: 'melba.io',
    prix: 'à partir de 49 €/mois',
    alternatives: [
      { nom: 'Yokitup', url: 'https://www.yokitup.com/', type: 'gratuit', description: 'Offre gratuite : fiches techniques, allergènes et coûts de revient ; offre complète à 159 €/mois par site.' },
      { nom: 'COS Kitchen', url: 'https://coskitchen.fr/', type: 'gratuit', description: 'Calculateur de coût matière (food cost) gratuit et illimité pour restaurants, avec export PDF.' },
      { nom: 'RestoMaestro', url: 'https://restomaestro.com/', type: 'plus-petit', description: 'Coût matière et marge par plat calculés à partir des factures scannées, dès 19 € HT/mois.' },
    ],
  },
  {
    nom: 'Foodmeup',
    slug: 'foodmeup',
    categorie: 'autre',
    description: 'Gestion de recettes, calcul de rentabilité et fiches techniques pour les métiers de bouche.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Une fiche technique avec calcul de coût de revient est un modèle de données recodable. Maintenir les prix d\'achat à jour dans la durée est le travail réel derrière l\'abonnement.',
    domaine: 'foodmeup.io',
    prix: 'sur devis',
    alternatives: [
      { nom: 'Yokitup', url: 'https://www.yokitup.com/', type: 'gratuit', description: 'Offre gratuite : fiches techniques, allergènes et coûts de revient ; offre complète à 159 €/mois par site.' },
      { nom: 'COS Kitchen', url: 'https://coskitchen.fr/', type: 'gratuit', description: 'Calculateur de coût matière (food cost) gratuit et illimité pour restaurants, avec export PDF.' },
      { nom: 'RestoMaestro', url: 'https://restomaestro.com/', type: 'plus-petit', description: 'Coût matière et marge par plat calculés à partir des factures scannées, dès 19 € HT/mois.' },
    ],
  },
  {
    nom: 'MarketMan',
    slug: 'marketman',
    categorie: 'autre',
    description: 'Gestion des stocks, fournisseurs, recettes et coûts pour restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur: 'Même logique que Koust et Yokitup : le suivi de stock est recodable, la gestion fournisseurs à jour est le vrai travail récurrent.',
    domaine: 'marketman.com',
    prix: 'à partir de 199 $/mois',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) : modules Inventaire, Achats et Fabrication (nomenclatures) pour stocks et coûts.' },
      { nom: 'Yokitup', url: 'https://www.yokitup.com/', type: 'gratuit', description: 'Offre gratuite : fiches techniques, allergènes et coûts de revient ; offre complète à 159 €/mois par site.' },
      { nom: 'COS Kitchen', url: 'https://coskitchen.fr/', type: 'gratuit', description: 'Calculateur de coût matière (food cost) gratuit et illimité pour restaurants, avec export PDF.' },
      { nom: 'RestoMaestro', url: 'https://restomaestro.com/', type: 'plus-petit', description: 'Coût matière et marge par plat calculés à partir des factures scannées, dès 19 € HT/mois.' },
    ],
  },
  {
    nom: 'Apicbase',
    slug: 'apicbase',
    categorie: 'autre',
    description: 'Gestion des recettes, achats, stocks et menus pour groupes de restauration et cuisines centrales.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Pensé pour des cuisines centrales et des groupes multi-sites, la consolidation des données à cette échelle dépasse largement un projet de développement interne.',
    domaine: 'apicbase.com',
    alternatives: [
      { nom: 'Melba', url: 'https://melba.io/fr', type: 'plus-petit', description: 'Fiches techniques, stocks, inventaires et commandes fournisseurs pour cuisines, modules dès 49 € HT/mois, essai gratuit.' },
      { nom: 'Koust', url: 'https://koust.net/', type: 'plus-petit', description: 'Éditeur français de fiches techniques, stocks et suivi des marges pour restaurants, dès 80 €/mois, essai de 14 jours.' },
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'plus-petit', description: 'Suite HACCP, stocks, recettes et commandes fournisseurs pour restaurants, dès 19,90 € HT/mois, plan gratuit limité.' },
    ],
  },
  {
    nom: 'Onrush',
    slug: 'onrush',
    categorie: 'autre',
    description: 'Logiciel food cost pour restaurateurs : mercuriale, fiches techniques et marges.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Même famille que Koust et Melba : le suivi food cost de base est accessible en DIY, la mercuriale fournisseurs à jour est le vrai travail récurrent.',
    domaine: 'onrush.fr',
    prix: 'à partir de 49 €/mois',
    alternatives: [
      { nom: 'COS Kitchen', url: 'https://coskitchen.fr/', type: 'gratuit', description: 'Calcul gratuit du food cost, import des menus et des bons de livraison, alertes de hausse de prix des ingrédients.' },
      { nom: 'Yokitup', url: 'https://www.yokitup.com/', type: 'gratuit', description: 'Offre gratuite permanente : fiches techniques, coût par ingrédient, taux de marge, allergènes et valorisation du stock.' },
    ],
  },
  {
    nom: 'Marge UP',
    slug: 'marge-up',
    categorie: 'autre',
    description: 'Calcul de marge et food cost avec gestion automatique des taux de TVA de la restauration (10 % / 5,5 %).',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Le calcul de marge est recodable ; la gestion fine des taux de TVA propres à la restauration doit rester juste en continu, ce qui demande une maintenance régulière.',
    domaine: 'marge-up.fr',
    prix: '39 €/mois',
    alternatives: [
      { nom: 'Yokitup', url: 'https://www.yokitup.com/', type: 'gratuit', description: 'Offre gratuite : fiches techniques, allergènes et coûts de revient ; offre complète à 159 €/mois par site.' },
      { nom: 'COS Kitchen', url: 'https://coskitchen.fr/', type: 'gratuit', description: 'Calculateur de coût matière (food cost) gratuit et illimité pour restaurants, avec export PDF.' },
      { nom: 'RestoMaestro', url: 'https://restomaestro.com/', type: 'plus-petit', description: 'Coût matière et marge par plat calculés à partir des factures scannées, dès 19 € HT/mois.' },
    ],
  },
  {
    nom: 'Restopilot',
    slug: 'restopilot',
    categorie: 'autre',
    description: 'Fiches techniques dynamiques et mercuriale connectée assistées par IA.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'La couche IA qui maintient automatiquement les fiches techniques à jour à partir des prix fournisseurs est un développement bien plus lourd qu\'un simple outil de stock.',
    domaine: 'restopilot.fr',
    alternatives: [
      { nom: 'COS Kitchen', url: 'https://coskitchen.fr/', type: 'gratuit', description: 'Calcul gratuit du food cost, import des menus et des bons de livraison, alertes de hausse de prix des ingrédients.' },
      { nom: 'Yokitup', url: 'https://www.yokitup.com/', type: 'gratuit', description: 'Offre gratuite permanente : fiches techniques, coût par ingrédient, taux de marge, allergènes et valorisation du stock.' },
    ],
  },
  {
    nom: 'Inpulse',
    slug: 'inpulse',
    categorie: 'autre',
    description: 'Prévisions de ventes par intelligence artificielle à la maille ingrédient, inventaires et commandes fournisseurs.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Un moteur de prévision IA entraîné sur l\'historique de ventes est un développement data bien au-delà d\'un outil de gestion de stock classique.',
    domaine: 'inpulse.ai',
  },
  {
    nom: "Somm'it",
    slug: 'sommit',
    categorie: 'autre',
    description: 'Gestion des stocks de boissons et génération de la carte des vins, numérique ou imprimable.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Un inventaire de cave avec génération de carte est un projet raisonnable : base de données de références et mise en page, sans contrainte réglementaire particulière.',
    domaine: 'somm-it.com',
    prix: 'à partir de 25 €/mois',
    alternatives: [
      { nom: 'Caves Explorer Pro', url: 'https://www.caves-explorer.com/en', type: 'plus-petit', description: 'Éditeur français de gestion de cave pour restaurateurs : stock, carte des vins mise à jour et export numérique, dès 29 €/mois.' },
    ],
  },
  {
    nom: 'Caves Explorer',
    slug: 'caves-explorer',
    categorie: 'autre',
    description: 'SaaS de gestion de cave pour restaurateurs, cavistes et sommeliers, avec traçabilité NFC et indicateurs financiers.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Même base que Somm\'it pour la gestion de cave ; la traçabilité NFC ajoute du matériel mais reste une brique optionnelle, pas un verrou technique majeur.',
    domaine: 'caves-explorer.com',
    prix: 'à partir de 45 €/mois',
    alternatives: [
      { nom: 'Somm\'IT', url: 'https://www.somm-it.com/', type: 'plus-petit', description: 'Éditeur français de gestion de cave et de stocks boissons pour restaurants, connecté à la caisse, compte gratuit à la création.' },
    ],
  },

  // Autre — fidélité / CRM / avis / e-réputation
  {
    nom: 'Ubiliz',
    slug: 'ubiliz',
    categorie: 'autre',
    description: 'CRM et campagnes de fidélisation multicanale conçus pour les restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Un programme de fidélité par points avec campagnes email/SMS se recode ; la délivrabilité et la conformité RGPD sur la durée sont ce qui reste du travail.',
    domaine: 'ubiliz.com',
    prix: 'gratuit (plans payants à partir de 39 €/mois)',
    alternatives: [
      { nom: 'FaveCard', url: 'https://www.favecard.co/', type: 'gratuit', description: 'Cartes de fidélité numériques avec offre gratuite à clients et tampons illimités, interface disponible en français.' },
      { nom: 'HanyPass', url: 'https://hanypass.com/', type: 'plus-petit', description: 'Fidélité via Apple, Google et Samsung Wallet, éditeur français, gratuit jusqu\'à 10 clients puis dès 14,99 €/mois.' },
      { nom: 'Fidelatoo', url: 'https://fidelatoo.fr/', type: 'plus-petit', description: 'Cartes de fidélité numériques pour commerçants et restaurants, abonnement mensuel sans engagement, essai gratuit.' },
      { nom: 'Pongo', url: 'https://www.heypongo.com/', type: 'plus-petit', description: 'Éditeur français de fidélité, avis Google et campagnes SMS/e-mail pour restaurants, relié aux caisses.' },
    ],
  },
  {
    nom: 'Pongo',
    slug: 'pongo',
    categorie: 'autre',
    description: 'Fidélité, marketing client, collecte d\'avis Google et SEO local, sur un seul écran, pour restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Un programme de fidélité et de marketing client se recode dans ses grandes lignes ; l\'outil vaut surtout pour la maintenance des intégrations (avis, SEO local) dans la durée.',
    domaine: 'heypongo.com',
    prix: 'sur devis (à partir de 69 €/mois)',
    alternatives: [
      { nom: 'Fydl', url: 'https://www.fydl-app.com/', type: 'gratuit', description: 'Carte de fidélité digitale (Apple/Google Wallet), gratuite à vie ; options payantes dès 18 € HT/mois.' },
      { nom: 'Carte Fidélité Resto', url: 'https://carte-fidelite-resto.com/', type: 'plus-petit', description: 'Carte à tampons par QR code sans application, gratuite jusqu\'à 50 clients, puis 9,90 €/mois.' },
    ],
  },
  {
    nom: 'Overfull',
    slug: 'overfull',
    categorie: 'autre',
    description: 'Logiciel bordelais de gestion des réservations et CRM pour restaurants.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Comme les autres petits outils de réservation/CRM régionaux, la base est recodable ; c\'est la maintenance dans la durée qui justifie l\'abonnement pour un indépendant.',
    domaine: 'overfull.fr',
    prix: 'à partir de 105 €/mois',
    alternatives: [
      { nom: 'OpenResto', url: 'https://get.openres.to', type: 'open-source', description: 'Système de réservation de tables open source (MIT), auto-hébergé avec Docker, sans frais par couvert.' },
      { nom: 'resOS', url: 'https://resos.com/', type: 'gratuit', description: 'Gestion des réservations avec plan gratuit (25 réservations/mois), puis forfaits fixes dès 23 €/mois sans commission.' },
      { nom: 'resmio', url: 'https://www.resmio.com/', type: 'plus-petit', description: 'Réservation de tables en ligne, disponible en français, abonnement mensuel fixe sans frais par client.' },
      { nom: 'Tablein', url: 'https://www.tablein.com/', type: 'plus-petit', description: 'Réservation de tables avec carnet clients (Guestbook), forfaits à partir de 67 €/mois, sans engagement.' },
    ],
  },
  {
    nom: 'Billiv',
    slug: 'billiv',
    categorie: 'autre',
    description: 'Ticket de caisse digital transformé en programme de fidélité et en collecte d\'avis Google.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Dématérialiser le ticket et y accrocher un programme de points est un projet raisonnable ; l\'intégration avec la caisse existante est ce qui demande le plus de soin.',
    domaine: 'billiv.fr',
    alternatives: [
      { nom: 'FaveCard', url: 'https://www.favecard.co/', type: 'gratuit', description: 'Carte de fidélité digitale à tampons avec plan gratuit sans limite de clients, version Pro à 12 €/mois.' },
      { nom: 'Fydl', url: 'https://www.fydl-app.com/', type: 'gratuit', description: 'Carte de fidélité digitale gratuite (Apple/Google Wallet), roue d\'avis Google en option payante dès 18 € HT/mois.' },
    ],
  },
  {
    nom: 'Klixi',
    slug: 'klixi',
    categorie: 'autre',
    description: 'Boîte à outils marketing globale : création de site web, gestion des réseaux sociaux et fidélisation client.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Trois outils différents (site web, réseaux sociaux, fidélité) réunis dans une seule suite : bien trop large pour être recodé et maintenu par une seule structure.',
    domaine: 'klixi.io',
    alternatives: [
      { nom: 'Postiz', url: 'https://github.com/gitroomhq/postiz-app', type: 'open-source', description: 'Planification de publications sur les réseaux sociaux, open source (AGPL), auto-hébergeable. Ne couvre que le volet réseaux sociaux.' },
      { nom: 'Google Business Profile', url: 'https://business.google.com/fr/business-profile/', type: 'gratuit', description: 'Fiche d\'établissement Google gratuite : horaires, publications et réponses aux avis clients.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'gratuit', description: 'Commande en ligne sans commission, plan Starter gratuit (20 commandes/mois), hébergé en France.' },
    ],
  },
  {
    nom: 'LocalRanker',
    slug: 'localranker',
    categorie: 'autre',
    description: 'Solution de référencement local et de gestion de la réputation pour établissements de proximité.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Le référencement local dépend d\'API et d\'algorithmes externes (Google en tête) qui changent régulièrement — un travail de veille et de maintenance continue, pas un développement ponctuel.',
    domaine: 'localranker.fr',
    alternatives: [
      { nom: 'Google Business Profile', url: 'https://business.google.com/fr/business-profile/', type: 'gratuit', description: 'Fiche d\'établissement Google gratuite : horaires, publications et réponses aux avis clients.' },
      { nom: 'Avis Resto', url: 'https://avis-resto.com/', type: 'gratuit', description: 'Collecte d\'avis Google par QR code gratuite pour un établissement ; offre Pro avec réponses IA à 89 € par an.' },
      { nom: 'BonjourAvis', url: 'https://bonjouravis.ai/', type: 'plus-petit', description: 'Réponses aux avis Google rédigées par IA, plan Business à 19 €/mois pour des réponses illimitées.' },
    ],
  },
  {
    nom: 'Le Commis',
    slug: 'le-commis',
    categorie: 'autre',
    description: 'Centralisation des avis Google, Facebook et TripAdvisor avec réponses assistées par IA, dans une suite de gestion restaurant.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Collecter des avis par email après le passage du client est un projet accessible ; centraliser plusieurs plateformes et y ajouter des réponses IA demande davantage de maintenance.',
    domaine: 'lecommis.fr',
    prix: 'à partir de 49 €/mois',
    alternatives: [
      { nom: 'Google Business Profile', url: 'https://business.google.com/fr/business-profile/', type: 'gratuit', description: 'Fiche d\'établissement Google gratuite : horaires, publications et réponses aux avis clients.' },
      { nom: 'Avis Resto', url: 'https://avis-resto.com/', type: 'gratuit', description: 'Collecte d\'avis Google par QR code gratuite pour un établissement ; offre Pro avec réponses IA à 89 € par an.' },
      { nom: 'BonjourAvis', url: 'https://bonjouravis.ai/', type: 'plus-petit', description: 'Réponses aux avis Google rédigées par IA, plan Business à 19 €/mois pour des réponses illimitées.' },
    ],
  },
  {
    nom: 'Partoo',
    slug: 'partoo',
    categorie: 'autre',
    description: 'Gestion des fiches établissement, messages et avis en ligne pour les réseaux de points de vente.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "La valeur est dans le maintien d'intégrations à jour avec des dizaines d'annuaires et de plateformes (Google, Meta...) dont les API changent régulièrement — un travail de maintenance continue, pas un projet ponctuel.",
    domaine: 'partoo.co',
    alternatives: [
      { nom: 'Google Business Profile', url: 'https://www.google.com/intl/fr_fr/business/', type: 'gratuit', description: 'Outil gratuit de Google pour gérer les fiches Maps et Recherche, répondre aux avis et gérer plusieurs établissements.' },
      { nom: 'Localranker', url: 'https://www.localranker.fr/', type: 'plus-petit', description: 'Gestion de présence locale (Google, Apple Plans), avis et suivi de position pour réseaux, tarif sur démo.' },
    ],
  },
  {
    nom: 'Guest Suite',
    slug: 'guest-suite',
    categorie: 'autre',
    description: 'Collecte, diffusion et gestion des avis clients pour les établissements et réseaux.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Un envoi d\'email post-visite pour collecter un avis se recode facilement. La diffusion automatisée vers plusieurs plateformes et le reporting consolidé demandent plus de maintenance.',
    domaine: 'guest-suite.com',
    prix: 'à partir de 39 €/mois',
    alternatives: [
      { nom: 'Google Business Profile', url: 'https://business.google.com/fr/business-profile/', type: 'gratuit', description: 'Fiche d\'établissement Google gratuite : horaires, publications et réponses aux avis clients.' },
      { nom: 'Avis Resto', url: 'https://avis-resto.com/', type: 'gratuit', description: 'Collecte d\'avis Google par QR code gratuite pour un établissement ; offre Pro avec réponses IA à 89 € par an.' },
      { nom: 'BonjourAvis', url: 'https://bonjouravis.ai/', type: 'plus-petit', description: 'Réponses aux avis Google rédigées par IA, plan Business à 19 €/mois pour des réponses illimitées.' },
    ],
  },
  {
    nom: 'Customer Alliance',
    slug: 'customer-alliance',
    categorie: 'autre',
    description: 'Plateforme hôtelière de centralisation des avis, enquêtes clients et retours d\'expérience.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Même logique que Guest Suite : l\'enquête de satisfaction de base est un projet raisonnable, la consolidation multi-plateformes est le vrai travail récurrent.',
    domaine: 'customer-alliance.com',
    prix: 'à partir de 98 €/mois',
    alternatives: [
      { nom: 'Guest Suite', url: 'https://www.guest-suite.com/', type: 'plus-petit', description: 'Plateforme française de collecte et gestion d\'avis sur plus de 27 sites, avec essai gratuit de 14 jours.' },
    ],
  },
  {
    nom: 'Malou',
    slug: 'malou',
    categorie: 'autre',
    description: 'Visibilité locale, avis et présence en ligne pour les restaurants.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Comme Partoo, la valeur tient au maintien d\'intégrations avec de multiples plateformes externes (avis, réseaux sociaux, fiches locales) — un travail continu plus qu\'un développement one-shot.',
    domaine: 'malou.io',
    alternatives: [
      { nom: 'Google Business Profile', url: 'https://business.google.com/fr/business-profile/', type: 'gratuit', description: 'Fiche d\'établissement Google gratuite : horaires, publications et réponses aux avis clients.' },
      { nom: 'Avis Resto', url: 'https://avis-resto.com/', type: 'gratuit', description: 'Collecte d\'avis Google par QR code gratuite pour un établissement ; offre Pro avec réponses IA à 89 € par an.' },
      { nom: 'BonjourAvis', url: 'https://bonjouravis.ai/', type: 'plus-petit', description: 'Réponses aux avis Google rédigées par IA, plan Business à 19 €/mois pour des réponses illimitées.' },
    ],
  },

  // Autre — pourboire digital
  {
    nom: 'TiPGO',
    slug: 'tipgo',
    categorie: 'autre',
    description: 'Application qui centralise et répartit les pourboires versés par carte, QR code ou espèces.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: "Reverser de l'argent à des salariés individuellement touche à la réglementation des services de paiement : ce n'est pas qu'une question d'interface.",
    domaine: 'tipgo.io',
    alternatives: [
      { nom: 'TipsYou', url: 'https://www.thetipsyou.fr/', type: 'gratuit', description: 'Application de pourboire dématérialisé par QR code, annoncée sans abonnement, avec répartition entre salle et cuisine.' },
      { nom: 'Tap Tiiip', url: 'https://www.taptiiip.com/', type: 'plus-petit', description: 'Plateforme française pour restaurants et hôtels : pourboire par QR code, avis Google et menu numérique, essai d\'un mois.' },
      { nom: 'Tip&Go', url: 'https://www.tip-n-go.com/', type: 'plus-petit', description: 'Pourboire sans espèces par QR code, gratuit pour l\'établissement, avec 2,5 % de frais au retrait des pourboires.' },
    ],
  },
  {
    nom: 'Tip&Go',
    slug: 'tip-go',
    categorie: 'autre',
    description: "Solution de pourboire numérique destinée aux équipes de l'hôtellerie et de la restauration.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même remarque que pour TiPGO : la répartition de fonds vers des tiers est un sujet de conformité paiement, pas un simple développement interne.',
    domaine: 'tip-n-go.com',
    alternatives: [
      { nom: 'TipsYou', url: 'https://www.thetipsyou.fr/', type: 'gratuit', description: 'Application de pourboire dématérialisé par QR code, annoncée sans abonnement, avec répartition entre salle et cuisine.' },
      { nom: 'Tap Tiiip', url: 'https://www.taptiiip.com/', type: 'plus-petit', description: 'Plateforme française pour restaurants et hôtels : pourboire par QR code, avis Google et menu numérique, essai d\'un mois.' },
      { nom: 'TiPGO', url: 'https://tipgo.io/', type: 'plus-petit', description: 'Application de collecte et de répartition des pourboires par terminal, QR code ou espèces, sans frais de création de compte.' },
    ],
  },
  {
    nom: 'TiPJAAR',
    slug: 'tipjaar',
    categorie: 'autre',
    description: 'Collecte et répartition transparente du pourboire dématérialisé par carte bancaire.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Même famille que TiPGO : redistribuer de l\'argent à des salariés individuellement touche à la réglementation des services de paiement, pas seulement à l\'interface.',
    domaine: '',
    alternatives: [
      { nom: 'TipsYou', url: 'https://www.thetipsyou.fr/', type: 'gratuit', description: 'Application de pourboire dématérialisé par QR code, annoncée sans abonnement, avec répartition entre salle et cuisine.' },
      { nom: 'Tap Tiiip', url: 'https://www.taptiiip.com/', type: 'plus-petit', description: 'Plateforme française pour restaurants et hôtels : pourboire par QR code, avis Google et menu numérique, essai d\'un mois.' },
      { nom: 'TiPGO', url: 'https://tipgo.io/', type: 'plus-petit', description: 'Application de collecte et de répartition des pourboires par terminal, QR code ou espèces, sans frais de création de compte.' },
      { nom: 'Tip&Go', url: 'https://www.tip-n-go.com/', type: 'plus-petit', description: 'Pourboire sans espèces par QR code, gratuit pour l\'établissement, avec 2,5 % de frais au retrait des pourboires.' },
    ],
  },
  {
    nom: 'Tipsi',
    slug: 'tipsi',
    categorie: 'autre',
    description: 'Application française permettant aux clients de verser des pourboires dématérialisés via QR code.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même logique que les autres apps de pourboire : la répartition de fonds vers des tiers est un sujet de conformité paiement.',
    domaine: 'tipsi.io',
    alternatives: [
      { nom: 'TipsYou', url: 'https://www.thetipsyou.fr/', type: 'gratuit', description: 'Application de pourboire dématérialisé par QR code, annoncée sans abonnement, avec répartition entre salle et cuisine.' },
      { nom: 'Tap Tiiip', url: 'https://www.taptiiip.com/', type: 'plus-petit', description: 'Plateforme française pour restaurants et hôtels : pourboire par QR code, avis Google et menu numérique, essai d\'un mois.' },
      { nom: 'TiPGO', url: 'https://tipgo.io/', type: 'plus-petit', description: 'Application de collecte et de répartition des pourboires par terminal, QR code ou espèces, sans frais de création de compte.' },
      { nom: 'Tip&Go', url: 'https://www.tip-n-go.com/', type: 'plus-petit', description: 'Pourboire sans espèces par QR code, gratuit pour l\'établissement, avec 2,5 % de frais au retrait des pourboires.' },
    ],
  },
  {
    nom: 'TipsYou',
    slug: 'tipsyou',
    categorie: 'autre',
    description: 'Application gratuite de pourboire dématérialisé par QR code, avec répartition front/back office.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Gratuite pour l\'établissement ou non, la contrainte reste la même : distribuer des fonds à des salariés est un sujet réglementaire, pas un simple développement interne.',
    domaine: 'thetipsyou.fr',
    alternatives: [
      { nom: 'Tap Tiiip', url: 'https://www.taptiiip.com/', type: 'plus-petit', description: 'Plateforme française pour restaurants et hôtels : pourboire par QR code, avis Google et menu numérique, essai d\'un mois.' },
      { nom: 'TiPGO', url: 'https://tipgo.io/', type: 'plus-petit', description: 'Application de collecte et de répartition des pourboires par terminal, QR code ou espèces, sans frais de création de compte.' },
      { nom: 'Tip&Go', url: 'https://www.tip-n-go.com/', type: 'plus-petit', description: 'Pourboire sans espèces par QR code, gratuit pour l\'établissement, avec 2,5 % de frais au retrait des pourboires.' },
    ],
  },
  {
    nom: 'Onetip',
    slug: 'onetip',
    categorie: 'autre',
    description: "Pourboire par QR code pour l'hôtellerie, la restauration et les commerces de proximité.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même famille que les autres solutions de pourboire digital : la conformité sur la redistribution des fonds prime sur la simplicité du QR code.',
    domaine: 'onetip-app.com',
    alternatives: [
      { nom: 'Tabl', url: 'https://www.tabl.studio/pourboire-dematerialise', type: 'plus-petit', description: 'Pourboire par carte via QR code ou NFC, sans terminal ; commission de 6 % uniquement au retrait des fonds.' },
      { nom: 'Tap Tiiip', url: 'https://www.taptiiip.com/', type: 'plus-petit', description: 'Plateforme française combinant menu QR code multilingue, pourboire par carte et collecte d\'avis Google.' },
    ],
  },

  // Autre — commande & paiement à table / menus QR
  {
    nom: 'DOOD',
    slug: 'dood',
    categorie: 'autre',
    description: 'Plateforme de commande sur place et en ligne, paiement par QR code et outils de parcours client pour la restauration.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Comme Sunday, un parcours de commande et paiement par QR code se recode avec un prestataire de paiement classique ; la fiabilité en heure de rush est ce qui reste difficile à garantir soi-même.',
    domaine: 'dood.com',
    prix: 'sur devis',
    alternatives: [
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Commande en ligne, réservation de tables et gestion de menus, libre (MIT), auto-hébergé, sans commission.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'gratuit', description: 'Menu QR code avec commande à table, gratuit jusqu\'à 20 commandes/mois sans paiement en ligne, 0 % de commission.' },
    ],
  },
  {
    nom: 'Obypay',
    slug: 'obypay',
    categorie: 'autre',
    description: 'Commande et paiement à table par QR code, click & collect, cartes prépayées et bornes de commande.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Les cartes prépayées impliquent de la monnaie stockée pour le compte de tiers, un sujet réglementaire (monnaie électronique) qui sort largement du cadre d\'un outil de commande fait maison.',
    domaine: 'obypay.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source (édition Community) incluant caisse restaurant, plan de salle et commande à table par QR code. NF525 à vérifier.' },
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Plateforme open source (MIT, Laravel) de commande en ligne, réservation de table et gestion de restaurant.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'plus-petit', description: 'Commande en ligne et menu QR code français sans commission, offre de départ gratuite limitée à 20 commandes/mois.' },
      { nom: 'Zenorder', url: 'https://www.zenorder.fr/', type: 'plus-petit', description: 'Click & collect, commande à table par QR code et fidélité, abonnement sans commission sur le chiffre d\'affaires.' },
    ],
  },
  {
    nom: 'Skeat',
    slug: 'skeat',
    categorie: 'autre',
    description: 'Commande et paiement mobile instantané, sans application, pour restaurants, bars et lieux festifs.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Comme Sunday et DOOD, un parcours de commande et paiement sans app se recode avec un prestataire de paiement classique ; la fiabilité en heure de pointe reste le vrai défi.',
    domaine: 'skeatapp.com',
    alternatives: [
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Plateforme open source (MIT, Laravel) de commande en ligne, réservation de table et gestion de restaurant.' },
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source (édition Community) incluant caisse restaurant, plan de salle et commande à table par QR code. NF525 à vérifier.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'plus-petit', description: 'Commande en ligne et menu QR code français sans commission, offre de départ gratuite limitée à 20 commandes/mois.' },
      { nom: 'Zenorder', url: 'https://www.zenorder.fr/', type: 'plus-petit', description: 'Click & collect, commande à table par QR code et fidélité, abonnement sans commission sur le chiffre d\'affaires.' },
    ],
  },
  {
    nom: 'TastyCloud',
    slug: 'tastycloud',
    categorie: 'autre',
    description: 'Menus digitaux interactifs, commande en ligne et click & collect pour restaurants, bars et hôtels.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Un menu digital en QR code est l\'un des cas les plus simples à recoder. Dès qu\'on y ajoute la commande en ligne et le paiement, la fiabilité en heure de rush redevient le sujet difficile.',
    domaine: 'tastycloud.fr',
    prix: 'à partir de 1 €/jour/tablette',
    alternatives: [
      { nom: 'TastyIgniter', url: 'https://github.com/tastyigniter/TastyIgniter', type: 'open-source', description: 'Système open source (MIT) de commande en ligne et de réservation de tables pour restaurants, sans commission.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'gratuit', description: 'Commande en ligne pour restaurants français, 0 % de commission, offre Starter gratuite, hébergement en France.' },
      { nom: 'Qwick Order', url: 'https://qwickorder.fr/', type: 'plus-petit', description: 'Menu numérique et commande-paiement par QR code à table, abonnement dès 29 €/mois plus frais par transaction.' },
      { nom: 'QR2App', url: 'https://www.qr2app.com/fr', type: 'plus-petit', description: 'Commande et paiement par QR code sans caisse à connecter ni commission, abonnement dès 19,90 €/mois hors frais Stripe.' },
    ],
  },
  {
    nom: 'Tabesto',
    slug: 'tabesto',
    categorie: 'autre',
    description: 'Bornes de commande, tablettes à table et caisse tactile intégrée pour la restauration rapide et à table.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'L\'ensemble bornes matérielles + paiement + synchronisation avec la caisse et la cuisine est un projet d\'intégration bien plus lourd qu\'un simple menu digital.',
    domaine: 'tabesto.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Biborne', url: 'https://biborne.com/', type: 'plus-petit', description: 'Spécialiste français des bornes de commande, avec caisses tactiles, écrans cuisine et logiciel de gestion pour la restauration.' },
    ],
  },
  {
    nom: 'Eazmenu',
    slug: 'eazmenu',
    categorie: 'autre',
    description: 'Menu digital QR code multilingue, avec mises à jour instantanées de la carte sans réimpression.',
    verdictEditeur: 'YES',
    justificationEditeur:
      'Un menu QR code sans commande ni paiement intégré est l\'un des cas les plus simples à recoder : une page web à jour reliée à un QR code.',
    domaine: 'eazmenu.com',
    prix: 'gratuit',
    alternatives: [
      { nom: 'Eazee Link', url: 'https://eazee-link.com/', type: 'gratuit', description: 'Menu digital QR code gratuit et sans engagement (carte, allergènes, multilingue) ; pas de commande ni de paiement.' },
      { nom: 'OrdraFood', url: 'https://www.ordrafood.fr/', type: 'gratuit', description: 'Menu QR code avec commande à table, gratuit jusqu\'à 20 commandes/mois sans paiement en ligne, 0 % de commission.' },
    ],
  },
  {
    nom: 'Menu-Touch',
    slug: 'menu-touch',
    categorie: 'autre',
    description: 'Carte digitale accessible par QR code avec prise de commande intégrée sur tablette.',
    verdictEditeur: 'KINDA',
    justificationEditeur:
      'Le menu QR de base est trivial ; dès qu\'on y ajoute la prise de commande sur tablette et son envoi en cuisine, la fiabilité redevient le sujet difficile.',
    domaine: 'menu-touch.fr',
    prix: 'à partir de 39,90 €/mois',
    alternatives: [
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'À ma carte', url: 'https://amacarte.fr/', type: 'gratuit', description: 'Carte de restaurant numérique par QR code, annoncée gratuite pour les restaurateurs.' },
      { nom: 'Eazee Link', url: 'https://eazee-link.com/', type: 'gratuit', description: 'Carte digitale par QR code gratuite, avec photos, allergènes et traduction de la carte.' },
      { nom: 'Basilyk', url: 'https://www.basilyk.com/', type: 'gratuit', description: 'Menu digital par QR code avec une offre gratuite financée par des publicités ; jeux et fidélité en offres payantes.' },
    ],
  },
  {
    nom: 'ID Menu',
    slug: 'id-menu',
    categorie: 'autre',
    description: 'Générateur de carte digitale QR code avec traductions intégrées et gestion autonome de la carte.',
    verdictEditeur: 'YES',
    justificationEditeur: 'Même constat qu\'Eazmenu : un menu QR multilingue sans commande ni paiement est un projet de développement très accessible.',
    domaine: 'idmenu.fr',
    prix: 'à partir de 25 €/mois',
    alternatives: [
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'À ma carte', url: 'https://amacarte.fr/', type: 'gratuit', description: 'Carte de restaurant numérique par QR code, annoncée gratuite pour les restaurateurs.' },
      { nom: 'Eazee Link', url: 'https://eazee-link.com/', type: 'gratuit', description: 'Carte digitale par QR code gratuite, avec photos, allergènes et traduction de la carte.' },
      { nom: 'Basilyk', url: 'https://www.basilyk.com/', type: 'gratuit', description: 'Menu digital par QR code avec une offre gratuite financée par des publicités ; jeux et fidélité en offres payantes.' },
    ],
  },
  {
    nom: 'Menupleaz',
    slug: 'menupleaz',
    categorie: 'autre',
    description: 'Menu numérique alternatif à la carte papier pour restaurants, bars et hôtels.',
    verdictEditeur: 'YES',
    justificationEditeur: 'Un menu digital simple, sans commande ni paiement associé, reste l\'un des outils les plus faciles à remplacer par une page maison.',
    domaine: 'menupleaz.com',
    prix: 'à partir de 14,90 €/mois',
    alternatives: [
      { nom: 'Satisfecho POS', url: 'https://github.com/satisfecho/pos', type: 'open-source', description: 'Caisse et commande restaurant auto-hébergée (AGPL) : menu QR, tables, réservations, écran cuisine. Conformité fiscale FR à vérifier.' },
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'Édition communautaire Odoo (LGPL) avec module Point de Vente restaurant, auto-commande par QR code et caisse en libre-service. NF525 à vérifier.' },
      { nom: 'À ma carte', url: 'https://amacarte.fr/', type: 'gratuit', description: 'Carte de restaurant numérique par QR code, annoncée gratuite pour les restaurateurs.' },
      { nom: 'Eazee Link', url: 'https://eazee-link.com/', type: 'gratuit', description: 'Carte digitale par QR code gratuite, avec photos, allergènes et traduction de la carte.' },
      { nom: 'Basilyk', url: 'https://www.basilyk.com/', type: 'gratuit', description: 'Menu digital par QR code avec une offre gratuite financée par des publicités ; jeux et fidélité en offres payantes.' },
    ],
  },

  // Autre — hygiène / HACCP
  {
    nom: 'ePack Pro',
    slug: 'epackpro',
    categorie: 'autre',
    description: 'Application tout-en-un de digitalisation du plan HACCP, températures et registres, pour cuisines professionnelles.',
    verdictEditeur: 'YES',
    justificationEditeur:
      "Un relevé de températures et de traçabilité HACCP, c'est un formulaire horodaté avec photo à l'appui — largement à la portée d'une app maison, sans certification obligatoire de l'outil lui-même.",
    domaine: 'epackpro.com',
    prix: 'à partir de 119 €/mois',
    alternatives: [
      { nom: 'HACCP Facile', url: 'https://www.haccp-facile.com/', type: 'gratuit', description: 'Application HACCP avec version gratuite de 4 modules (traçabilité photo, réceptions, températures frigos, huiles de friture).' },
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'HACCP, stocks et RH pour restaurants : offre gratuite de base (températures manuelles), payante dès 19,90 € HT/mois.' },
    ],
  },
  {
    nom: 'Traqfood',
    slug: 'traqfood',
    categorie: 'autre',
    description: 'Application HACCP pour relevés de température, traçabilité, nettoyage et étiquetage DLC, largement utilisée en France.',
    verdictEditeur: 'YES',
    justificationEditeur:
      'Même constat que pour les autres apps HACCP : ce sont des formulaires structurés avec horodatage, un des cas les plus simples à recoder soi-même.',
    domaine: 'traqfood.com',
    prix: 'à partir de 19,99 €/mois',
    alternatives: [
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'HACCP sur tablette avec offre gratuite : DLC, étiquettes, relevés de température manuels et réception fournisseurs.' },
    ],
  },
  {
    nom: 'Octopus HACCP',
    slug: 'octopus-haccp',
    categorie: 'autre',
    description: 'Application pour digitaliser le plan de maîtrise sanitaire et supprimer le papier en cuisine.',
    verdictEditeur: 'YES',
    justificationEditeur:
      'Le plan de maîtrise sanitaire est une obligation de process, pas de logiciel certifié : une app de saisie simple suffit à répondre au besoin.',
    domaine: 'octopus-haccp.com',
    prix: 'à partir de 55 €/mois',
    alternatives: [
      { nom: 'HACCP Facile', url: 'https://www.haccp-facile.com/', type: 'gratuit', description: 'Application HACCP avec offre gratuite permanente : traçabilité photo, réception, températures frigos et huile de friture.' },
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'Logiciel HACCP sur tablette pour restaurants, avec offre gratuite permanente et formules payantes dès 19,90 €/mois.' },
      { nom: 'BackResto', url: 'https://www.backresto.com/fr', type: 'plus-petit', description: 'Application HACCP française (températures, nettoyage, traçabilité), 14,90 à 19,90 €/mois, utilisateurs illimités.' },
    ],
  },
  {
    nom: 'EazyHaccp',
    slug: 'eazyhaccp',
    categorie: 'autre',
    description: 'Application mobile de suivi des températures, nettoyage, réception des marchandises et non-conformités.',
    verdictEditeur: 'YES',
    justificationEditeur:
      'Comme les autres outils HACCP, c\'est essentiellement un carnet de bord numérique : facile à recoder et à adapter aux process de l\'établissement.',
    domaine: 'eazyhaccp.com',
    prix: 'à partir de 39 €/mois',
    alternatives: [
      { nom: 'HACCP Facile', url: 'https://www.haccp-facile.com/', type: 'gratuit', description: 'Application HACCP avec version gratuite de 4 modules (traçabilité photo, réceptions, températures frigos, huiles de friture).' },
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'HACCP, stocks et RH pour restaurants : offre gratuite de base (températures manuelles), payante dès 19,90 € HT/mois.' },
    ],
  },
  {
    nom: 'Tracely HACCP',
    slug: 'tracely-haccp',
    categorie: 'autre',
    description: 'Application mobile dédiée à la traçabilité sanitaire, aux relevés de températures et au suivi HACCP.',
    verdictEditeur: 'YES',
    justificationEditeur:
      'Même famille que les autres apps HACCP : un carnet de bord numérique, sans contrainte de certification propre à l\'outil.',
    domaine: 'tracelyhaccp.com',
    prix: 'à partir de 39,99 €/mois',
    alternatives: [
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'HACCP sur tablette avec offre gratuite : DLC, étiquettes, relevés de température manuels et réception fournisseurs.' },
    ],
  },
  {
    nom: 'iQoo',
    slug: 'iqoo',
    categorie: 'autre',
    description: 'Contrôle des températures, traçabilité et gestion simplifiée du plan de maîtrise sanitaire.',
    verdictEditeur: 'YES',
    justificationEditeur:
      'Même constat : un contrôle de températures et une traçabilité HACCP sont un cas d\'école du formulaire numérique facile à recoder.',
    domaine: 'iqoo.eu',
    prix: 'gratuit (forfaits Pro/Enterprise sur devis)',
    alternatives: [
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'Logiciel HACCP français avec plan gratuit (températures manuelles, réceptions, traçabilité) ; Pro à 49,90 € HT/mois avec planning.' },
      { nom: 'HACCP Facile', url: 'https://www.haccp-facile.com/', type: 'gratuit', description: 'Application HACCP web et mobile avec offre découverte gratuite de 4 modules (dont relevés de température).' },
      { nom: 'Frigolog', url: 'https://frigolog.fr/', type: 'plus-petit', description: 'HACCP : températures, plan de nettoyage et traçabilité, à partir de 47 € HT/mois en annuel, sans engagement.' },
    ],
  },
  {
    nom: 'HPA Solutions',
    slug: 'hpa-solutions',
    categorie: 'autre',
    description: 'Pack hygiène digital : relevés de température, traçabilité alimentaire, étiquettes DLC, plans de nettoyage.',
    verdictEditeur: 'YES',
    justificationEditeur:
      'Même famille que les autres packs HACCP : un ensemble de formulaires numériques, sans verrou technique ou réglementaire propre à l\'outil.',
    domaine: '',
    alternatives: [
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'Logiciel HACCP français avec plan gratuit (températures manuelles, réceptions, traçabilité) ; Pro à 49,90 € HT/mois avec planning.' },
      { nom: 'HACCP Facile', url: 'https://www.haccp-facile.com/', type: 'gratuit', description: 'Application HACCP web et mobile avec offre découverte gratuite de 4 modules (dont relevés de température).' },
      { nom: 'Frigolog', url: 'https://frigolog.fr/', type: 'plus-petit', description: 'HACCP : températures, plan de nettoyage et traçabilité, à partir de 47 € HT/mois en annuel, sans engagement.' },
    ],
  },
  {
    nom: 'Kooklin',
    slug: 'kooklin',
    categorie: 'autre',
    description: 'Plateforme de traçabilité alimentaire et HACCP pour restaurants et cuisines centrales.',
    verdictEditeur: 'YES',
    justificationEditeur:
      'Même logique que les autres outils HACCP : la traçabilité alimentaire se digitalise avec des formulaires structurés, un projet raisonnable pour une équipe technique.',
    domaine: 'kooklin.fr',
    prix: 'à partir de 85 €/mois',
    alternatives: [
      { nom: 'RestoPil', url: 'https://www.restopil.fr/', type: 'gratuit', description: 'Logiciel HACCP français avec plan gratuit (températures manuelles, réceptions, traçabilité) ; Pro à 49,90 € HT/mois avec planning.' },
      { nom: 'HACCP Facile', url: 'https://www.haccp-facile.com/', type: 'gratuit', description: 'Application HACCP web et mobile avec offre découverte gratuite de 4 modules (dont relevés de température).' },
      { nom: 'Frigolog', url: 'https://frigolog.fr/', type: 'plus-petit', description: 'HACCP : températures, plan de nettoyage et traçabilité, à partir de 47 € HT/mois en annuel, sans engagement.' },
    ],
  },

  // Autre — approvisionnement B2B
  {
    nom: 'Pourdebon',
    slug: 'pourdebon',
    categorie: 'autre',
    description: 'Marketplace de vente directe producteur à professionnel (paiement à 30 jours, regroupement de commandes) pour restaurateurs et épiceries fines.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'La valeur est le réseau de producteurs et la logistique de livraison groupée, pas un logiciel : impossible à répliquer sans le réseau lui-même.',
    domaine: 'pourdebon.com',
    alternatives: [
      { nom: 'Open Food Network', url: 'https://www.openfoodnetwork.org/', type: 'open-source', description: 'Logiciel open source (AGPL) reliant producteurs, grossistes et acheteurs pour la vente directe de produits locaux.' },
    ],
  },
  {
    nom: 'RungisMarket',
    slug: 'rungismarket',
    categorie: 'autre',
    description: 'Marketplace B2B de produits frais du marché de Rungis, avec plusieurs milliers de références de grossistes.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Même logique que Pourdebon : la valeur tient au catalogue de grossistes et à la logistique d\'approvisionnement, pas à l\'interface de commande.',
    domaine: 'rungismarket.com',
  },

  // Autre — paiement / hardware / accès
  {
    nom: 'PayGreen — Lunch Kit',
    slug: 'paygreen-lunch-kit',
    categorie: 'autre',
    description: 'Solution de paiement en ligne adaptée à la restauration, notamment pour accepter les titres-restaurant dématérialisés.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Accepter des titres-restaurant dématérialisés suppose des contrats et des intégrations techniques avec chaque émetteur (Swile, Edenred, Up...) — impossible à recoder sans ces accords commerciaux.",
    domaine: 'paygreen.io',
  },
  {
    nom: 'Yavin',
    slug: 'yavin',
    categorie: 'autre',
    description: "Solution d'encaissement et de suivi des paiements par terminal, avec des fonctions pensées pour les restaurateurs.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: 'Un terminal de paiement certifié relève de la même logique que les caisses NF525 : le matériel et la certification pèsent plus que le logiciel.',
    domaine: 'yavin.com',
    alternatives: [
      { nom: 'Odoo Community', url: 'https://github.com/odoo/odoo', type: 'open-source', description: 'ERP open source dont l\'application Point de vente gère plan de salle, tables et envoi en cuisine pour restaurants. NF525 à vérifier.' },
      { nom: 'Hiboutik', url: 'https://www.hiboutik.com/', type: 'gratuit', description: 'Caisse enregistreuse en ligne conforme NF525, proposée gratuitement avec des options payantes facultatives, mode restaurant inclus.' },
      { nom: 'L\'Addition', url: 'https://www.laddition.com/fr', type: 'plus-petit', description: 'Caisse sur iPad certifiée NF525 pour restaurants et bars, avec click & collect, réservation et paiement à table.' },
      { nom: 'Zatyoo', url: 'https://www.zatyoo.fr/', type: 'plus-petit', description: 'Logiciel de caisse certifié pour restaurants, bars et commerces, avec plan de salle, stocks et comptes clients.' },
    ],
  },
  {
    nom: 'Payplug',
    slug: 'payplug',
    categorie: 'autre',
    description: 'Plateforme de paiement omnicanale pour les commerces, utilisable pour les commandes et ventes des établissements CHR.',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Un prestataire de paiement est un établissement agréé soumis à la réglementation PCI-DSS et aux réseaux bancaires : hors de portée d\'un développement interne, quelle que soit la taille de l\'établissement.',
    domaine: 'payplug.com',
  },
  {
    nom: 'Ariane Systems',
    slug: 'ariane-systems',
    categorie: 'autre',
    description: "Bornes et enregistrement en ligne pour automatiser l'arrivée et le départ des clients d'hôtels.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      'Bornes matérielles synchronisées avec le PMS et le paiement forment un projet d\'intégration matériel + logiciel bien au-delà d\'un développement fait maison.',
    domaine: 'arianesystems.com',
  },
  {
    nom: 'SALTO KS',
    slug: 'salto-ks',
    categorie: 'autre',
    description: "Plateforme cloud de contrôle d'accès permettant de gérer à distance les accès aux portes et espaces d'un établissement.",
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur:
      "Le contrôle d'accès touche à la sécurité physique du bâtiment et dépend de serrures et de firmware propriétaires : ce n'est pas un logiciel qu'on recode, c'est un système fermé par construction.",
    domaine: 'saltoks.com',
  },
];
