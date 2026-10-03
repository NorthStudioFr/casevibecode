// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { ShareOnX } from './ShareOnX';

describe('ShareOnX', () => {
  it('links to an X intent with the verdict text and the fiche url', () => {
    render(
      <ShareOnX
        nom="Zenchef"
        verdictLabel="Partiellement remplaçable"
        url="https://casevibecode.fr/logiciel/zenchef"
      />
    );
    const href = screen.getByRole('link', { name: /partager sur X/i }).getAttribute('href') ?? '';
    expect(href).toContain('https://x.com/intent/post?text=');
    expect(decodeURIComponent(href)).toContain('Zenchef');
    expect(decodeURIComponent(href)).toContain('Partiellement remplaçable');
    expect(decodeURIComponent(href)).toContain('/logiciel/zenchef');
  });
});
