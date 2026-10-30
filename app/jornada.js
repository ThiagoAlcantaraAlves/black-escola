import { supabase, $, esc, mascara, player, COMUNIDADE, HUB_BLACK, leadDaPagina } from '/app/app.js';
import { TAREFAS, PERGUNTAS, PERGUNTA_ABERTA, DATAS, NOME_NIVEL, contam, estado, dataCurta } from '/app/regras.js';
import { FERRAMENTAS } from '/app/ferramentas.js';

const views = ['carregando', 'entrar', 'inscricao', 'jornada'];
const mostra = (v) => views.forEach((n) => ($('#v-' + n).hidden = n !== v));
document.querySelectorAll('input[type=tel]').forEach((i) => i.addEventListener('input', () => (i.value = mascara(i.value))));

let user = null, membro = null;
let S = { feitos: {}, resultados: {}, placar: null, pesquisa: null, conteudos: [], indicacoes: 0 };

// ───────────── sincroniza com o hub (CRM, Mailchimp e a fila do assistente) ─────────────
async function hub(acao = 'sync') {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  try {
    const r = await fetch(HUB_BLACK, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ acao }) });
    return await r.json();
  } catch { return null; }
}

// ───────────── entrada ─────────────
async function iniciar() {
  const { data } = await supabase.auth.getUser();
  user = data.user;
  $('#sair').hidden = !user;
  if (!user) {
    const l = leadDaPagina();
    if (l?.email) $('#f-entrar').email.value = l.email;
    return mostra('entrar');
  }
  const { data: papeis } = await supabase.from('user_roles').select('role');
  $('#link-equipe').hidden = !(papeis || []).some((p) => p.role === 'admin');
  ({ data: membro } = await supabase.from('black_membros').select('*').maybeSingle());
  if (!membro) {
    const l = leadDaPagina();
    if (l && l.email === (user.email || '').toLowerCase() && l.nome && l.whats?.length >= 10) {
      const { error } = await supabase.from('black_membros').insert({ user_id: user.id, nome: l.nome, email: user.email, whatsapp: '+55' + l.whats, ja_aluno: false });
      if (!error) return iniciar();
    }
    const f = $('#f-inscricao');
    f.nome.value = l?.nome || user.user_metadata?.nome || '';
    if (l?.whats) f.whats.value = mascara(l.whats);
    return mostra('inscricao');
  }
  supabase.rpc('black_visita');
  if (!sessionStorage.getItem('bf_sync')) { sessionStorage.setItem('bf_sync', '1'); hub(); }
  await carregar();
}

async function carregar() {
  const [{ data: prog }, { data: placar }, { data: conteudos }, { data: pesquisa }, { count }] = await Promise.all([
    supabase.from('black_progresso').select('passo, feito_em, dados'),
    supabase.rpc('black_meu_placar'),
    supabase.from('black_conteudos').select('*').order('ordem'),
    supabase.from('black_pesquisa').select('*').maybeSingle(),
    supabase.from('black_indicacoes').select('id', { count: 'exact', head: true }),
  ]);
  S.feitos = Object.fromEntries((prog || []).map((p) => [p.passo, p.feito_em]));
  S.resultados = Object.fromEntries((prog || []).filter((p) => p.dados).map((p) => [p.passo, p.dados]));
  S.placar = placar?.[0] || null;
  S.conteudos = conteudos || [];
  S.pesquisa = pesquisa && (pesquisa.versao ?? 1) >= 2 ? pesquisa : null;
  if (!S.pesquisa) delete S.feitos.pesquisa;
  S.indicacoes = count || 0;
  desenhar();
}

const feitos = () => Object.keys(S.feitos);

// ───────────── tela ─────────────
function desenhar() {
  mostra('jornada');
  const primeiro = membro.nome.split(' ')[0];
  $('#oi').textContent = `${primeiro}, vamos preparar o seu motel para 2027.`;
  const nFeitas = contam.filter((id) => S.feitos[id]).length;
  const nivel = S.placar?.nivel || 'preparado';
  $('#nivel').textContent = NOME_NIVEL[nivel];
  $('#feitas').textContent = nFeitas;
  $('#barra').style.width = Math.round(((nFeitas + 1) / (contam.length + 1)) * 100) + '%';
  const agora = new Date();
  const dias = Math.ceil((DATAS.linkLista - agora) / 86400000);
  $('#contador').textContent = dias > 0 ? `Faltam ${dias} dia(s) para o link da Black.` : 'O link da Black já foi liberado.';
  $('#meta').innerHTML = nivel === 'na_frente'
    ? '<strong>Você está Na frente.</strong> O link da Black chega para você no domingo, 22/11, às 15h: duas horas antes da lista.'
    : agora <= DATAS.naFrenteAte
      ? `Complete 6 das 8 tarefas até sexta, 20/11, e receba o link no domingo às <strong>15h</strong>, duas horas antes da lista. Como os bônus da Black são por ordem de chegada, isso faz diferença. Faltam ${Math.max(0, 6 - nFeitas)}.`
      : 'O link da Black chega para a lista no domingo, 22/11, às 17h.';

  $('#tarefas').innerHTML = TAREFAS.map((t) => {
    const e = estado(t.id, feitos(), agora);
    const sub = { feita: 'Feita', livre: '', trancada: '🔒 Responda o Raio-X 2027 para liberar', agendada: `Abre em ${t.abre ? dataCurta(t.abre) : ''}` }[e];
    const acao = e === 'livre' ? `<button class="btn sec" data-abrir="${t.id}">Fazer</button>`
      : e === 'feita' && (t.ferramenta || t.id === 'pesquisa' || t.id === 'video' || t.id === 'indicacao') ? `<button class="btn sec" data-abrir="${t.id}">Ver</button>` : '';
    return `<div class="card passo ${e}"><span class="ok">${e === 'feita' ? '✓' : ''}</span><div><strong>${t.titulo}</strong><small>${t.desc}</small>${sub ? `<small class="estado">${sub}</small>` : ''}</div><div>${acao}</div></div>`;
  }).join('');
  document.querySelectorAll('[data-abrir]').forEach((b) => (b.onclick = () => abrir(b.dataset.abrir)));

  const lista = S.conteudos;
  $('#conteudos').innerHTML = lista.length
    ? lista.map((c) => `<div class="card"><h3>${esc(c.titulo)}</h3>${c.descricao ? `<p class="sub">${esc(c.descricao)}</p>` : ''}${c.tipo === 'video' ? `<div class="video">${player(c.url)}</div>` : `<p style="margin-top:12px"><a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener">Abrir</a></p>`}</div>`).join('')
    : '<p class="sub">Os conteúdos aparecem aqui conforme você faz as tarefas.</p>';
}

function painel(html) {
  const p = $('#painel');
  p.hidden = false;
  p.innerHTML = `<button class="link fechar" id="fechar" aria-label="Fechar">Fechar ✕</button>${html}`;
  $('#fechar').onclick = () => { p.hidden = true; };
  p.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return p;
}

async function marcar(passo, dados = null) {
  const { error } = await supabase.rpc('black_marcar', { _passo: passo, _dados: dados });
  if (error) return error.message;
  await carregar();
  hub();
  return null;
}

// ───────────── cada tarefa ─────────────
function abrir(id) {
  if (id === 'pesquisa') return S.pesquisa ? raiox() : pesquisa(0, {});
  if (id === 'video') return video();
  if (id === 'comunidade') return comunidade();
  if (id === 'indicacao') return indicacao();
  if (id === 'live') return live();
  if (FERRAMENTAS[id]) return ferramenta(id);
}

function pesquisa(i, resp) {
  if (i < PERGUNTAS.length) {
    const q = PERGUNTAS[i];
    const p = painel(`<p class="eyebrow">Raio-X 2027 · ${i + 1} de ${PERGUNTAS.length + 1}</p><div class="barra fina"><i style="width:${Math.round(((i + 1) / (PERGUNTAS.length + 1)) * 100)}%"></i></div>
      <h2>${q.texto}</h2><div class="opcoes">${q.op.map((o) => `<button class="opcao" data-v="${o[0]}">${o[1]}</button>`).join('')}</div>
      ${i > 0 ? '<button class="link" id="voltar">← Voltar</button>' : ''}`);
    p.querySelectorAll('.opcao').forEach((b) => (b.onclick = () => pesquisa(i + 1, { ...resp, [q.id]: b.dataset.v })));
    $('#voltar') && ($('#voltar').onclick = () => pesquisa(i - 1, resp));
    return;
  }
  const p = painel(`<p class="eyebrow">Raio-X 2027 · última</p><div class="barra fina"><i style="width:100%"></i></div>
    <h2>${PERGUNTA_ABERTA.texto}</h2><form id="f-aberta" style="max-width:none"><textarea name="t" rows="3" maxlength="400" placeholder="Ex.: quanto subir o pernoite de sábado sem perder cliente?"></textarea>
    <button class="btn">Ver meu Raio-X 2027</button><p class="msg" id="m-pesq"></p></form>`);
  p.querySelector('#f-aberta').onsubmit = async (e) => {
    e.preventDefault();
    e.target.querySelector('button').disabled = true;
    const linha = { user_id: user.id, ...resp, pergunta_live: e.target.t.value.trim() || null, versao: 2, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('black_pesquisa').upsert(linha, { onConflict: 'user_id' });
    if (error) { e.target.querySelector('button').disabled = false; return ($('#m-pesq').textContent = 'Não consegui salvar. Tenta de novo.'); }
    await carregar();
    hub();
    raiox();
  };
}

function raioxLocal(p) {
  const r = [], o = [];
  if (['1-2', '2-4', '4+'].includes(p.faturamento) || ['25-39', '40+'].includes(p.suites_faixa)) r.push({ titulo: 'A folha de 2027', texto: 'Com a equipe que um motel do seu tamanho tem, o fim da 6x1 pesa. A diferença entre não mexer e ajustar bem costuma ser grande.' });
  r.push({ titulo: 'O imposto muda de lugar', texto: 'A CBS entra em 2027 e motel cai no regime específico da hotelaria. Vale saber se o seu regime atual continua sendo o melhor.' });
  if (p.como_decide === 'feeling' || p.como_decide === 'planilhas') r.push({ titulo: 'Decidir sem o número na mão', texto: 'Em um ano de custo maior, decisão de preço e de escala no sentimento sai caro.' });
  else r.push({ titulo: 'Juros altos', texto: 'Reforma e investimento precisam se pagar mais rápido com o dinheiro caro.' });
  o.push({ titulo: 'Preço pela ocupação', texto: 'Categoria com ocupação alta aceita reajuste. O protocolo da Escola diz quanto, com teto de 20%.' });
  o.push({ titulo: 'Escala bem feita', texto: 'Meio período e 12x36 bem usados reduzem o custo da nova escala.' });
  o.push({ titulo: 'IA no dia a dia', texto: 'Os relatórios do seu sistema viram decisão em minutos com a IA.' });
  const ferr = { preco: 'preco', reforma: 'revpar', escala: 'escala', imposto: 'imposto', marketing: 'revpar' }[p.decisao] || 'escala';
  return { resumo: 'Um resumo do que 2027 traz para um motel como o seu.', riscos: r.slice(0, 3), oportunidades: o, primeiro_passo: 'Faça esta semana a tarefa da ferramenta indicada abaixo, com os números do seu motel.', ferramenta: ferr };
}

async function raiox() {
  const p = painel('<p class="eyebrow">Seu Raio-X 2027</p><p class="sub">Montando o seu Raio-X…</p>');
  const r = await hub('raiox');
  const rx = r?.raiox || raioxLocal(S.pesquisa || {});
  const t = TAREFAS.find((x) => x.id === rx.ferramenta);
  const e = t ? estado(t.id, feitos()) : null;
  const bloco = (titulo, itens) => `<h3>${titulo}</h3><ul class="rx">${(itens || []).map((i) => `<li><strong>${esc(i.titulo)}</strong><span>${esc(i.texto)}</span></li>`).join('')}</ul>`;
  p.innerHTML = `<button class="link fechar" id="fechar">Fechar ✕</button>
    <p class="eyebrow">Seu Raio-X 2027</p><h2>${esc(membro.nome.split(' ')[0])}, ${esc(rx.resumo || '')}</h2>
    ${bloco('3 riscos', rx.riscos)}${bloco('3 oportunidades', rx.oportunidades)}
    <h3>Primeiro passo</h3><p>${esc(rx.primeiro_passo || '')}</p>
    ${t ? `<p class="sub">Ferramenta indicada: <strong>${t.titulo}</strong>${e === 'agendada' ? ` (abre em ${dataCurta(t.abre)})` : ''}.</p>` : ''}
    <p class="acoes-linha"><button class="btn" id="ir-video">Assistir o vídeo da conta de 2027</button> <button class="btn sec" onclick="window.print()">Salvar em PDF</button></p>`;
  $('#fechar').onclick = () => { p.hidden = true; };
  $('#ir-video').onclick = video;
}

function video() {
  const vids = S.conteudos.filter((c) => c.tipo === 'video');
  const feito = !!S.feitos.video;
  const p = painel(`<p class="eyebrow">Vídeo</p><h2>A conta de 2027</h2>
    <p class="sub">A live com o Vinicius Roveda e o Thiago Alcântara: o fim da escala 6x1, a reforma tributária e como usar a IA para fazer essas contas no seu motel.</p>
    ${vids.length ? vids.map((c) => `<div class="video">${player(c.url)}</div>`).join('') : '<p class="sub">O vídeo entra aqui em instantes. Volte daqui a pouco.</p>'}
    ${vids.length && !feito ? '<p style="margin-top:14px"><button class="btn" id="assisti">Já assisti</button></p>' : ''}
    ${feito ? '<p class="msg">Tarefa feita.</p>' : ''}<p class="msg" id="m-video"></p>`);
  const b = p.querySelector('#assisti');
  if (b) b.onclick = async () => { b.disabled = true; const er = await marcar('video'); $('#m-video').textContent = er ? 'Não consegui marcar. Tenta de novo.' : 'Pronto, tarefa feita.'; };
}

function ferramenta(id) {
  const F = FERRAMENTAS[id], t = TAREFAS.find((x) => x.id === id), ant = S.resultados[id];
  const p = painel(`<p class="eyebrow">Ferramenta da Escola</p><h2>${t.titulo}</h2>
    <form id="f-ferr" style="max-width:none">${F.form}<button class="btn">Calcular</button><p class="msg" id="m-ferr"></p></form>
    <div id="res-ferr">${ant ? F.mostrar(ant) + '<p class="sub">Esse é o seu último resultado. Pode refazer com outros números.</p>' : ''}</div>
    <p class="sub">Versão completa no hub: <a href="${F.completo}" target="_blank" rel="noopener" style="color:var(--champ)">abrir no Nova Motelaria Hub</a>.</p>`);
  p.querySelectorAll('input[inputmode=decimal]').forEach((i) => i.addEventListener('blur', () => (i.value = i.value.trim())));
  p.querySelector('#f-ferr').onsubmit = async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.target));
    let d;
    try { d = F.calcular(dados); } catch (er) { return ($('#m-ferr').textContent = er.message); }
    $('#res-ferr').innerHTML = F.mostrar(d);
    $('#m-ferr').textContent = '';
    const er = await marcar(id, d);
    if (er) $('#m-ferr').textContent = er.includes('abriu') ? 'Essa tarefa ainda não abriu.' : 'O resultado está aí, mas não consegui marcar a tarefa. Tenta de novo.';
    else $('#res-ferr').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}

function comunidade() {
  const p = painel(`<p class="eyebrow">Comunidade</p><h2>Comunidade Black 2026</h2>
    <p class="sub">O link da oferta cai lá primeiro, junto com avisos e o link da live. Só a equipe posta, então não vira bagunça.</p>
    <p style="margin-top:14px"><a class="btn" id="entrar-com" href="${COMUNIDADE}" target="_blank" rel="noopener">Entrar na comunidade</a></p>`);
  p.querySelector('#entrar-com').onclick = () => setTimeout(() => marcar('comunidade'), 800);
}

function indicacao() {
  const n = S.indicacoes;
  const p = painel(`<p class="eyebrow">Traga o seu sócio</p><h2>Quem decide junto com você?</h2>
    <p class="sub">Indique o sócio, o gerente ou o filho que cuida do motel com você. A gente manda o convite em seu nome.</p>
    <ul class="escada"><li class="${n >= 1 ? 'ok' : ''}"><strong>1 indicado que se cadastrar</strong>vaga extra no sorteio do MotelMind Floripa 2027</li><li class="${n >= 3 ? 'ok' : ''}"><strong>3 indicados</strong>15 minutos com o Thiago para montar o primeiro uso de IA do seu motel</li></ul>
    <p class="sub">Você indicou ${n} pessoa(s).</p>
    <form id="f-ind"><label>Nome<input name="nome" required minlength="2"></label><label>WhatsApp com DDD<input name="whats" type="tel" required placeholder="(47) 99999-9999"></label><button class="btn">Indicar</button><p class="msg" id="m-ind"></p></form>`);
  const f = p.querySelector('#f-ind');
  f.whats.addEventListener('input', () => (f.whats.value = mascara(f.whats.value)));
  f.onsubmit = async (e) => {
    e.preventDefault();
    const w = f.whats.value.replace(/\D/g, '');
    if (w.length !== 11 && w.length !== 10) return ($('#m-ind').textContent = 'Confere o WhatsApp com DDD.');
    const { error } = await supabase.from('black_indicacoes').insert({ user_id: user.id, nome: f.nome.value.trim(), whatsapp: '+55' + w });
    if (error) return ($('#m-ind').textContent = 'Não consegui salvar. Tenta de novo.');
    await carregar(); hub(); indicacao();
    $('#m-ind').textContent = 'Indicação feita. Obrigado!';
  };
}

function live() {
  const feito = !!S.feitos.live;
  const p = painel(`<p class="eyebrow">Live de lançamento</p><h2>Segunda, 23/11, às 17h</h2>
    <p class="sub">O Vinicius apresenta a nova Escola de Motelaria e abre a Black 2026 ao vivo. O link da sala chega no WhatsApp e na comunidade.</p>
    ${feito ? '<p class="msg">Presença confirmada.</p>' : '<p style="margin-top:14px"><button class="btn" id="conf">Confirmo minha presença</button></p>'}<p class="msg" id="m-live"></p>`);
  const b = p.querySelector('#conf');
  if (b) b.onclick = async () => { b.disabled = true; const er = await marcar('live'); $('#m-live').textContent = er ? 'Não consegui confirmar. Tenta de novo.' : 'Presença confirmada.'; };
}

// ───────────── formulários de entrada ─────────────
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
  if (whats.length !== 11 && whats.length !== 10) return ($('#m-inscricao').textContent = 'Confere o WhatsApp com DDD.');
  const { error } = await supabase.from('black_membros').insert({ user_id: user.id, nome: f.nome.value.trim(), email: user.email, whatsapp: '+55' + whats, ja_aluno: f.aluno.checked });
  if (error) return ($('#m-inscricao').textContent = 'Não consegui salvar. Tenta de novo.');
  iniciar();
});

$('#sair').addEventListener('click', async () => { await supabase.auth.signOut(); location.reload(); });
supabase.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_IN' && !user) iniciar(); });
iniciar();
