import { supabase, $, esc, mascara, player, COMUNIDADE } from './app.js';
import { PASSOS, faixa, podeFazer } from './regras.js';

const LINK_BLACK = new Date('2026-11-22T20:00:00Z'); // dom 22/11 17h (Brasília)
const views = ['carregando', 'entrar', 'inscricao', 'jornada'];
const mostra = (v) => views.forEach((n) => ($('#v-' + n).hidden = n !== v));
document.querySelectorAll('input[type=tel]').forEach((i) => i.addEventListener('input', () => (i.value = mascara(i.value))));

let user = null;

async function iniciar() {
  const { data } = await supabase.auth.getUser();
  user = data.user;
  $('#sair').hidden = !user;
  if (!user) return mostra('entrar');
  const { data: papeis } = await supabase.from('user_roles').select('role');
  $('#link-equipe').hidden = !(papeis || []).some((p) => p.role === 'admin');
  const { data: membro } = await supabase.from('black_membros').select('*').maybeSingle();
  if (!membro) {
    const f = $('#f-inscricao');
    f.nome.value = user.user_metadata?.nome || sessionStorage.getItem('bf_nome') || '';
    return mostra('inscricao');
  }
  await jornada(membro);
}

async function jornada(membro) {
  mostra('jornada');
  $('#oi').textContent = `Olá, ${membro.nome.split(' ')[0]}. Vamos preparar sua Black.`;
  const [{ data: prog }, { data: placar }, { data: conteudos }] = await Promise.all([
    supabase.from('black_progresso').select('passo'),
    supabase.rpc('black_meu_placar'),
    supabase.from('black_conteudos').select('*').order('ordem'),
  ]);
  const feitos = (prog || []).map((p) => p.passo);
  const pontos = placar?.[0]?.pontos ?? 0;
  $('#pontos').textContent = pontos;
  $('#barra').style.width = Math.round((feitos.length / PASSOS.length) * 100) + '%';
  const f = faixa(pontos);
  $('#faltam').textContent = feitos.length === PASSOS.length ? 'Jornada completa! Você está entre os mais preparados.' : `${PASSOS.length - feitos.length} passo(s) para completar a jornada · nível ${f}`;
  const dias = Math.ceil((LINK_BLACK - Date.now()) / 86400000);
  $('#contador').textContent = dias > 0 ? `Faltam ${dias} dia(s) para o link da Black chegar para a lista (dom 22/11, 17h).` : 'O link da Black já foi liberado para a lista.';

  $('#passos').innerHTML = PASSOS.map((p) => {
    const feito = feitos.includes(p.id);
    const livre = podeFazer(p.id, feitos);
    let acao = '';
    if (!feito && livre) {
      if (p.id === 'pesquisa') acao = '<a class="btn sec" href="#bloco-pesquisa">Responder</a>';
      if (p.id === 'video') acao = '<a class="btn sec" href="#conteudos">Assistir</a>';
      if (p.id === 'comunidade') acao = `<a class="btn sec" data-marcar="comunidade" href="${COMUNIDADE}" target="_blank" rel="noopener">Entrar</a>`;
      if (p.id === 'indicacao') acao = '<a class="btn sec" href="#bloco-indicacao">Indicar</a>';
    }
    const sub = !livre && !feito ? '🔒 Responda a pesquisa para liberar' : p.libera ? `Libera: ${p.libera}` : '';
    return `<div class="card passo ${feito ? 'feito' : ''} ${!livre && !feito ? 'trancado' : ''}"><span class="ok">${feito ? '✓' : ''}</span><div>${p.titulo}<small>${sub}</small></div><div>${acao || `<span class="pts">+${p.pontos} pts</span>`}</div></div>`;
  }).join('');
  document.querySelectorAll('[data-marcar]').forEach((a) => a.addEventListener('click', () => marcar(a.dataset.marcar, membro, 1500)));

  $('#bloco-pesquisa').hidden = feitos.includes('pesquisa');
  $('#bloco-indicacao').hidden = feitos.includes('indicacao');

  const lista = conteudos || [];
  const proximos = PASSOS.filter((p) => p.libera && !feitos.includes(p.id));
  $('#conteudos').innerHTML = lista.map((c) => `<div class="card"><h3>${esc(c.titulo)}</h3>${c.descricao ? `<p class="sub">${esc(c.descricao)}</p>` : ''}
      ${c.tipo === 'video' ? `<div class="video">${player(c.url)}</div>${c.libera_apos === 'pesquisa' && !feitos.includes('video') ? '<p style="margin-top:12px"><button class="btn" id="assisti">Já assisti o vídeo</button></p>' : ''}` : `<p style="margin-top:12px"><a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener">Baixar brinde</a></p>`}</div>`).join('')
    + proximos.map((p) => `<div class="card trancado">🔒 <strong>${p.libera}</strong><small style="display:block;color:var(--suave)">Libera ao concluir: ${p.titulo.toLowerCase()}</small></div>`).join('')
    || '<p class="sub">Em breve.</p>';
  $('#assisti')?.addEventListener('click', () => marcar('video', membro));
}

async function marcar(passo, membro, atraso = 0) {
  const { error } = await supabase.rpc('black_marcar', { _passo: passo });
  if (error) return alert(error.message);
  setTimeout(() => jornada(membro), atraso);
}

$('#f-entrar').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.disabled = true;
  const { error } = await supabase.auth.signInWithOtp({ email: e.target.email.value.trim().toLowerCase(), options: { emailRedirectTo: location.origin + '/app/' } });
  btn.disabled = false;
  $('#m-entrar').textContent = error ? 'Não consegui enviar agora. Tenta de novo em 1 minuto.' : 'Pronto! Abra seu e-mail e clique no link de acesso.';
});

$('#f-inscricao').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target, whats = f.whats.value.replace(/\D/g, '');
  if (whats.length !== 11) return ($('#m-inscricao').textContent = 'Confere o WhatsApp com DDD (11 dígitos).');
  const { error } = await supabase.from('black_membros').insert({ user_id: user.id, nome: f.nome.value.trim(), email: user.email, whatsapp: '+55' + whats, ja_aluno: f.aluno.checked });
  if (error) return ($('#m-inscricao').textContent = 'Não consegui salvar. Tenta de novo.');
  iniciar();
});

$('#f-pesquisa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(e.target));
  const { error } = await supabase.from('black_pesquisa').insert({ ...dados, user_id: user.id });
  if (error) return ($('#m-pesquisa').textContent = 'Não consegui salvar. Tenta de novo.');
  iniciar();
});

$('#f-indicacao').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target, whats = f.whats.value.replace(/\D/g, '');
  if (whats.length !== 11) return ($('#m-indicacao').textContent = 'Confere o WhatsApp com DDD.');
  const { error } = await supabase.from('black_indicacoes').insert({ user_id: user.id, nome: f.nome.value.trim(), whatsapp: '+55' + whats });
  if (error) return ($('#m-indicacao').textContent = 'Não consegui salvar. Tenta de novo.');
  iniciar();
});

$('#sair').addEventListener('click', async () => { await supabase.auth.signOut(); location.reload(); });
supabase.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_IN' && !user) iniciar(); });
iniciar();
