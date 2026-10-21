import { texteFiche } from './llms';
import type { Logiciel } from '@/types/logiciel';

const base: Logiciel = { id: 'z', nom: 'Zelty', slug: 'zelty', categorie: 'caisse', secteur: 'chr', description: 'Caisse cloud.', verdictEditeur: 'NOT_REALLY', justificationEditeur: 'Certification obligatoire.', domaine: 'zelty.fr', dateAjout: 0, dateMaj: 0 };

describe('texteFiche', () => {
  it('écrit le verdict, la description et le lien de la fiche', () => {
    const t = texteFiche(base, 'https://casevibecode.fr');
    expect(t).toContain('## Zelty');
    expect(t).toContain('URL : https://casevibecode.fr/logiciel/zelty');
    expect(t).toContain('Verdict casevibecode : Pas remplaçable');
    expect(t).toContain('Pourquoi : Certification obligatoire.');
  });
  it("n'écrit ni prix, ni date de vérification, ni alternatives quand la fiche n'en a pas", () => {
    const t = texteFiche(base, 'https://x.fr');
    expect(t).not.toMatch(/Prix|Vérifié|Alternatives/);
  });
  it('liste prix, date de vérification et alternatives quand elles existent', () => {
    const t = texteFiche({ ...base, prix: '59 €/mois', verifieLe: '2026-10-20', alternatives: [{ nom: 'Hiboutik', url: 'https://hiboutik.com', type: 'gratuit', description: 'Caisse en ligne.' }] }, 'https://x.fr');
    expect(t).toContain('Prix : 59 €/mois');
    expect(t).toContain('Vérifié le : 2026-10-20');
    expect(t).toContain('- Hiboutik (Gratuit) : Caisse en ligne. https://hiboutik.com');
  });
  it('ne double pas les points dans « ce que vous perdez »', () => {
    const t = texteFiche({ ...base, ceQueVousPerdez: ['Les passkeys.', 'Le partage.'] }, 'https://x.fr');
    expect(t).toContain('Ce que vous perdez en le remplaçant : Les passkeys ; Le partage.');
  });
});
