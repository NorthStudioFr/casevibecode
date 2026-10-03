import { afterEach, describe, expect, it } from 'vitest';
import { getClientIp, hashIp } from './ip';

const req = (headers: Record<string, string>) => new Request('http://x', { headers });

describe('getClientIp', () => {
  it('prend le premier élément de x-forwarded-for', () => {
    expect(getClientIp(req({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' }))).toBe('1.2.3.4');
  });
  it('se rabat sur x-real-ip puis sur 127.0.0.1', () => {
    expect(getClientIp(req({ 'x-real-ip': '5.6.7.8' }))).toBe('5.6.7.8');
    expect(getClientIp(req({}))).toBe('127.0.0.1');
  });
});

describe('hashIp', () => {
  const avant = process.env.VOTE_IP_SALT;
  afterEach(() => {
    if (avant === undefined) delete process.env.VOTE_IP_SALT;
    else process.env.VOTE_IP_SALT = avant;
  });

  it('refuse de hacher sans sel (pas de valeur par défaut)', () => {
    delete process.env.VOTE_IP_SALT;
    expect(() => hashIp('1.2.3.4')).toThrow(/VOTE_IP_SALT/);
    process.env.VOTE_IP_SALT = 'court';
    expect(() => hashIp('1.2.3.4')).toThrow(/VOTE_IP_SALT/);
  });

  it('est déterministe, dépend du sel et ne contient pas l’IP', () => {
    process.env.VOTE_IP_SALT = 'a'.repeat(32);
    const a = hashIp('1.2.3.4');
    expect(hashIp('1.2.3.4')).toBe(a);
    expect(hashIp('1.2.3.5')).not.toBe(a);
    expect(a).not.toContain('1.2.3.4');
    process.env.VOTE_IP_SALT = 'b'.repeat(32);
    expect(hashIp('1.2.3.4')).not.toBe(a);
  });
});
