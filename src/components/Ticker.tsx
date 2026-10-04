'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';
import { formatEuros, tapeDurationSeconds, tapeItems, totalMensuel } from '@/lib/ticker';

const REEL = Array.from({ length: 10 }, (_, n) => n);

export function Ticker({ logiciels }: { logiciels: { nom: string; prixMensuel?: number }[] }) {
  const { t, lang } = useLocale();
  const total = totalMensuel(logiciels);
  if (total === 0) return null;

  const tape = tapeItems(logiciels, lang).join(' · ');
  const label = formatEuros(total, lang);

  return (
    <div className="ticker">
      <div className="tape" aria-hidden="true">
        <div className="tape-track" style={{ ['--tape-dur' as string]: `${tapeDurationSeconds(tape)}s` }}>
          <span>{tape} · </span>
          <span>{tape} · </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-5">
        <span className="text-right text-xs leading-tight" style={{ color: 'var(--ticker-label)' }}>
          {t.ticker.label1}
          <br />
          {t.ticker.label2}
        </span>
        <span className="odometer" role="img" aria-label={t.ticker.ariaTotal(label)}>
          {[...label].map((ch, i) =>
            /\d/.test(ch) ? (
              <span key={i} className="digit">
                <span className="reel" style={{ transform: `translateY(calc(${-Number(ch)} * var(--digit-h)))` }}>
                  {REEL.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </span>
            ) : (
              <span key={i} className="sym">
                {ch}
              </span>
            )
          )}
          <span className="sym">€</span>
        </span>
        <span className="text-sm" style={{ color: 'var(--ticker-dim)' }}>
          {t.ticker.perMonth}
        </span>
      </div>
    </div>
  );
}
