// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogicielGrid } from './LogicielGrid';
import type { LogicielAvecVerdict } from '@/types/logiciel';

const logiciels: LogicielAvecVerdict[] = [
  {
    id: 'zenchef',
    nom: 'Zenchef',
    slug: 'zenchef',
    categorie: 'reservation',
    secteur: 'chr',
    description: '',
    verdictEditeur: 'KINDA',
    justificationEditeur: '',
    domaine: '',
    dateAjout: 0,
    dateMaj: 0,
    // community has overridden the editor's KINDA
    displayVerdict: 'YES',
    totalVotes: 25,
  },
  {
    id: 'laddition',
    nom: "L'Addition",
    slug: 'laddition',
    categorie: 'caisse',
    secteur: 'chr',
    description: '',
    verdictEditeur: 'NOT_REALLY',
    justificationEditeur: '',
    domaine: '',
    dateAjout: 0,
    dateMaj: 0,
    displayVerdict: 'NOT_REALLY',
    totalVotes: 2,
  },
];

describe('LogicielGrid', () => {
  it('shows all fiches by default and filters by category on click', async () => {
    render(<LogicielGrid logiciels={logiciels} />);

    expect(screen.getByText('Zenchef')).toBeInTheDocument();
    expect(screen.getByText("L'Addition")).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Caisse/ }));

    expect(screen.queryByText('Zenchef')).not.toBeInTheDocument();
    expect(screen.getByText("L'Addition")).toBeInTheDocument();
  });

  it('renders each card with its displayVerdict rather than verdictEditeur', () => {
    render(<LogicielGrid logiciels={logiciels} />);
    // Badges render as <span>, distinguishing them from the same-labelled filter buttons.
    expect(screen.getByText('Remplaçable', { selector: 'span' })).toBeInTheDocument();
    expect(screen.queryByText('Partiellement remplaçable', { selector: 'span' })).not.toBeInTheDocument();
    expect(screen.getByText('Pas remplaçable', { selector: 'span' })).toBeInTheDocument();
  });

  it('filters by verdict on click', async () => {
    render(<LogicielGrid logiciels={logiciels} />);

    await userEvent.click(screen.getByRole('button', { name: /^Remplaçable$/ }));

    expect(screen.getByText('Zenchef')).toBeInTheDocument();
    expect(screen.queryByText("L'Addition")).not.toBeInTheDocument();
  });

  it('combines category and verdict filters and shows an empty state when nothing matches', async () => {
    render(<LogicielGrid logiciels={logiciels} />);

    await userEvent.click(screen.getByRole('button', { name: /Caisse/ }));
    await userEvent.click(screen.getByRole('button', { name: /^Remplaçable$/ }));

    expect(screen.queryByText('Zenchef')).not.toBeInTheDocument();
    expect(screen.queryByText("L'Addition")).not.toBeInTheDocument();
    expect(screen.getByText('Aucune fiche ne correspond à ces filtres.')).toBeInTheDocument();
  });

  it('filters by name search, accent- and case-insensitively', async () => {
    render(<LogicielGrid logiciels={logiciels} />);

    await userEvent.type(screen.getByRole('searchbox'), 'ADDI');

    expect(screen.queryByText('Zenchef')).not.toBeInTheDocument();
    expect(screen.getByText("L'Addition")).toBeInTheDocument();
  });

  it('ranks by votes by default and can switch to alphabetical order', async () => {
    render(<LogicielGrid logiciels={logiciels} />);
    const names = () => screen.getAllByRole('heading', { level: 2 }).map((el) => el.textContent);
    expect(names()).toEqual(['Zenchef', "L'Addition"]);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'nom');
    expect(names()).toEqual(["L'Addition", 'Zenchef']);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'votes');
    expect(names()).toEqual(['Zenchef', "L'Addition"]);
  });
});

describe('LogicielGrid — secteurs', () => {
  const saas: LogicielAvecVerdict = {
    ...logiciels[0],
    id: 'notion',
    nom: 'Notion',
    slug: 'notion',
    categorie: 'notes',
    secteur: 'saas',
    displayVerdict: 'KINDA',
    totalVotes: 0,
  };

  it('ne propose pas de filtre de secteur quand il n’y en a qu’un', () => {
    render(<LogicielGrid logiciels={logiciels} />);
    expect(screen.queryByRole('group', { name: 'Secteur' })).toBeNull();
  });

  it('filtre par secteur et ne garde que les catégories présentes', async () => {
    render(<LogicielGrid logiciels={[...logiciels, saas]} />);
    expect(screen.getByRole('button', { name: /Notes/ })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Outils du quotidien/ }));
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.queryByText('Zenchef')).toBeNull();
    expect(screen.queryByRole('button', { name: /Réservation/ })).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: /CHR/ }));
    expect(screen.getByText('Zenchef')).toBeInTheDocument();
    expect(screen.queryByText('Notion')).toBeNull();
    expect(screen.queryByRole('button', { name: /Notes/ })).toBeNull();
  });
});
