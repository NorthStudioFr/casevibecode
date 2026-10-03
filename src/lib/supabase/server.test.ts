import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const createClientMock = vi.fn(() => ({ __type: 'supabase' }));
vi.mock('@supabase/supabase-js', () => ({ createClient: createClientMock }));

describe('supabase server client', () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockClear();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('throws a clear error when the public env vars are missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
    const { getSupabaseServer } = await import('./server');
    expect(() => getSupabaseServer()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it('uses the anon key (never the service role) and keeps no session', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:1');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-test');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-test');
    const { getSupabaseServer } = await import('./server');
    getSupabaseServer();
    expect(createClientMock).toHaveBeenCalledWith('http://localhost:1', 'anon-test', {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  });

  it('isBuildWithoutSupabase is true only during next build without the public vars', async () => {
    const { isBuildWithoutSupabase } = await import('./server');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
    vi.stubEnv('NEXT_PHASE', 'phase-production-build');
    expect(isBuildWithoutSupabase()).toBe(true);
    vi.stubEnv('NEXT_PHASE', 'phase-production-server'); // runtime: a missing var stays an error
    expect(isBuildWithoutSupabase()).toBe(false);
    vi.stubEnv('NEXT_PHASE', 'phase-production-build');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:1');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-test');
    expect(isBuildWithoutSupabase()).toBe(false);
  });
});
