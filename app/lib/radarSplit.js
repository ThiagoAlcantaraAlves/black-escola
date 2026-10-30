// Gerado de motelaria-hub/src/lib/radarSplit.ts (commit 1386990) com esbuild. Não editar aqui: mude no hub e gere de novo.
const STORAGE_KEY = "motelmind-radar-split-v2";
const CBS_2027_PADRAO = 11.3;
const DEFAULT_STATE = {
  regime: "simples",
  atividade: "III",
  categoria: "padrao",
  rbt12: 12e5,
  fat: 1e5,
  folha: 3e4,
  b2brr: 40,
  b2c: 45,
  prazoReceb: 30,
  eletronico: 85,
  cartao: 30,
  comprasRR: 35e3,
  comprasSP: 5e3,
  custoFixo: 45e3,
  juros: 1.9,
  aliqRef: 30,
  cbs27: CBS_2027_PADRAO,
  cargaAtual: 8,
  floatDias: 35,
  anoSel: 2027
};
const PL = "https://www.planalto.gov.br/ccivil_03/";
const U = {
  lc214: PL + "leis/lcp/lcp214.htm",
  dec: PL + "_ato2023-2026/2026/decreto/d12955.htm",
  adct: PL + "constituicao/constituicao.htm",
  cgsn194: "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/setembro/simples-nacional-2027-entenda-os-novos-prazos-e-faca-sua-escolha-com-consciencia-e-tranquilidade",
  portalSN: "https://www8.receita.fazenda.gov.br/SimplesNacional/",
  manual: "https://www.cgibs.gov.br/upload/arquivos/202606/30145925-minuta-split-payment-manual-de-operacoes.pdf",
  atos: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/legislacao/atos-tecnicos-conjuntos",
  devol: "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/apresentacoes/reforma-tributaria-do-consumo/live-piloto-dia-04_devolucoes-transferencias-e-ressarcimentos.pdf/@@download/file",
  dfe: "https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2026/julho/receita-federal-e-comite-gestor-do-ibs-publicam-o-cronograma-de-implementacao-dos-documentos-fiscais-eletronicos-da-reforma-tributaria-do-consumo",
  senado: "https://www12.senado.leg.br/noticias/materias/2026/10/26/reforma-tributaria-aliquota-da-cbs-avanca-nesta-semana",
  senadoTcu: "https://www12.senado.leg.br/noticias/materias/2026/10/28/reforma-tributaria-tcu-calcula-aliquota-da-cbs-em-11-3-para-2027",
  cgibs14: "https://www.cgibs.gov.br/upload/arquivos/202607/31144942-resoluc-ao-cgibs-n-14-de-29-de-julho-de-2026-proposta-percentual-ibs-cgibs-2027.pdf",
  ntFaz: "https://www.gov.br/fazenda/pt-br/central-de-conteudo/publicacoes/notas-informativas/2024/agosto/nota-tecnica-aliquotas-sertmf.pdf",
  sgs: "https://www3.bcb.gov.br/sgspub/",
  exame: "https://exame.com/economia/split-payment-adiado-nao-e-split-payment-esquecido-o-que-muda-no-caixa-e-nos-sistemas-das-empresas/"
};
const ref = (url, txt) => `<a href="${url}" target="_blank" rel="noopener">${txt} \u2197</a>`;
const lei = (a, t) => ref(U.lc214 + "#" + a, t);
const dec = (a, t) => ref(U.dec + "#" + a, t);
const MARCOS = [
  {
    fim: /* @__PURE__ */ new Date("2026-10-31T02:59:59Z"),
    rot: "Prazo para optar pelo regime regular de IBS/CBS (efeitos: jan\u2013jun/2027)",
    alvo: `Op\xE7\xE3o de <b>1\xBA/09 a 30/10/2026</b> no Portal do Simples Nacional (prazo prorrogado pela Resolu\xE7\xE3o CGSN 194/2026). Arrependeu? Cancela de <b>03/11 a 20/12/2026</b>. ` + ref(U.cgsn194, "Receita Federal"),
    lede: `E quem \xE9 do Simples Nacional tem at\xE9 <strong>30 de outubro de 2026</strong> (prazo prorrogado) para decidir se continua no <strong>Simples \u201Cpuro\u201D</strong> ou adota o <strong>regime h\xEDbrido</strong> em jan\u2013jun/2027 \u2014 quem n\xE3o optar permanece no puro.`
  },
  {
    fim: /* @__PURE__ */ new Date("2026-12-21T02:59:59Z"),
    rot: "Janela para cancelar a op\xE7\xE3o pelo regime regular (jan\u2013jun/2027)",
    alvo: `A op\xE7\xE3o para jan\u2013jun/2027 fechou em 30/10/2026. Quem optou pelo h\xEDbrido pode cancelar <b>de 03/11 a 20/12/2026</b> no Portal do Simples Nacional. ` + ref(U.cgsn194, "Receita Federal"),
    lede: `A op\xE7\xE3o do Simples para jan\u2013jun/2027 fechou em 30/10/2026 \u2014 quem optou pelo <strong>regime h\xEDbrido</strong> ainda pode cancelar at\xE9 <strong>20 de dezembro de 2026</strong>, e a pr\xF3xima janela \xE9 em <strong>mar\xE7o de 2027</strong>.`
  },
  {
    fim: /* @__PURE__ */ new Date("2027-04-01T02:59:59Z"),
    rot: "Pr\xF3xima janela: op\xE7\xE3o para o 2\xBA semestre de 2027",
    alvo: `Em <b>mar\xE7o/2027</b> quem \xE9 do Simples pode optar pelo regime regular (ou desistir dele) para jul\u2013dez/2027. Confira as datas exatas no Portal do Simples Nacional. ` + lei("art517", "LC 123, art. 13 \xA710"),
    lede: `Em <strong>mar\xE7o de 2027</strong>, quem \xE9 do Simples Nacional pode rever a escolha entre <strong>Simples \u201Cpuro\u201D</strong> e <strong>regime h\xEDbrido</strong> para o 2\xBA semestre.`
  },
  {
    fim: /* @__PURE__ */ new Date("2027-10-01T02:59:59Z"),
    rot: "Pr\xF3xima janela: op\xE7\xE3o para o 1\xBA semestre de 2028",
    alvo: `Em <b>setembro/2027</b> quem \xE9 do Simples pode optar pelo regime regular (ou desistir dele) para jan\u2013jun/2028. Confira as datas exatas no Portal do Simples Nacional. ` + lei("art517", "LC 123, art. 13 \xA710"),
    lede: `Em <strong>setembro de 2027</strong>, quem \xE9 do Simples Nacional pode rever a escolha entre <strong>Simples \u201Cpuro\u201D</strong> e <strong>regime h\xEDbrido</strong> para o 1\xBA semestre de 2028.`
  }
];
const MARCO_FINAL = {
  rot: "Janelas de op\xE7\xE3o do Simples Nacional",
  alvo: "A op\xE7\xE3o pelo regime regular de IBS/CBS acontece em mar\xE7o e setembro de cada ano. " + ref(U.portalSN, "Portal do Simples Nacional"),
  lede: "E quem \xE9 do Simples Nacional pode rever, a cada semestre, a escolha entre <strong>Simples \u201Cpuro\u201D</strong> e <strong>regime h\xEDbrido</strong>."
};
const marcoAtual = (now) => MARCOS.find((m) => now < m.fim) || null;
const opcaoAberta = (now) => now < MARCOS[0].fim;
const cancelAberto = (now) => now < MARCOS[1].fim;
function textoOpcao(now) {
  if (opcaoAberta(now)) return `Fa\xE7a a op\xE7\xE3o no Portal do Simples Nacional at\xE9 <b>30/10/2026</b> (prazo prorrogado pela Res. CGSN 194/2026)`;
  if (cancelAberto(now)) return `A janela para jan\u2013jun/2027 fechou em 30/10/2026: se voc\xEA j\xE1 optou, mantenha a op\xE7\xE3o (cancelar s\xF3 \xE9 poss\xEDvel at\xE9 20/12/2026); se n\xE3o optou, a pr\xF3xima chance \xE9 em <b>mar\xE7o/2027</b>, para jul\u2013dez`;
  return `A op\xE7\xE3o vale por semestre: decida em mar\xE7o (para jul\u2013dez) ou em setembro (para jan\u2013jun do ano seguinte)`;
}
function seloPrazo(now) {
  const prazo = opcaoAberta(now) ? "op\xE7\xE3o para jan\u2013jun/2027 at\xE9 30/10/2026 \xB7 cancelamento de 03/11 a 20/12/2026" : cancelAberto(now) ? "cancelamento da op\xE7\xE3o at\xE9 20/12/2026 \xB7 pr\xF3xima janela: mar\xE7o/2027" : "janelas de op\xE7\xE3o em mar\xE7o e setembro";
  return `\u21BB Revers\xEDvel a cada semestre (${lei("art517", "LC 123, art. 13 \xA710")}) \xB7 ${prazo} (${ref(U.cgsn194, "Res. CGSN 194/2026")}) \xB7 trava: quem recebeu ressarcimento de cr\xE9ditos n\xE3o volta ao puro (${dec("art41", "Decreto 12.955, art. 41 \xA75\xBA")})`;
}
const FAIXAS = {
  I: [{ max: 18e4, a: 4, d: 0 }, { max: 36e4, a: 7.3, d: 5940 }, { max: 72e4, a: 9.5, d: 13860 }, { max: 18e5, a: 10.7, d: 22500 }, { max: 36e5, a: 14.3, d: 87300 }, { max: 48e5, a: 19, d: 378e3, a2728: 18.9 }],
  II: [{ max: 18e4, a: 4.5, d: 0 }, { max: 36e4, a: 7.8, d: 5940 }, { max: 72e4, a: 10, d: 13860 }, { max: 18e5, a: 11.2, d: 22500 }, { max: 36e5, a: 14.7, d: 85500 }, { max: 48e5, a: 30, d: 72e4, a2728: 29.9 }],
  III: [{ max: 18e4, a: 6, d: 0 }, { max: 36e4, a: 11.2, d: 9360 }, { max: 72e4, a: 13.5, d: 17640 }, { max: 18e5, a: 16, d: 35640 }, { max: 36e5, a: 21, d: 125640 }, { max: 48e5, a: 33, d: 648e3, a2728: 32.9 }],
  IV: [{ max: 18e4, a: 4.5, d: 0 }, { max: 36e4, a: 9, d: 8100 }, { max: 72e4, a: 10.2, d: 12420 }, { max: 18e5, a: 14, d: 39780 }, { max: 36e5, a: 22, d: 183780 }, { max: 48e5, a: 33, d: 828e3, a2728: 32.9 }],
  V: [{ max: 18e4, a: 15.5, d: 0 }, { max: 36e4, a: 18, d: 4500 }, { max: 72e4, a: 19.5, d: 9900 }, { max: 18e5, a: 20.5, d: 17100 }, { max: 36e5, a: 23, d: 62100 }, { max: 48e5, a: 30.5, d: 54e4, a2728: 30.4 }]
};
const SHARE_IVA = {
  I: { 2027: [15.5, 15.5, 15.5, 15.5, 15.5, 34.02], 2029: [18.9, 18.9, 18.85, 18.85, 18.85, 34.4], 2030: [22.3, 22.3, 22.2, 22.2, 22.2, 34.4], 2031: [25.7, 25.7, 25.55, 25.55, 25.55, 34.4], 2032: [29.1, 29.1, 28.9, 28.9, 28.9, 34.4], 2033: [49.5, 49.5, 49, 49, 49, 34.4] },
  II: { 2027: [14, 14, 14, 14, 14, 25.22], 2029: [17.2, 17.2, 17.2, 17.2, 17.2, 25.5], 2030: [20.4, 20.4, 20.4, 20.4, 20.4, 25.5], 2031: [23.6, 23.6, 23.6, 23.6, 23.6, 25.5], 2032: [26.8, 26.8, 26.8, 26.8, 26.8, 25.5], 2033: [46, 46, 46, 46, 46, 25.5] },
  III: { 2027: [15.6, 17.1, 16.6, 16.6, 15.6, 19.29], 2029: [18.95, 20.3, 19.85, 19.85, 18.95, 19.5], 2030: [22.3, 23.5, 23.1, 23.1, 22.3, 19.5], 2031: [25.65, 26.7, 26.35, 26.35, 25.65, 19.5], 2032: [29, 29.9, 29.6, 29.6, 29, 19.5], 2033: [49.1, 49.1, 49.1, 49.1, 49.1, 19.5] },
  IV: { 2027: [21.5, 25, 24, 23, 22, 24.7], 2029: [25.95, 29, 28, 27, 26, 25], 2030: [30.4, 33, 32, 31, 30, 25], 2031: [34.85, 37, 36, 35, 34, 25], 2032: [39.3, 41, 40, 39, 38, 25], 2033: [66, 65, 64, 63, 62, 25] },
  V: { 2027: [17.15, 17.15, 18.15, 19.15, 17.15, 19.78], 2029: [18.55, 18.85, 20.05, 21.25, 19.5, 20], 2030: [19.95, 20.55, 21.95, 23.35, 21.85, 20], 2031: [21.35, 22.25, 23.85, 25.45, 24.2, 20], 2032: [22.75, 23.95, 25.75, 27.55, 26.55, 20], 2033: [31.15, 34.15, 37.15, 40.15, 40.65, 20] }
};
const FATOR_IBS = { 2027: 0, 2029: 0.1, 2030: 0.2, 2031: 0.3, 2032: 0.4, 2033: 1 };
const ANOS = [2027, 2029, 2030, 2031, 2032, 2033];
const REDUTOR = { padrao: 1, red30: 0.7, red60: 0.4, red40: 0.6, zero: 0 };
const NOME_CATEGORIA = { padrao: "al\xEDquota padr\xE3o", red30: "redu\xE7\xE3o de 30%", red60: "redu\xE7\xE3o de 60%", red40: "regime espec\xEDfico (hotelaria, bares e restaurantes, \u221240%)", zero: "al\xEDquota zero" };
const fmtBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtBRL2 = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (v, d = 1) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }) + "%";
const pctRec = (S, v) => S.fat > 0 ? fmtPct(v / S.fat * 100, 1) + " da receita" : "\u2014";
const parseBR = (s) => {
  const n = String(s).replace(/[^\d]/g, "");
  return n ? parseInt(n, 10) : 0;
};
function faixaDe(rbt12, anexo) {
  const t = FAIXAS[anexo];
  for (let i = 0; i < t.length; i++) if (rbt12 <= t[i].max) return i;
  return 5;
}
function anexoEfetivo(S) {
  if (S.atividade === "FR") {
    const r = S.rbt12 > 0 ? S.folha * 12 / S.rbt12 : 0;
    return { anexo: r >= 0.28 ? "III" : "V", fatorR: r, usaFatorR: true };
  }
  return { anexo: S.atividade, fatorR: null, usaFatorR: false };
}
function aliqEfetiva(rbt12, anexo, ano) {
  const i = faixaDe(rbt12, anexo);
  const f = FAIXAS[anexo][i];
  const nominal = ano < 2029 && f.a2728 !== void 0 ? f.a2728 : f.a;
  const ef = rbt12 > 0 ? Math.max(0, (rbt12 * nominal / 100 - f.d) / rbt12) : nominal / 100;
  return { ef, faixa: i, nominal };
}
function tIVA(S, ano) {
  const ibsRef = S.aliqRef - S.cbs27;
  return S.cbs27 + ibsRef * FATOR_IBS[ano];
}
function tIn(S, ano, categoria) {
  const t = tIVA(S, ano) * REDUTOR[categoria];
  return t / (100 + t);
}
const shareIVA = (anexo, ano, faixa) => SHARE_IVA[anexo][ano][faixa] / 100;
function cenarioSimples(S, ano) {
  const { anexo } = anexoEfetivo(S);
  const { ef, faixa } = aliqEfetiva(S.rbt12, anexo, ano);
  const share = shareIVA(anexo, ano, faixa);
  const ti = tIn(S, ano, S.categoria);
  const fat = S.fat;
  const dasPuro = ef * fat;
  const ivaDentroDAS = dasPuro * share;
  const credRepassePuro = S.categoria === "red40" ? 0 : ef * share;
  const dasHibrido = dasPuro * (1 - share);
  const debito = fat * ti;
  const credComprasRR = S.comprasRR * ti;
  const efForn = aliqEfetiva(5e5, "I", ano).ef;
  const credComprasSP = S.comprasSP * efForn * shareIVA("I", ano, 2);
  const creditos = credComprasRR + credComprasSP;
  const ivaLiq = Math.max(0, debito - creditos);
  const saldoCredor = Math.max(0, creditos - debito);
  const cargaHibrido = dasHibrido + ivaLiq;
  const credRepasseHibrido = S.categoria === "red40" ? 0 : ti;
  const descontoEmpate = Math.max(0, credRepasseHibrido - credRepassePuro);
  const fatB2BRR = fat * S.b2brr / 100;
  const pressaoB2B = fatB2BRR * descontoEmpate;
  const delta = cargaHibrido - dasPuro;
  return { ano, anexo, faixa, ef, share, ti, dasPuro, ivaDentroDAS, credRepassePuro, dasHibrido, debito, creditos, credComprasRR, credComprasSP, ivaLiq, saldoCredor, cargaHibrido, credRepasseHibrido, descontoEmpate, pressaoB2B, delta };
}
function cenarioRR(S, ano) {
  const ti = tIn(S, ano, S.categoria);
  const debito = S.fat * ti;
  const efForn = aliqEfetiva(5e5, "I", ano).ef;
  const creditos = S.comprasRR * ti + S.comprasSP * efForn * shareIVA("I", ano, 2);
  const ivaLiq = Math.max(0, debito - creditos);
  return { ano, ti, debito, creditos, ivaLiq, saldoCredor: Math.max(0, creditos - debito) };
}
function metricasCaixa(S, ivaMensal, cargaTotalMensal, ano) {
  const pctAlcance = ano <= 2028 ? S.eletronico / 100 * (1 - S.cartao / 100) * (S.b2brr / 100) : S.eletronico / 100;
  const alcancado = ivaMensal * pctAlcance;
  const floatEfetivo = Math.max(0, S.floatDias - S.prazoReceb);
  const jurosDia = S.juros / 100 / 30;
  const custoFloatMes = alcancado * floatEfetivo * jurosDia;
  const capitalGiro = alcancado * floatEfetivo / 30;
  const rm = S.fat > 0 ? custoFloatMes / S.fat : 0;
  const cfpPrazo = S.fat * (S.prazoReceb / 30) * (S.juros / 100);
  const ips = S.custoFixo > 0 ? (S.fat - cargaTotalMensal) / S.custoFixo : null;
  return { alcancado, pctAlcance, floatEfetivo, custoFloatMes, capitalGiro, rm, cfpPrazo, ips };
}
function veredictoSimples(S, c) {
  const beneficio = c.pressaoB2B;
  const custo = Math.max(0, c.delta);
  let rec = "cinza";
  if (c.delta <= 0) rec = "hibrido";
  else if (beneficio > custo * 1.15 && S.b2brr >= 30) rec = "hibrido";
  else if (S.b2brr < 20 || custo > beneficio * 1.5) rec = "puro";
  const deltaTxt = c.delta > 0 ? `O h\xEDbrido custa ${fmtBRL(custo)}/m\xEAs a mais em imposto, mas protege ${fmtBRL(beneficio)}/m\xEAs em competitividade B2B.` : `E o melhor: com seus cr\xE9ditos de compras, o h\xEDbrido j\xE1 custa ${fmtBRL(-c.delta)}/m\xEAs MENOS que o puro.`;
  return { rec, deltaTxt };
}
function veredictoSimplesFinal(S, now) {
  const c27 = cenarioSimples(S, 2027), c33 = cenarioSimples(S, 2033);
  const v27 = veredictoSimples(S, c27), v33 = veredictoSimples(S, c33);
  let tom, tit, txt;
  if (v27.rec === "hibrido" || v27.rec !== "puro" && v33.rec === "hibrido" && S.b2brr >= 35) {
    tom = "hibrido";
    tit = "O h\xEDbrido tende a ser o seu caminho \u2014 pelo cliente, n\xE3o pelo imposto.";
    txt = `No seu perfil, <b>${S.b2brr}% das vendas v\xE3o para empresas do regime regular</b>, que passar\xE3o a enxergar cr\xE9dito de IBS/CBS como desconto direto. No h\xEDbrido, voc\xEA repassa <b>${fmtPct(c27.credRepasseHibrido * 100, 1)}</b> de cr\xE9dito j\xE1 em 2027 (${fmtPct(c33.credRepasseHibrido * 100, 1)} em 2033); no puro, apenas <b>${fmtPct(c27.credRepassePuro * 100, 2)}</b>. ${v27.deltaTxt} ${textoOpcao(now)} \u2014 e reavalie a cada semestre.`;
  } else if (v27.rec === "puro" && (v33.rec === "puro" || S.b2brr < 20)) {
    tom = "puro";
    tit = "Fique no Simples puro \u2014 simplicidade est\xE1 a seu favor.";
    txt = `Com <b>${S.b2c}% das vendas para consumidor final</b> e s\xF3 ${S.b2brr}% para empresas do regime regular, o cr\xE9dito cheio do h\xEDbrido renderia pouco \u2014 e custaria caro: a carga subiria ${fmtBRL(Math.max(0, c27.delta))}/m\xEAs j\xE1 em 2027 (${fmtBRL(Math.max(0, c33.delta))}/m\xEAs no cen\xE1rio pleno de 2033). No puro, o IBS/CBS segue dentro do DAS, pago no dia 20 \u2014 e, na 1\xAA fase do split, suas vendas em regra ficam fora da reten\xE7\xE3o. N\xE3o precisa fazer nada: quem n\xE3o opta continua no puro automaticamente${!opcaoAberta(now) && cancelAberto(now) ? " (se voc\xEA j\xE1 optou pelo h\xEDbrido, ainda d\xE1 para cancelar at\xE9 20/12/2026)" : ""}. Reavalie se o seu mix B2B crescer.`;
  } else {
    tom = "cinza";
    tit = "Zona cinzenta: a conta muda com o tempo \u2014 decida semestre a semestre.";
    const saldo27 = c27.pressaoB2B - Math.max(0, c27.delta);
    const saldo33 = c33.pressaoB2B - Math.max(0, c33.delta);
    txt = `Em 2027 (quando s\xF3 a CBS pesa), ${saldo27 > 0 ? `o h\xEDbrido j\xE1 se paga: protege ${fmtBRL(c27.pressaoB2B)}/m\xEAs de competitividade B2B contra ${fmtBRL(Math.max(0, c27.delta))}/m\xEAs de custo extra` : `o puro ainda custa menos: o h\xEDbrido sairia ${fmtBRL(Math.max(0, c27.delta))}/m\xEAs mais caro para proteger ${fmtBRL(c27.pressaoB2B)}/m\xEAs de competitividade B2B`}; no cen\xE1rio pleno de 2033, ${saldo33 > 0 ? "a balan\xE7a vira para o h\xEDbrido" : "a disputa segue apertada"}. A boa not\xEDcia: a lei permite trocar de regime <b>a cada 6 meses</b> (decide em setembro para jan\u2013jun e em mar\xE7o para jul\u2013dez). Estrat\xE9gia sugerida: ${opcaoAberta(now) ? saldo27 > 0 ? "j\xE1 abra 2027 no h\xEDbrido (op\xE7\xE3o at\xE9 30/10/2026)" : "comece 2027 no puro" : saldo27 > 0 ? "avalie entrar no h\xEDbrido em mar\xE7o/2027, para jul\u2013dez" : "siga no puro no 1\xBA semestre de 2027"}, pergunte aos seus clientes PJ se v\xE3o exigir cr\xE9dito, e reavalie em mar\xE7o/2027 com seu contador.`;
  }
  return { tom, etiqueta: "Veredicto \xB7 regime de IBS/CBS em 2027", titulo: tit, texto: txt, selo: seloPrazo(now) };
}
const VEREDICTO_MEI = {
  tom: "info",
  etiqueta: "Veredicto \xB7 MEI",
  titulo: "Siga o jogo. Seu IBS/CBS ser\xE1 um valor fixo de poucos reais.",
  texto: `Pela LC 214/2025 (Anexo XXIII), o MEI recolhe IBS+CBS em valores fixos: <b>R$ 1,00/m\xEAs em 2027\u20132028</b>, subindo gradualmente at\xE9 <b>R$ 3,00/m\xEAs a partir de 2033</b> (substituindo o ICMS/ISS de hoje). N\xE3o h\xE1 op\xE7\xE3o de regime a fazer, a 1\xAA fase do split payment n\xE3o alcan\xE7a as suas vendas, e a novidade pr\xE1tica \xE9 a <b>nota fiscal no novo leiaute, com IBS/CBS</b>, a partir de janeiro/2027. ${lei("anexo23", "LC 214, Anexo XXIII")} ${ref(U.dfe, "cronograma das notas")}</p><p style="margin-top:12px">Fique atento a dois pontos: (1) se voc\xEA vende para <b>empresas</b>, elas passam a preferir fornecedores que repassem cr\xE9dito \u2014 o MEI repassa quase nada, o que pode pesar em contratos B2B grandes; (2) se seu faturamento est\xE1 crescendo perto do teto (R$ 81 mil/ano), a decis\xE3o puro \xD7 h\xEDbrido vai te alcan\xE7ar quando virar ME. A\xED, volte aqui e simule como Simples.`,
  selo: `IBS/CBS fixo: R$ 1/m\xEAs (2027) \u2192 R$ 3/m\xEAs (2033) \xB7 ${lei("anexo23", "Anexo XXIII, LC 214")}`
};
function veredictoRR(S) {
  const c27 = cenarioRR(S, 2027), c33 = cenarioRR(S, 2033);
  const nome = S.regime === "presumido" ? "Lucro Presumido" : "Lucro Real";
  const cargaAtualMes = S.fat * S.cargaAtual / 100;
  const delta33 = c33.ivaLiq - cargaAtualMes;
  return {
    tom: "info",
    etiqueta: "Veredicto \xB7 " + nome,
    titulo: "Para voc\xEA n\xE3o h\xE1 escolha de regime \u2014 h\xE1 um cronograma. Prepare o caixa.",
    texto: `Em 2027, PIS/Cofins somem e entra a CBS (CBS + IBS de ${fmtPct(S.cbs27, 2)} no cen\xE1rio que voc\xEA escolheu) com cr\xE9dito amplo \u2014 mas <b>ICMS/ISS continuam sendo pagos normalmente</b> at\xE9 2028 e s\xF3 caem gradualmente entre 2029 e 2032. Pelo seu perfil de compras, seu IVA l\xEDquido mensal ser\xE1 de <b>${fmtBRL(c27.ivaLiq)}</b> em 2027 (al\xE9m do ICMS/ISS remanescente), chegando a <b>${fmtBRL(c33.ivaLiq)}</b> no sistema pleno (2033), quando substitui de vez os ~${fmtBRL(cargaAtualMes)} que voc\xEA recolhe hoje de tributos de consumo \u2014 ${delta33 > 0 ? `uma <b>alta estimada de ${fmtBRL(delta33)}/m\xEAs</b> na compara\xE7\xE3o cheia` : `uma <b>queda estimada de ${fmtBRL(-delta33)}/m\xEAs</b> na compara\xE7\xE3o cheia`}. O impacto mais trai\xE7oeiro, por\xE9m, \xE9 o de <b>caixa</b>: \xE0 medida que o split for adotado, o imposto sai na liquida\xE7\xE3o de cada recebimento eletr\xF4nico, n\xE3o mais no dia 25.`,
    selo: `2027: facultativo entre empresas \xB7 2028: obrigat\xF3rio entre empresas (boleto, Pix, TED, TEF; vendas ao consumidor e cart\xF5es continuam fora) \xB7 etapa seguinte: cart\xF5es + B2C, data por ato conjunto da Receita Federal e do Comit\xEA Gestor do IBS \xB7 ${dec("art33", "Decreto 12.955, art. 33")}`
  };
}
function subtituloSimples(S) {
  const info = anexoEfetivo(S);
  const c27 = cenarioSimples(S, 2027);
  return `Anexo ${info.anexo}${info.usaFatorR ? ` (Fator R = ${fmtPct((info.fatorR ?? 0) * 100)})` : ""} \xB7 ${faixaDe(S.rbt12, info.anexo) + 1}\xAA faixa \xB7 al\xEDquota efetiva do DAS: <b>${fmtPct(c27.ef * 100, 2)}</b> \xB7 enquadramento IVA: <b>${NOME_CATEGORIA[S.categoria]}</b>` + (S.rbt12 > 48e5 ? ' \xB7 <b class="text-destructive">\u26A0 RBT12 acima do teto do Simples (R$ 4,8 mi) \u2014 valide a perman\xEAncia no regime com o contador</b>' : S.rbt12 > 36e5 ? ' \xB7 <b class="text-warning">\u26A0 acima do sublimite de R$ 3,6 mi: ICMS/ISS/IBS saem do DAS e s\xE3o pagos por fora \u2014 o comparativo simplifica esse ponto</b>' : "");
}
function notaComparador(S, c) {
  const d = c.delta;
  return `<b>Leitura do ano ${c.ano === 2027 ? "2027\u201328" : c.ano}:</b> ${d > 0 ? `o h\xEDbrido custa <b>${fmtBRL(d)}/m\xEAs</b> (${pctRec(S, d)}) a mais em tributo \u2014 esse \xE9 o \u201Cpre\xE7o\u201D de repassar cr\xE9dito cheio e aproveitar cr\xE9ditos.` : `o h\xEDbrido j\xE1 custa <b>${fmtBRL(-d)}/m\xEAs a menos</b> que o puro \u2014 os cr\xE9ditos das suas compras superam a diferen\xE7a de al\xEDquota.`}` + (S.categoria === "red40" ? ` <b>Aten\xE7\xE3o:</b> no regime espec\xEDfico de hotelaria, bares e restaurantes, seu cliente PJ n\xE3o pode apropriar cr\xE9dito \u2014 o argumento comercial do h\xEDbrido desaparece. ${lei("art283", "LC 214, arts. 276 e 283")}` : "") + (S.categoria === "zero" ? " <b>Aten\xE7\xE3o:</b> com al\xEDquota zero nas vendas, o h\xEDbrido gera d\xE9bito ~0 e transforma cr\xE9ditos de compras em ressarcimento \u2014 cen\xE1rio frequentemente vantajoso; valide o fluxo de ressarcimento com o contador." : "");
}
function notaCompet(S, c) {
  const descontoNecessario = c.descontoEmpate * 1e4;
  if (descontoNecessario > 1) return `Para empatar com um concorrente h\xEDbrido, no puro voc\xEA precisaria dar <b>${fmtPct(c.descontoEmpate * 100, 1)} de desconto</b> (${fmtBRL(descontoNecessario)} nessa venda). Aplicado aos seus ${fmtPct(S.b2brr, 0)} de vendas B2B, isso significa <b>${fmtBRL(c.pressaoB2B)}/m\xEAs</b> de margem em risco \u2014 compare com o custo extra do h\xEDbrido (${fmtBRL(Math.max(0, c.delta))}/m\xEAs) e a decis\xE3o vira matem\xE1tica.`;
  if (S.categoria === "red40") return `Na hotelaria, em bares e em restaurantes o cliente PJ n\xE3o toma cr\xE9dito em nenhum dos dois regimes \u2014 a guerra do cr\xE9dito n\xE3o te pressiona. ${lei("art283", "LC 214, arts. 276 e 283")}`;
  return "No seu enquadramento, a diferen\xE7a de cr\xE9dito entre puro e h\xEDbrido \xE9 pequena \u2014 a guerra do cr\xE9dito n\xE3o te pressiona.";
}
function subCaixaSimples(S, ano) {
  const fase1 = ano <= 2028;
  return `Cen\xE1rio <b>h\xEDbrido</b> no ano ${ano === 2027 ? "2027\u201328" : ano} \u2014 no puro, suas vendas em regra n\xE3o sofrem reten\xE7\xE3o. ${fase1 ? `<b>2027: facultativo entre empresas \xB7 2028: obrigat\xF3rio entre empresas</b> (vendas ao consumidor e cart\xF5es continuam fora): os n\xFAmeros abaixo s\xE3o o teto, se todo boleto/Pix/TED/TEF dos seus ${S.b2brr}% de vendas para PJ do regime regular passar pelo split. ${dec("art33", "Decreto 12.955, art. 33 \xA71\xBA")}` : `Daqui em diante o simulador assume o split em todos os recebimentos eletr\xF4nicos \u2014 entre empresas ele \xE9 obrigat\xF3rio a partir de 2028, segundo a Receita Federal (30/08/2026); a data para cart\xF5es e vendas ao consumidor ainda depende de ato conjunto RFB/CGIBS. ${ref(U.exame, "Exame, 30/09/2026")} ${ref(U.atos, "Atos conjuntos")}`}`;
}
const subCaixaRR = (S) => `Cen\xE1rio 2027\u201328 \u2014 <b>2027: facultativo entre empresas \xB7 2028: obrigat\xF3rio entre empresas</b> (vendas ao consumidor e cart\xF5es continuam fora): os n\xFAmeros abaixo s\xE3o o teto, se todo boleto/Pix/TED/TEF dos seus ${S.b2brr}% de vendas para PJ do regime regular passar pelo split. ${dec("art33", "Decreto 12.955, art. 33 \xA71\xBA")}`;
function recibo(S, V, ano) {
  let ti, retencao, regTxt, obs;
  if (S.regime === "simples") {
    const c = cenarioSimples(S, ano);
    ti = c.ti;
    const prop = c.debito > 0 ? c.ivaLiq / c.debito : 0;
    retencao = V * ti * prop;
    regTxt = "Simples H\xCDBRIDO";
    obs = "No PURO: em regra, reten\xE7\xE3o R$ 0 (IBS/CBS no DAS). No h\xEDbrido, o procedimento padr\xE3o desconta o que j\xE1 foi quitado \u2014 reten\xE7\xE3o estimada l\xEDquida.";
  } else if (S.regime === "mei") {
    ti = 0;
    retencao = 0;
    regTxt = "MEI";
    obs = "MEI n\xE3o sofre split payment.";
  } else {
    const c = cenarioRR(S, ano);
    ti = c.ti;
    const prop = c.debito > 0 ? c.ivaLiq / c.debito : 0;
    retencao = V * ti * prop;
    regTxt = S.regime === "presumido" ? "Lucro Presumido" : "Lucro Real";
    obs = "Reten\xE7\xE3o l\xEDquida estimada (o procedimento padr\xE3o desconta o que j\xE1 foi quitado).";
  }
  if (ano <= 2028 && S.regime !== "mei") obs += " 2027: facultativo entre empresas \xB7 2028: obrigat\xF3rio entre empresas (vendas ao consumidor e cart\xF5es continuam fora). A reten\xE7\xE3o s\xF3 alcan\xE7a pagamentos por boleto, Pix, TED ou TEF.";
  obs += ` Excessos retornam em at\xE9 3 dias \xFAteis (procedimento padr\xE3o) ou at\xE9 3 dias \xFAteis ap\xF3s o fechamento da apura\xE7\xE3o (simplificado) \u2014 e no simplificado seu cliente PJ n\xE3o toma cr\xE9dito do valor retido. ${lei("art32", "LC 214, arts. 32\u201333")}`;
  return { ti, retencao, regTxt, obs, destaque: V * ti, liquido: V - retencao };
}
function plano(tipo, now) {
  const a = [];
  if (tipo === "mei") {
    a.push(["AGORA", "Organize a emiss\xE3o de notas", "A partir de 01/01/2027 as notas fiscais do Simples Nacional passam ao novo leiaute, com IBS/CBS. Confirme com seu app/emissor que ele estar\xE1 pronto em janeiro para n\xE3o travar vendas.", ref(U.dfe, "cronograma das notas")]);
    a.push(["AGORA", "Se estiver perto do teto, simule como ME", "Faturando perto de R$ 81 mil/ano? O desenquadramento te joga na decis\xE3o puro \xD7 h\xEDbrido. Simule antes, n\xE3o depois."]);
    a.push(["2027", "Acompanhe seus clientes PJ", "Se contratos B2B relevantes come\xE7arem a exigir cr\xE9dito de IBS/CBS, avalie migrar de MEI para ME h\xEDbrido com seu contador."]);
  } else if (tipo === "simples") {
    a.push(["AGORA", "Valide este diagn\xF3stico com seu contador", "Leve este relat\xF3rio impresso. Pe\xE7a a ele: al\xEDquota efetiva exata, partilha do seu anexo, e o impacto do ISS do seu munic\xEDpio.", lei("anexo18", "tabelas: LC 214, Anexos XVIII\u2013XXII")]);
    a.push(["AGORA", "Pergunte aos seus 5 maiores clientes PJ", "\u201CVoc\xEAs v\xE3o exigir cr\xE9dito de IBS/CBS dos fornecedores em 2027?\u201D A resposta deles vale mais que qualquer planilha \u2014 e define a urg\xEAncia do h\xEDbrido.", lei("art47", "cr\xE9dito: LC 214, art. 47")]);
    if (opcaoAberta(now)) a.push(["AT\xC9 30/10/2026", "Fa\xE7a (ou n\xE3o) a op\xE7\xE3o no Portal do Simples", "A op\xE7\xE3o pelo regime regular de IBS/CBS para jan\u2013jun/2027 \xE9 feita no Portal do Simples Nacional \u2014 prazo prorrogado pela Resolu\xE7\xE3o CGSN 194/2026. Sem op\xE7\xE3o = puro autom\xE1tico.", ref(U.portalSN, "Portal do Simples") + " " + ref(U.cgsn194, "Receita Federal")]);
    if (cancelAberto(now)) a.push(["03/11 A 20/12/2026", "Arrependeu? Cancele a op\xE7\xE3o", "Quem optou pelo h\xEDbrido pode cancelar nessa janela, em car\xE1ter irretrat\xE1vel. Depois disso, a escolha vale para todo o 1\xBA semestre de 2027.", ref(U.cgsn194, "Receita Federal")]);
    a.push(["AT\xC9 DEZ/2026", "Prepare o caixa para o cen\xE1rio escolhido", "Se h\xEDbrido: monte reserva equivalente \xE0 reten\xE7\xE3o mensal estimada e renegocie prazos com fornecedores. Se puro: recalcule pre\xE7os B2B considerando o desconto de empate."]);
    a.push(["JAN/2027", "Ajuste o ERP/emissor para o IBS/CBS", "A partir de 01/01/2027 as notas do Simples seguem o novo leiaute com IBS/CBS. No h\xEDbrido, informe o IBS/CBS tamb\xE9m no boleto/Pix: quando o split estiver valendo para o seu meio de pagamento, pagamento sem esses valores cai no procedimento simplificado \u2014 e a\xED seu cliente PJ n\xE3o toma cr\xE9dito do valor retido. Na fase 1 (2027), sem os campos preenchidos o pagamento s\xF3 segue sem split.", ref(U.dfe, "cronograma das notas") + " " + lei("art33", "LC 214, art. 33 \xA7\xA72\xBA-A e 7\xBA")]);
    a.push(["MAR/2027", "Reavalie para o 2\xBA semestre", "Em mar\xE7o voc\xEA pode optar pelo regime regular (ou desistir dele) para jul\u2013dez/2027. Repita esta simula\xE7\xE3o com n\xFAmeros reais de janeiro e fevereiro.", lei("art517", "LC 123, art. 13 \xA710")]);
  } else {
    a.push(["AGORA", "Rode um teste de estresse de caixa", "Simule seu fluxo de 2027 retirando o IVA l\xEDquido em D+0 de cada recebimento. O n\xFAmero do capital de giro a repor est\xE1 acima \u2014 confirme se sua reserva cobre."]);
    a.push(["AT\xC9 DEZ/2026", "Revise contratos longos", "Insira cl\xE1usulas de repasse tribut\xE1rio e reequil\xEDbrio econ\xF4mico-financeiro para absorver a varia\xE7\xE3o de al\xEDquotas 2027\u20132033."]);
    a.push(["AT\xC9 DEZ/2026", "Adeque ERP e cadastros", "Destaque exato de IBS/CBS na NF-e (viabiliza o split padr\xE3o) e revis\xE3o de NCM/NBS para capturar redu\xE7\xF5es de 30%/60%/zero.", lei("art125", "redu\xE7\xF5es: LC 214, arts. 125 a 144")]);
    a.push(["2027", "Decida se adere ao split facultativo", "Em 2027 o split entre empresas \xE9 facultativo; em 2028 fica obrigat\xF3rio entre empresas (vendas ao consumidor e cart\xF5es continuam fora). Seu cliente s\xF3 toma cr\xE9dito quando o seu d\xE9bito \xE9 extinto \u2014 e o split faz isso na hora. Em combust\xEDveis, pagar pelo split ainda afasta a responsabilidade solid\xE1ria do comprador. Avalie com o contador.", lei("art47", "LC 214, art. 47") + " " + lei("art177", "art. 177 \xA71\xBA")]);
    a.push(["2027+", "Reprecifique com o RM", "Aplique o repasse m\xEDnimo calculado acima nos reajustes de tabela \u2014 pequenos % que preservam sua margem quando o float sumir."]);
  }
  return a;
}
function premissas(S) {
  return [
    ["Al\xEDquota de refer\xEAncia IBS+CBS (pleno)", fmtPct(S.aliqRef, 1) + " (ajust\xE1vel)", "Ainda n\xE3o fixada. Com a CBS calculada pelo TCU (11,3%) e o IBS estimado pelo Comit\xEA Gestor (18,7%), a soma projetada fica em ~30%; a estimativa inicial da Fazenda era 26,5%. " + ref(U.cgibs14, "Res. CGIBS 14/2026") + " " + ref(U.ntFaz, "Nota t\xE9cnica Fazenda") + " " + ref(U.senadoTcu, "Ag\xEAncia Senado, 28/10/2026"), "est"],
    ["Prazo para fixar a al\xEDquota da CBS de 2027", "TCU aprovou em 28/10/2026 (11,3%) \xB7 Senado fixa at\xE9 15/12/2026", "Se o Senado n\xE3o deliberar at\xE9 15/12/2026, vale o c\xE1lculo do TCU a partir de 1\xBA/01/2027. " + lei("art349", "LC 214, art. 349") + " " + ref(U.senadoTcu, "Ag\xEAncia Senado"), "def"],
    ["CBS + IBS 2027\u201328", fmtPct(S.cbs27, 2) + " (ajust\xE1vel; TCU: 11,30%)", "Refer\xEAncia da CBS calculada pelo TCU em 28/10/2026: 11,3% (11,3468%). Em 2027\u201328 a CBS \xE9 a refer\xEAncia menos 0,1 p.p. (11,2%) e o IBS soma 0,05% estadual + 0,05% municipal \u2014 total de 11,3%. A Fazenda estimava 9,21%. Falta a fixa\xE7\xE3o pelo Senado at\xE9 15/12/2026. " + lei("art347", "LC 214, art. 347") + " " + ref(U.adct + "#adctart127", "ADCT, art. 127") + " " + ref(U.senadoTcu, "Ag\xEAncia Senado"), "def"],
    ["Transi\xE7\xE3o IBS", "10%\u219240% (2029\u201332), 100% em 2033", ref(U.adct + "#adctart128", "ADCT, arts. 128\u2013129"), "conf"],
    ["Tabelas e partilha do Simples (2027\u20132033)", "Anexos XVIII\u2013XXII", "Parcela CBS+IBS do DAS por faixa, na reda\xE7\xE3o da LC 227/2026 \u2014 os 180 valores usados conferem com a lei. " + lei("anexo18", "LC 214, Anexos XVIII\u2013XXII"), "conf"],
    ["MEI: IBS/CBS em valor fixo", "R$ 1,00/m\xEAs (2027\u201328) \u2192 R$ 3,00/m\xEAs (2033)", lei("anexo23", "LC 214, Anexo XXIII"), "conf"],
    ["Cr\xE9dito na compra de Simples puro", "IBS/CBS efetivamente pago no DAS", lei("art47", "LC 214, art. 47 \xA79\xBA II"), "conf"],
    ["Op\xE7\xE3o pelo h\xEDbrido (jan\u2013jun/2027)", "1\xBA/09 a 30/10/2026 \xB7 cancelamento de 03/11 a 20/12/2026", "Prazo original (30/09) prorrogado pela Resolu\xE7\xE3o CGSN 194/2026. " + ref(U.cgsn194, "Receita Federal") + " " + ref(U.portalSN, "Portal do Simples"), "conf"],
    ["Semestralidade da op\xE7\xE3o", "mar\xE7o (vale jul\u2013dez) e setembro (vale jan\u2013jun)", lei("art517", "LC 123, art. 13 \xA710, red. LC 227 (via LC 214, art. 517)"), "conf"],
    ["Trava do ressarcimento", "quem recebeu ressarcimento de cr\xE9ditos n\xE3o volta ao puro", dec("art41", "Decreto 12.955, art. 41 \xA75\xBA"), "conf"],
    ["Split payment 2027\u201328 (fase 1)", "2027: facultativo entre empresas \xB7 2028: obrigat\xF3rio entre empresas \xB7 boleto/Pix/TED/TEF, proc. padr\xE3o", dec("art33", "Decreto 12.955, art. 33 \xA71\xBA") + " " + ref(U.manual, "Manual CGIBS (fase 1 \u201CB2B Opcional\u201D)"), "conf"],
    ["In\xEDcio da fase 1 e obrigatoriedade do split", "facultativo em 2027 e obrigat\xF3rio entre empresas a partir de 2028, segundo a Receita Federal (30/08/2026)", "An\xFAncio da Receita, ainda sem norma publicada; a formaliza\xE7\xE3o depende de ato conjunto RFB/CGIBS. " + ref(U.exame, "Exame, 30/09/2026") + " " + lei("art35", "LC 214, art. 35") + " " + ref(U.atos, "Atos T\xE9cnicos Conjuntos"), "def"],
    ["Cart\xF5es, vouchers e vendas ao consumidor (B2C)", "s\xF3 na etapa seguinte", dec("art28", "Decreto 12.955, art. 28 \xA75\xBA") + " " + dec("art33", "art. 33 \xA72\xBA"), "def"],
    ["Alcance do split no simulador", "2027\u201328: vendas a PJ regular, sem cart\xF5es \xB7 2029+: todo recebimento eletr\xF4nico", "Premissa do simulador: teto da fase 1; de 2029 em diante, cen\xE1rio pleno hipot\xE9tico. " + dec("art33", "Decreto 12.955, art. 33"), "est"],
    ["Simples puro e o split", "fase 1: em regra sem reten\xE7\xE3o \xB7 depois: em defini\xE7\xE3o", "Na fase 1 o split s\xF3 ocorre com o IBS/CBS informado no pagamento. " + ref(U.manual, "Manual CGIBS, se\xE7\xF5es 1.2 e 3.1") + " " + dec("art33", "Decreto, art. 33 \xA72\xBA"), "def"],
    ["Devolu\xE7\xE3o de reten\xE7\xF5es a maior", "3 dias \xFAteis (padr\xE3o) / 3 dias \xFAteis ap\xF3s a apura\xE7\xE3o (simplificado)", lei("art32", "LC 214, art. 32 \xA74\xBA") + " " + lei("art33", "art. 33 \xA74\xBA") + " " + ref(U.devol, "Receita Federal"), "conf"],
    ["Simplificado n\xE3o gera cr\xE9dito ao cliente PJ", "cr\xE9dito vedado sobre o valor retido", lei("art33", "LC 214, art. 33 \xA77\xBA II"), "conf"],
    ["Combust\xEDveis: split afasta a solidariedade", "o comprador deixa de responder pelo imposto", lei("art177", "LC 214, art. 177 \xA71\xBA I"), "conf"],
    ["Redu\xE7\xF5es setoriais", "30% profiss\xF5es \xB7 60% sa\xFAde/educa\xE7\xE3o/alimentos/cultura/eventos \xB7 zero cesta b\xE1sica e dispositivos m\xE9dicos", lei("art125", "LC 214, arts. 125, 127, 128 e 144"), "conf"],
    ["Hotelaria, bares, restaurantes e parques", "redu\xE7\xE3o de 40% \xB7 cliente PJ n\xE3o toma cr\xE9dito", lei("art273", "LC 214, arts. 275\u2013276 e 281\u2013283"), "conf"],
    ["Notas fiscais do Simples com IBS/CBS", "a partir de 01/01/2027", ref(U.dfe, "Cronograma RFB/CGIBS"), "conf"],
    ["Custo do dinheiro (capital de giro PJ)", fmtPct(S.juros, 1) + " a.m. (ajust\xE1vel)", "Refer\xEAncia de mercado: ~1,7\u20132,1% a.m. " + ref(U.sgs, "BCB, s\xE9ries SGS 20722 e 25441"), "est"],
    ["Float atual at\xE9 a guia", S.floatDias + " dias (ajust\xE1vel)", "Vencimentos usuais: DAS dia 20 \xB7 PIS/Cofins dia 25 \xB7 ICMS ~dia 10\u201320. Ajuste ao seu caso.", "est"],
    ["Cr\xE9dito de compras de fornecedor Simples", "Anexo I, 3\xAA faixa como proxy", "Simplifica\xE7\xE3o do simulador \u2014 refine com dados reais", "est"],
    ["Teto de 5% do ISS (5\xAA faixa dos servi\xE7os)", "n\xE3o modelado", "Simplifica\xE7\xE3o \u2014 afeta s\xF3 as faixas altas dos Anexos III e IV. " + lei("anexo20", "LC 214, Anexos XX\u2013XXI (nota)"), "est"],
    ["Sublimite de R$ 3,6 mi (ICMS/ISS/IBS por fora do DAS)", "sinalizado, n\xE3o calculado", "LC 123, art. 13-A, na reda\xE7\xE3o dada pela LC 214 \u2014 simplifica\xE7\xE3o. " + lei("art517", "LC 214, art. 517"), "est"]
  ];
}
export {
  ANOS,
  CBS_2027_PADRAO,
  DEFAULT_STATE,
  FAIXAS,
  MARCOS,
  MARCO_FINAL,
  NOME_CATEGORIA,
  SHARE_IVA,
  STORAGE_KEY,
  U,
  VEREDICTO_MEI,
  aliqEfetiva,
  anexoEfetivo,
  cenarioRR,
  cenarioSimples,
  faixaDe,
  fmtBRL,
  fmtBRL2,
  fmtPct,
  marcoAtual,
  metricasCaixa,
  notaComparador,
  notaCompet,
  parseBR,
  pctRec,
  plano,
  premissas,
  recibo,
  ref,
  seloPrazo,
  subCaixaRR,
  subCaixaSimples,
  subtituloSimples,
  tIVA,
  tIn,
  textoOpcao,
  veredictoRR,
  veredictoSimples,
  veredictoSimplesFinal
};
