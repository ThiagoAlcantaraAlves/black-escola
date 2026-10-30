// Situação de cada pessoa e a mensagem sugerida. Os mesmos textos estão na view
// black_bot_fila do hub (motelaria-hub/supabase/migrations/20261030180000_*.sql),
// que é o que o assistente lê: mude os dois juntos.
const LINK = 'https://black.escolademotelaria.com.br/app/';

export function situacao(l) {
  if (l.na_frente) return 'na_frente';
  if (!l.proxima) return 'em_dia';
  return l.proxima === 'pesquisa' ? 'falta_pesquisa' : 'falta_' + l.proxima;
}

export const NOME_SITUACAO = {
  na_frente: 'Na frente', em_dia: 'Em dia', falta_pesquisa: 'Falta a pesquisa', falta_video: 'Falta o vídeo',
  falta_escala: 'Falta a escala', falta_preco: 'Falta o preço', falta_revpar: 'Falta o RevPAR', falta_imposto: 'Falta o imposto',
  falta_comunidade: 'Falta a comunidade', falta_indicacao: 'Falta a indicação', falta_live: 'Falta confirmar a live',
};

export function mensagem(l) {
  const n = (l.nome || '').split(' ')[0];
  return {
    pesquisa: `${n}, falta só a pesquisa de 2 minutos para liberar o vídeo da conta de 2027 e o seu Raio-X. É por aqui: ${LINK}`,
    video: `${n}, o vídeo da conta de 2027 já está liberado na sua área. Vale ver o trecho da escala e o da reforma tributária: ${LINK}`,
    escala: `${n}, abriu a conta da escala: em 2 minutos você vê quanto o fim da 6x1 soma à folha do seu motel nos três caminhos. ${LINK}`,
    preco: `${n}, quanto o seu fim de semana deveria custar? Abriu na sua área a sugestão de reajuste pelo protocolo de preço da Escola. ${LINK}`,
    revpar: `${n}, onde o seu motel fica no RevPAR do seu estado? Coloca faturamento e suítes e vê na hora: ${LINK}`,
    imposto: `${n}, o imposto em 2027 pesa ou ajuda o seu motel? Abriu na sua área o radar da reforma tributária com o que levar ao contador. ${LINK}`,
    comunidade: `${n}, o link da Black chega primeiro na comunidade. Se ainda não entrou, é por aqui: ${LINK}`,
    indicacao: `${n}, quem decide junto com você? Indicando o sócio ou o gerente na sua área, você ganha uma vaga extra no sorteio do MotelMind Floripa 2027. ${LINK}`,
    live: `${n}, confirma a sua presença na live de segunda, 23/11, às 17h? É um clique na sua área: ${LINK}`,
  }[l.proxima] || `${n}, tudo certo por aí? O link da Black chega no domingo, 22/11. Qualquer dúvida, é só responder aqui.`;
}
