import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

export const supabase = createClient(
  'https://xzrnqghcacxjteldklyt.supabase.co',
  'sb_publishable_kvMj40j9wnybJl0mafIogg_3gqNfgK7',
);

export const COMUNIDADE = 'https://chat.whatsapp.com/EWumga16MSN0WlOhawDziF';
export const EVENTO_LEAD = 'https://cmrydpojogzofzfzwjhi.supabase.co/functions/v1/evento-lead';
// Ponte com o hub: sincroniza CRM, Mailchimp e a fila do assistente, e gera o Raio-X 2027.
export const HUB_BLACK = 'https://cmrydpojogzofzfzwjhi.supabase.co/functions/v1/black-area';

/** Dados que a pessoa deixou na página de inscrição (guardados por 30 dias neste aparelho). */
export function leadDaPagina() {
  try {
    const l = JSON.parse(localStorage.getItem('bf_lead') || 'null');
    if (!l || Date.now() - (l.t || 0) > 30 * 86400000) return null;
    return { nome: l.nome, email: (l.email || '').toLowerCase(), whats: (l.whats || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '') };
  } catch { return null; }
}

export const $ = (s) => document.querySelector(s);
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function mascara(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  if (v.length > 2) return v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  return v;
}

/** Link do YouTube/Vimeo vira player embutido; arquivo .mp4 vira <video>. */
export function player(url) {
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (yt) return `<iframe src="https://www.youtube.com/embed/${yt[1]}?rel=0" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `<iframe src="https://player.vimeo.com/video/${vm[1]}" allowfullscreen allow="autoplay; fullscreen"></iframe>`;
  return `<video src="${esc(url)}" controls playsinline></video>`;
}
