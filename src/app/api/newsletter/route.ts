import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { getClientIp, hashIp } from '@/lib/ip';

const UNIQUE_VIOLATION = '23505';
const MAX_INSCRIPTIONS_PAR_HEURE = 5;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ipHash = hashIp(getClientIp(request));
    const supabase = getSupabaseAdmin();

    const { data: autorise, error: limitError } = await supabase.rpc('rate_limit_hit', {
      p_cle: `newsletter:${ipHash}`,
      p_max: MAX_INSCRIPTIONS_PAR_HEURE,
      p_fenetre_secondes: 3600,
    });
    if (limitError) {
      console.error('rate_limit_hit:', limitError);
      return NextResponse.json({ error: 'Service momentanément indisponible' }, { status: 503 });
    }
    if (!autorise) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez plus tard.' }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    if (!email || email.length > 254 || !EMAIL.test(email)) {
      return NextResponse.json({ error: 'E-mail invalide' }, { status: 400 });
    }

    const { error } = await supabase.from('abonnes_newsletter').insert({ email });
    // Déjà inscrit : succès silencieux (on ne révèle pas qui est abonné).
    if (error && error.code !== UNIQUE_VIOLATION) {
      console.error('newsletter insert:', error);
      return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('newsletter:', error);
    return NextResponse.json({ error: 'Erreur inattendue' }, { status: 500 });
  }
}
