import { getDict } from './dictionaries';


describe('meta descriptions', () => {
  it.each(['fr', 'en'] as const)('restent sous 155 caractères (%s)', (lang) => {
    const t = getDict(lang);
    for (const d of [t.site.description, t.alternatives.indexDescription, t.audit.description]) {
      expect(d.length).toBeLessThanOrEqual(155);
    }
  });
});

describe('titres de fiche', () => {
  const suffixe = ' | casevibecode';

  it.each(['fr', 'en'] as const)('gardent la formulation complète pour un nom court (%s)', (lang) => {
    expect(getDict(lang).fiche.title('Mealie', true)).toMatch(/pri|pric/);
  });

  it.each(['fr', 'en'] as const)('passent à une formulation plus courte pour un nom long, titre et suffixe sous 60 caractères (%s)', (lang) => {
    const t = getDict(lang);
    for (const nom of ['Easy!Appointments', 'Tandoor Recipes', 'Oracle OPERA Cloud', 'Adobe Creative Cloud']) {
      expect(t.fiche.title(nom, true).length + suffixe.length).toBeLessThanOrEqual(60);
    }
  });
});
