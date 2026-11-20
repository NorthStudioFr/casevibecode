import { NextRequest } from 'next/server';
import { proxy } from './proxy';

const appel = (chemin: string) => proxy(new NextRequest(`https://casevibecode.fr${chemin}`));

describe('proxy', () => {
  it('redirige en 301 les anciennes adresses /en/fr/... vers /en/...', () => {
    const r = appel('/en/fr/logiciel/airtable');
    expect(r.status).toBe(301);
    expect(new URL(r.headers.get('location')!).pathname).toBe('/en/logiciel/airtable');
    expect(new URL(appel('/en/fr').headers.get('location')!).pathname).toBe('/en');
  });
  it('laisse passer les pages anglaises valides et renvoie /fr/... vers la racine', () => {
    expect(appel('/en/logiciel/airtable').status).toBe(200);
    expect(new URL(appel('/fr/methode').headers.get('location')!).pathname).toBe('/methode');
  });
});
