'use client';

import { useLocale } from '@/lib/i18n/LocaleProvider';

// Exécuté dans <head> avant le premier rendu pour éviter tout flash de thème.
export const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t='dark';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}`;

export function ThemeToggle() {
  const { t } = useLocale();
  function toggle() {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // stockage bloqué (navigation privée) : le thème reste appliqué pour la session
    }
  }

  // Aucune icône dépendant d'un état : les deux sont rendues et le CSS
  // (globals.css) affiche celle qui correspond au thème courant.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.theme}
      className="rounded-sm border border-slate-200 px-2 py-1 text-sm text-slate-700 transition-colors hover:border-primary hover:text-primary"
    >
      <span aria-hidden="true" className="theme-icon-dark">
        ☀
      </span>
      <span aria-hidden="true" className="theme-icon-light">
        ☾
      </span>
    </button>
  );
}
