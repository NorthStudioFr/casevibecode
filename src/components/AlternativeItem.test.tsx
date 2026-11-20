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

  it('affiche les faits datés : licence, modèle, version et étoiles GitHub avec leur date de relevé', () => {
    render(
      <AlternativeItem
        alternative={{
          nom: 'VoxelBooking',
          url: 'https://voxelbooking.com',
          type: 'open-source',
          description: 'Réservation auto-hébergée.',
          licence: 'AGPL-3.0',
          modele: 'libre-auto-heberge',
          derniereVersion: { version: '1.1.2', date: '2026-10-21' },
          etoiles: { nombre: 1234, releveLe: '2026-11-20' },
          depot: 'https://github.com/NowSquare/VoxelBooking',
        }}
      />
    );
    expect(screen.getByText(/Licence AGPL-3.0/)).toBeInTheDocument();
    expect(screen.getByText(/100 % libre, à héberger soi-même/)).toBeInTheDocument();
    expect(screen.getByText(/version 1\.1\.2 du 21 octobre 2026/)).toBeInTheDocument();
    const etoiles = screen.getByRole('link', { name: /étoiles GitHub \(relevé du 20 novembre 2026\)/ });
    expect(etoiles).toHaveAttribute('href', 'https://github.com/NowSquare/VoxelBooking');
    expect(etoiles.textContent).toContain('1');
  });

  it('n’affiche aucune ligne de faits sans ces champs', () => {
    render(<AlternativeItem alternative={{ nom: 'X', url: 'https://x.test', type: 'gratuit', description: 'Outil.' }} />);
    expect(screen.queryByText(/Licence|étoiles/)).not.toBeInTheDocument();
  });
});
