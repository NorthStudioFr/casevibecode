'use client';

export function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Rechercher un logiciel…"
      aria-label="Rechercher un logiciel"
      className="w-full rounded-sm border border-slate-200 bg-white px-4 py-2 text-base text-slate-800 placeholder:text-slate-400 focus:border-secondary focus:outline-none"
    />
  );
}
