// src/lib/mock-data.ts
// Dados de demonstração — 12 crianças brasileiras com sessões e evoluções realistas.
// IDs fixos garantem consistência em qualquer dispositivo (seed idempotente).
// Datas calculadas a partir de junho/2026.

import type { Crianca, Sessao, Evolucao } from '@/types';

// ── Crianças ────────────────────────────────────────────────────────────────

export const CRIANCAS_MOCK: Crianca[] = [
  {
    id: 'mock-c01',
    nome: 'Ana Beatriz Santos',
    apelido: 'Bia',
    dataNascimento: '2016-06-16', // aniversário HOJE (10 anos)
    genero: 'F',
    status: 'ativo',
    escola: 'E.M. Professora Maria Aparecida',
    turma: '5A',
    serie: '5º ano',
    turno: 'tarde',
    professorRegente: 'Professora Cláudia Mendes',
    diagnosticos: ['TEA'],
    cids: ['F84.0'],
    dataInicioAcompanhamento: '2024-02-05',
    responsaveis: [
      { nome: 'Marta Santos', parentesco: 'Mãe', telefone: '(11) 98765-4321', responsavelLegal: true },
      { nome: 'Roberto Santos', parentesco: 'Pai', telefone: '(11) 98111-2233', responsavelLegal: false },
    ],
    observacoesImportantes: 'Sensível a barulhos altos. Usar fones de abafamento nas atividades coletivas.',
    medicamentos: ['Risperidona 0,5mg'],
  },
  {
    id: 'mock-c02',
    nome: 'Lucas Pereira Costa',
    dataNascimento: '2018-06-16', // aniversário HOJE (8 anos)
    genero: 'M',
    status: 'ativo',
    escola: 'E.M. Santos Dumont',
    turma: '3B',
    serie: '3º ano',
    turno: 'manhã',
    professorRegente: 'Professor André Lima',
    diagnosticos: ['TDAH'],
    cids: ['F90.0'],
    dataInicioAcompanhamento: '2024-08-12',
    responsaveis: [
      { nome: 'Carla Costa', parentesco: 'Mãe', telefone: '(11) 97654-3210', responsavelLegal: true },
    ],
  },
  {
    id: 'mock-c03',
    nome: 'Mariana Oliveira Silva',
    dataNascimento: '2013-06-17', // aniversário amanhã (13 anos)
    genero: 'F',
    status: 'ativo',
    escola: 'E.M. Rui Barbosa',
    turma: '8B',
    serie: '8º ano',
    turno: 'tarde',
    professorRegente: 'Professora Fernanda Queiroz',
    diagnosticos: ['Dislexia'],
    cids: ['F81.0'],
    dataInicioAcompanhamento: '2023-03-20',
    responsaveis: [
      { nome: 'Sandra Silva', parentesco: 'Mãe', telefone: '(11) 96543-2109', responsavelLegal: true },
    ],
  },
  {
    id: 'mock-c04',
    nome: 'Pedro Henrique Almeida',
    dataNascimento: '2019-06-20', // aniversário daqui 4 dias (7 anos)
    genero: 'M',
    status: 'ativo',
    escola: 'E.M. Professora Maria Aparecida',
    turma: '2A',
    serie: '2º ano',
    turno: 'integral',
    professorRegente: 'Professora Bianca Rocha',
    diagnosticos: ['Síndrome de Down'],
    cids: ['Q90.0'],
    dataInicioAcompanhamento: '2024-03-01',
    responsaveis: [
      { nome: 'Fernanda Almeida', parentesco: 'Mãe', telefone: '(11) 95432-1098', responsavelLegal: true },
      { nome: 'Diego Almeida', parentesco: 'Pai', telefone: '(11) 95111-9988', responsavelLegal: true },
    ],
    observacoesImportantes: 'Fisioterapia às quartas. Não realizar atividades de alta intensidade física no mesmo dia.',
  },
  {
    id: 'mock-c05',
    nome: 'Sophia Rodrigues Ferreira',
    dataNascimento: '2015-06-22', // aniversário em 6 dias (11 anos)
    genero: 'F',
    status: 'ativo',
    escola: 'E.M. Santos Dumont',
    turma: '6A',
    serie: '6º ano',
    turno: 'manhã',
    professorRegente: 'Professor Carlos Vidal',
    diagnosticos: ['Deficiência Auditiva'],
    cids: ['H90.3'],
    dataInicioAcompanhamento: '2023-08-14',
    responsaveis: [
      { nome: 'Paulo Ferreira', parentesco: 'Pai', telefone: '(11) 94321-0987', responsavelLegal: true },
    ],
    observacoesImportantes: 'Usa AASI bilateral. Priorizar posicionamento frontal para leitura labial.',
  },
  {
    id: 'mock-c06',
    nome: 'Gabriel Monteiro Souza',
    dataNascimento: '2017-09-03',
    genero: 'M',
    status: 'ativo',
    escola: 'E.M. Rui Barbosa',
    turma: '4C',
    serie: '4º ano',
    turno: 'tarde',
    professorRegente: 'Professora Luciana Torres',
    diagnosticos: ['TEA', 'Ansiedade'],
    cids: ['F84.0', 'F41.1'],
    dataInicioAcompanhamento: '2024-05-06',
    responsaveis: [
      { nome: 'Beatriz Souza', parentesco: 'Mãe', telefone: '(11) 93210-9876', responsavelLegal: true },
    ],
    medicamentos: ['Fluoxetina 10mg'],
  },
  {
    id: 'mock-c07',
    nome: 'Isabella Castro Pinto',
    dataNascimento: '2014-03-14',
    genero: 'F',
    status: 'ativo',
    escola: 'E.M. Professora Maria Aparecida',
    turma: '7A',
    serie: '7º ano',
    turno: 'manhã',
    professorRegente: 'Professor Henrique Barros',
    diagnosticos: ['TDAH', 'Dislexia'],
    cids: ['F90.0', 'F81.0'],
    dataInicioAcompanhamento: '2023-02-28',
    responsaveis: [
      { nome: 'Ana Castro', parentesco: 'Mãe', telefone: '(11) 92109-8765', responsavelLegal: true },
    ],
  },
  {
    id: 'mock-c08',
    nome: 'Miguel Barbosa Nunes',
    dataNascimento: '2019-11-28',
    genero: 'M',
    status: 'ativo',
    escola: 'E.M. Santos Dumont',
    turma: '1B',
    serie: '1º ano',
    turno: 'integral',
    professorRegente: 'Professora Rita Vieira',
    diagnosticos: ['Síndrome de Down'],
    cids: ['Q90.0'],
    dataInicioAcompanhamento: '2024-09-02',
    responsaveis: [
      { nome: 'Priscila Nunes', parentesco: 'Mãe', telefone: '(11) 91098-7654', responsavelLegal: true },
    ],
    observacoesImportantes: 'Fonoaudiologia às terças. Cardiopatia congênita leve — acompanhamento cardiológico semestral.',
  },
  {
    id: 'mock-c09',
    nome: 'Laura Fernandes Batista',
    dataNascimento: '2012-07-05',
    genero: 'F',
    status: 'inativo',
    escola: 'E.M. Rui Barbosa',
    turma: '9A',
    serie: '9º ano',
    turno: 'tarde',
    professorRegente: 'Professor Sandro Neves',
    diagnosticos: ['Deficiência Visual'],
    cids: ['H54.0'],
    dataInicioAcompanhamento: '2023-04-10',
    responsaveis: [
      { nome: 'Roberto Batista', parentesco: 'Pai', telefone: '(11) 90987-6543', responsavelLegal: true },
    ],
    observacoesImportantes: 'Mudança de cidade — encaminhada para serviço de AEE na nova escola.',
  },
  {
    id: 'mock-c10',
    nome: 'Thiago Lima Gomes',
    dataNascimento: '2018-02-22',
    genero: 'M',
    status: 'ativo',
    escola: 'E.M. Santos Dumont',
    turma: '3A',
    serie: '3º ano',
    turno: 'manhã',
    professorRegente: 'Professora Simone Araújo',
    diagnosticos: ['Deficiência Intelectual'],
    cids: ['F70'],
    dataInicioAcompanhamento: '2024-04-15',
    responsaveis: [
      { nome: 'Rosana Gomes', parentesco: 'Mãe', telefone: '(11) 89876-5432', responsavelLegal: true },
    ],
  },
  {
    id: 'mock-c11',
    nome: 'Valentina Rocha Cruz',
    dataNascimento: '2016-04-08',
    genero: 'F',
    status: 'espera',
    escola: 'E.M. Professora Maria Aparecida',
    turma: '5B',
    serie: '5º ano',
    turno: 'tarde',
    diagnosticos: ['TEA'],
    cids: ['F84.0'],
    dataInicioAcompanhamento: '2026-05-20',
    responsaveis: [
      { nome: 'Camila Cruz', parentesco: 'Mãe', telefone: '(11) 88765-4321', responsavelLegal: true },
    ],
    observacoesImportantes: 'Aguardando vaga. Avaliação psicológica concluída em maio/2026.',
  },
  {
    id: 'mock-c12',
    nome: 'Enzo Carvalho Moreira',
    dataNascimento: '2021-01-15',
    genero: 'M',
    status: 'espera',
    escola: 'EMEI Girassol',
    turma: 'Infantil 5',
    serie: 'Educação Infantil',
    turno: 'manhã',
    diagnosticos: ['Suspeita TEA'],
    cids: ['F84.5'],
    dataInicioAcompanhamento: '2026-06-01',
    responsaveis: [
      { nome: 'Juliana Moreira', parentesco: 'Mãe', telefone: '(11) 87654-3210', responsavelLegal: true },
      { nome: 'Felipe Moreira', parentesco: 'Pai', telefone: '(11) 87111-0099', responsavelLegal: false },
    ],
  },
];

// ── Sessões ──────────────────────────────────────────────────────────────────

export const SESSOES_MOCK: Sessao[] = [
  // Ana Beatriz (c01) — sessões em maio e junho/2026
  { id: 'mock-s01', criancaId: 'mock-c01', data: '2026-05-06', hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Trabalhamos comunicação aumentativa. Ana usou o prancha de comunicação com autonomia por 20 min.', evolucaoObservada: 'Melhora perceptível na iniciativa comunicativa.' },
  { id: 'mock-s02', criancaId: 'mock-c01', data: '2026-05-13', hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Atividade de pareamento e identificação de emoções com cartões ilustrados.' },
  { id: 'mock-s03', criancaId: 'mock-c01', data: '2026-05-20', hora: '14:00', duracao: 50, tipo: 'individual', presente: false, motivoFalta: 'Criança com febre', anotacoes: '' },
  { id: 'mock-s04', criancaId: 'mock-c01', data: '2026-05-27', hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Retomada após falta. Boa disposição, completou todas as atividades propostas.' },
  { id: 'mock-s05', criancaId: 'mock-c01', data: '2026-06-03', hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Iniciamos trabalho com rotina visual. Ana demonstrou preferência pelo layout de imagens maiores.' },
  { id: 'mock-s06', criancaId: 'mock-c01', data: '2026-06-10', hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Sessão de orientação para família — discutidas estratégias para generalizar rotina visual em casa.', evolucaoObservada: 'Família engajada. Mãe relatou redução de crises em momentos de transição.' },

  // Lucas (c02) — sessões em maio e junho/2026
  { id: 'mock-s07', criancaId: 'mock-c02', data: '2026-05-05', hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Trabalhamos autorregulação com técnica de semáforo emocional. Lucas adorou a atividade.' },
  { id: 'mock-s08', criancaId: 'mock-c02', data: '2026-05-12', hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Jogos de atenção sustentada — conseguiu manter foco por 15 min consecutivos (recorde!).' },
  { id: 'mock-s09', criancaId: 'mock-c02', data: '2026-05-19', hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Estratégias de organização escolar — pasta colorida por matéria. Professora André relatou melhora.' },
  { id: 'mock-s10', criancaId: 'mock-c02', data: '2026-06-02', hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Retomada pós-feriado. Revisão das estratégias de atenção, Lucas as aplicou bem.' },
  { id: 'mock-s11', criancaId: 'mock-c02', data: '2026-06-09', hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Trabalhamos impulsividade em situações sociais com role-play.' },

  // Mariana (c03) — sessões regulares
  { id: 'mock-s12', criancaId: 'mock-c03', data: '2026-05-07', hora: '15:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Técnicas de decodificação fonológica. Mariana identificou todos os fonemas-alvo.' },
  { id: 'mock-s13', criancaId: 'mock-c03', data: '2026-05-14', hora: '15:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Leitura com texto adaptado — ampliação de fonte e espaçamento. Fluência aumentando.' },
  { id: 'mock-s14', criancaId: 'mock-c03', data: '2026-05-21', hora: '15:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Trabalhamos produção textual com mapa mental. Texto coeso e bem estruturado.' },
  { id: 'mock-s15', criancaId: 'mock-c03', data: '2026-05-28', hora: '15:00', duracao: 45, tipo: 'individual', presente: false, motivoFalta: 'Consulta médica', anotacoes: '' },
  { id: 'mock-s16', criancaId: 'mock-c03', data: '2026-06-04', hora: '15:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Preparação para prova bimestral — estratégias de leitura de enunciados.' },
  { id: 'mock-s17', criancaId: 'mock-c03', data: '2026-06-11', hora: '15:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Devolutiva pós-prova. Mariana acertou 80% — melhor desempenho do ano!', evolucaoObservada: 'Avanço significativo na fluência leitora e autoconfiança.' },

  // Pedro Henrique (c04) — muito ativo
  { id: 'mock-s18', criancaId: 'mock-c04', data: '2026-05-05', hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Atividades de encaixe e coordenação fina. Pedro completou 3 puzzles de 12 peças.' },
  { id: 'mock-s19', criancaId: 'mock-c04', data: '2026-05-12', hora: '10:00', duracao: 40, tipo: 'grupo', presente: true, anotacoes: 'Sessão em grupo com Miguel. Brincadeiras de turno — ambos aguardaram sua vez com sucesso.' },
  { id: 'mock-s20', criancaId: 'mock-c04', data: '2026-05-19', hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Linguagem receptiva e expressiva. Pedro nomeou 15 objetos do cotidiano corretamente.' },
  { id: 'mock-s21', criancaId: 'mock-c04', data: '2026-05-26', hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Pré-escrita — traçado de linhas e círculos. Demonstrou boa coordenação para a idade.' },
  { id: 'mock-s22', criancaId: 'mock-c04', data: '2026-06-02', hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Reconhecimento de cores e formas. Pedro identificou todos os 8 cores básicas.' },
  { id: 'mock-s23', criancaId: 'mock-c04', data: '2026-06-09', hora: '10:00', duracao: 40, tipo: 'familiar', presente: true, anotacoes: 'Orientação para família — atividades de estimulação para o fim de semana.', evolucaoObservada: 'Família muito participativa. Fernanda relatou que Pedro está se comunicando mais em casa.' },
  { id: 'mock-s24', criancaId: 'mock-c04', data: '2026-06-16', hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Sessão do aniversário! Comemoramos com atividade especial de memória. Pedro encantou a todos.' },

  // Sophia (c05)
  { id: 'mock-s25', criancaId: 'mock-c05', data: '2026-05-06', hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Trabalho de leitura labial em contexto de sala de aula simulada.' },
  { id: 'mock-s26', criancaId: 'mock-c05', data: '2026-05-13', hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Treinamento auditivo com AASI — discriminação de pares mínimos.' },
  { id: 'mock-s27', criancaId: 'mock-c05', data: '2026-05-20', hora: '08:30', duracao: 50, tipo: 'orientacao', presente: true, anotacoes: 'Orientação ao professor Carlos sobre estratégias em sala para Sophia.' },
  { id: 'mock-s28', criancaId: 'mock-c05', data: '2026-05-27', hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Habilidades sociais comunicativas — iniciação e manutenção de conversa.' },
  { id: 'mock-s29', criancaId: 'mock-c05', data: '2026-06-03', hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Compreensão de texto escrito — estratégias de inferência.' },
  { id: 'mock-s30', criancaId: 'mock-c05', data: '2026-06-10', hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Produção de texto descritivo. Sophia escreveu 3 parágrafos coesos.' },

  // Gabriel (c06)
  { id: 'mock-s31', criancaId: 'mock-c06', data: '2026-05-07', hora: '15:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Trabalho com regulação sensorial — caixa sensorial com materiais de diferentes texturas.' },
  { id: 'mock-s32', criancaId: 'mock-c06', data: '2026-05-14', hora: '15:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Habilidades sociais — identificação de expressões faciais com jogos de cartas.' },
  { id: 'mock-s33', criancaId: 'mock-c06', data: '2026-05-21', hora: '15:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Flexibilidade cognitiva com mudanças planejadas de atividade. Gabriel tolerou bem.' },
  { id: 'mock-s34', criancaId: 'mock-c06', data: '2026-06-04', hora: '15:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Comunicação funcional — solicitar ajuda de forma adequada. Bom progresso.' },
  { id: 'mock-s35', criancaId: 'mock-c06', data: '2026-06-11', hora: '15:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Trabalho com interesses restritos como ponte para novas aprendizagens (tema: dinossauros).', evolucaoObservada: 'Interesse por dinossauros sendo usado como veículo para habilidades de leitura e matemática.' },

  // Isabella (c07) — última sessão há mais de 15 dias para teste de alerta
  { id: 'mock-s36', criancaId: 'mock-c07', data: '2026-04-24', hora: '08:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Técnicas de organização — planejador visual semanal.' },
  { id: 'mock-s37', criancaId: 'mock-c07', data: '2026-05-08', hora: '08:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Decodificação fonológica avançada com texto de nível de série.' },
  { id: 'mock-s38', criancaId: 'mock-c07', data: '2026-05-15', hora: '08:00', duracao: 45, tipo: 'individual', presente: false, motivoFalta: 'Viagem escolar', anotacoes: '' },
  { id: 'mock-s39', criancaId: 'mock-c07', data: '2026-05-22', hora: '08:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Estratégias de estudo para ENEM (Isabella está no 7º ano mas já demonstra interesse). Ótima sessão.' },

  // Miguel (c08)
  { id: 'mock-s40', criancaId: 'mock-c08', data: '2026-05-05', hora: '10:30', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Estimulação de linguagem oral com músicas e rimas. Miguel repetiu 5 palavras novas.' },
  { id: 'mock-s41', criancaId: 'mock-c08', data: '2026-05-12', hora: '10:30', duracao: 40, tipo: 'grupo', presente: true, anotacoes: 'Grupo com Pedro H. Cooperação em jogos simples de turno.' },
  { id: 'mock-s42', criancaId: 'mock-c08', data: '2026-05-19', hora: '10:30', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Pré-alfabetização — reconhecimento de letras do próprio nome.' },
  { id: 'mock-s43', criancaId: 'mock-c08', data: '2026-05-26', hora: '10:30', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Coordenação motora fina — pintura e recorte com tesoura.' },
  { id: 'mock-s44', criancaId: 'mock-c08', data: '2026-06-09', hora: '10:30', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Contagem de objetos até 5. Miguel demonstrou compreensão da correspondência um-a-um.' },
  { id: 'mock-s45', criancaId: 'mock-c08', data: '2026-06-16', hora: '10:30', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Atividade de categorização por cor e forma. Excelente desempenho!' },

  // Laura (c09) — inativa, última sessão em abril
  { id: 'mock-s46', criancaId: 'mock-c09', data: '2026-03-10', hora: '15:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Adaptação de materiais digitais para ampliação. Laura usou lupa eletrônica com facilidade.' },
  { id: 'mock-s47', criancaId: 'mock-c09', data: '2026-03-24', hora: '15:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Orientação de mobilidade — trajeto escola para sala de recursos.' },
  { id: 'mock-s48', criancaId: 'mock-c09', data: '2026-04-07', hora: '15:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Última sessão antes da mudança. Encaminhamentos realizados. Laura emocionada e agradecida.' },

  // Thiago (c10)
  { id: 'mock-s49', criancaId: 'mock-c10', data: '2026-05-06', hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Conceitos matemáticos básicos com material concreto (palitos e tampinhas).' },
  { id: 'mock-s50', criancaId: 'mock-c10', data: '2026-05-13', hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Leitura de palavras simples com apoio de imagens. Thiago reconheceu 10 palavras-chave.' },
  { id: 'mock-s51', criancaId: 'mock-c10', data: '2026-05-20', hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Atividades de vida diária — sequenciação de rotina matinal com pictogramas.' },
  { id: 'mock-s52', criancaId: 'mock-c10', data: '2026-05-27', hora: '09:30', duracao: 50, tipo: 'individual', presente: false, motivoFalta: 'Ausência sem justificativa', anotacoes: '' },
  { id: 'mock-s53', criancaId: 'mock-c10', data: '2026-06-03', hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Escrita do próprio nome com modelo. Thiago escreve as 6 letras com apoio visual.' },
  { id: 'mock-s54', criancaId: 'mock-c10', data: '2026-06-10', hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Habilidades sociais — cumprimentar e pedir licença. Professora Simone relatou generalização em sala!' },
  { id: 'mock-s55', criancaId: 'mock-c10', data: '2026-06-16', hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Contagem, identificação de numerais e operações simples com apoio concreto.', evolucaoObservada: 'Thiago está generalizando habilidades para sala de aula com sucesso.' },

  // Valentina (c11) — em espera, apenas avaliação inicial
  { id: 'mock-s56', criancaId: 'mock-c11', data: '2026-05-21', hora: '14:00', duracao: 60, tipo: 'individual', presente: true, anotacoes: 'Avaliação inicial — aplicação de instrumentos de triagem. Valentina colaborativa.' },
  { id: 'mock-s57', criancaId: 'mock-c11', data: '2026-06-04', hora: '14:00', duracao: 60, tipo: 'familiar', presente: true, anotacoes: 'Devolutiva da avaliação para família. Encaminhamentos realizados. Aguarda vaga no serviço.' },

  // Enzo (c12) — em espera, primeiro contato
  { id: 'mock-s58', criancaId: 'mock-c12', data: '2026-06-03', hora: '09:00', duracao: 30, tipo: 'familiar', presente: true, anotacoes: 'Primeiro contato com família. Anamnese realizada. Criança observada em ambiente livre.' },
];

// ── Evoluções ────────────────────────────────────────────────────────────────

export const EVOLUCOES_MOCK: Evolucao[] = [
  // Ana Beatriz (c01)
  {
    id: 'mock-e01', criancaId: 'mock-c01', data: '2026-03-31',
    periodo: '1º Trimestre 2026',
    areas: ['Comunicação', 'Rotina', 'Autonomia'],
    descricao: 'Ana demonstrou evolução significativa no uso da prancha de comunicação. Já consegue expressar necessidades básicas de forma independente. Início do trabalho com rotina visual apresentou resultados positivos — redução de crises em momentos de transição.',
    proximosPassos: 'Expandir vocabulário da prancha. Introduzir sequência de rotina mais complexa. Envolver irmã mais velha nas estratégias em casa.',
  },
  {
    id: 'mock-e02', criancaId: 'mock-c01', data: '2026-06-10',
    periodo: '1º Semestre 2026',
    areas: ['Comunicação', 'Regulação Sensorial', 'Interação Social'],
    descricao: 'Avanços expressivos em todas as áreas. A rotina visual foi totalmente incorporada por Ana e pela família. Participação em atividades em grupo melhorou — tolera presença de 3 colegas sem sinais de sobrecarga sensorial. Uso espontâneo da prancha em casa.',
    proximosPassos: 'Introduzir comunicação com colegas de sala. Trabalhar transições não planejadas.',
  },

  // Lucas (c02)
  {
    id: 'mock-e03', criancaId: 'mock-c02', data: '2026-06-09',
    periodo: '1º Semestre 2026',
    areas: ['Atenção', 'Autorregulação', 'Organização Escolar'],
    descricao: 'Lucas apresentou evolução marcante na capacidade de sustentação da atenção — passou de 5 para 15 minutos em atividade estruturada. O sistema de pasta colorida por matéria reduziu esquecimentos de material. Professor André relatou menos interrupções durante a aula.',
    proximosPassos: 'Trabalhar atenção em contextos com maior distração. Desenvolver checklist de tarefas autônomo.',
  },

  // Mariana (c03)
  {
    id: 'mock-e04', criancaId: 'mock-c03', data: '2026-03-28',
    periodo: '1º Trimestre 2026',
    areas: ['Leitura', 'Fluência', 'Autoestima'],
    descricao: 'Mariana superou bloqueio emocional significativo em relação à leitura em voz alta. Fluência leitora aumentou de 45 para 82 palavras por minuto com compreensão. Início do uso de texto com fonte ampliada e espaçamento duplo.',
  },
  {
    id: 'mock-e05', criancaId: 'mock-c03', data: '2026-06-11',
    periodo: '1º Semestre 2026',
    areas: ['Leitura', 'Escrita', 'Estratégias de Estudo'],
    descricao: 'Resultado expressivo na prova bimestral — 80% de aproveitamento. Mariana internalizou estratégias de leitura de enunciado. Escrita ficou mais fluente com o mapa mental. Autoconfiança visivelmente aumentada.',
    proximosPassos: 'Preparar estratégias para 2º semestre. Discutir adaptações para ENEM futuro.',
  },

  // Pedro Henrique (c04)
  {
    id: 'mock-e06', criancaId: 'mock-c04', data: '2026-03-30',
    periodo: '1º Trimestre 2026',
    areas: ['Linguagem', 'Coordenação Motora', 'Autonomia'],
    descricao: 'Pedro ampliou vocabulário expressivo em 30 palavras novas. Já nomeia objetos do ambiente escolar. Coordenação fina melhorou — consegue encaixar peças de puzzle de 12 peças com mínima ajuda.',
  },
  {
    id: 'mock-e07', criancaId: 'mock-c04', data: '2026-05-28',
    periodo: '1º Semestre 2026 — Parcial',
    areas: ['Linguagem', 'Interação Social', 'Pré-leitura'],
    descricao: 'Pedro começou a combinar 2 palavras espontaneamente ("mais água", "mamãe não"). Participação em grupo com Miguel foi excelente — turno respeitado em 8 de 10 tentativas. Reconhece o próprio nome escrito.',
    proximosPassos: 'Estimular combinações de 3 palavras. Introduzir conceito de número.',
  },
  {
    id: 'mock-e08', criancaId: 'mock-c04', data: '2026-06-10',
    periodo: 'Avaliação Semestral 2026',
    areas: ['Comunicação', 'Cognição', 'Socialização'],
    descricao: 'Pedro demonstra evolução além do esperado para Síndrome de Down considerando o tempo de intervenção. Família altamente comprometida — estratégias generalizadas para casa e terapia. Preparação para 2º semestre.',
    proximosPassos: 'Introduzir pré-escrita. Ampliar grupo para 3 crianças.',
  },

  // Sophia (c05)
  {
    id: 'mock-e09', criancaId: 'mock-c05', data: '2026-03-25',
    periodo: '1º Trimestre 2026',
    areas: ['Comunicação', 'Integração Social', 'Uso de AASI'],
    descricao: 'Sophia adaptou bem ao AASI bilateral. Já consegue manter atenção em conversas em ambiente de baixo ruído. Leitura labial avançou — identifica 70% das palavras em contexto familiar.',
  },
  {
    id: 'mock-e10', criancaId: 'mock-c05', data: '2026-06-10',
    periodo: '1º Semestre 2026',
    areas: ['Comunicação', 'Autonomia', 'Escrita'],
    descricao: 'Sophia está cada vez mais independente em sala de aula. Professor Carlos implementou todas as adaptações sugeridas. Produção escrita excelente — compensa a perda auditiva com habilidades visuais e escritas muito desenvolvidas.',
    proximosPassos: 'Trabalhar ambientes mais complexos (refeitório, pátio). Preparar Sophia para grupo de pares.',
  },

  // Gabriel (c06)
  {
    id: 'mock-e11', criancaId: 'mock-c06', data: '2026-06-11',
    periodo: '1º Semestre 2026',
    areas: ['Regulação Sensorial', 'Flexibilidade', 'Comunicação'],
    descricao: 'Gabriel demonstra progresso na regulação sensorial — crises de sobrecarga reduziram de 3x/semana para 1x/quinzena. Tolera mudanças de rotina com aviso prévio. Comunicação funcional para pedir ajuda está consolidada.',
    proximosPassos: 'Expandir uso dos interesses para aprendizagem curricular. Trabalhar reciprocidade social.',
  },

  // Isabella (c07)
  {
    id: 'mock-e12', criancaId: 'mock-c07', data: '2026-02-28',
    periodo: '1º Trimestre 2026',
    areas: ['Atenção', 'Leitura', 'Organização'],
    descricao: 'Isabella apresenta bons resultados com estratégias multissensoriais. O planejador visual reduziu tarefas esquecidas. Decodificação avançou — leitura de palavras irregulares está melhorando.',
  },
  {
    id: 'mock-e13', criancaId: 'mock-c07', data: '2026-05-22',
    periodo: '1º Semestre 2026 — Avaliação Parcial',
    areas: ['Leitura', 'Escrita', 'Estratégias Metacognitivas'],
    descricao: 'Isabella demonstra crescente metacognição — já identifica quando precisa de apoio. Escrita com erros ortográficos reduzidos após treino fonológico sistemático. Muito motivada.',
    proximosPassos: 'Retomar sessões regularmente. Preparar estratégias para 2º semestre.',
  },

  // Miguel (c08)
  {
    id: 'mock-e14', criancaId: 'mock-c08', data: '2026-03-20',
    periodo: '1º Trimestre 2026',
    areas: ['Linguagem', 'Pré-leitura', 'Socialização'],
    descricao: 'Miguel ampliou vocabulário expressivo para 40 palavras. Reconhece o próprio nome. Participação em grupo com Pedro foi muito positiva — relação de amizade construída.',
  },
  {
    id: 'mock-e15', criancaId: 'mock-c08', data: '2026-06-09',
    periodo: '1º Semestre 2026',
    areas: ['Cognição', 'Linguagem', 'Autonomia'],
    descricao: 'Miguel começa a combinar palavras em contexto. Categorização de objetos está consolidada. Autonomia nas atividades de vida diária em progressão — se despede e cumprimenta espontaneamente.',
    proximosPassos: 'Ampliar vocabulário. Trabalhar conceito de número com material concreto.',
  },

  // Laura (c09) — inativa
  {
    id: 'mock-e16', criancaId: 'mock-c09', data: '2026-04-07',
    periodo: 'Relatório de Encerramento 2026',
    areas: ['Autonomia', 'Tecnologia Assistiva', 'Vida Escolar'],
    descricao: 'Laura desenvolveu plena autonomia no uso de tecnologia assistiva (ampliador digital, lupa eletrônica, leitor de tela). Excelente rendimento acadêmico — média 8,5. Encaminhada para serviço de AEE na nova cidade com relatório completo.',
  },

  // Thiago (c10)
  {
    id: 'mock-e17', criancaId: 'mock-c10', data: '2026-03-28',
    periodo: '1º Trimestre 2026',
    areas: ['Pré-leitura', 'Matemática Básica', 'Autonomia'],
    descricao: 'Thiago reconhece 30 palavras por imagem. Conta até 5 com correspondência um-a-um. Rotina escolar bem estabelecida com suporte dos pictogramas.',
  },
  {
    id: 'mock-e18', criancaId: 'mock-c10', data: '2026-06-16',
    periodo: '1º Semestre 2026',
    areas: ['Leitura', 'Matemática', 'Habilidades Sociais'],
    descricao: 'Thiago escreve o próprio nome de forma semi-autônoma. Reconhece numerais até 10. Professora Simone relatou que Thiago está generalizando habilidades sociais para o intervalo — cumprimenta colegas e pede licença.',
    proximosPassos: 'Trabalhar leitura de palavras dissílabas. Ampliar contagem e operações simples.',
  },
];
