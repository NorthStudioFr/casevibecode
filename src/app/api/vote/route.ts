import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { getClientIp, hashIp } from '@/lib/ip';

const MAX_VOTES_PAR_HEURE = 30;
const FK_VIOLATION = '23503';

export async function POST(request: Request) {
  try {
    const ipHash = hashIp(getClientIp(request));
    const supabase = getSupabaseAdmin();

    // Limite partagée par toutes les instances (table rate_limits).
    const { data: autorise, error: limitError } = await supabase.rpc('rate_limit_hit', {
      p_cle: `vote:${ipHash}`,
      p_max: MAX_VOTES_PAR_HEURE,
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
    const logicielId = body?.logicielId;
    const valeur = body?.valeur;
    if (!logicielId || typeof logicielId !== 'string' || !['remplace', 'pas_remplacable'].includes(valeur)) {
      return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
    }

    const { error } = await supabase
      .from('votes')
      .upsert(
        { logiciel_slug: logicielId, ip_hash: ipHash, valeur, updated_at: new Date().toISOString() },
        { onConflict: 'logiciel_slug,ip_hash' },
      );
    if (error) {
      if (error.code === FK_VIOLATION) {
        return NextResponse.json({ error: 'Fiche inconnue' }, { status: 400 });
      }
      console.error('vote upsert:', error);
      return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }

    // Renvoie les nouveaux compteurs pour la mise à jour de l'affichage.
    const { data: counts, error: countError } = await supabase.rpc('vote_counts', { p_slug: logicielId });
    if (countError) return NextResponse.json({ success: true, counts: null });
    const row = (counts as { remplace: number; pas_remplacable: number }[] | null)?.[0];
    return NextResponse.json({
      success: true,
      counts: { remplace: row?.remplace ?? 0, pasRemplacable: row?.pas_remplacable ?? 0 },
    });
  } catch (error) {
    console.error('vote:', error);
    return NextResponse.json({ error: 'Erreur inattendue' }, { status: 500 });
  }
}
