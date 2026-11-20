// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { SponsorBlock } from './SponsorBlock';

const s = { nom: 'Exemple', url: 'https://exemple.test/', description: 'Une phrase.', descriptionEn: 'One sentence.', debut: '2026-12-01', fin: '2026-12-31' };

describe('SponsorBlock', () => {
  it('n’affiche rien sans sponsor', () => {
    const { container } = render(<SponsorBlock lang="fr" sponsors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it('étiquette « Sponsorisé » et lien rel=sponsored', () => {
    render(<SponsorBlock lang="fr" sponsors={[s]} />);
    expect(screen.getByText('Sponsorisé')).toBeInTheDocument();
    const lien = screen.getByRole('link', { name: 'Exemple' });
    expect(lien).toHaveAttribute('rel', expect.stringContaining('sponsored'));
    expect(lien).toHaveAttribute('href', 'https://exemple.test/');
    expect(screen.getByRole('link', { name: 'Comment ça marche' })).toHaveAttribute('href', '/offre-editeur');
  });
  it('version anglaise', () => {
    render(<SponsorBlock lang="en" sponsors={[s]} />);
    expect(screen.getByText('Sponsored')).toBeInTheDocument();
    expect(screen.getByText('One sentence.')).toBeInTheDocument();
  });
});
