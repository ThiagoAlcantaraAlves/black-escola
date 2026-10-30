// Gerado de motelaria-hub/src/lib/simuladorEscala.ts (commit 1386990) com esbuild. Não editar aqui: mude no hub e gere de novo.
const STORAGE_KEY = "motelmind-simulador-5x2-v2";
const EXAMPLE = {
  nome: "Motel Exemplo",
  fat: 3e5,
  regime: "normal",
  benef: 500,
  faltas: 3,
  dobra: 1400,
  mp: 60,
  rows: [
    { nome: "Gerente", pessoas: 1, salario: 5250, tipo: "fixo", hoje: 0, dem: 0, mp: false, x12: false },
    { nome: "Recep\xE7\xE3o", pessoas: 4, salario: 1980, tipo: "turnos", hoje: 21, dem: 21, mp: false, x12: true },
    { nome: "Camareiras", pessoas: 8, salario: 1790, tipo: "turnos", hoje: 48, dem: 45, mp: false, x12: false },
    { nome: "Governanta", pessoas: 1, salario: 2290, tipo: "fixo", hoje: 0, dem: 0, mp: false, x12: false },
    { nome: "Cozinha", pessoas: 2, salario: 1920, tipo: "turnos", hoje: 12, dem: 12, mp: true, x12: false },
    { nome: "Lavanderia", pessoas: 1, salario: 1730, tipo: "fixo", hoje: 0, dem: 0, mp: false, x12: false },
    { nome: "Manuten\xE7\xE3o", pessoas: 1, salario: 2350, tipo: "fixo", hoje: 0, dem: 0, mp: false, x12: false }
  ]
};
const BLANK = {
  nome: "",
  fat: 0,
  regime: "simples",
  benef: 500,
  faltas: 3,
  dobra: 0,
  mp: 60,
  rows: [
    { nome: "Recep\xE7\xE3o", pessoas: 0, salario: 0, tipo: "turnos", hoje: 21, dem: 21, mp: false, x12: true },
    { nome: "Camareiras", pessoas: 0, salario: 0, tipo: "turnos", hoje: 0, dem: 0, mp: false, x12: false },
    { nome: "Gerente", pessoas: 1, salario: 0, tipo: "fixo", hoje: 0, dem: 0, mp: false, x12: false }
  ]
};
const clone = (o) => JSON.parse(JSON.stringify(o));
function num(v) {
  const n = parseFloat(String(v));
  return isFinite(n) ? n : 0;
}
const brl = (n) => "R$ " + Math.round(n).toLocaleString("pt-BR");
const pct = (n, d = 1) => (n >= 0 ? "+" : "") + n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }) + "%";
const dec = (n) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const WEEKS = 30 / 7;
const F13 = 1 + 1 / 12 + 4 / 3 / 12;
const PATRONAL = 0.275;
function custoPessoa(sal, s) {
  const enc = 0.08 + (s.regime === "normal" ? PATRONAL : 0);
  return Math.max(0, num(sal)) * F13 * (1 + enc) + Math.max(0, num(s.benef));
}
const regimeLabel = (s) => s.regime === "normal" ? "Presumido ou Real" : "Simples Nacional (Anexo III)";
function planShifts(pessoas, turnos, aceitaMP) {
  if (turnos <= 0 || pessoas * 5 >= turnos) return { total: pessoas, mp: 0, cap: pessoas * 5 };
  const full = Math.floor(turnos / 5), rem = turnos - full * 5;
  if (rem === 0) return { total: full, mp: 0, cap: full * 5 };
  if (aceitaMP && rem <= 3) return { total: full, mp: 1, cap: full * 5 + rem };
  return { total: full + 1, mp: 0, cap: (full + 1) * 5 };
}
function compute(s) {
  const faltas = Math.max(0, num(s.faltas)) / 100, mpPct = Math.max(0, num(s.mp)) / 100;
  const z = () => ({ hires: 0, mps: 0, extra: 0, horas: 0, pessoas: 0 });
  const out = { pessoas: 0, folha: 0, sc: { A: z(), B: z(), C: z() }, rows: [] };
  const gap = (cap, need, h) => Math.max(0, need * faltas - Math.max(0, cap - need)) * h * WEEKS;
  for (const r of s.rows) {
    const p = Math.max(0, Math.round(num(r.pessoas))), c = custoPessoa(r.salario, s);
    out.pessoas += p;
    out.folha += p * c;
    const row = {
      nome: r.nome || "Sem nome",
      hoje: p,
      A: { n: p, mp: 0, how: "" },
      B: { n: p, mp: 0, how: "" },
      C: { n: p, mp: 0, how: "" }
    };
    if (r.tipo === "turnos") {
      const th = Math.max(0, num(r.hoje)), td = Math.max(0, num(r.dem));
      const nA = th > 0 ? Math.max(p, Math.ceil(th / 5 - 1e-9)) : p;
      row.A = { n: nA, mp: 0, how: th > 0 ? `${dec(th)} \xF7 5 = ${dec(th / 5)}` : "" };
      const b = planShifts(p, td, !!r.mp);
      row.B = { n: b.total, mp: b.mp, how: td > 0 ? `${dec(td)} \xF7 5 = ${dec(td / 5)}` : "" };
      let cap, need, h;
      if (r.x12 && td > 0) {
        const plant = td * 8 / 12, nC = Math.max(p, Math.ceil(plant / 3.5 - 1e-9));
        row.C = { n: nC, mp: 0, how: `12x36: ${dec(plant)} plant\xF5es \xF7 3,5 = ${dec(plant / 3.5)}` };
        cap = nC * 3.5;
        need = plant;
        h = 12;
      } else {
        row.C = { n: b.total, mp: b.mp, how: row.B.how };
        cap = b.cap;
        need = td;
        h = 8;
      }
      out.sc.A.horas += gap(nA * 5, td || th, 8);
      out.sc.B.horas += gap(b.cap, td, 8);
      out.sc.C.horas += gap(cap, need, h);
      ["A", "B", "C"].forEach((k) => {
        const it = row[k], hires = Math.max(0, it.n - p);
        out.sc[k].hires += hires;
        out.sc[k].mps += it.mp;
        out.sc[k].extra += hires * c + it.mp * c * mpPct;
      });
    }
    out.rows.push(row);
  }
  ["A", "B", "C"].forEach((k) => out.sc[k].pessoas = out.pessoas + out.sc[k].hires);
  return out;
}
function teamLabel(s, cap = true) {
  return (s.hires ? `+${s.hires}${s.hires === 1 ? " pessoa" : " pessoas"}` : cap ? "Sem contrata\xE7\xE3o" : "sem contrata\xE7\xE3o") + (s.mps ? ` e ${s.mps}${s.mps === 1 ? " meio per\xEDodo" : " meios per\xEDodos"}` : "");
}
function bestScenario(r) {
  const ks = ["A", "B", "C"];
  if (ks.every((k) => r.sc[k].extra === 0)) return null;
  return ks.reduce((m, k) => r.sc[k].extra < r.sc[m].extra ? k : m, "A");
}
function summary(s, r) {
  const fat = num(s.fat), dobra = Math.max(0, num(s.dobra));
  const line = (t, sc) => {
    const who = (sc.hires ? `+${sc.hires}${sc.hires === 1 ? " pessoa" : " pessoas"}` : "sem contrata\xE7\xE3o") + (sc.mps ? ` e ${sc.mps} meio per\xEDodo` : "");
    return `${t}: ${who}, +${brl(sc.extra)}/m\xEAs (${r.folha > 0 ? pct(sc.extra / r.folha * 100) : "\u2014"})` + (dobra > 0 ? `; com a dobra de domingo zerada, +${brl(Math.max(0, sc.extra - dobra))}` : "");
  };
  return [
    `Simulador da Escala 5x2 \xB7 ${s.nome || "meu motel"}`,
    `Hoje: ${r.pessoas} pessoas, folha de ${brl(r.folha)}` + (fat > 0 ? ` (${(r.folha / fat * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% da receita)` : "") + ` \xB7 ${regimeLabel(s)}`,
    line("A \xB7 N\xE3o mexer", r.sc.A),
    line("B \xB7 Ajuste", r.sc.B),
    line("C \xB7 Ajuste bem feito", r.sc.C),
    `Faltas de ${dec(num(s.faltas))}%: horas sem ningu\xE9m por m\xEAs \u2248 A ${Math.round(r.sc.A.horas)}h, B ${Math.round(r.sc.B.horas)}h, C ${Math.round(r.sc.C.horas)}h`,
    "Simula\xE7\xE3o para planejamento (EC 141/2026). Confirme com o contador e o advogado trabalhista."
  ].join("\n");
}
function countdownText(now) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = 864e5;
  const d1 = Math.round((new Date(2026, 11, 16).getTime() - today.getTime()) / day);
  const d2 = Math.round((new Date(2027, 11, 16).getTime() - today.getTime()) / day);
  if (d1 > 0) return `Faltam ${d1}${d1 === 1 ? " dia" : " dias"} para as duas folgas (16/12/2026)`;
  if (d2 > 0) return `Duas folgas em vigor \xB7 faltam ${d2} dias para as 40h (16/12/2027)`;
  return "Duas folgas e 40h em vigor";
}
export {
  BLANK,
  EXAMPLE,
  STORAGE_KEY,
  bestScenario,
  brl,
  clone,
  compute,
  countdownText,
  custoPessoa,
  dec,
  num,
  pct,
  planShifts,
  regimeLabel,
  summary,
  teamLabel
};
