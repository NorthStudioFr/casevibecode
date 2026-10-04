import { NextResponse, type NextRequest } from 'next/server';

// Le français vit à la racine, l'anglais sous /en. Toutes les pages sont rangées
// sous app/[lang] : on réécrit donc les chemins sans préfixe vers /fr (l'adresse
// affichée ne change pas) et on renvoie /fr/... vers l'adresse sans préfixe pour
// qu'une page n'ait qu'une seule URL.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/en' || pathname.startsWith('/en/')) return NextResponse.next();

  if (pathname === '/fr' || pathname.startsWith('/fr/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/fr${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Ni l'API, ni les ressources internes, ni les fichiers (llms.txt, robots.txt,
  // sitemap.xml, favicon.ico…).
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
