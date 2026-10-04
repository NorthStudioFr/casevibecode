// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { AlternativesPreview } from './AlternativesPreview';
import type { Alternative } from '@/types/logiciel';

const alt = (nom: string): Alternative => ({
  nom,
  url: `https://${nom.toLowerCase()}.io`,
  type: 'gratuit',
  description: `${nom} fait ça.`,
});

describe('AlternativesPreview', () => {
  it('shows the first three alternatives and links to the full list', () => {
    render(
      <AlternativesPreview
        nom="Zenchef"
        slug="zenchef"
        alternatives={[alt('A'), alt('B'), alt('C'), alt('D')]}
      />
    );
    expect(screen.getAllByRole('link', { name: /^[ABCD]$/ })).toHaveLength(3);
    expect(screen.getByRole('link', { name: /toutes les 4 alternatives/i })).toHaveAttribute(
      'href',
      '/logiciel/zenchef/alternatives'
    );
  });

  it('uses a singular label for a single alternative', () => {
    render(<AlternativesPreview nom="Zenchef" slug="zenchef" alternatives={[alt('A')]} />);
    expect(screen.getByRole('link', { name: /l'alternative/i })).toHaveAttribute(
      'href',
      '/logiciel/zenchef/alternatives'
    );
  });

  it('says so plainly when the list is empty', () => {
    render(<AlternativesPreview nom="Zenchef" slug="zenchef" alternatives={[]} />);
    expect(screen.getByText(/aucune alternative libre ou gratuite/i)).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('says so plainly when alternatives are missing (null in the database)', () => {
    render(<AlternativesPreview nom="Zenchef" slug="zenchef" />);
    expect(screen.getByText(/aucune alternative libre ou gratuite/i)).toBeInTheDocument();
  });
});
