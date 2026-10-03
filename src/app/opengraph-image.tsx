import { ImageResponse } from 'next/og';

export const alt = 'casevibecode — le verdict sur vos logiciels';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
          Le verdict sur vos logiciels, du CHR aux outils du quotidien : remplaçable par du sur-mesure, ou pas ?
        </div>
      </div>
    ),
    { ...size }
  );
}
