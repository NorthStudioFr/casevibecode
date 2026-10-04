// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { LogicielRow } from './LogicielRow';
import type { Logiciel } from '@/types/logiciel';

const logiciel: Logiciel = {
  id: 'zenchef',
  nom: 'Zenchef',
  slug: 'zenchef',
  categorie: 'reservation',
  secteur: 'chr',
  description: 'Gestion des réservations en ligne',
  verdictEditeur: 'KINDA',
  justificationEditeur: '...',
  domaine: 'zenchef.com',
  dateAjout: 0,
  dateMaj: 0,
};

describe('LogicielRow', () => {
  it('renders rank, name and links to the fiche page', () => {
    render(<LogicielRow logiciel={logiciel} verdict="KINDA" totalVotes={0} rang={3} />);
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Zenchef' })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/logiciel/zenchef');
  });

  it('shows the display verdict it is given, not the raw verdictEditeur', () => {
    render(<LogicielRow logiciel={logiciel} verdict="YES" totalVotes={0} rang={1} />);
    expect(screen.getByText('Remplaçable')).toBeInTheDocument();
    expect(screen.queryByText('Partiellement remplaçable')).not.toBeInTheDocument();
  });

  it('shows the category with its emoji', () => {
    render(<LogicielRow logiciel={logiciel} verdict="KINDA" totalVotes={0} rang={1} />);
    expect(screen.getByText('📅 Réservation')).toBeInTheDocument();
  });

  it('shows the vote count and the price when present, hides the price otherwise', () => {
    const { rerender } = render(<LogicielRow logiciel={logiciel} verdict="KINDA" totalVotes={0} rang={1} />);
    expect(screen.queryByText(/€\/mois/)).not.toBeInTheDocument();
    expect(screen.getByLabelText('0 vote')).toBeInTheDocument();

    rerender(
      <LogicielRow logiciel={{ ...logiciel, prix: '29 €/mois' }} verdict="KINDA" totalVotes={3} rang={1} />
    );
    // Rendu deux fois (colonne desktop + ligne mobile), l'une des deux est masquée par CSS.
    expect(screen.getAllByText('29 €/mois').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('3 votes')).toBeInTheDocument();
  });

  it('affiche le nombre de personnes qui ont remplacé l\'outil', () => {
    const { rerender } = render(<LogicielRow logiciel={logiciel} verdict="YES" totalVotes={0} rang={1} />);
    expect(screen.getByLabelText('0 personne a remplacé cet outil')).toBeInTheDocument();
    rerender(<LogicielRow logiciel={logiciel} verdict="YES" totalVotes={0} nbConstruits={3} rang={1} />);
    expect(screen.getByLabelText('3 personnes ont remplacé cet outil')).toBeInTheDocument();
  });
});
