// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { AuditClient, type AuditLogiciel } from './AuditClient';
import { LocaleProvider } from '@/lib/i18n/LocaleProvider';

const base = { domaine: 'x.io', categorie: 'autre', secteur: 'saas' } as const;
const logiciels: AuditLogiciel[] = [
  { ...base, slug: 'notion', nom: 'Notion', verdict: 'KINDA', prix: 'à partir de 10 €/mois', prixMensuel: 10 },
  { ...base, slug: 'canva', nom: 'Canva', verdict: 'YES', prix: 'à partir de 12 €/mois', prixMensuel: 12 },
  { ...base, slug: 'gratuit', nom: 'Gratuit', verdict: 'NOT_REALLY', prix: 'gratuit' },
];

afterEach(() => window.history.replaceState(null, '', '/'));

describe('AuditClient', () => {
  it('additionne les abonnements cochés et compte les outils sans prix', async () => {
    render(<AuditClient logiciels={logiciels} />);
    expect(screen.getByText('Aucun outil choisi')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: /Notion/ }));
    await userEvent.click(screen.getByRole('checkbox', { name: /Canva/ }));
    await userEvent.click(screen.getByRole('checkbox', { name: /Gratuit/ }));
    expect(screen.getByText('3 outils choisis')).toBeInTheDocument();
    expect(screen.getByText(/22\s*€/)).toBeInTheDocument();
    expect(screen.getByText(/264\s*€ par an/)).toBeInTheDocument();
    expect(screen.getByText(/1 outil sans prix mensuel chiffré/)).toBeInTheDocument();
    expect(window.location.search).toBe('?t=notion%2Ccanva%2Cgratuit');
  });

  it('relit la sélection d’un lien partagé, en ignorant les slugs inconnus', async () => {
    window.history.replaceState(null, '', '/?t=canva,inconnu');
    render(<AuditClient logiciels={logiciels} />);
    expect(await screen.findByText('1 outil choisi')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Canva/ })).toBeChecked();
  });

  it('filtre la liste et parle anglais sous /en', async () => {
    render(
      <LocaleProvider lang="en">
        <AuditClient logiciels={logiciels} />
      </LocaleProvider>,
    );
    expect(screen.getByText('No tool selected')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('searchbox'), 'canv');
    expect(screen.queryByRole('checkbox', { name: /Notion/ })).toBeNull();
    expect(screen.getByRole('checkbox', { name: /Canva/ })).toBeInTheDocument();
  });
});
