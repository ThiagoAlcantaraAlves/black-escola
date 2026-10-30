import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { Upload } from 'https://esm.sh/tus-js-client@4.3.1';

const AREA_URL = 'https://xzrnqghcacxjteldklyt.supabase.co';
const AREA_KEY = 'sb_publishable_kvMj40j9wnybJl0mafIogg_3gqNfgK7';
export const supabase = createClient(AREA_URL, AREA_KEY);
export const BUCKET_VIDEOS = 'black-videos';

/** Link temporário (4 h) para tocar um vídeo do bucket privado. Só sai para quem já liberou o conteúdo. */
export async function videoAssinado(path) {
  const { data, error } = await supabase.storage.from(BUCKET_VIDEOS).createSignedUrl(path, 60 * 60 * 4);
  if (error) throw error;
  return data.signedUrl;
}

/** Envio retomável (TUS) em pedaços de 6 MB, igual ao portal do MotelMind IA. Se cair, escolher o arquivo de novo continua de onde parou. */
export async function enviarVideo(file, onProgresso) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Sessão expirada. Entre de novo.');
  const limpo = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9.-]+/g, '-').toLowerCase();
  const path = `${new Date().toISOString().slice(0, 10)}-${Date.now()}-${limpo}`;
  await new Promise((resolve, reject) => {
    const up = new Upload(file, {
      endpoint: `${AREA_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: { authorization: `Bearer ${token}`, apikey: AREA_KEY, 'x-upsert': 'true' },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: { bucketName: BUCKET_VIDEOS, objectName: path, contentType: file.type || 'video/mp4', cacheControl: '3600' },
      chunkSize: 6 * 1024 * 1024,
      onError: reject,
      onProgress: (enviado, total) => onProgresso(Math.round((enviado / total) * 100)),
      onSuccess: resolve,
    });
    up.findPreviousUploads().then((ant) => { if (ant[0]) up.resumeFromPreviousUpload(ant[0]); up.start(); });
  });
  return path;
}

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
