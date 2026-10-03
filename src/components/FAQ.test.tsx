// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { FAQ } from './FAQ';
import type { Logiciel } from '@/types/logiciel';

const logiciel: Logiciel = {
  id: 'eazmenu',
  nom: 'Eazmenu',
  slug: 'eazmenu',
  categorie: 'autre',
  secteur: 'chr',
  description: 'Menu digital QR code multilingue.',
  verdictEditeur: 'YES',
  justificationEditeur: 'Un menu QR code sans commande ni paiement est simple à recoder.',
  domaine: '',
  dateAjout: 0,
  dateMaj: 0,
};

describe('FAQ', () => {
  it('renders a question/answer pair using the given verdict label', () => {
    render(<FAQ logiciel={logiciel} verdict="YES" />);
    expect(screen.getByText('Eazmenu est-il remplaçable par un outil sur mesure ?')).toBeInTheDocument();
    expect(screen.getByText(/Verdict casevibecode : Remplaçable/)).toBeInTheDocument();
  });

  it('adds an alternatives question only when the fiche has alternatives, naming up to three', () => {
    const { rerender } = render(<FAQ logiciel={logiciel} verdict="YES" />);
    expect(screen.queryByText(/Quelles alternatives/)).not.toBeInTheDocument();

    rerender(
      <FAQ
        logiciel={{
          ...logiciel,
          alternatives: [
            { nom: 'qr-menu', url: 'https://github.com/softenrj/qr-menu', type: 'open-source', description: 'Menu QR.' },
            { nom: 'Menuz', url: 'https://menuz.io', type: 'gratuit', description: 'Menu gratuit.' },
          ],
        }}
        verdict="YES"
      />
    );
    expect(screen.getByText('Quelles alternatives existent déjà à Eazmenu ?')).toBeInTheDocument();
    expect(screen.getByText(/qr-menu \(open source\), Menuz \(gratuit\)/)).toBeInTheDocument();
  });

  it('emits valid FAQPage JSON-LD matching the rendered questions', () => {
    const { container } = render(<FAQ logiciel={logiciel} verdict="YES" />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent!);
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(2);
    expect(data.mainEntity[0].name).toBe('Eazmenu est-il remplaçable par un outil sur mesure ?');
  });
});
