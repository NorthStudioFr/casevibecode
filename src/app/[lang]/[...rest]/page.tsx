import { notFound } from 'next/navigation';

// Toute adresse inconnue passe ici pour afficher la 404 de marque (src/app/[lang]/not-found.tsx),
// dans la mise en page du site, avec en-tête, pied de page et liens de retour. Sans cette route,
// Next sert sa page 404 par défaut, sans mise en page, car la racine du site est le segment [lang].
export default function PageInconnue(): never {
  notFound();
}
