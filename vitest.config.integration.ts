import { defineConfig } from 'vitest/config';
import path from 'path';

// Config dédiée aux tests d'intégration RLS : ils exigent la pile Supabase
// LOCALE (`supabase start`, ports décalés de +1000 dans supabase/config.toml)
// et sont exclus de `npm test` (voir vitest.config.ts). Lancer : `npm run test:rls`.
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/rls.integration.test.ts'],
    testTimeout: 20000,
    hookTimeout: 60000,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
