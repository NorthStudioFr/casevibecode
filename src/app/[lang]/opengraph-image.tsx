import { ImageResponse } from 'next/og';
import { getDict } from '@/lib/i18n/dictionaries';
import { langOf } from '@/lib/i18n/config';

export const alt = 'casevibecode';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ lang?: string }> }) {
  const t = getDict(langOf(await params));
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: 8,
            border: '2px solid #33e667',
            color: '#33e667',
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          cv
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, marginTop: 40 }}>
          casevibecode
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#9aa29a', marginTop: 20, maxWidth: 900 }}>
          {t.site.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
