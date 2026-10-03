export function CeQueVousPerdez({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-4 rounded-sm border border-no/40 p-4">
      <h2 className="font-serif text-lg font-semibold text-slate-800">Ce que vous perdez</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
