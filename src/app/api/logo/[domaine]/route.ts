import { NextResponse } from 'next/server';

// Les logos d'éditeurs viennent du service de favicons de Google. Les charger directement depuis
// le navigateur enverrait l'adresse IP de chaque visiteur à Google : c'est notre serveur qui les
// récupère (une fois, puis servis depuis le cache du CDN) et les sert depuis casevibecode.fr.
export const revalidate = 2592000;

// Nom de domaine seul (pas d'URL, de chemin ni de port) : la requête sortante ne vise jamais qu'un
// hôte fixe, avec un paramètre assaini, donc ce point d'accès ne peut pas servir de relais ouvert.
const DOMAINE = /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;

export async function GET(_req: Request, context: { params: Promise<{ domaine: string }> }) {
  const domaine = decodeURIComponent((await context.params).domaine).toLowerCase();
  if (!DOMAINE.test(domaine)) return new NextResponse('Domaine invalide', { status: 400 });

  try {
    const res = await fetch(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domaine)}&sz=128`, {
      signal: AbortSignal.timeout(5000),
    });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !type.startsWith('image/')) return new NextResponse(null, { status: 404 });
    return new NextResponse(await res.arrayBuffer(), {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
