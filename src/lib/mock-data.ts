// Dados de exemplo realistas para demonstração do Controle AEE
// Data de referência: 08/05/2026
// 2 aniversários hoje (08/05), 1 nos próximos 7 dias

import type { Crianca, Sessao, Evolucao } from "@/types";

export const criancas: Crianca[] = [
  {
    id: "1",
    nome: "Lucas Ferreira Nascimento",
    apelido: "Luca",
    dataNascimento: "2016-05-08",
    genero: "M",
    status: "ativo",
    escola: "EMEF João Paulo II",
    turma: "3º Ano A",
    serie: "3º Ano EF",
    turno: "manhã",
    professorRegente: "Profª Ana Paula Mendes",
    diagnosticos: ["TEA"],
    cids: ["F84.0"],
    dataInicioAcompanhamento: "2024-02-10",
    responsaveis: [
      {
        nome: "Carla Ferreira Nascimento",
        parentesco: "Mãe",
        telefone: "(11) 99872-3401",
        email: "carla.nascimento@gmail.com",
        responsavelLegal: true,
      },
      {
        nome: "Roberto Nascimento",
        parentesco: "Pai",
        telefone: "(11) 98654-7732",
        responsavelLegal: false,
      },
    ],
    observacoesImportantes:
      "Possui hipersensibilidade sensorial a sons altos. Evitar ambientes barulhentos durante as sessões. Responde bem a rotinas estruturadas.",
    medicamentos: ["Risperidona 0,5mg (noite)"],
    alergias: ["Corante amarelo tartrazina"],
  },
  {
    id: "2",
    nome: "Maria Clara Santos Oliveira",
    apelido: "Maju",
    dataNascimento: "2014-05-08",
    genero: "F",
    status: "ativo",
    escola: "E.E. Professora Maria das Graças",
    turma: "5º Ano B",
    serie: "5º Ano EF",
    turno: "tarde",
    professorRegente: "Prof. Ricardo Almeida",
    diagnosticos: ["TDAH", "Dislexia"],
    cids: ["F90.0", "F81.0"],
    dataInicioAcompanhamento: "2023-08-15",
    responsaveis: [
      {
        nome: "Patrícia Santos",
        parentesco: "Mãe",
        telefone: "(11) 97654-1122",
        email: "patricia.santos@hotmail.com",
        responsavelLegal: true,
      },
    ],
    observacoesImportantes:
      "Dificuldade significativa de concentração em atividades longas. Sessões de no máximo 40 minutos com intervalos. Muito criativa e motivada por artes.",
    medicamentos: ["Metilfenidato 10mg (manhã)"],
  },
  {
    id: "3",
    nome: "Pedro Henrique Lima Souza",
    apelido: "Pedrinho",
    dataNascimento: "2018-05-11",
    genero: "M",
    status: "ativo",
    escola: "EMEF João Paulo II",
    turma: "1º Ano B",
    serie: "1º Ano EF",
    turno: "manhã",
    professorRegente: "Profª Juliana Castro",
    diagnosticos: ["Síndrome de Down"],
    cids: ["Q90.0"],
    dataInicioAcompanhamento: "2024-03-01",
    responsaveis: [
      {
        nome: "Fernanda Lima",
        parentesco: "Mãe",
        telefone: "(11) 96543-8821",
        email: "fernanda.lima@gmail.com",
        responsavelLegal: true,
      },
      {
        nome: "Carlos Souza",
        parentesco: "Pai",
        telefone: "(11) 95432-6610",
        responsavelLegal: false,
      },
    ],
    alergias: ["Leite de vaca"],
  },
  {
    id: "4",
    nome: "Ana Beatriz Costa Ferreira",
    apelido: "Bia",
    dataNascimento: "2015-09-22",
    genero: "F",
    status: "ativo",
    escola: "EMEF Dom Pedro I",
    turma: "4º Ano C",
    serie: "4º Ano EF",
    turno: "manhã",
    professorRegente: "Profª Sandra Lima",
    diagnosticos: ["Dislexia", "Discalculia"],
    cids: ["F81.0", "F81.2"],
    dataInicioAcompanhamento: "2024-04-14",
    responsaveis: [
      {
        nome: "Mônica Costa",
        parentesco: "Mãe",
        telefone: "(11) 94321-5509",
        email: "monica.costa@outlook.com",
        responsavelLegal: true,
      },
    ],
    observacoesImportantes:
      "Inversão frequente de letras (b/d, p/q). Progresso significativo nas últimas 4 sessões com método fônico.",
  },
  {
    id: "5",
    nome: "Gabriel Mendes Oliveira",
    dataNascimento: "2013-11-03",
    genero: "M",
    status: "ativo",
    escola: "E.E. Professora Maria das Graças",
    turma: "6º Ano A",
    serie: "6º Ano EF",
    turno: "tarde",
    professorRegente: "Prof. Marcelo Pinto",
    diagnosticos: ["Deficiência Auditiva"],
    cids: ["H90.3"],
    dataInicioAcompanhamento: "2023-02-20",
    responsaveis: [
      {
        nome: "Silvia Mendes",
        parentesco: "Mãe",
        telefone: "(11) 93210-4498",
        responsavelLegal: true,
      },
      {
        nome: "Jorge Oliveira",
        parentesco: "Pai",
        telefone: "(11) 92109-3387",
        email: "jorge.oliveira@gmail.com",
        responsavelLegal: false,
      },
    ],
    observacoesImportantes:
      "Usa aparelho auditivo bilateral. Senta sempre na primeira fileira em sala. Excelente leitura labial. Conhece LIBRAS básico.",
  },
  {
    id: "6",
    nome: "Sofia Rodrigues Batista",
    dataNascimento: "2017-03-15",
    genero: "F",
    status: "ativo",
    escola: "EMEF João Paulo II",
    turma: "2º Ano A",
    serie: "2º Ano EF",
    turno: "manhã",
    professorRegente: "Profª Mariana Torres",
    diagnosticos: ["Deficiência Intelectual Leve"],
    cids: ["F70"],
    dataInicioAcompanhamento: "2024-08-05",
    responsaveis: [
      {
        nome: "Luciana Rodrigues",
        parentesco: "Mãe",
        telefone: "(11) 91098-2276",
        email: "luciana.rod@gmail.com",
        responsavelLegal: true,
      },
    ],
  },
  {
    id: "7",
    nome: "Mateus Alves Pereira",
    dataNascimento: "2015-07-28",
    genero: "M",
    status: "ativo",
    escola: "EMEF Dom Pedro I",
    turma: "4º Ano A",
    serie: "4º Ano EF",
    turno: "integral",
    professorRegente: "Prof. Eduardo Silva",
    diagnosticos: ["TEA", "TDAH"],
    cids: ["F84.0", "F90.0"],
    dataInicioAcompanhamento: "2022-11-10",
    responsaveis: [
      {
        nome: "Renata Alves",
        parentesco: "Mãe",
        telefone: "(11) 90987-1165",
        email: "renata.alves@gmail.com",
        responsavelLegal: true,
      },
    ],
    observacoesImportantes:
      "Apresenta comportamentos de autoestimulação (balançar o corpo). Aceito e não requer intervenção. Demonstra superdotação em matemática — resolver problemas complexos como recompensa.",
    medicamentos: ["Metilfenidato 18mg OROS (manhã)", "Clonidina 0,1mg (noite)"],
  },
  {
    id: "8",
    nome: "Isabela Souza Cardoso",
    apelido: "Bela",
    dataNascimento: "2016-12-01",
    genero: "F",
    status: "ativo",
    escola: "E.E. Professora Maria das Graças",
    turma: "3º Ano B",
    serie: "3º Ano EF",
    turno: "tarde",
    professorRegente: "Profª Cristina Farias",
    diagnosticos: ["Deficiência Visual"],
    cids: ["H54.0"],
    dataInicioAcompanhamento: "2024-05-20",
    responsaveis: [
      {
        nome: "Tatiana Souza",
        parentesco: "Mãe",
        telefone: "(11) 89876-0054",
        email: "tatiana.souza@hotmail.com",
        responsavelLegal: true,
      },
    ],
    observacoesImportantes:
      "Visão residual de 10% no olho esquerdo. Usa lupa e material ampliado. Acompanha fonoaudióloga paralelamente ao AEE.",
  },
  {
    id: "9",
    nome: "João Victor Martins Gomes",
    dataNascimento: "2014-06-19",
    genero: "M",
    status: "espera",
    escola: "EMEF Dom Pedro I",
    turma: "5º Ano A",
    serie: "5º Ano EF",
    turno: "manhã",
    professorRegente: "Profª Helena Campos",
    diagnosticos: ["TDAH"],
    cids: ["F90.1"],
    dataInicioAcompanhamento: "2026-03-01",
    responsaveis: [
      {
        nome: "Vanessa Martins",
        parentesco: "Mãe",
        telefone: "(11) 88765-9943",
        responsavelLegal: true,
      },
    ],
    observacoesImportantes:
      "Em lista de espera para avaliação psicopedagógica. Laudo médico já entregue. Aguardando abertura de vaga.",
  },
  {
    id: "10",
    nome: "Valentina Cruz Ribeiro",
    dataNascimento: "2017-08-11",
    genero: "F",
    status: "espera",
    escola: "EMEF João Paulo II",
    turma: "2º Ano C",
    serie: "2º Ano EF",
    turno: "tarde",
    professorRegente: "Profª Beatriz Nunes",
    diagnosticos: ["Dislexia"],
    cids: ["F81.0"],
    dataInicioAcompanhamento: "2026-04-15",
    responsaveis: [
      {
        nome: "Camila Cruz",
        parentesco: "Mãe",
        telefone: "(11) 87654-8832",
        email: "camila.cruz@gmail.com",
        responsavelLegal: true,
      },
    ],
  },
  {
    id: "11",
    nome: "Rafael Gonçalves Teixeira",
    dataNascimento: "2012-02-25",
    genero: "M",
    status: "inativo",
    escola: "E.E. Professora Maria das Graças",
    turma: "7º Ano B",
    serie: "7º Ano EF",
    turno: "tarde",
    professorRegente: "Prof. Leandro Moura",
    diagnosticos: ["TEA"],
    cids: ["F84.5"],
    dataInicioAcompanhamento: "2021-03-10",
    responsaveis: [
      {
        nome: "Cláudia Gonçalves",
        parentesco: "Mãe",
        telefone: "(11) 86543-7721",
        responsavelLegal: true,
      },
    ],
    observacoesImportantes:
      "Família mudou de município. Alta por transferência em janeiro/2026.",
  },
  {
    id: "12",
    nome: "Camila Ferreira Duarte",
    apelido: "Cami",
    dataNascimento: "2016-10-30",
    genero: "F",
    status: "inativo",
    escola: "EMEF Dom Pedro I",
    turma: "3º Ano A",
    serie: "3º Ano EF",
    turno: "manhã",
    professorRegente: "Prof. Anderson Melo",
    diagnosticos: ["Deficiência Intelectual Moderada"],
    cids: ["F71"],
    dataInicioAcompanhamento: "2023-06-01",
    responsaveis: [
      {
        nome: "Eliana Duarte",
        parentesco: "Mãe",
        telefone: "(11) 85432-6610",
        responsavelLegal: true,
      },
    ],
    observacoesImportantes:
      "Alta temporária a pedido da família para tratamento médico intensivo. Retorno previsto para agosto/2026.",
  },
];

export const sessoes: Sessao[] = [
  // Lucas (id: "1") — 8 sessões
  { id: "s1", criancaId: "1", data: "2026-04-28", hora: "09:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Trabalhou reconhecimento de emoções com cartões. Identificou corretamente alegria e tristeza. Dificuldade com raiva e medo — área para próxima sessão.", evolucaoObservada: "Ampliou vocabulário emocional." },
  { id: "s2", criancaId: "1", data: "2026-04-21", hora: "09:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Atividade de sequência temporal com figuras. Completou sequência de 4 etapas com apoio verbal mínimo. Progresso em relação à sessão anterior (precisava de apoio total).", evolucaoObservada: "Melhora no raciocínio sequencial." },
  { id: "s3", criancaId: "1", data: "2026-04-14", hora: "09:00", duracao: 50, tipo: "individual", presente: false, motivoFalta: "Criança com febre", anotacoes: "Sessão cancelada. Contato com a mãe." },
  { id: "s4", criancaId: "1", data: "2026-04-07", hora: "09:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Introdução a jogos cooperativos simples (jogo da memória em dupla). Tolerância à frustração melhorou — aceitou perder 2 vezes sem crise." },
  { id: "s5", criancaId: "1", data: "2026-03-31", hora: "09:00", duracao: 50, tipo: "familiar", presente: true, anotacoes: "Orientação à mãe sobre estratégias de comunicação visual em casa. Apresentação de recursos de antecipação de rotina." },
  { id: "s6", criancaId: "1", data: "2026-03-24", hora: "09:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Trabalho com habilidades de atenção sustentada. Jogos de encaixe e labirinto. Concentração mantida por 25 minutos consecutivos — recorde pessoal." },
  { id: "s7", criancaId: "1", data: "2026-03-17", hora: "09:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Exploração sensorial com diferentes texturas. Aceitou tocar areia cinética pela primeira vez — grande avanço considerando a hipersensibilidade tátil." },
  { id: "s8", criancaId: "1", data: "2026-03-10", hora: "09:00", duracao: 50, tipo: "orientacao", presente: true, anotacoes: "Reunião com professora regente Ana Paula. Alinhamento de estratégias para sala de aula. Acordado uso de fone anti-ruído durante provas." },

  // Maria Clara (id: "2") — 8 sessões
  { id: "s9", criancaId: "2", data: "2026-05-05", hora: "14:00", duracao: 40, tipo: "individual", presente: true, anotacoes: "Leitura de texto curto com marcação de palavras-chave. Identificou 80% das ideias principais. Exercícios de decodificação fonológica com ganhos visíveis.", evolucaoObservada: "Fluidez leitora com melhora progressiva." },
  { id: "s10", criancaId: "2", data: "2026-04-28", hora: "14:00", duracao: 40, tipo: "individual", presente: true, anotacoes: "Atividade de organização do tempo com agenda visual. Criou sua própria rotina de estudos em casa. Muito engajada pela parte criativa da atividade." },
  { id: "s11", criancaId: "2", data: "2026-04-21", hora: "14:00", duracao: 40, tipo: "individual", presente: false, motivoFalta: "Consulta médica", anotacoes: "Ausência justificada. Reagendado." },
  { id: "s12", criancaId: "2", data: "2026-04-14", hora: "14:00", duracao: 40, tipo: "individual", presente: true, anotacoes: "Treino de escrita com método fônico. Trabalhou correspondência grafema-fonema para grupos consonantais. Erros diminuíram 40% na autoavaliação da sessão." },
  { id: "s13", criancaId: "2", data: "2026-04-07", hora: "14:00", duracao: 40, tipo: "familiar", presente: true, anotacoes: "Orientação à mãe Patrícia. Estratégias para tarefa de casa: fragmentar tarefas longas, usar temporizador, ambiente silencioso." },
  { id: "s14", criancaId: "2", data: "2026-03-31", hora: "14:00", duracao: 40, tipo: "individual", presente: true, anotacoes: "Consciência fonológica: rima, aliteração e sílaba. Desempenho acima da média para o nível. Ponto de atenção: troca de b/d ainda frequente." },
  { id: "s15", criancaId: "2", data: "2026-03-24", hora: "14:00", duracao: 40, tipo: "individual", presente: true, anotacoes: "Uso de audiobook aliado à leitura visual. Maju adorou — maior engajamento observado até hoje. Estratégia mantida." },
  { id: "s16", criancaId: "2", data: "2026-03-17", hora: "14:00", duracao: 40, tipo: "individual", presente: true, anotacoes: "Organização de texto: identificação de início, meio e fim. Recontar histórias com apoio de imagens. Narrativa com coerência crescente." },

  // Pedro (id: "3") — 7 sessões
  { id: "s17", criancaId: "3", data: "2026-05-04", hora: "10:00", duracao: 45, tipo: "individual", presente: true, anotacoes: "Estimulação cognitiva: classificação de objetos por cor e forma. Concluiu atividade com autonomia crescente. Sorridente e participativo durante toda a sessão." },
  { id: "s18", criancaId: "3", data: "2026-04-27", hora: "10:00", duracao: 45, tipo: "individual", presente: true, anotacoes: "Desenvolvimento de linguagem oral: nomeação de figuras do cotidiano. Vocabulário de 45 palavras reconhecidas — acima da meta trimestral." },
  { id: "s19", criancaId: "3", data: "2026-04-20", hora: "10:00", duracao: 45, tipo: "grupo", presente: true, anotacoes: "Sessão em grupo com Sofia. Atividade de cooperação com blocos. Interação social positiva, esperou a vez sem intervenção." },
  { id: "s20", criancaId: "3", data: "2026-04-13", hora: "10:00", duracao: 45, tipo: "individual", presente: true, anotacoes: "Coordenação motora fina: encaixe de peças, rasgar papel, modelagem com massinha. Tonicidade muscular em melhora." },
  { id: "s21", criancaId: "3", data: "2026-04-06", hora: "10:00", duracao: 45, tipo: "familiar", presente: true, anotacoes: "Orientação aos pais Fernanda e Carlos. Atividades de estimulação precoce para casa: música, dança, livros sensoriais." },
  { id: "s22", criancaId: "3", data: "2026-03-30", hora: "10:00", duracao: 45, tipo: "individual", presente: true, anotacoes: "Habilidades de autocuidado: sequência de lavar as mãos com figuras de apoio. Pedro executou 5 das 6 etapas com independência." },
  { id: "s23", criancaId: "3", data: "2026-03-23", hora: "10:00", duracao: 45, tipo: "individual", presente: false, motivoFalta: "Gripe", anotacoes: "Ausente. Mãe avisou por WhatsApp." },

  // Ana Beatriz (id: "4") — 7 sessões
  { id: "s24", criancaId: "4", data: "2026-05-06", hora: "09:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Método fônico avançado: ditado de palavras com grupos consonantais. Acertos: 14/20 — melhor resultado desde início do acompanhamento." },
  { id: "s25", criancaId: "4", data: "2026-04-29", hora: "09:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Resolução de problemas matemáticos com material concreto (palitos, tampas). Contagem e adição até 20 com 100% de acertos usando material de apoio." },
  { id: "s26", criancaId: "4", data: "2026-04-22", hora: "09:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Leitura de palavras bissilábicas e trissilábicas. Bia demonstra estratégia de decodificação sílaba a sílaba — método sendo consolidado." },
  { id: "s27", criancaId: "4", data: "2026-04-15", hora: "09:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Revisão de alfabeto com âncoras visuais (a de abelha, b de bola). Confusão b/d reduziu significativamente com uso de âncora da letra b." },
  { id: "s28", criancaId: "4", data: "2026-04-08", hora: "09:30", duracao: 50, tipo: "orientacao", presente: true, anotacoes: "Reunião com professora Sandra. Acordadas adaptações curriculares: provas orais opcionais, mais tempo para escrita, uso de dicionário." },
  { id: "s29", criancaId: "4", data: "2026-04-01", hora: "09:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Consciência numérica: correspondência número-quantidade. Identificação de números até 50. Base para adição concreta." },
  { id: "s30", criancaId: "4", data: "2026-03-25", hora: "09:30", duracao: 50, tipo: "familiar", presente: true, anotacoes: "Orientação à mãe Mônica. Estratégias para leitura em casa: livros de imagens, acompanhar dedo na leitura, não corrigir em voz alta." },

  // Gabriel (id: "5") — 7 sessões
  { id: "s31", criancaId: "5", data: "2026-05-05", hora: "15:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Trabalho com leitura labial: palavras de uso cotidiano. Gabriel identificou 35/40 palavras sem apoio auditivo — excelente desempenho." },
  { id: "s32", criancaId: "5", data: "2026-04-28", hora: "15:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Introdução ao português como segunda língua (L2). Trabalho com estrutura frasal e concordância. Vocabulário acadêmico em expansão." },
  { id: "s33", criancaId: "5", data: "2026-04-21", hora: "15:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "LIBRAS básico: sinais para matérias escolares. Gabriel já conhecia metade dos sinais — ensinou alguns à psicóloga! Interação muito rica." },
  { id: "s34", criancaId: "5", data: "2026-04-14", hora: "15:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Estratégias de compreensão de textos escritos. Uso de mapas mentais e esquemas visuais. Adaptação do material de história para suporte visual." },
  { id: "s35", criancaId: "5", data: "2026-04-07", hora: "15:30", duracao: 50, tipo: "orientacao", presente: true, anotacoes: "Reunião com professor Marcelo. Orientações sobre comunicação eficaz com Gabriel: sempre de frente, iluminação adequada, evitar cobrir a boca ao falar." },
  { id: "s36", criancaId: "5", data: "2026-03-31", hora: "15:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Produção textual assistida: Gabriel escreveu um parágrafo sobre suas férias com estrutura coerente e vocabulário adequado ao 6º ano." },
  { id: "s37", criancaId: "5", data: "2026-03-24", hora: "15:30", duracao: 50, tipo: "familiar", presente: true, anotacoes: "Orientação à mãe Silvia. Reforço da importância do uso consistente do aparelho auditivo. Dicas para comunicação em casa." },

  // Sofia (id: "6") — 6 sessões
  { id: "s38", criancaId: "6", data: "2026-05-04", hora: "09:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Noções básicas de matemática: contagem até 10 com material concreto. Sofia contou com 100% de acertos usando dedos e fichas." },
  { id: "s39", criancaId: "6", data: "2026-04-27", hora: "09:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Desenvolvimento de linguagem: identificação de figuras e construção de frases simples. Vocabulário funcional em crescimento constante." },
  { id: "s40", criancaId: "6", data: "2026-04-20", hora: "09:00", duracao: 50, tipo: "grupo", presente: true, anotacoes: "Sessão em grupo com Pedro. Atividade de encaixe e classificação. Sofia demonstrou paciência e generosidade ao compartilhar materiais." },
  { id: "s41", criancaId: "6", data: "2026-04-13", hora: "09:00", duracao: 50, tipo: "individual", presente: false, motivoFalta: "Festa na escola", anotacoes: "Ausente — evento escolar. Comunicado com antecedência." },
  { id: "s42", criancaId: "6", data: "2026-04-06", hora: "09:00", duracao: 50, tipo: "familiar", presente: true, anotacoes: "Orientação à mãe Luciana. Rotina estruturada em casa: horários fixos, instruções simples e diretas, reforço positivo imediato." },
  { id: "s43", criancaId: "6", data: "2026-03-30", hora: "09:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Habilidades de vida diária: sequência da rotina de manhã com fichas ilustradas. Sofia ordenou corretamente 4/5 etapas." },

  // Mateus (id: "7") — 8 sessões
  { id: "s44", criancaId: "7", data: "2026-05-06", hora: "13:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Mateus resolveu 15 operações de multiplicação em 8 minutos — desempenho de nível 7º ano. Trabalho de regulação emocional: identificou 3 gatilhos de estresse da semana." },
  { id: "s45", criancaId: "7", data: "2026-04-29", hora: "13:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Atividades de função executiva: planejamento de projeto (montar um foguete de papel). Mateus elaborou lista de materiais e etapas sem apoio." },
  { id: "s46", criancaId: "7", data: "2026-04-22", hora: "13:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Trabalho de flexibilidade cognitiva: mudança de regras no meio do jogo. Reagiu bem após estratégia de aviso prévio (contagem regressiva verbal)." },
  { id: "s47", criancaId: "7", data: "2026-04-15", hora: "13:00", duracao: 50, tipo: "orientacao", presente: true, anotacoes: "Reunião com professor Eduardo. Adaptações acordadas: aviso prévio de mudanças, tarefas fragmentadas, uso de agenda visual digital." },
  { id: "s48", criancaId: "7", data: "2026-04-08", hora: "13:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Habilidades sociais: entrar em um grupo brincando. Prática por role play. Mateus demonstrou capacidade de observar e aguardar momento de entrada." },
  { id: "s49", criancaId: "7", data: "2026-04-01", hora: "13:00", duracao: 50, tipo: "familiar", presente: true, anotacoes: "Orientação à mãe Renata. Manejo de crises em casa: espaço de regulação, musica baixa, não confrontar durante crise. Estratégias preventivas." },
  { id: "s50", criancaId: "7", data: "2026-03-25", hora: "13:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Narrativa oral e escrita: Mateus criou uma história de ficção científica de 3 parágrafos. Criatividade excepcional. Ortografia em nível adequado." },
  { id: "s51", criancaId: "7", data: "2026-03-18", hora: "13:00", duracao: 50, tipo: "individual", presente: false, motivoFalta: "Consulta neurológica", anotacoes: "Ausência justificada." },

  // Isabela (id: "8") — 6 sessões
  { id: "s52", criancaId: "8", data: "2026-05-05", hora: "15:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Trabalho com materiais ampliados: leitura de texto em fonte 24 com lupa. Isabela leu um parágrafo inteiro sem apoio verbal." },
  { id: "s53", criancaId: "8", data: "2026-04-28", hora: "15:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Orientação espacial e mobilidade: identificação de pontos de referência dentro da escola. Isabela demonstrou boa memória espacial." },
  { id: "s54", criancaId: "8", data: "2026-04-21", hora: "15:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Introdução ao Braille: reconhecimento dos pontos do sistema. Interesse demonstrado — pediu para aprender mais rápido!" },
  { id: "s55", criancaId: "8", data: "2026-04-14", hora: "15:00", duracao: 50, tipo: "orientacao", presente: true, anotacoes: "Reunião com professora Cristina. Adaptações: material ampliado, posição na primeira carteira, avaliações orais opcionais." },
  { id: "s56", criancaId: "8", data: "2026-04-07", hora: "15:00", duracao: 50, tipo: "familiar", presente: true, anotacoes: "Orientação à mãe Tatiana sobre recursos de acessibilidade digital. Configuração do modo de alto contraste e aumento de fonte no tablet de Isabela." },
  { id: "s57", criancaId: "8", data: "2026-03-31", hora: "15:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Estimulação visual funcional: discriminação de cores e formas em diferentes contrastes. Isabela distingue melhor contraste preto/branco e amarelo/preto." },

  // João Victor (id: "9") — 3 sessões (em espera, poucas)
  { id: "s58", criancaId: "9", data: "2026-04-10", hora: "10:30", duracao: 40, tipo: "orientacao", presente: true, anotacoes: "Reunião inicial com mãe Vanessa. Coleta de histórico escolar e familiar. Encaminhamento para avaliação psicopedagógica." },
  { id: "s59", criancaId: "9", data: "2026-03-20", hora: "10:30", duracao: 40, tipo: "orientacao", presente: true, anotacoes: "Triagem inicial com João Victor. Observação comportamental durante atividades lúdicas. Confirmação de características de TDAH." },
  { id: "s60", criancaId: "9", data: "2026-03-10", hora: "10:30", duracao: 30, tipo: "orientacao", presente: true, anotacoes: "Primeiro contato — mãe trouxe laudo e histórico. Explicação do processo de entrada no AEE. João Victor aguarda vaga." },

  // Valentina (id: "10") — 2 sessões (em espera)
  { id: "s61", criancaId: "10", data: "2026-04-22", hora: "15:30", duracao: 40, tipo: "orientacao", presente: true, anotacoes: "Triagem inicial com Valentina e mãe Camila. Identificação de dificuldades leitoras consistentes com hipótese de dislexia." },
  { id: "s62", criancaId: "10", data: "2026-04-15", hora: "15:30", duracao: 30, tipo: "orientacao", presente: true, anotacoes: "Primeiro contato com a família. Orientações sobre avaliação e processo de ingresso no AEE. Encaminhamento ao neurologista." },

  // Rafael (id: "11") — 6 sessões (inativo)
  { id: "s63", criancaId: "11", data: "2025-12-08", hora: "14:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Última sessão antes da mudança. Atividade de despedida. Rafael criou um caderno com dicas de como se adaptar a nova escola." },
  { id: "s64", criancaId: "11", data: "2025-11-24", hora: "14:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Preparação emocional para mudança de cidade. Rafael expressou ansiedade — trabalho de antecipação e estratégias de adaptação." },
  { id: "s65", criancaId: "11", data: "2025-11-10", hora: "14:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Habilidades sociais: iniciativa de conversação. Rafael simulou apresentar-se a um colega novo. Desempenho excelente após 4 anos de acompanhamento." },
  { id: "s66", criancaId: "11", data: "2025-10-27", hora: "14:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Revisão das conquistas do ano. Rafael identificou seus próprios avanços com clareza — autorregulação e consciência em nível superior." },
  { id: "s67", criancaId: "11", data: "2025-10-13", hora: "14:30", duracao: 50, tipo: "individual", presente: true, anotacoes: "Trabalho com comunicação alternativa avançada: Rafael usa fala funcional para todos os contextos escolares." },
  { id: "s68", criancaId: "11", data: "2025-09-29", hora: "14:30", duracao: 50, tipo: "familiar", presente: true, anotacoes: "Última reunião com mãe Cláudia antes da transferência. Entrega do relatório de evolução completo para nova escola." },

  // Camila (id: "12") — 6 sessões (inativa)
  { id: "s69", criancaId: "12", data: "2025-11-20", hora: "10:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Última sessão antes da pausa. Atividades de estimulação cognitiva com materiais favoritos da Cami (fantoches e música)." },
  { id: "s70", criancaId: "12", data: "2025-11-06", hora: "10:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Habilidades de comunicação funcional: Cami usou PECS para solicitar 5 objetos diferentes durante a sessão — record pessoal." },
  { id: "s71", criancaId: "12", data: "2025-10-23", hora: "10:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Sequência de autocuidado: Cami organizou materiais escolares na mochila com apoio mínimo de pista visual." },
  { id: "s72", criancaId: "12", data: "2025-10-09", hora: "10:00", duracao: 50, tipo: "familiar", presente: true, anotacoes: "Orientação à mãe Eliana sobre uso do PECS em casa durante o período de tratamento. Material impresso entregue." },
  { id: "s73", criancaId: "12", data: "2025-09-25", hora: "10:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Estimulação de linguagem receptiva: Cami segue instruções de 2 etapas com 70% de acurácia." },
  { id: "s74", criancaId: "12", data: "2025-09-11", hora: "10:00", duracao: 50, tipo: "individual", presente: true, anotacoes: "Trabalho com habilidades sociais básicas: cumprimentar, pedir, agradecer. Uso de histórias sociais ilustradas." },
];

export const evolucoes: Evolucao[] = [
  // Lucas
  { id: "e1", criancaId: "1", data: "2026-04-30", periodo: "1º Semestre 2026", descricao: "Lucas demonstra progresso significativo na comunicação funcional. Passou de 2-3 palavras por sessão para frases de 4-5 palavras. A tolerância à frustração melhorou consideravelmente — crises de intensidade alta passaram de diárias para raras (1x/semana conforme relato da mãe). Continua com dificuldade em ambientes sensorialmente intensos.", areas: ["Comunicação", "Regulação Emocional", "Habilidades Sociais"], proximosPassos: "Iniciar trabalho de leitura de expressões faciais com cartões de emoção. Introduzir jogo de tabuleiro cooperativo em sessão." },
  { id: "e2", criancaId: "1", data: "2025-12-20", periodo: "2º Semestre 2025", descricao: "Primeiro semestre de acompanhamento. Lucas chegou sem linguagem verbal funcional e com alta rigidez comportamental. Ao final do semestre, já nomeia objetos conhecidos e aceita pequenas mudanças de rotina com aviso prévio. A relação de vínculo com a psicóloga está bem estabelecida.", areas: ["Linguagem", "Flexibilidade Cognitiva", "Vínculo Terapêutico"] },

  // Maria Clara
  { id: "e3", criancaId: "2", data: "2026-04-30", periodo: "1º Semestre 2026", descricao: "Maju apresenta evolução expressiva na leitura: passou de leitura silabada lenta para leitura de palavras com maior fluência. Os erros de inversão diminuíram 50%. Na área de TDAH, as estratégias de organização do tempo estão sendo internalizadas — relatou à mãe que 'lembrou de usar o cronômetro' para tarefa de casa sem ser solicitada.", areas: ["Leitura", "Escrita", "Organização e Planejamento"] },
  { id: "e4", criancaId: "2", data: "2025-12-18", periodo: "2º Semestre 2025", descricao: "Período de avaliação inicial e estabelecimento de vínculo. Maju foi avaliada com ferramentas padronizadas — leitura no nível de 2º ano (defasagem de 3 anos). Motivação elevada para aprender, o que é um fator protetivo importante. Intervenção fonológica iniciada com método Fônico Fônico.", areas: ["Avaliação", "Consciência Fonológica", "Motivação"] },

  // Pedro
  { id: "e5", criancaId: "3", data: "2026-04-28", periodo: "1º Semestre 2026", descricao: "Pedro supriu a meta de vocabulário do trimestre (45 palavras, meta era 35). Sua interação social em sessões de grupo é ponto alto — esperado da Síndrome de Down. A coordenação motora fina avança gradualmente. Pais muito engajados, o que potencializa os resultados.", areas: ["Linguagem Oral", "Habilidades Sociais", "Motricidade Fina"] },
  { id: "e6", criancaId: "3", data: "2025-12-15", periodo: "2º Semestre 2025", descricao: "Semestre inicial. Pedro chegou com comunicação predominantemente gestual e choro para expressar necessidades. Hoje verbaliza 'água', 'não', 'mais' e 3 nomes de familiares de forma espontânea. Compreensão de instruções simples de 1 etapa consolidada.", areas: ["Comunicação Alternativa", "Linguagem Receptiva"] },

  // Ana Beatriz
  { id: "e7", criancaId: "4", data: "2026-05-06", periodo: "1º Semestre 2026", descricao: "Bia está consolidando a alfabetização com método fônico. Acertos no ditado passaram de 40% para 70%. A discalculia ainda impõe desafios para operações abstratas, mas com material concreto o desempenho é satisfatório. Autoestima muito melhorada — relatou à mãe que 'não é burra, aprende diferente'.", areas: ["Leitura e Escrita", "Matemática", "Autoestima"] },
  { id: "e8", criancaId: "4", data: "2025-12-10", periodo: "2º Semestre 2025", descricao: "Avaliação inicial revelou dislexia e discalculia. Bia tinha resistência total a leitura. Após 8 sessões com método fônico, demonstrou primeiros avanços na correspondência letra-som. Vínculo terapêutico estabelecido após trabalho com artes plásticas na fase de engajamento.", areas: ["Avaliação Diagnóstica", "Engajamento", "Fonologia"] },

  // Gabriel
  { id: "e9", criancaId: "5", data: "2026-04-28", periodo: "1º Semestre 2026", descricao: "Gabriel está em nível avançado dentro do AEE. Sua leitura labial é excepcional e a produção textual em português está no nível adequado ao 6º ano. O trabalho agora foca em vocabulário acadêmico específico das disciplinas e na preparação para o Ensino Médio. LIBRAS sendo aprendida em paralelo com a psicóloga por iniciativa própria.", areas: ["Leitura Labial", "Produção Textual", "LIBRAS", "Autonomia"] },
  { id: "e10", criancaId: "5", data: "2025-12-05", periodo: "2º Semestre 2025", descricao: "Anual de 2025: Gabriel consolidou leitura labial em contexto escolar. Principais avanços: produção de texto com coerência e coesão adequadas, uso efetivo do aparelho auditivo, sensibilização dos professores sobre comunicação acessível.", areas: ["Leitura Labial", "Escrita", "Inclusão Escolar"] },

  // Sofia
  { id: "e11", criancaId: "6", data: "2026-04-27", periodo: "1º Semestre 2026", descricao: "Sofia avança em ritmo próprio e consistente. Contagem até 10 consolidada, vocabulário funcional em crescimento. O trabalho em grupo com Pedro tem sido especialmente positivo para habilidades sociais. A família está muito engajada, o que é diferencial importante.", areas: ["Cognição", "Linguagem", "Habilidades Sociais"] },
  { id: "e12", criancaId: "6", data: "2025-12-08", periodo: "2º Semestre 2025", descricao: "Início do acompanhamento em agosto. Em 5 meses, Sofia passou de comunicação predominantemente gestual para verbalização de 25 palavras funcionais. Segue rotina da sala AEE sem resistência — vínculo sólido estabelecido.", areas: ["Comunicação", "Rotina", "Vínculo"] },

  // Mateus
  { id: "e13", criancaId: "7", data: "2026-04-29", periodo: "1º Semestre 2026", descricao: "Mateus é o caso mais complexo do grupo, mas também o de maiores avanços longitudinais. A autorregulação emocional está muito mais sólida — crises graves não ocorrem há 3 meses. Sua superdotação em matemática é trabalhada como recurso terapêutico e motivacional. As habilidades sociais avançam com prática sistemática por role play.", areas: ["Autorregulação", "Habilidades Sociais", "Cognição Matemática", "Flexibilidade Cognitiva"] },
  { id: "e14", criancaId: "7", data: "2025-06-30", periodo: "1º Semestre 2025", descricao: "Após 3 anos de acompanhamento, Mateus demonstra autonomia crescente. A comunicação em contextos sociais simples está estabelecida. A grande conquista do semestre: participação voluntária em trabalho de grupo na sala regular — algo impensável há 2 anos.", areas: ["Autonomia", "Comunicação Social", "Inclusão"] },

  // Isabela
  { id: "e15", criancaId: "8", data: "2026-04-28", periodo: "1º Semestre 2026", descricao: "Isabela demonstra motivação excepcional. O interesse pelo Braille é ponto positivo para planejamento da continuidade. A orientação espacial na escola está consolidada. A família tem sido parceira fundamental na acessibilidade digital em casa.", areas: ["Leitura com Apoio Visual", "Orientação Espacial", "Braille", "Tecnologia Assistiva"] },
  { id: "e16", criancaId: "8", data: "2025-11-30", periodo: "2º Semestre 2025", descricao: "Semestre inicial. Isabela chegou sem estratégias de compensação para a deficiência visual. Ao final do período, já usa lupa e material ampliado de forma autônoma. A autoconfiança cresceu — não se envergonha mais da condição em sala de aula.", areas: ["Compensação Sensorial", "Autoconfiança", "Autonomia"] },

  // Rafael (inativo)
  { id: "e17", criancaId: "11", data: "2025-12-01", periodo: "Relatório de Alta — 2025", descricao: "Rafael encerrou 4 anos de acompanhamento em dezembro/2025 por transferência de município. Chegou ao AEE sem linguagem verbal funcional e com comportamentos de autoagressão frequentes. Saiu com comunicação verbal funcional em todos os contextos, relacionamento social positivo com 2 amigos próximos e plena participação acadêmica. Caso de sucesso documentado para referência institucional.", areas: ["Comunicação Verbal", "Habilidades Sociais", "Comportamento Adaptativo", "Inclusão Plena"] },
  { id: "e18", criancaId: "11", data: "2023-12-15", periodo: "Relatório Anual 2023", descricao: "Marco importante: Rafael verbalizou sua primeira frase espontânea ('Quero ir jogar') durante sessão de junho. Comportamentos de autoagressão reduziram 80%. Iniciou amizade com um colega — acompanhamento feito de forma indireta pela professora.", areas: ["Linguagem Expressiva", "Comportamento", "Socialização"] },

  // Camila (inativa)
  { id: "e19", criancaId: "12", data: "2025-11-15", periodo: "Relatório de Pausa — Nov/2025", descricao: "Camila em pausa temporária para tratamento médico intensivo. Em 2 anos de acompanhamento, passou de comunicação zero para uso funcional do sistema PECS (30 ícones). Habilidades de autocuidado básicas (higiene, alimentação) com apoio mínimo. Retorno previsto para agosto/2026.", areas: ["Comunicação Alternativa", "Autocuidado", "PECS"] },
  { id: "e20", criancaId: "12", data: "2024-06-30", periodo: "Relatório Semestral — 1º Semestre 2024", descricao: "Primeiro ano completo de acompanhamento. A Cami chegou sem qualquer sistema de comunicação. Hoje usa PECS para solicitar 15 itens e aceita rotina da sala AEE sem resistência. Os pais relatam que a Cami está 'mais feliz e menos frustrada' em casa.", areas: ["Comunicação Alternativa", "Redução de Frustração", "Rotina"] },
];

// Funções utilitárias para acesso aos dados
export function getCriancaById(id: string): Crianca | undefined {
  return criancas.find((c) => c.id === id);
}

export function getSessoesByCriancaId(criancaId: string): Sessao[] {
  return sessoes
    .filter((s) => s.criancaId === criancaId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

export function getEvolucoesByCriancaId(criancaId: string): Evolucao[] {
  return evolucoes
    .filter((e) => e.criancaId === criancaId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

export function getTaxaPresenca(criancaId: string): number {
  const sessoesC = sessoes.filter((s) => s.criancaId === criancaId);
  if (sessoesC.length === 0) return 0;
  const presentes = sessoesC.filter((s) => s.presente).length;
  return Math.round((presentes / sessoesC.length) * 100);
}

export function getSessoesDoMes(mes?: number, ano?: number): Sessao[] {
  const hoje = new Date();
  const m = mes ?? hoje.getMonth();
  const a = ano ?? hoje.getFullYear();
  return sessoes.filter((s) => {
    const d = new Date(s.data);
    return d.getMonth() === m && d.getFullYear() === a;
  });
}

export function criancasSemSessaoRecente(dias = 15): Crianca[] {
  const limite = new Date();
  limite.setDate(limite.getDate() - dias);
  return criancas
    .filter((c) => c.status === "ativo")
    .filter((c) => {
      const ultimaSessao = sessoes
        .filter((s) => s.criancaId === c.id && s.presente)
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
      if (!ultimaSessao) return true;
      return new Date(ultimaSessao.data) < limite;
    });
}
