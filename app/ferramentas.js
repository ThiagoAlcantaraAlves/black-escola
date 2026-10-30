// Versões leves das ferramentas do hub para a jornada da Black 2026.
// Escala e imposto usam as bibliotecas do hub (lib/, geradas de motelaria-hub/src/lib).
// O preço segue o protocolo da função tabela-precos-suggest do hub.
import { compute, custoPessoa } from '/app/lib/simuladorEscala.js';
import { cenarioSimples, veredictoSimplesFinal, veredictoRR, VEREDICTO_MEI, plano, DEFAULT_STATE } from '/app/lib/radarSplit.js';
import { REVPAR_ESTADOS } from '/app/lib/revpar-estados.js';

const HUB = 'https://novamotelaria.com.br';
export const brl = (n) => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
const num = (v) => { const n = parseFloat(String(v ?? '').replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
const pctTxt = (n) => (n * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';

// ─────────────────────────── Escala ───────────────────────────
export const escala = {
  titulo: 'A conta da escala',
  completo: `${HUB}/ferramentas/simulador-escala-5x2`,
  form: `
    <p class="sub">Pela EC 141/2026, a escala 6x1 acaba: duas folgas por semana a partir de 16/12/2026. Coloque quantas pessoas trabalham em turno e o salário médio de cada função. Quem trabalha em 6x1 hoje cobre 6 turnos por semana.</p>
    <label>Regime da empresa<select name="regime"><option value="simples">Simples Nacional</option><option value="normal">Presumido ou Real</option></select></label>
    <div class="grade3">
      <span></span><small>Pessoas</small><small>Salário médio</small>
      <span>Recepção</span><input name="rec_p" inputmode="numeric" placeholder="4"><input name="rec_s" inputmode="decimal" placeholder="1980">
      <span>Camareiras</span><input name="cam_p" inputmode="numeric" placeholder="8"><input name="cam_s" inputmode="decimal" placeholder="1790">
      <span>Cozinha e copa</span><input name="coz_p" inputmode="numeric" placeholder="2"><input name="coz_s" inputmode="decimal" placeholder="1920">
      <span>Horário fixo (gerente, manutenção)</span><input name="fix_p" inputmode="numeric" placeholder="3"><input name="fix_s" inputmode="decimal" placeholder="3000">
    </div>
    <label class="check"><input type="checkbox" name="x12" checked> A recepção pode trabalhar em 12x36</label>
    <label class="check"><input type="checkbox" name="mp" checked> Aceito meio período onde couber</label>
    <label>Faturamento médio por mês (opcional)<input name="fat" inputmode="decimal" placeholder="300000"></label>`,
  calcular(f) {
    const linha = (nome, p, s, extra = {}) => ({ nome, pessoas: num(f[p]), salario: num(f[s]), tipo: 'turnos', hoje: num(f[p]) * 6, dem: num(f[p]) * 6, mp: !!f.mp, x12: false, ...extra });
    const st = {
      nome: 'meu motel', fat: num(f.fat), regime: f.regime, benef: 500, faltas: 3, dobra: 0, mp: 60,
      rows: [
        linha('Recepção', 'rec_p', 'rec_s', { x12: !!f.x12 }),
        linha('Camareiras', 'cam_p', 'cam_s'),
        linha('Cozinha e copa', 'coz_p', 'coz_s'),
        { nome: 'Horário fixo', pessoas: num(f.fix_p), salario: num(f.fix_s), tipo: 'fixo', hoje: 0, dem: 0, mp: false, x12: false },
      ],
    };
    if (st.rows.every((r) => !r.pessoas)) throw new Error('Coloque pelo menos uma função com pessoas e salário.');
    const r = compute(st);
    const c = (k) => ({ extra: Math.round(r.sc[k].extra), pessoas: r.sc[k].hires, meio: r.sc[k].mps });
    return { folha: Math.round(r.folha), pessoas: r.pessoas, A: c('A'), B: c('B'), C: c('C'), fat: st.fat };
  },
  mostrar(d) {
    const linha = (rot, x) => `<tr><td>${rot}</td><td>${x.pessoas ? '+' + x.pessoas + ' pessoa(s)' : 'sem contratação'}${x.meio ? ' e ' + x.meio + ' meio período' : ''}</td><td><strong>+${brl(x.extra)}</strong> por mês</td><td>${d.folha ? '+' + pctTxt(x.extra / d.folha) : ''}</td></tr>`;
    const melhor = ['A', 'B', 'C'].reduce((m, k) => (d[k].extra < d[m].extra ? k : m), 'A');
    return `<p>Hoje: ${d.pessoas} pessoas, folha de ${brl(d.folha)} por mês${d.fat ? ` (${pctTxt(d.folha / d.fat)} do faturamento)` : ''}.</p>
      <table class="res"><tr><th>Caminho</th><th>Equipe</th><th>Custo a mais</th><th>Sobre a folha</th></tr>
      ${linha('Não mexer', d.A)}${linha('Ajuste', d.B)}${linha('Ajuste bem feito', d.C)}</table>
      <p class="sub">A diferença entre o pior e o melhor caminho é de <strong>${brl(d.A.extra - d[melhor].extra)} por mês</strong>. O roteiro do ajuste bem feito, com os cuidados da 12x36 e dos acordos coletivos, está na Masterclass Preparação 2027 da Escola. Simulação para planejamento: confirme com o contador e o advogado trabalhista.</p>`;
  },
};

// ─────────────────────────── Preço ───────────────────────────
const arred9 = (reais) => { const r = Math.round(reais); for (let d = 0; d <= 10; d++) { const c = [r + d, r - d].filter((v) => v > 0 && v % 10 === 9); if (c.length) return c.sort((a, b) => Math.abs(a - r) - Math.abs(b - r))[0]; } return r; };
const pctPorTO = (t) => (t > 1 ? 0.175 : t >= 0.7 ? 0.125 : t >= 0.5 ? 0.075 : t >= 0.4 ? 0.05 : 0);

export const preco = {
  titulo: 'O preço do fim de semana',
  completo: `${HUB}/dashboard`,
  form: `
    <p class="sub">É o protocolo de preço da Escola: o reajuste vem da ocupação da categoria, com teto de 20% de uma vez, concentrado no período de 3 horas, e o pernoite de fim de semana derivado do de semana. Escolha uma categoria do seu motel.</p>
    <label>Categoria<input name="cat" placeholder="Ex.: Suíte Hidro"></label>
    <div class="grade2">
      <label>Período de 3h hoje (R$)<input name="p3" inputmode="decimal" required placeholder="129"></label>
      <label>Pernoite de semana hoje (R$)<input name="p12s" inputmode="decimal" placeholder="249"></label>
      <label>Pernoite de fim de semana hoje (R$)<input name="p12f" inputmode="decimal" placeholder="289"></label>
      <label>Locações por suíte por dia, em média<input name="to" inputmode="decimal" required placeholder="0,8"></label>
    </div>
    <label>Como essa categoria se posiciona<select name="pos"><option value="padrao">Padrão</option><option value="superior">Superior</option><option value="festa">Festa (temática, grupo)</option><option value="chamarisco">Chamariz (a mais barata, puxa movimento)</option></select></label>
    <div class="checks"><label class="check"><input type="checkbox" name="hidro"> Hidromassagem</label><label class="check"><input type="checkbox" name="piscina"> Piscina</label><label class="check"><input type="checkbox" name="sauna"> Sauna</label><label class="check"><input type="checkbox" name="ofuro"> Ofurô</label><label class="check"><input type="checkbox" name="churras"> Churrasqueira</label></div>`,
  calcular(f) {
    const p3 = num(f.p3), p12s = num(f.p12s), p12f = num(f.p12f), to = num(f.to);
    if (!p3 || !to) throw new Error('Coloque o preço de 3 horas e as locações por suíte por dia.');
    if (to < 0.4) return { bloqueado: true, to, cat: f.cat };
    const premio = Math.min(0.03, 0.01 * ['hidro', 'piscina', 'sauna', 'ofuro', 'churras'].filter((k) => f[k]).length);
    const teto = f.pos === 'chamarisco' ? 0.025 : 0.2;
    const pct = Math.min(pctPorTO(to) + premio, teto);
    const pct12 = pct * 0.85;
    const n3 = Math.max(p3, arred9(p3 * (1 + pct)));
    const n12s = p12s ? Math.max(p12s, arred9(p12s * (1 + pct12))) : 0;
    const n12f = n12s ? Math.max(p12f || 0, arred9(n12s * (f.pos === 'festa' ? 1.22 : 1.175))) : 0;
    return { cat: f.cat, to, pct, p3, n3, p12s, n12s, p12f, n12f };
  },
  mostrar(d) {
    if (d.bloqueado) return `<p><strong>Não é hora de subir preço${d.cat ? ' na ' + d.cat : ''}.</strong> Com ${String(d.to).replace('.', ',')} locação por suíte por dia, o protocolo da Escola trava o reajuste: abaixo de 0,4 o problema é de demanda, não de preço.</p><p class="sub">O caminho é olhar ocupação na semana, marketing e a categoria de entrada. Faça também a tarefa do RevPAR para ver onde o seu motel fica no estado.</p>`;
    const l = (rot, a, n) => (a ? `<tr><td>${rot}</td><td>${brl(a)}</td><td><strong>${brl(n)}</strong></td><td>+${pctTxt((n - a) / a)}</td></tr>` : '');
    return `<p>Reajuste sugerido de <strong>${pctTxt(d.pct)}</strong> no período de 3 horas${d.cat ? ' da ' + d.cat : ''}, pela ocupação de ${String(d.to).replace('.', ',')} locação por suíte por dia.</p>
      <table class="res"><tr><th></th><th>Hoje</th><th>Sugerido</th><th></th></tr>${l('Período de 3h', d.p3, d.n3)}${l('Pernoite de semana', d.p12s, d.n12s)}${l('Pernoite de fim de semana', d.p12f || d.n12f, d.n12f)}</table>
      <p class="sub">Preços terminam em 9 e nenhum fica abaixo do atual. Pernoite sobe menos que o período, e o de fim de semana sai do de semana. A tabela completa, com todas as categorias e a escada entre elas, está no hub, no plano Profissional.</p>`;
  },
};

// ─────────────────────────── RevPAR ───────────────────────────
export const revpar = {
  titulo: 'Seu RevPAR no estado',
  completo: `${HUB}/ferramentas/calculadora-revpar`,
  form: `
    <p class="sub">RevPAR é o quanto cada suíte fatura por dia, ocupada ou não: faturamento dividido por suítes e por dias. É o número que mais compara motéis de tamanhos diferentes.</p>
    <label>Estado<select name="uf">${REVPAR_ESTADOS.map((r) => `<option value="${r.estado}">${r.estado === 'BR' ? 'Brasil (média geral)' : r.estado}</option>`).join('')}</select></label>
    <div class="grade2">
      <label>Faturamento do mês (R$)<input name="fat" inputmode="decimal" required placeholder="180000"></label>
      <label>Número de suítes<input name="su" inputmode="numeric" required placeholder="25"></label>
    </div>
    <label>Dias do mês<input name="dias" inputmode="numeric" value="30"></label>`,
  calcular(f) {
    const fat = num(f.fat), su = num(f.su), dias = num(f.dias) || 30;
    if (!fat || !su) throw new Error('Coloque o faturamento do mês e o número de suítes.');
    const v = fat / su / dias;
    let b = REVPAR_ESTADOS.find((r) => r.estado === f.uf) || REVPAR_ESTADOS.find((r) => r.estado === 'BR');
    const poucos = b.amostra < 5;
    if (poucos) b = REVPAR_ESTADOS.find((r) => r.estado === 'BR');
    const pos = v >= b.p75 ? 'acima_p75' : v >= b.p50 ? 'acima_mediana' : 'abaixo_mediana';
    return { revpar: Math.round(v), uf: f.uf, base: b.estado, media: b.media, p50: b.p50, p75: b.p75, amostra: b.amostra, poucos, pos };
  },
  mostrar(d) {
    const msg = { acima_p75: 'O seu motel está no grupo de cima: acima de 3 em cada 4 motéis da amostra.', acima_mediana: 'O seu motel está acima da metade da amostra, mas abaixo do grupo de cima.', abaixo_mediana: 'O seu motel está abaixo da metade da amostra. Tem espaço para crescer em preço, ocupação ou nos dois.' }[d.pos];
    const max = Math.max(d.revpar, d.p75) * 1.25, w = (x) => Math.round((x / max) * 100);
    return `<p>RevPAR do seu motel: <strong>${brl(d.revpar)} por suíte por dia</strong>.</p>
      <div class="regua"><i style="width:${w(d.revpar)}%"></i><b style="left:${w(d.p50)}%" title="mediana"></b><b style="left:${w(d.p75)}%" title="quartil de cima"></b></div>
      <p class="sub">${d.base === 'BR' ? 'Brasil' : d.base}: mediana ${brl(d.p50)} · média ${brl(d.media)} · grupo de cima a partir de ${brl(d.p75)} (amostra de ${d.amostra} motéis do Censo da Motelaria).${d.poucos ? ' O seu estado ainda tem poucos motéis na amostra, por isso a comparação é com o Brasil.' : ''}</p>
      <p>${msg}</p>`;
  },
};

// ─────────────────────────── Imposto ───────────────────────────
export const imposto = {
  titulo: 'O imposto em 2027',
  completo: `${HUB}/ferramentas/radar-split-payment`,
  form: `
    <p class="sub">A reforma tributária começa em 2027 com a CBS, e motel entra no regime específico da hotelaria, com redução de 40%. Quem está no Simples escolhe a cada semestre entre o Simples "puro" e o híbrido.</p>
    <label>Regime da empresa<select name="regime"><option value="simples">Simples Nacional</option><option value="presumido">Lucro Presumido</option><option value="real">Lucro Real</option><option value="mei">MEI</option></select></label>
    <div class="grade2">
      <label>Faturamento médio por mês (R$)<input name="fat" inputmode="decimal" required placeholder="150000"></label>
      <label>Folha por mês, com encargos (R$)<input name="folha" inputmode="decimal" placeholder="40000"></label>
      <label>Compras por mês de fornecedores fora do Simples (R$)<input name="crr" inputmode="decimal" placeholder="25000"></label>
      <label>Vendas para empresas (% do faturamento)<input name="b2b" inputmode="numeric" value="5"></label>
    </div>`,
  calcular(f) {
    const fat = num(f.fat);
    if (!fat && f.regime !== 'mei') throw new Error('Coloque o faturamento médio por mês.');
    const S = { ...DEFAULT_STATE, regime: f.regime, atividade: 'III', categoria: 'red40', fat, rbt12: fat * 12, folha: num(f.folha) || DEFAULT_STATE.folha, comprasRR: num(f.crr), comprasSP: 0, b2brr: num(f.b2b), b2c: 100 - num(f.b2b) };
    const agora = new Date();
    const v = f.regime === 'mei' ? VEREDICTO_MEI : f.regime === 'simples' ? veredictoSimplesFinal(S, agora) : veredictoRR(S);
    const acoes = plano(f.regime === 'mei' ? 'mei' : f.regime === 'simples' ? 'simples' : 'rr', agora).slice(0, 4);
    const delta = f.regime === 'simples' ? Math.round(cenarioSimples(S, 2027).delta) : null;
    return { regime: f.regime, tom: v.tom, titulo: v.titulo, texto: v.texto, acoes, delta };
  },
  mostrar(d) {
    return `<p><strong>${d.titulo}</strong></p><div class="sub lei">${d.texto}</div>
      <h3 style="margin-top:18px">O que levar ao contador</h3>
      <ol class="acoes">${d.acoes.map((a) => `<li><small>${a[0]}</small><strong>${a[1]}</strong><span>${a[2]}</span></li>`).join('')}</ol>
      <p class="sub">Simulação com as regras de 29/10/2026 (LC 214/2025 e cálculo da CBS pelo TCU). Valide com o seu contador.</p>`;
  },
};

export const FERRAMENTAS = { escala, preco, revpar, imposto };
export { custoPessoa };
