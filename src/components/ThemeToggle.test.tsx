// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = 'dark';
  });

  it('switches to the light theme, persists it, and switches back', async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /thème/i });

    await userEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');

    await userEvent.click(button);
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('still switches when localStorage throws', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button', { name: /thème/i }));
    expect(document.documentElement.dataset.theme).toBe('light');
    vi.restoreAllMocks();
  });
});
