// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { CeQueVousPerdez } from './CeQueVousPerdez';

describe('CeQueVousPerdez', () => {
  it('lists the honest limits', () => {
    render(<CeQueVousPerdez items={['Le support', 'Les mises à jour légales']} />);
    expect(screen.getByRole('heading', { name: /ce que vous perdez/i })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders nothing without items', () => {
    const { container } = render(<CeQueVousPerdez items={[]} />);
    expect(container).toBeEmptyDOMElement();
    const { container: c2 } = render(<CeQueVousPerdez />);
    expect(c2).toBeEmptyDOMElement();
  });
});
