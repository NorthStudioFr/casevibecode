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

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Catégorie/ }), 'caisse');

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

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Catégorie/ }), 'caisse');
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

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /trier par/i }), 'nom');
    expect(names()).toEqual(["L'Addition", 'Zenchef']);

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /trier par/i }), 'votes');
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
    expect(screen.getByRole('option', { name: /Notes/ })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Outils du quotidien/ }));
    expect(screen.getByText('Notion')).toBeInTheDocument();
    expect(screen.queryByText('Zenchef')).toBeNull();
    expect(screen.queryByRole('option', { name: /Réservation/ })).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: /CHR/ }));
    expect(screen.getByText('Zenchef')).toBeInTheDocument();
    expect(screen.queryByText('Notion')).toBeNull();
    expect(screen.queryByRole('option', { name: /Notes/ })).toBeNull();
  });
});

describe('LogicielGrid — tri par défaut « Pertinence »', () => {
  const base = { secteur: 'chr' as const, categorie: 'caisse' as const, description: '', verdictEditeur: 'KINDA' as const, justificationEditeur: '', domaine: '', dateAjout: 0, dateMaj: 0, displayVerdict: 'KINDA' as const };
  it("place d'abord les fiches votées, puis celles au tarif documenté, puis l'ordre alphabétique", () => {
    const liste: LogicielAvecVerdict[] = [
      { ...base, id: 'a', nom: 'Alpha', slug: 'a', totalVotes: 0 },
      { ...base, id: 'b', nom: 'Bravo', slug: 'b', totalVotes: 0, prix: '10 €/mois' },
      { ...base, id: 'c', nom: 'Charlie', slug: 'c', totalVotes: 2 },
    ];
    render(<LogicielGrid logiciels={liste} />);
    const ordre = screen.getAllByRole('link').map((l) => l.textContent ?? '').filter((t) => /Alpha|Bravo|Charlie/.test(t));
    expect(ordre[0]).toMatch(/Charlie/);
    expect(ordre[1]).toMatch(/Bravo/);
    expect(ordre[2]).toMatch(/Alpha/);
  });
});

describe('LogicielGrid — états vides', () => {
  const base = { secteur: 'chr' as const, categorie: 'caisse' as const, description: '', verdictEditeur: 'KINDA' as const, justificationEditeur: '', domaine: '', dateAjout: 0, dateMaj: 0, displayVerdict: 'KINDA' as const };
  const fiches = (avecVotes: number): LogicielAvecVerdict[] =>
    Array.from({ length: 12 }, (_, i) => ({ ...base, id: `f${i}`, nom: `Outil${i}`, slug: `f${i}`, totalVotes: i < avecVotes ? 1 : 0 }));

  it('masque les colonnes Votes et Remplacé tant que presque aucune fiche n’a de données', () => {
    render(<LogicielGrid logiciels={fiches(2)} />);
    expect(screen.queryByText('Votes')).not.toBeInTheDocument();
    expect(screen.queryByText('Remplacé')).not.toBeInTheDocument();
  });

  it('les affiche dès que dix fiches ont des données', () => {
    render(<LogicielGrid logiciels={fiches(10)} />);
    expect(screen.getByText('Votes')).toBeInTheDocument();
    expect(screen.getByText('Remplacé')).toBeInTheDocument();
  });

  it('dit « tarif non communiqué » quand il n’y a pas de prix', () => {
    render(<LogicielGrid logiciels={fiches(0)} />);
    expect(screen.getAllByText('tarif non communiqué').length).toBeGreaterThan(0);
  });
});
