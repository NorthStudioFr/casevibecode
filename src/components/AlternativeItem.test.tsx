// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { AlternativeItem } from './AlternativeItem';

describe('AlternativeItem', () => {
  it('links to the alternative in a new tab, with its type and description', () => {
    render(
      <AlternativeItem
        alternative={{
          nom: 'TastyIgniter',
          url: 'https://tastyigniter.com',
          type: 'open-source',
          description: 'Commandes en ligne et menu pour restaurants.',
        }}
      />
    );
    const link = screen.getByRole('link', { name: 'TastyIgniter' });
    expect(link).toHaveAttribute('href', 'https://tastyigniter.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(screen.getByText('Open source')).toBeInTheDocument();
    expect(screen.getByText('Commandes en ligne et menu pour restaurants.')).toBeInTheDocument();
  });
});
