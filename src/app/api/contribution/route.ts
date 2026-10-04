import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { getClientIp, hashIp } from '@/lib/ip';
import { validerContribution } from '@/lib/contribution';

const MAX_PAR_HEURE = 6;
const FK_VIOLATION = '23503';

// Envoi d'un retour (« je l'ai construit », « ça a cassé ») ou d'une proposition de
// logiciel. Rien n'est publié tant qu'un administrateur n'a pas validé.
export async function POST(request: Request) {
  try {
    const ipHash = hashIp(getClientIp(request));
    const supabase = getSupabaseAdmin();

    const { data: autorise, error: limitError } = await supabase.rpc('rate_limit_hit', {
      p_cle: `contribution:${ipHash}`,
      p_max: MAX_PAR_HEURE,
      p_fenetre_secondes: 3600,
    });
    if (limitError) {
      console.error('rate_limit_hit:', limitError);
      return NextResponse.json({ error: 'indisponible' }, { status: 503 });
    }
    if (!autorise) return NextResponse.json({ error: 'trop' }, { status: 429 });

    const corps = await request.json().catch(() => null);
    const v = validerContribution(corps);
    if (!v.ok) return NextResponse.json({ error: v.erreur }, { status: 400 });

    const c = v.valeur;
    const { error } =
      c.kind === 'retour'
        ? await supabase.from('retours').insert({
            logiciel_slug: c.logicielId,
            type: c.type,
            texte: c.texte,
            lien: c.lien,
            langue: c.langue,
            ip_hash: ipHash,
          })
        : await supabase.from('propositions').insert({
            nom: c.nom,
            url: c.url,
            raison: c.raison,
            langue: c.langue,
            ip_hash: ipHash,
          });
    if (error) {
      if (error.code === FK_VIOLATION) return NextResponse.json({ error: 'fiche' }, { status: 400 });
      console.error('contribution insert:', error);
      return NextResponse.json({ error: 'interne' }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('contribution:', error);
    return NextResponse.json({ error: 'interne' }, { status: 500 });
  }
}
