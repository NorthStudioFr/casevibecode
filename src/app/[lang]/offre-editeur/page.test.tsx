// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import OffreEditeurPage, { generateMetadata } from './page';

describe('OffreEditeurPage', () => {
  it('affiche ce qui est promis et ce qui ne l’est pas, sans prix inventé', async () => {
    render(await OffreEditeurPage({ params: Promise.resolve({ lang: 'fr' }) }));
    expect(screen.getByRole('heading', { name: 'Offre éditeur' })).toBeInTheDocument();
    expect(screen.getByText(/Aucune promesse de visites/)).toBeInTheDocument();
    expect(screen.getByText(/communiqué par écrit/)).toBeInTheDocument();
  });
  it('reste en noindex tant que le prix n’est pas fixé', async () => {
    const m = await generateMetadata({ params: Promise.resolve({ lang: 'fr' }) });
    expect(m.robots).toMatchObject({ index: false });
  });
});
