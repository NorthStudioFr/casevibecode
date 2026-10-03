// Usage : npx --yes tsx scripts/set-admin.ts <user-id>
// Accorde le droit administrateur : app_metadata = { admin: true }, via la clé
// service_role (locale, jamais exposée). app_metadata n'est modifiable que côté
// serveur : c'est ce que lisent la RLS et l'interface. Le nouvel administrateur
// doit se reconnecter pour que son jeton porte le droit.
import type { SupabaseClient } from '@supabase/supabase-js';
import { getServiceClient } from './lib/supabase-admin';

export async function setAdmin(client: SupabaseClient, userId: string): Promise<void> {
  const { error } = await client.auth.admin.updateUserById(userId, { app_metadata: { admin: true } });
  if (error) throw error;
}

if (require.main === module) {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: npx tsx scripts/set-admin.ts <user-id>');
    process.exit(1);
  }
  setAdmin(getServiceClient(), userId)
    .then(() => console.log(`app_metadata.admin = true accordé à ${userId}`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
