import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 px-8 py-6 text-center text-sm text-slate-500">
      <nav className="flex justify-center gap-4">
        <Link href="/mentions-legales" className="hover:text-secondary">
          Mentions légales
        </Link>
        <Link href="/confidentialite" className="hover:text-secondary">
          Confidentialité
        </Link>
      </nav>
      <p className="mt-3 text-xs">
        Design inspiré de{' '}
        <a
          href="https://canivibecodeit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-secondary"
        >
          canivibecodeit.com
        </a>{' '}
        (licence MIT)
      </p>
    </footer>
  );
}
