// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { CategoryFilter } from './CategoryFilter';

describe('CategoryFilter', () => {
  it('appelle onChange avec la catégorie choisie dans la liste', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter selected="toutes" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Catégorie/ }), 'reservation');

    expect(onChange).toHaveBeenCalledWith('reservation');
  });

  it('affiche le nombre de fiches par catégorie et le total', () => {
    render(<CategoryFilter selected="toutes" onChange={vi.fn()} categories={['caisse', 'reservation']} counts={{ caisse: 12, reservation: 3 }} />);
    expect(screen.getByRole('option', { name: /Toutes les catégories \(15\)/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Caisse \(12\)/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Réservation \(3\)/ })).toBeInTheDocument();
  });

  it("ne propose que les catégories fournies, pas un mur de pastilles", () => {
    render(<CategoryFilter selected="toutes" onChange={vi.fn()} categories={['caisse']} />);
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
