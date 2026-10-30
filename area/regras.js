// Regras da Jornada da Black 2026. O banco (função black_pontos) usa os mesmos números.
export const PASSOS = [
  { id: 'boas_vindas', titulo: 'Boas-vindas à área da Black', pontos: 10, libera: null },
  { id: 'pesquisa', titulo: 'Responder a pesquisa do seu motel', pontos: 30, libera: 'Vídeo preparatório para a Black' },
  { id: 'video', titulo: 'Assistir o vídeo preparatório', pontos: 20, libera: 'Kit 2027 (brinde)', exige: 'pesquisa' },
  { id: 'comunidade', titulo: 'Entrar na comunidade do WhatsApp', pontos: 10, libera: null },
  { id: 'indicacao', titulo: 'Indicar um sócio ou gerente', pontos: 20, libera: 'Brinde extra' },
];

export const PONTOS_RESPOSTA = {
  intencao: { quero: 30, talvez: 15, olhando: 0 },
  motel_qtd: { '1': 0, '2-3': 20, '4+': 20 },
  cargo: { dono: 10, socio: 10, gerente: 0, outro: 0 },
};

export function pontuar(feitos, pesquisa) {
  let total = PASSOS.filter((p) => feitos.includes(p.id)).reduce((s, p) => s + p.pontos, 0);
  if (pesquisa) {
    for (const campo of Object.keys(PONTOS_RESPOSTA)) total += PONTOS_RESPOSTA[campo][pesquisa[campo]] ?? 0;
  }
  return total;
}

export function faixa(pontos) {
  if (pontos >= 80) return 'quente';
  if (pontos >= 40) return 'morno';
  return 'frio';
}

export function podeFazer(passoId, feitos) {
  const passo = PASSOS.find((p) => p.id === passoId);
  return !!passo && (!passo.exige || feitos.includes(passo.exige));
}
