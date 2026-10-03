import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Les tests d'intégration RLS exigent la pile Supabase locale et se lancent
    // à part (`npm run test:rls`, voir vitest.config.integration.ts).
    exclude: ['**/node_modules/**', 'tests/rls.integration.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
