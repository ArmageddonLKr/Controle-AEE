
// src/lib/mock-data.ts
import { Crianca, Sessao, Evolucao } from '@/types';
import { subDays } from 'date-fns';

const hoje = new Date();

// Datas de aniversário dinâmicas (baseadas na data atual)
const aniversarioHoje = new Date(hoje.getFullYear() - 8, hoje.getMonth(), hoje.getDate()).toISOString();
const aniversarioDaqui2Dias = new Date(
  hoje.getFullYear() - 6,
  new Date(hoje.getTime() + 2 * 24 * 60 * 60 * 1000).getMonth(),
  new Date(hoje.getTime() + 2 * 24 * 60 * 60 * 1000).getDate()
).toISOString();
const aniversarioDaqui5Dias = new Date(
  hoje.getFullYear() - 10,
  new Date(hoje.getTime() + 5 * 24 * 60 * 60 * 1000).getMonth(),
  new Date(hoje.getTime() + 5 * 24 * 60 * 60 * 1000).getDate()
).toISOString();

// --- DADOS MOCK REALISTAS ---

export const criancas: Crianca[] = [
  {
    id: '1',
    nome: 'Lucas Martins Oliveira',
    apelido: 'Luquinha',
    dataNascimento: '2016-05-20T00:00:00.000Z',
    genero: 'M',
    status: 'ativo',
    escola: 'Escola Municipal Sol Nascente',
    turma: '302',
    serie: '3º Ano',
    turno: 'tarde',
    professorRegente: 'Prof.ª Marina Souza',
    diagnosticos: ['TEA', 'TDAH'],
    cids: ['F84.0', 'F90.0'],
    dataInicioAcompanhamento: '2023-02-15T00:00:00.000Z',
    responsaveis: [
      { nome: 'Ana Oliveira', parentesco: 'Mãe', telefone: '(21) 98765-4321', email: 'ana.oliveira@email.com', responsavelLegal: true },
      { nome: 'Carlos Oliveira', parentesco: 'Pai', telefone: '(21) 97654-3210', responsavelLegal: false },
    ],
    observacoesImportantes: 'Hipersensibilidade a sons altos. Prefere atividades visuais. Não tolera mudanças abruptas de rotina.',
    medicamentos: ['Ritalina 10mg (manhã)'],
  },
  {
    id: '2',
    nome: 'Júlia Pereira da Silva',
    apelido: 'Juju',
    dataNascimento: aniversarioHoje,
    genero: 'F',
    status: 'ativo',
    escola: 'Escola Estadual Girassol',
    turma: '5A',
    serie: '5º Ano',
    turno: 'manhã',
    professorRegente: 'Prof. Roberto Alves',
    diagnosticos: ['Dislexia'],
    cids: ['F81.0'],
    dataInicioAcompanhamento: '2022-09-01T00:00:00.000Z',
    responsaveis: [
      { nome: 'Marcos da Silva', parentesco: 'Pai', telefone: '(31) 91234-5678', responsavelLegal: true },
      { nome: 'Fernanda Pereira', parentesco: 'Mãe', telefone: '(31) 99876-5432', email: 'fernanda.p@email.com', responsavelLegal: true },
    ],
    alergias: ['Poeira'],
  },
  {
    id: '3',
    nome: 'Pedro Henrique Costa',
    apelido: 'Pedrinho',
    dataNascimento: '2017-03-12T00:00:00.000Z',
    genero: 'M',
    status: 'ativo',
    escola: 'Escola Municipal Sol Nascente',
    turma: '201',
    serie: '2º Ano',
    turno: 'manhã',
    professorRegente: 'Prof.ª Cláudia Lima',
    diagnosticos: ['TDAH'],
    cids: ['F90.0'],
    dataInicioAcompanhamento: '2024-03-01T00:00:00.000Z',
    responsaveis: [
      { nome: 'Beatriz Costa', parentesco: 'Mãe', telefone: '(11) 95555-7777', responsavelLegal: true },
    ],
    observacoesImportantes: 'Alta agitação motora. Responde bem a atividades estruturadas com tempo curto.',
    medicamentos: ['Venvanse 20mg'],
  },
  {
    id: '4',
    nome: 'Sofia Almeida Ribeiro',
    dataNascimento: aniversarioDaqui2Dias,
    genero: 'F',
    status: 'ativo',
    escola: 'Escola Estadual Girassol',
    turma: '1B',
    serie: '1º Ano',
    turno: 'integral',
    professorRegente: 'Prof.ª Juliana Matos',
    diagnosticos: ['Síndrome de Down'],
    cids: ['Q90.0'],
    dataInicioAcompanhamento: '2021-08-10T00:00:00.000Z',
    responsaveis: [
      { nome: 'Patrícia Ribeiro', parentesco: 'Mãe', telefone: '(21) 98888-1111', email: 'patricia.r@email.com', responsavelLegal: true },
      { nome: 'João Almeida', parentesco: 'Pai', telefone: '(21) 97777-2222', responsavelLegal: true },
    ],
    observacoesImportantes: 'Ótima vinculação afetiva. Aprendizagem por repetição e reforço positivo.',
  },
  {
    id: '5',
    nome: 'Mateus Ferreira Lima',
    dataNascimento: '2015-11-08T00:00:00.000Z',
    genero: 'M',
    status: 'ativo',
    escola: 'Instituto Esperança',
    turma: '6A',
    serie: '6º Ano',
    turno: 'tarde',
    professorRegente: 'Prof. André Correia',
    diagnosticos: ['Deficiência Intelectual'],
    cids: ['F70'],
    dataInicioAcompanhamento: '2020-04-20T00:00:00.000Z',
    responsaveis: [
      { nome: 'Sandra Lima', parentesco: 'Mãe', telefone: '(85) 99111-3333', responsavelLegal: true },
    ],
    alergias: ['Lactose'],
  },
  {
    id: '6',
    nome: 'Isabella Santos Gomes',
    apelido: 'Bela',
    dataNascimento: aniversarioDaqui5Dias,
    genero: 'F',
    status: 'ativo',
    escola: 'Escola Municipal Sol Nascente',
    turma: '401',
    serie: '4º Ano',
    turno: 'manhã',
    professorRegente: 'Prof.ª Renata Vieira',
    diagnosticos: ['TEA'],
    cids: ['F84.1'],
    dataInicioAcompanhamento: '2023-07-05T00:00:00.000Z',
    responsaveis: [
      { nome: 'Carla Gomes', parentesco: 'Mãe', telefone: '(11) 96666-4444', email: 'carla.gomes@email.com', responsavelLegal: true },
    ],
    observacoesImportantes: 'Comunicação verbal limitada. Usa PECS. Não tolera texturas ásperas.',
  },
  {
    id: '7',
    nome: 'Gabriel Rodrigues Souza',
    dataNascimento: '2018-01-30T00:00:00.000Z',
    genero: 'M',
    status: 'espera',
    escola: 'Instituto Esperança',
    turma: 'Pré-I',
    serie: 'Pré-escola',
    turno: 'manhã',
    diagnosticos: ['Deficiência Auditiva'],
    cids: ['H90.3'],
    dataInicioAcompanhamento: '2025-01-15T00:00:00.000Z',
    responsaveis: [
      { nome: 'Lúcia Souza', parentesco: 'Mãe', telefone: '(71) 98877-6655', responsavelLegal: true },
    ],
    observacoesImportantes: 'Usa aparelho auditivo bilateral. Em processo de avaliação para AEE.',
  },
  {
    id: '8',
    nome: 'Ana Beatriz Carvalho',
    apelido: 'Aninha',
    dataNascimento: '2014-07-22T00:00:00.000Z',
    genero: 'F',
    status: 'ativo',
    escola: 'Escola Estadual Girassol',
    turma: '7B',
    serie: '7º Ano',
    turno: 'tarde',
    professorRegente: 'Prof. Fábio Nascimento',
    diagnosticos: ['Dislexia', 'TDAH'],
    cids: ['F81.0', 'F90.0'],
    dataInicioAcompanhamento: '2022-02-28T00:00:00.000Z',
    responsaveis: [
      { nome: 'Mônica Carvalho', parentesco: 'Mãe', telefone: '(19) 99000-5566', email: 'monica.c@email.com', responsavelLegal: true },
      { nome: 'Ricardo Carvalho', parentesco: 'Pai', telefone: '(19) 98900-4455', responsavelLegal: false },
    ],
    medicamentos: ['Concerta 36mg'],
  },
  {
    id: '9',
    nome: 'Lucas Eduardo Moreira',
    dataNascimento: '2016-09-14T00:00:00.000Z',
    genero: 'M',
    status: 'espera',
    escola: 'Instituto Esperança',
    turma: '3A',
    serie: '3º Ano',
    turno: 'tarde',
    diagnosticos: ['Deficiência Visual'],
    cids: ['H54.0'],
    dataInicioAcompanhamento: '2025-03-10T00:00:00.000Z',
    responsaveis: [
      { nome: 'Vera Moreira', parentesco: 'Avó', telefone: '(47) 97788-9900', responsavelLegal: true },
    ],
    observacoesImportantes: 'Baixa visão (5% em OD). Aguarda laudo oftalmológico atualizado.',
  },
  {
    id: '10',
    nome: 'Valentina Cruz Pereira',
    apelido: 'Val',
    dataNascimento: '2016-12-03T00:00:00.000Z',
    genero: 'F',
    status: 'ativo',
    escola: 'Escola Municipal Sol Nascente',
    turma: '302',
    serie: '3º Ano',
    turno: 'manhã',
    professorRegente: 'Prof.ª Marina Souza',
    diagnosticos: ['TEA', 'Ansiedade'],
    cids: ['F84.0', 'F41.1'],
    dataInicioAcompanhamento: '2023-09-04T00:00:00.000Z',
    responsaveis: [
      { nome: 'Daniela Cruz', parentesco: 'Mãe', telefone: '(21) 99123-4567', email: 'daniela.cruz@email.com', responsavelLegal: true },
    ],
    observacoesImportantes: 'Muito ansiosa em situações novas. Gosta de desenho e musicoterapia.',
    medicamentos: ['Risperidona 0,5mg (noite)'],
  },
  {
    id: '11',
    nome: 'Enzo Barbosa Nunes',
    dataNascimento: '2015-04-17T00:00:00.000Z',
    genero: 'M',
    status: 'inativo',
    escola: 'Escola Estadual Girassol',
    turma: '6B',
    serie: '6º Ano',
    turno: 'manhã',
    diagnosticos: ['TDAH'],
    cids: ['F90.1'],
    dataInicioAcompanhamento: '2021-06-01T00:00:00.000Z',
    responsaveis: [
      { nome: 'Patricia Nunes', parentesco: 'Mãe', telefone: '(11) 92233-4455', responsavelLegal: true },
    ],
    observacoesImportantes: 'Acompanhamento encerrado por mudança de cidade em 2025.',
  },
  {
    id: '12',
    nome: 'Maria Clara Pinto da Silva',
    apelido: 'Clarinha',
    dataNascimento: '2017-08-25T00:00:00.000Z',
    genero: 'F',
    status: 'inativo',
    escola: 'Instituto Esperança',
    turma: '2B',
    serie: '2º Ano',
    turno: 'tarde',
    diagnosticos: ['Síndrome de Down'],
    cids: ['Q90.0'],
    dataInicioAcompanhamento: '2022-04-11T00:00:00.000Z',
    responsaveis: [
      { nome: 'Rosa da Silva', parentesco: 'Mãe', telefone: '(41) 98844-2266', email: 'rosa.silva@email.com', responsavelLegal: true },
    ],
    observacoesImportantes: 'Alta por solicitação da família. Retomada prevista para 2027.',
  },
];

// --- SESSÕES ---

export const sessoes: Sessao[] = [
  // Lucas (id: '1') — TEA + TDAH
  { id: 's1', criancaId: '1', data: subDays(hoje, 5).toISOString(), hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Foco em regulação emocional com tabuleiro de sentimentos. Lucas reconheceu e nomeou 4 emoções diferentes.', evolucaoObservada: 'Melhora na identificação de emoções básicas.' },
  { id: 's2', criancaId: '1', data: subDays(hoje, 12).toISOString(), hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Atividade de sequenciação visual. Utilizamos cartões com histórias em quadrinhos adaptadas.', evolucaoObservada: 'Conseguiu ordenar 5 cartões sem auxílio, recorde pessoal.' },
  { id: 's3', criancaId: '1', data: subDays(hoje, 19).toISOString(), hora: '14:00', duracao: 50, tipo: 'individual', presente: false, motivoFalta: 'Criança com febre. Informado pela mãe com antecedência.', anotacoes: 'Falta justificada. Enviado atividade para casa.' },
  { id: 's4', criancaId: '1', data: subDays(hoje, 26).toISOString(), hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Sessão de integração sensorial. Brincadeiras com massinha e areia cinética.', evolucaoObservada: 'Tolerância tátil aumentada. Ficou 10 min com areia cinética sem resistência.' },
  { id: 's5', criancaId: '1', data: subDays(hoje, 33).toISOString(), hora: '14:00', duracao: 50, tipo: 'familiar', presente: true, anotacoes: 'Orientação com a mãe sobre estratégias de regulação em casa. Discussão sobre rotina visual.', },
  { id: 's6', criancaId: '1', data: subDays(hoje, 40).toISOString(), hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Trabalho com habilidades sociais básicas. Role-play de situações do recreio.', evolucaoObservada: 'Demonstrou iniciar interação com colega fictício durante o role-play.' },
  { id: 's7', criancaId: '1', data: subDays(hoje, 47).toISOString(), hora: '14:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Avaliação de progresso semestral. Aplicação de protocolo CARS revisado.' },

  // Júlia (id: '2') — Dislexia
  { id: 's8', criancaId: '2', data: subDays(hoje, 3).toISOString(), hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Atividade de consciência fonológica com rimas. Jogo de rima memória adaptado.', evolucaoObservada: 'Identificou 8 de 10 rimas corretamente, evolução em relação às 5 da semana anterior.' },
  { id: 's9', criancaId: '2', data: subDays(hoje, 10).toISOString(), hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Leitura compartilhada com texto de nível 2. Uso de régua de leitura e fonte especial.' },
  { id: 's10', criancaId: '2', data: subDays(hoje, 17).toISOString(), hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Método fônico com sílabas complexas (lha, nha, lho). Fichas coloridas por família silábica.' },
  { id: 's11', criancaId: '2', data: subDays(hoje, 24).toISOString(), hora: '09:00', duracao: 45, tipo: 'orientacao', presente: true, anotacoes: 'Orientação para o professor regente sobre adaptações curriculares necessárias.' },
  { id: 's12', criancaId: '2', data: subDays(hoje, 31).toISOString(), hora: '09:00', duracao: 45, tipo: 'individual', presente: false, motivoFalta: 'Passeio escolar não informado previamente.', anotacoes: 'Falta não justificada a tempo. Reagendado.' },
  { id: 's13', criancaId: '2', data: subDays(hoje, 38).toISOString(), hora: '09:00', duracao: 45, tipo: 'individual', presente: true, anotacoes: 'Escrita de palavras com ditado adaptado. Uso de teclado como apoio.', evolucaoObservada: 'Erros de inversão reduzidos de 40% para 22%.' },

  // Pedro (id: '3') — TDAH
  { id: 's14', criancaId: '3', data: subDays(hoje, 6).toISOString(), hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Atividade de atenção sustentada com blocos de LEGO temático. Tempo máximo de foco: 12 minutos.', evolucaoObservada: 'Aumento de 3 min no tempo de foco comparado à sessão anterior.' },
  { id: 's15', criancaId: '3', data: subDays(hoje, 13).toISOString(), hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Técnica de pausa ativa: movimentos físicos coordenados antes de atividades de escrita.' },
  { id: 's16', criancaId: '3', data: subDays(hoje, 20).toISOString(), hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Jogo de memória com sequências de 4 elementos. Trabalho de memória de trabalho.' },
  { id: 's17', criancaId: '3', data: subDays(hoje, 27).toISOString(), hora: '10:00', duracao: 40, tipo: 'familiar', presente: true, anotacoes: 'Orientação com a mãe: criação de rotina visual para casa, uso de timer durante tarefas.' },
  { id: 's18', criancaId: '3', data: subDays(hoje, 34).toISOString(), hora: '10:00', duracao: 40, tipo: 'individual', presente: false, motivoFalta: 'Criança doente — otite.', anotacoes: 'Falta justificada por atestado médico.' },
  { id: 's19', criancaId: '3', data: subDays(hoje, 41).toISOString(), hora: '10:00', duracao: 40, tipo: 'individual', presente: true, anotacoes: 'Atividades de autorregulação: semáforo emocional e estação de calma no consultório.' },

  // Sofia (id: '4') — Síndrome de Down
  { id: 's20', criancaId: '4', data: subDays(hoje, 4).toISOString(), hora: '11:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Contagem até 20 com material concreto (tampinhas coloridas). Sofia atingiu 15 sem erros.', evolucaoObservada: 'Reconhecimento de numerais até 15 consolidado.' },
  { id: 's21', criancaId: '4', data: subDays(hoje, 11).toISOString(), hora: '11:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Atividade de linguagem: identificação de figuras e associação com palavras escritas.' },
  { id: 's22', criancaId: '4', data: subDays(hoje, 18).toISOString(), hora: '11:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Estimulação de coordenação motora fina com recorte e colagem. Tema: família.' },
  { id: 's23', criancaId: '4', data: subDays(hoje, 25).toISOString(), hora: '11:00', duracao: 50, tipo: 'familiar', presente: true, anotacoes: 'Reunião com os pais: planejamento de metas para o semestre e revisão do PEI.' },
  { id: 's24', criancaId: '4', data: subDays(hoje, 32).toISOString(), hora: '11:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Leitura de palavras simples (CVC). Sofia leu "bola", "mala" e "faca" de forma independente.' },
  { id: 's25', criancaId: '4', data: subDays(hoje, 39).toISOString(), hora: '11:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Jogo da memória com pares de animais. Sofia acertou 6 pares em 10 tentativas.' },

  // Mateus (id: '5') — Def. Intelectual
  { id: 's26', criancaId: '5', data: subDays(hoje, 7).toISOString(), hora: '14:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Habilidades adaptativas: higiene pessoal. Sequência de passos para lavar as mãos (6 etapas).', evolucaoObservada: 'Realiza 5 das 6 etapas com autonomia.' },
  { id: 's27', criancaId: '5', data: subDays(hoje, 14).toISOString(), hora: '14:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Habilidades de comunicação: uso de prancha de CAA com 30 figuras.' },
  { id: 's28', criancaId: '5', data: subDays(hoje, 21).toISOString(), hora: '14:30', duracao: 50, tipo: 'individual', presente: false, motivoFalta: 'Consulta médica de rotina.', anotacoes: 'Falta justificada.' },
  { id: 's29', criancaId: '5', data: subDays(hoje, 28).toISOString(), hora: '14:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Trabalho com conceitos básicos: cores, formas e tamanhos usando materiais concretos.' },
  { id: 's30', criancaId: '5', data: subDays(hoje, 35).toISOString(), hora: '14:30', duracao: 50, tipo: 'orientacao', presente: true, anotacoes: 'Orientação para professora regente sobre adaptações de atividades e uso de apoio visual.' },
  { id: 's31', criancaId: '5', data: subDays(hoje, 42).toISOString(), hora: '14:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Atividade de vida prática: identificação de moedas. Mateus identificou R$0,25 e R$0,50.' },

  // Isabella (id: '6') — TEA
  { id: 's32', criancaId: '6', data: subDays(hoje, 2).toISOString(), hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Comunicação via PECS: Isabella usou 8 figuras de forma espontânea para pedir objetos.', evolucaoObservada: 'Primeiro uso espontâneo de figura para "água" sem prompt.' },
  { id: 's33', criancaId: '6', data: subDays(hoje, 9).toISOString(), hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Integração sensorial: caixa sensorial com materiais de texturas variadas. Boa tolerância.' },
  { id: 's34', criancaId: '6', data: subDays(hoje, 16).toISOString(), hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'ABA: treino de imitação motora com espelho. 7 de 10 imitações corretas.' },
  { id: 's35', criancaId: '6', data: subDays(hoje, 23).toISOString(), hora: '08:30', duracao: 50, tipo: 'familiar', presente: true, anotacoes: 'Orientação com a mãe: estratégias para o manejo de birra e comunicação em casa.' },
  { id: 's36', criancaId: '6', data: subDays(hoje, 30).toISOString(), hora: '08:30', duracao: 50, tipo: 'individual', presente: false, motivoFalta: 'Crise respiratória — hospitalização breve.', anotacoes: 'Criança internada por 2 dias. Retornou sem sequelas.' },
  { id: 's37', criancaId: '6', data: subDays(hoje, 37).toISOString(), hora: '08:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Habilidades de jogo funcional com bolinhas e encaixe. Exploração por 20 minutos.' },

  // Ana Beatriz (id: '8') — Dislexia + TDAH
  { id: 's38', criancaId: '8', data: subDays(hoje, 8).toISOString(), hora: '15:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Trabalho com compreensão de texto. Leitura de conto curto com perguntas guiadas.', evolucaoObservada: 'Respondeu 4 de 5 perguntas inferenciais corretamente.' },
  { id: 's39', criancaId: '8', data: subDays(hoje, 15).toISOString(), hora: '15:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Estratégias de estudo: mapa mental para revisão de conteúdo de história.' },
  { id: 's40', criancaId: '8', data: subDays(hoje, 22).toISOString(), hora: '15:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Autorregulação: técnica de respiração e organização da mochila para a escola.' },
  { id: 's41', criancaId: '8', data: subDays(hoje, 29).toISOString(), hora: '15:00', duracao: 50, tipo: 'orientacao', presente: true, anotacoes: 'Reunião com escola para planejamento de adaptações em provas (tempo extra, fonte ampliada).' },
  { id: 's42', criancaId: '8', data: subDays(hoje, 36).toISOString(), hora: '15:00', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Atividade de escrita criativa com teclado. Produção de texto curto sem preocupação ortográfica.' },
  { id: 's43', criancaId: '8', data: subDays(hoje, 43).toISOString(), hora: '15:00', duracao: 50, tipo: 'individual', presente: false, motivoFalta: 'Provas escolares finais.', anotacoes: 'Falta justificada. Combinado retorno na semana seguinte.' },

  // Valentina (id: '10') — TEA + Ansiedade
  { id: 's44', criancaId: '10', data: subDays(hoje, 1).toISOString(), hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Sessão de musicoterapia adaptada. Valentina escolheu a música e tocou pandeiro por 15 min.', evolucaoObservada: 'Primeira sessão em que verbalizou preferência espontaneamente.' },
  { id: 's45', criancaId: '10', data: subDays(hoje, 8).toISOString(), hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Trabalho com ansiedade: termômetro emocional e estratégias de grounding 5-4-3-2-1.' },
  { id: 's46', criancaId: '10', data: subDays(hoje, 15).toISOString(), hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Desenho livre: Valentina representou sua família e nomeou cada membro.' },
  { id: 's47', criancaId: '10', data: subDays(hoje, 22).toISOString(), hora: '09:30', duracao: 50, tipo: 'familiar', presente: true, anotacoes: 'Orientação com a mãe: manejo de ansiedade antecipatória antes de atividades novas.' },
  { id: 's48', criancaId: '10', data: subDays(hoje, 29).toISOString(), hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Interação social em dupla com outra criança (sessão piloto). Valentina manteve contato visual por 5 min.' },
  { id: 's49', criancaId: '10', data: subDays(hoje, 36).toISOString(), hora: '09:30', duracao: 50, tipo: 'individual', presente: true, anotacoes: 'Revisão de metas: Valentina consegue ir ao banheiro sozinha na escola há 3 semanas.' },
];

// --- EVOLUÇÕES ---

export const evolucoes: Evolucao[] = [
  // Lucas (id: '1')
  {
    id: 'e1',
    criancaId: '1',
    data: '2025-06-30T00:00:00.000Z',
    periodo: '1º Semestre 2025',
    descricao: 'Lucas apresentou avanços significativos na interação social com os pares. A tolerância a sons no ambiente escolar melhorou após o uso de abafadores. As atividades de regulação emocional foram bem aceitas e há indicadores de generalização para o ambiente familiar.',
    areas: ['Interação Social', 'Regulação Emocional', 'Integração Sensorial'],
    proximosPassos: 'Introduzir jogos em grupo com regras simples. Ampliar o vocabulário emocional para 12 emoções.',
  },
  {
    id: 'e2',
    criancaId: '1',
    data: '2024-12-15T00:00:00.000Z',
    periodo: '2º Semestre 2024',
    descricao: 'Melhora no tempo de permanência em tarefas estruturadas (de 5 para 15 minutos). Diminuição de comportamentos de fuga em situações acadêmicas.',
    areas: ['Atenção', 'Comportamento Adaptativo'],
    proximosPassos: 'Trabalhar atenção compartilhada e comunicação intencional.',
  },

  // Júlia (id: '2')
  {
    id: 'e3',
    criancaId: '2',
    data: '2025-06-20T00:00:00.000Z',
    periodo: '1º Semestre 2025',
    descricao: 'Taxa de inversão silábica na escrita reduzida de 45% para 18%. Júlia demonstrou melhora expressiva na consciência fonológica e já associa a maioria das letras aos sons correspondentes.',
    areas: ['Consciência Fonológica', 'Escrita', 'Leitura'],
    proximosPassos: 'Avançar para textos de nível 3. Trabalhar fluência de leitura oral.',
  },
  {
    id: 'e4',
    criancaId: '2',
    data: '2024-11-30T00:00:00.000Z',
    periodo: '2º Semestre 2024',
    descricao: 'Avanço na decodificação de sílabas simples. Motivação aumentada com o uso de recursos digitais e fontes especiais para dislexia.',
    areas: ['Decodificação', 'Motivação para Leitura'],
    proximosPassos: 'Consolidar leitura de sílabas complexas (dígrafos, encontros consonantais).',
  },

  // Pedro (id: '3')
  {
    id: 'e5',
    criancaId: '3',
    data: '2025-05-31T00:00:00.000Z',
    periodo: '1º Semestre 2025',
    descricao: 'Pedro demonstra maior controle do impulso em situações de espera. O tempo médio de atenção sustentada aumentou de 5 para 15 minutos com apoio de timer visual. A mãe relata melhora nas tarefas escolares em casa.',
    areas: ['Atenção Sustentada', 'Controle de Impulsos', 'Autorregulação'],
    proximosPassos: 'Trabalhar flexibilidade cognitiva e transições entre atividades.',
  },
  {
    id: 'e6',
    criancaId: '3',
    data: '2024-11-20T00:00:00.000Z',
    periodo: '2º Semestre 2024',
    descricao: 'Redução de comportamentos de interrupção em sala de aula segundo relato do professor. Inicio de uso de agenda visual.',
    areas: ['Comportamento Escolar', 'Organização'],
    proximosPassos: 'Generalizar o uso da agenda visual para casa.',
  },

  // Sofia (id: '4')
  {
    id: 'e7',
    criancaId: '4',
    data: '2025-06-10T00:00:00.000Z',
    periodo: '1º Semestre 2025',
    descricao: 'Sofia consolidou o reconhecimento de numerais até 15 e demonstra boa compreensão do conceito de quantidade. Na leitura, já reconhece 12 palavras de alta frequência de forma independente. A vinculação com a psicóloga está excelente.',
    areas: ['Matemática Concreta', 'Leitura', 'Habilidades Sociais'],
    proximosPassos: 'Avançar para numerais até 30. Ampliar vocabulário de leitura para 25 palavras.',
  },
  {
    id: 'e8',
    criancaId: '4',
    data: '2024-12-05T00:00:00.000Z',
    periodo: '2º Semestre 2024',
    descricao: 'Sofia passou a se comunicar de forma mais assertiva, usando frases de 2 palavras de forma espontânea. Coordenação motora fina em desenvolvimento.',
    areas: ['Comunicação', 'Motricidade Fina'],
    proximosPassos: 'Trabalhar frases de 3 palavras e iniciação de pedidos.',
  },

  // Isabella (id: '6')
  {
    id: 'e9',
    criancaId: '6',
    data: '2025-04-30T00:00:00.000Z',
    periodo: '1º Semestre 2025',
    descricao: 'Isabella ampliou o repertório comunicativo via PECS para 25 figuras. O uso espontâneo de figuras para pedidos aumentou significativamente. A tolerância sensorial apresenta melhora gradual.',
    areas: ['Comunicação Alternativa', 'Integração Sensorial', 'Jogo Funcional'],
    proximosPassos: 'Avançar para PECS fase 3 (discriminação). Introduzir agenda visual.',
  },
  {
    id: 'e10',
    criancaId: '6',
    data: '2024-10-15T00:00:00.000Z',
    periodo: '2º Semestre 2024',
    descricao: 'Início do uso de PECS com 10 figuras. Isabella demonstrou interesse por atividades estruturadas e tolerância ao contato visual breve.',
    areas: ['Comunicação Alternativa', 'Atenção Compartilhada'],
    proximosPassos: 'Ampliar vocabulário PECS e trabalhar imitação motora.',
  },

  // Ana Beatriz (id: '8')
  {
    id: 'e11',
    criancaId: '8',
    data: '2025-06-01T00:00:00.000Z',
    periodo: '1º Semestre 2025',
    descricao: 'Ana Beatriz demonstrou avanço expressivo em estratégias de autorregulação. A compreensão leitora melhorou notavelmente com uso de tecnologia assistiva. A escola reporta maior participação e conclusão de tarefas.',
    areas: ['Autorregulação', 'Compreensão Leitora', 'Organização Escolar'],
    proximosPassos: 'Trabalhar fluência de escrita e produção de texto mais longa.',
  },
  {
    id: 'e12',
    criancaId: '8',
    data: '2024-12-10T00:00:00.000Z',
    periodo: '2º Semestre 2024',
    descricao: 'Melhora no foco durante atividades com menos distrações. Uso consistente de técnicas de pausa ativa.',
    areas: ['Atenção', 'Estratégias de Estudo'],
    proximosPassos: 'Desenvolver habilidades de organização de tempo e uso de planner.',
  },

  // Valentina (id: '10')
  {
    id: 'e13',
    criancaId: '10',
    data: '2025-05-15T00:00:00.000Z',
    periodo: '1º Semestre 2025',
    descricao: 'Valentina apresentou ganhos importantes na comunicação verbal espontânea. A ansiedade em situações novas foi reduzida com uso das estratégias de grounding. A vinculação terapêutica está sólida.',
    areas: ['Comunicação Verbal', 'Manejo de Ansiedade', 'Autonomia'],
    proximosPassos: 'Ampliar interações sociais. Trabalhar resolução de conflitos simples.',
  },
  {
    id: 'e14',
    criancaId: '10',
    data: '2024-11-25T00:00:00.000Z',
    periodo: '2º Semestre 2024',
    descricao: 'Redução de crises de ansiedade antecipatória de 4 para 1 por semana. Valentina verbalizou seus medos pela primeira vez durante sessão.',
    areas: ['Regulação Emocional', 'Expressão de Sentimentos'],
    proximosPassos: 'Consolidar técnicas de autorregulação e generalizar para o contexto escolar.',
  },
];

// --- FUNÇÕES DE ACESSO AOS DADOS MOCK ---

export const getCriancas = () => criancas;
export const getCriancaById = (id: string) => criancas.find(c => c.id === id);
export const getSessoesByCriancaId = (criancaId: string) => sessoes.filter(s => s.criancaId === criancaId);
export const getEvolucoesByCriancaId = (criancaId: string) => evolucoes.filter(e => e.criancaId === criancaId);
