import { NextResponse } from 'next/server';
import { getLogicielBySlug, getVoteCounts } from '@/lib/logiciels-server';
import { computeVerdictDisplay } from '@/lib/verdict';
import { langOf, type Lang } from '@/lib/i18n/config';
import { getDict } from '@/lib/i18n/dictionaries';

export const revalidate = 3600;

export function genererBadgeSvg({
  verdictLabel,
  verdict,
}: {
  verdictLabel: string;
  verdict: 'YES' | 'KINDA' | 'NOT_REALLY';
}): string {
  const leftText = 'casevibecode';
  const rightText = `Verdict : ${verdictLabel}`;

  const colors: Record<string, string> = {
    YES: '#16a34a',
    KINDA: '#d97706',
    NOT_REALLY: '#475569',
  };
  const rightBg = colors[verdict] ?? '#475569';

  // Calcul proportionnel de largeur
  const leftWidth = 86;
  const rightWidth = Math.max(90, Math.round(rightText.length * 6.8 + 16));
  const totalWidth = leftWidth + rightWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${leftText}: ${rightText}">
  <title>${leftText}: ${rightText}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="20" fill="#0f172a"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${rightBg}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${leftWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${leftText}</text>
    <text x="${leftWidth / 2}" y="14">${leftText}</text>
    <text x="${leftWidth + rightWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${rightText}</text>
    <text x="${leftWidth + rightWidth / 2}" y="14">${rightText}</text>
  </g>
</svg>`;
}

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const lang: Lang = langOf({ lang: searchParams.get('lang') ?? undefined });
  const t = getDict(lang);

  const logiciel = await getLogicielBySlug(slug, lang);
  if (!logiciel) {
    return new NextResponse('Logiciel introuvable', { status: 404 });
  }

  const counts = await getVoteCounts(logiciel.id);
  const display = computeVerdictDisplay(logiciel.verdictEditeur, counts);

  const verdictLabel = t.verdict[display.verdict];
  const svg = genererBadgeSvg({
    verdictLabel,
    verdict: display.verdict,
  });

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
