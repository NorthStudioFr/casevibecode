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

const alternatives = [
  { nom: 'qr-menu', url: 'https://github.com/softenrj/qr-menu', type: 'open-source' as const, description: 'Menu QR.' },
  { nom: 'Menuz', url: 'https://menuz.io', type: 'gratuit' as const, description: 'Menu gratuit.' },
];

describe('FAQ', () => {
  it('ne recopie ni le verdict ni la description affichés en haut de fiche', () => {
    render(<FAQ logiciel={{ ...logiciel, alternatives }} verdict="YES" />);
    expect(screen.queryByText(/Verdict casevibecode/)).not.toBeInTheDocument();
    expect(screen.queryByText(logiciel.description)).not.toBeInTheDocument();
    expect(screen.queryByText(logiciel.justificationEditeur)).not.toBeInTheDocument();
  });

  it("pose la question du coût seulement si le prix ou « ce que vous perdez » est connu", () => {
    const { rerender } = render(<FAQ logiciel={{ ...logiciel, alternatives }} verdict="YES" />);
    expect(screen.queryByText(/Combien coûte/)).not.toBeInTheDocument();

    rerender(<FAQ logiciel={{ ...logiciel, prix: 'à partir de 29 €/mois', ceQueVousPerdez: ['Support 24 h'], alternatives }} verdict="YES" />);
    expect(screen.getByText('Combien coûte Eazmenu, et que paie-t-on vraiment ?')).toBeInTheDocument();
    expect(screen.getByText(/Tarif indiqué : à partir de 29 €\/mois\./)).toBeInTheDocument();
    expect(screen.getByText(/Support 24 h/)).toBeInTheDocument();
  });

  it('liste les alternatives avec leur type, seulement si la fiche en a', () => {
    const { rerender } = render(<FAQ logiciel={logiciel} verdict="YES" />);
    expect(screen.queryByText(/alternatives gratuites ou open source/)).not.toBeInTheDocument();

    rerender(<FAQ logiciel={{ ...logiciel, alternatives }} verdict="YES" />);
    expect(screen.getByText('Quelles sont les alternatives gratuites ou open source à Eazmenu ?')).toBeInTheDocument();
    expect(screen.getByText(/qr-menu \(open source\), Menuz \(gratuit\)/)).toBeInTheDocument();
  });

  it('propose la question de construction sauf pour un verdict « Pas remplaçable »', () => {
    const { rerender } = render(<FAQ logiciel={{ ...logiciel, alternatives }} verdict="KINDA" />);
    expect(screen.getByText(/Par où commencer pour construire/)).toBeInTheDocument();
    rerender(<FAQ logiciel={{ ...logiciel, alternatives }} verdict="NOT_REALLY" />);
    expect(screen.queryByText(/Par où commencer pour construire/)).not.toBeInTheDocument();
  });

  it("n'affiche rien (ni JSON-LD) quand la fiche ne permet aucune réponse", () => {
    const { container } = render(<FAQ logiciel={logiciel} verdict="NOT_REALLY" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('emits valid FAQPage JSON-LD matching the rendered questions', () => {
    const { container } = render(<FAQ logiciel={{ ...logiciel, alternatives }} verdict="YES" />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent!);
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(2);
    expect(data.mainEntity[0].name).toBe('Quelles sont les alternatives gratuites ou open source à Eazmenu ?');
    expect(JSON.stringify(data)).not.toContain('AggregateRating');
  });

  it('links to the methodology page', () => {
    render(<FAQ logiciel={{ ...logiciel, alternatives }} verdict="YES" />);
    expect(screen.getByRole('link', { name: /méthode/i })).toHaveAttribute('href', '/methode');
  });
});
