// Regras da Jornada da Black 2026 (doc 33). O banco usa os mesmos números
// (drizzle/migrations/0001_jornada_lead_scoring.sql): mude os dois juntos.

const BRT = (s) => new Date(s + '-03:00');

export const DATAS = {
  naFrenteAte: BRT('2026-11-20T23:59:59'),
  linkNaFrente: BRT('2026-11-22T15:00:00'),
  linkLista: BRT('2026-11-22T17:00:00'),
  live: BRT('2026-11-23T17:00:00'),
};

// As 8 tarefas que contam para o nível + vídeo e live, que só pontuam.
export const TAREFAS = [
  { id: 'boas_vindas', titulo: 'Boas-vindas', desc: 'Você entrou na área. Primeiro passo feito.', eng: 5, conta: true },
  { id: 'pesquisa', titulo: 'Raio-X 2027', desc: 'Responda 8 perguntas rápidas sobre o seu motel. Libera o vídeo da conta de 2027 e o seu Raio-X.', eng: 5, conta: true },
  { id: 'video', titulo: 'Vídeo: a conta de 2027', desc: 'A live com o Vinicius Roveda e o Thiago Alcântara sobre escala, imposto e IA.', eng: 8, exige: 'pesquisa' },
  { id: 'escala', titulo: 'A conta da escala', desc: 'Quanto o fim da 6x1 soma à folha do seu motel, em três caminhos.', eng: 4, ferramenta: true, conta: true, exige: 'pesquisa', abre: BRT('2026-11-05T00:00:00') },
  { id: 'preco', titulo: 'O preço do fim de semana', desc: 'A sugestão de reajuste pelo protocolo de preço da Escola.', eng: 4, ferramenta: true, conta: true, exige: 'pesquisa', abre: BRT('2026-11-09T00:00:00') },
  { id: 'revpar', titulo: 'Seu RevPAR no estado', desc: 'Onde o seu motel fica na régua do seu estado.', eng: 4, ferramenta: true, conta: true, exige: 'pesquisa', abre: BRT('2026-11-09T00:00:00') },
  { id: 'imposto', titulo: 'O imposto em 2027', desc: 'Se a reforma tributária pesa ou ajuda o seu motel, e o que levar ao contador.', eng: 4, ferramenta: true, conta: true, exige: 'pesquisa', abre: BRT('2026-11-12T00:00:00') },
  { id: 'comunidade', titulo: 'Comunidade Black 2026', desc: 'O link da oferta chega lá primeiro.', eng: 5, conta: true },
  { id: 'indicacao', titulo: 'Traga o seu sócio', desc: '1 indicado que se cadastrar: vaga extra no sorteio do MotelMind Floripa 2027. 3 indicados: 15 minutos com o Thiago.', eng: 5, conta: true },
  { id: 'live', titulo: 'Confirme a live de 23/11', desc: 'Segunda, 23/11, às 17h: a nova Escola e a abertura da Black.', eng: 6, abre: BRT('2026-11-16T00:00:00') },
];

export const PERGUNTAS = [
  { id: 'suites_faixa', texto: 'Quantas suítes o seu motel tem? Se tiver mais de um, some todos.', op: [['<15', 'Até 14', 0], ['15-24', '15 a 24', 6], ['25-39', '25 a 39', 12], ['40+', '40 ou mais', 12]] },
  { id: 'motel_qtd', texto: 'Quantos motéis você opera?', op: [['1', '1', 0], ['2-5', '2 a 5', 8], ['6+', '6 ou mais', 8], ['vai_abrir', 'Ainda vou abrir', -10]] },
  { id: 'papel', texto: 'Qual o seu papel no motel?', op: [['dono_socio', 'Dono ou sócio', 10], ['gerente', 'Gerente', 4], ['outro', 'Outro', 0]] },
  { id: 'faturamento', texto: 'Quanto o motel faturou em 2025, mais ou menos?', op: [['<1', 'Até R$ 1 milhão', 0], ['1-2', 'R$ 1 a 2 milhões', 5], ['2-4', 'R$ 2 a 4 milhões', 10], ['4+', 'Mais de R$ 4 milhões', 10], ['nao_dizer', 'Prefiro não dizer', 3]] },
  { id: 'decisao', texto: 'Qual decisão você mais quer acertar nos próximos 60 dias?', op: [['preco', 'Preço e tabela', 0], ['reforma', 'Reforma ou nova suíte', 0], ['escala', 'Escala e equipe para 2027', 0], ['imposto', 'Imposto e reforma tributária', 0], ['marketing', 'Marketing e ocupação', 0]] },
  { id: 'como_decide', texto: 'Como você decide hoje?', op: [['feeling', 'No sentimento', 0], ['planilhas', 'Em planilha', 0], ['sistema', 'Com sistema e relatório', 0], ['equipe_metodo', 'Com equipe e método', 0]] },
  { id: 'relacao', texto: 'Qual a sua relação com a Escola?', op: [['nunca', 'Nunca fui aluno', 0], ['ex_aluno', 'Já fui aluno', 0], ['aluno', 'Sou aluno hoje', 0], ['motelmind', 'Sou do MotelMind', 0]] },
  { id: 'como_entrar', texto: 'Se a Black trouxer o que você precisa para 2027, como prefere entrar?', op: [['conhecer', 'Quero conhecer a Escola primeiro', 0], ['anual', 'Plano de 1 ano', 5], ['tres_anos', 'Plano de 3 anos com o hub', 10], ['nao_momento', 'Ainda não é o momento', -5]] },
];
export const PERGUNTA_ABERTA = { id: 'pergunta_live', texto: 'Que pergunta, se respondida na live de 23/11, faria a live valer a pena para você? (opcional)' };

export function perfil(resp) {
  if (!resp) return 0;
  const t = PERGUNTAS.reduce((s, p) => s + (p.op.find((o) => o[0] === resp[p.id])?.[2] ?? 0), 0);
  return Math.max(0, Math.min(50, t));
}

export function engajamento(feitos, visitas = 1, diasParado = 0) {
  let t = 0, fer = 0;
  for (const tf of TAREFAS) if (feitos.includes(tf.id)) tf.ferramenta ? (fer += tf.eng) : (t += tf.eng);
  t += Math.min(12, fer) + Math.min(4, 2 * Math.max(0, visitas - 1));
  if (diasParado > 7) t -= 5;
  return Math.max(0, Math.min(50, t));
}

export function faixa(p, e) {
  if (p >= 30 && e >= 25) return 'prioridade';
  if (p >= 30) return 'acelerar';
  if (e >= 25) return 'nutrir';
  return 'base';
}

export const contam = TAREFAS.filter((t) => t.conta).map((t) => t.id);

export function nivel(feitosComData, agora = new Date()) {
  const ok = (id) => feitosComData[id];
  const total = contam.filter(ok).length;
  const noPrazo = contam.filter((id) => ok(id) && new Date(feitosComData[id]) <= DATAS.naFrenteAte).length;
  if (noPrazo >= 6) return 'na_frente';
  return total >= 3 ? 'pronto' : 'preparado';
}

/** livre: pode fazer agora · trancada: falta o pré-requisito · agendada: abre numa data */
export function estado(tarefaId, feitos, agora = new Date()) {
  const t = TAREFAS.find((x) => x.id === tarefaId);
  if (!t) return 'invalida';
  if (feitos.includes(t.id)) return 'feita';
  if (t.abre && agora < t.abre) return 'agendada';
  if (t.exige && !feitos.includes(t.exige)) return 'trancada';
  return 'livre';
}

export const NOME_NIVEL = { preparado: 'Preparado', pronto: 'Pronto', na_frente: 'Na frente' };
export const dataCurta = (d) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' });

// ───────────── painel da equipe ─────────────
export const tituloTarefa = (id) => TAREFAS.find((t) => t.id === id)?.titulo ?? id ?? '';
export const dataHoraBrasilia = (iso) => iso
  ? new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '';
export const COLUNAS_CSV_EQUIPE = ['nome', 'email', 'whatsapp', 'faixa', 'pontos', 'tarefas_concluidas', 'proxima_tarefa', 'ultimo_acesso', 'dias_parado', 'pesquisa_respondida'];
/** Uma linha do "Exportar CSV" do painel, a partir do que black_painel devolve. */
export function linhaCsvEquipe(l) {
  const feitas = (l.feitas || []).map((f) => tituloTarefa(f.passo)).join(', ');
  return {
    nome: l.nome, email: l.email, whatsapp: l.whatsapp, faixa: l.faixa, pontos: l.pontos,
    tarefas_concluidas: feitas,
    proxima_tarefa: l.proxima ? tituloTarefa(l.proxima) : 'Em dia',
    ultimo_acesso: dataHoraBrasilia(l.ultimo_acesso),
    dias_parado: l.dias_parado ?? 0,
    pesquisa_respondida: (l.feitas || []).some((f) => f.passo === 'pesquisa') ? 'sim' : 'não',
  };
}
