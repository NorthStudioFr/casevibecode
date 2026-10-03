import { ImageResponse } from 'next/og';
import { getLogicielBySlug } from '@/lib/logiciels-server';
import { VERDICT_LABEL } from '@/lib/verdict';
import type { VerdictEditeur } from '@/types/logiciel';

export const alt = 'Verdict casevibecode';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const VERDICT_COLORS: Record<VerdictEditeur, { bg: string; text: string }> = {
  YES: { bg: '#33e667', text: '#06170b' },
  KINDA: { bg: '#ffb000', text: '#1a1200' },
  NOT_REALLY: { bg: '#ff4444', text: '#1a0505' },
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const logiciel = await getLogicielBySlug(slug);
  const nom = logiciel?.nom ?? 'Logiciel introuvable';
  const description = logiciel?.description ?? '';
  const verdict = logiciel?.verdictEditeur ?? 'KINDA';
  const colors = VERDICT_COLORS[verdict];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0b0d0b',
          color: '#e8e6e0',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#33e667' }}>casevibecode</div>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, marginTop: 24, maxWidth: 1000 }}>
          {nom}
        </div>
        {description && (
          <div style={{ display: 'flex', fontSize: 30, color: '#9aa29a', marginTop: 20, maxWidth: 950 }}>
            {description}
          </div>
        )}
        {logiciel && (
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              marginTop: 40,
              padding: '12px 28px',
              borderRadius: 6,
              fontSize: 30,
              fontWeight: 600,
              background: colors.bg,
              color: colors.text,
            }}
          >
            {VERDICT_LABEL[verdict]}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
