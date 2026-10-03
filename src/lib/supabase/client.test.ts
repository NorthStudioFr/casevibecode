import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const createClientMock = vi.fn(() => ({ __type: 'supabase' }));
vi.mock('@supabase/supabase-js', () => ({ createClient: createClientMock }));

describe('supabase browser client', () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockClear();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('throws a clear error, only when used, if the public env vars are missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
    const { getSupabaseBrowser } = await import('./client'); // import alone must not throw
    expect(() => getSupabaseBrowser()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it('creates the client once with the public url and anon key', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:1');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-test');
    const { getSupabaseBrowser } = await import('./client');
    getSupabaseBrowser();
    getSupabaseBrowser();
    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(createClientMock.mock.calls[0]).toEqual(['http://localhost:1', 'anon-test', expect.anything()]);
  });
});
