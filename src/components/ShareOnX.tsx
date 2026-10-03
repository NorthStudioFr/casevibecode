export function ShareOnX({ nom, verdictLabel, url }: { nom: string; verdictLabel: string; url: string }) {
  const text = `${nom} : ${verdictLabel} ? Le verdict casevibecode ${url}`;
  return (
    <a
      href={`https://x.com/intent/post?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-sm border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary"
    >
      Partager sur X
    </a>
  );
}
