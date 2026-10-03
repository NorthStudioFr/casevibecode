import crypto from 'crypto';

// Sur Vercel, x-forwarded-for est posé par la plateforme : son premier élément
// est l'adresse du visiteur.
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || '127.0.0.1';
}

// Empreinte salée : l'adresse IP brute n'est jamais stockée ni journalisée.
// Sans sel secret (ou avec un sel trop court) on refuse plutôt que de hacher
// avec une valeur par défaut devinable.
export function hashIp(ip: string): string {
  const salt = process.env.VOTE_IP_SALT;
  if (!salt || salt.length < 16) {
    throw new Error('VOTE_IP_SALT doit être défini (16 caractères minimum).');
  }
  return crypto.createHmac('sha256', salt).update(ip).digest('hex');
}
