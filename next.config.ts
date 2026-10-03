import type { NextConfig } from "next";

// Ancien nom de domaine du site, redirigé en permanence vers le domaine actuel.
// Fourni par l'environnement (ANCIEN_DOMAINE) : le dépôt public ne le contient pas.
const ancienDomaine = process.env.ANCIEN_DOMAINE?.trim();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...(ancienDomaine
        ? [
            {
              source: '/:path*',
              has: [{ type: 'host' as const, value: ancienDomaine }],
              destination: 'https://casevibecode.fr/:path*',
              permanent: true,
            },
          ]
        : []),
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.casevibecode.fr',
          },
        ],
        destination: 'https://casevibecode.fr/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
