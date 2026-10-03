// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { Ticker } from './Ticker';

describe('Ticker', () => {
  it('exposes the total to assistive tech and shows priced fiches in the tape', () => {
    render(<Ticker logiciels={[{ nom: 'Zenchef', prixMensuel: 129 }, { nom: 'Gratuit' }]} />);
    expect(screen.getByLabelText('129 € par mois')).toBeInTheDocument();
    expect(document.querySelector('.tape')?.textContent).toContain('ZENCHEF −129 €/mois');
    expect(document.querySelector('.tape')?.textContent).not.toContain('GRATUIT');
  });

  it('renders nothing when no fiche has a price', () => {
    const { container } = render(<Ticker logiciels={[{ nom: 'A' }]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
