import { describe, it, expect, vi } from 'vitest';
import { setAdmin } from './set-admin';

describe('setAdmin', () => {
  it('sets app_metadata.admin (never user_metadata) for the given user id', async () => {
    const updateUserById = vi.fn().mockResolvedValue({ error: null });
    await setAdmin({ auth: { admin: { updateUserById } } } as never, 'friend-uid-123');
    expect(updateUserById).toHaveBeenCalledWith('friend-uid-123', { app_metadata: { admin: true } });
  });

  it('throws when Supabase refuses', async () => {
    const updateUserById = vi.fn().mockResolvedValue({ error: new Error('User not found') });
    await expect(setAdmin({ auth: { admin: { updateUserById } } } as never, 'x')).rejects.toThrow('User not found');
  });
});
