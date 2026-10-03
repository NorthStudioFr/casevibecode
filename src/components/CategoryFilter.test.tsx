// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { CategoryFilter } from './CategoryFilter';

describe('CategoryFilter', () => {
  it('calls onChange with the clicked category', async () => {
    const onChange = vi.fn();
    render(<CategoryFilter selected="toutes" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: /Réservation/ }));

    expect(onChange).toHaveBeenCalledWith('reservation');
  });
});
