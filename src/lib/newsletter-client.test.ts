import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('subscribeNewsletter', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('posts the email to /api/newsletter', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
    const { subscribeNewsletter } = await import('./newsletter-client');
    await subscribeNewsletter('chef@example.com');

    expect(fetch).toHaveBeenCalledWith('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'chef@example.com' }),
    });
  });

  it('throws an error if the request fails', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'E-mail invalide' }),
    } as Response);
    const { subscribeNewsletter } = await import('./newsletter-client');
    await expect(subscribeNewsletter('pas-un-email')).rejects.toThrow('E-mail invalide');
  });
});
