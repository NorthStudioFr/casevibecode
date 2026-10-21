import { getDict } from './dictionaries';


describe('meta descriptions', () => {
  it.each(['fr', 'en'] as const)('restent sous 155 caractères (%s)', (lang) => {
    const t = getDict(lang);
    for (const d of [t.site.description, t.alternatives.indexDescription, t.audit.description]) {
      expect(d.length).toBeLessThanOrEqual(155);
    }
  });
});
