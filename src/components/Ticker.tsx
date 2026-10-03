import { formatEuros, tapeDurationSeconds, tapeItems, totalMensuel } from '@/lib/ticker';

const REEL = Array.from({ length: 10 }, (_, n) => n);

export function Ticker({ logiciels }: { logiciels: { nom: string; prixMensuel?: number }[] }) {
  const total = totalMensuel(logiciels);
  if (total === 0) return null;

  const tape = tapeItems(logiciels).join(' · ');
  const label = formatEuros(total);

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
          abonnements
          <br />
          passés au crible
        </span>
        <span className="odometer" role="img" aria-label={`${label} € par mois`}>
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
          /mois
        </span>
      </div>
    </div>
  );
}
