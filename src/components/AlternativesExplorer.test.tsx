// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlternativesExplorer } from './AlternativesExplorer';

const l = (id: string, nom: string, secteur: 'chr' | 'saas') => ({ id, nom, slug: id, secteur, domaine: '' });
const polyvalentes = [{ nom: 'Dolibarr', url: 'https://dolibarr.org', totalMensuel: 0, remplace: [l('a', 'Zelty', 'chr'), l('b', 'Notion', 'saas')] }];
const groupes = [
  { categorie: 'caisse' as const, logiciels: [{ ...l('a', 'Zelty', 'chr'), nbAlternatives: 3 }] },
  { categorie: 'notes' as const, logiciels: [{ ...l('b', 'Notion', 'saas'), nbAlternatives: 2 }] },
];

describe('AlternativesExplorer', () => {
  it('filtre par recherche, sans tenir compte des accents ni de la casse', async () => {
    render(<AlternativesExplorer polyvalentes={polyvalentes} groupes={groupes} />);
    await userEvent.type(screen.getByRole('searchbox'), 'NOTION');
    // La liste par catégorie ne garde que Notion ; la carte Dolibarr (qui le remplace) reste entière.
    expect(screen.queryByRole('heading', { name: /Caisse/ })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Notes/ })).toBeInTheDocument();
    expect(screen.getByText('Dolibarr')).toBeInTheDocument();
  });

  it('filtre par secteur', async () => {
    render(<AlternativesExplorer polyvalentes={polyvalentes} groupes={groupes} />);
    await userEvent.click(screen.getByRole('button', { name: /CHR/ }));
    expect(screen.queryByRole('link', { name: /Notion/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Zelty/ }).length).toBeGreaterThan(0);
  });

  it('indique quand rien ne correspond', async () => {
    render(<AlternativesExplorer polyvalentes={polyvalentes} groupes={groupes} />);
    await userEvent.type(screen.getByRole('searchbox'), 'zzzz');
    expect(screen.getByText('Aucun résultat.')).toBeInTheDocument();
  });
});
