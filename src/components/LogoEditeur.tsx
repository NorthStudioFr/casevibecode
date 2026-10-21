'use client';

import { useState } from 'react';
import Image from 'next/image';

// Logos récupérés par notre serveur auprès du service de favicons de Google (jamais depuis le
// navigateur du visiteur : voir /api/logo) plutôt qu'hébergés :
// pas de 133 fichiers à maintenir, et ça s'adapte tout seul aux futurs
// ajouts. (Clearbit, qui offrait un vrai logo haute qualité, a fermé son API
// publique — ce service-ci est plus modeste visuellement mais stable et sans
// clé.) En contrepartie certains domaines n'ont pas de favicon exploitable :
// on masque l'image plutôt que de laisser un cadre cassé, le nom reste
// lisible à côté.
export function LogoEditeur({ domaine, taille = 32 }: { domaine?: string; taille?: number }) {
  const [enErreur, setEnErreur] = useState(false);

  if (!domaine || enErreur) return null;

  return (
    <Image
      src={`/api/logo/${encodeURIComponent(domaine)}`}
      alt=""
      width={taille}
      height={taille}
      unoptimized
      className="shrink-0 rounded-sm border border-slate-200 bg-[#f6f6f2] object-contain"
      onError={() => setEnErreur(true)}
    />
  );
}
