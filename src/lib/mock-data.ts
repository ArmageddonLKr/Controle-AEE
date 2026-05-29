
// src/lib/mock-data.ts
import { Crianca, Sessao, Evolucao } from '@/types';
import { subDays, addDays } from 'date-fns';

// --- DADOS MOCK REALISTAS ---

const hoje = new Date();

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
    diagnosticos: ['TEA', 'TDAH'],
    cids: ['F84.0', 'F90.0'],
    dataInicioAcompanhamento: '2023-02-15T00:00:00.000Z',
    responsaveis: [{ nome: 'Ana Oliveira', parentesco: 'Mãe', telefone: '(21) 98765-4321', responsavelLegal: true }],
    observacoesImportantes: 'Hipersensibilidade a sons altos. Prefere atividades visuais.',
  },
  {
    id: '2',
    nome: 'Júlia Pereira da Silva',
    dataNascimento: subDays(hoje, 365 * 7).toISOString(), // Aniversário hoje!
    genero: 'F',
    status: 'ativo',
    escola: 'Escola Girassol',
    turma: '5A',
    serie: '5º Ano',
    turno: 'manhã',
    diagnosticos: ['Dislexia'],
    cids: ['F81.0'],
    dataInicioAcompanhamento: '2022-09-01T00:00:00.000Z',
    responsaveis: [{ nome: 'Marcos da Silva', parentesco: 'Pai', telefone: '(31) 91234-5678', responsavelLegal: true }],
    alergias: ['Poeira'],
  },
  // ... mais 10 crianças, com dados variados como especificado no CLAUDE.md
];

export const sessoes: Sessao[] = [
  {
    id: 's1',
    criancaId: '1',
    data: subDays(hoje, 5).toISOString(),
    hora: '14:00',
    duracao: 50,
    tipo: 'individual',
    presente: true,
    anotacoes: 'Foco em atividades de regulação emocional. Usamos o tabuleiro de sentimentos.',
    evolucaoObservada: 'Demonstrou melhora na identificação de emoções básicas.',
  },
  // ... mais sessões para todas as crianças
];

export const evolucoes: Evolucao[] = [
  {
    id: 'e1',
    criancaId: '1',
    data: '2024-06-30T00:00:00.000Z',
    periodo: '1º Semestre 2024',
    descricao: 'Lucas apresentou avanços significativos na interação social com os pares...',
    areas: ['Interação Social', 'Comunicação'],
    proximosPassos: 'Introduzir jogos em grupo com regras simples.',
  },
  // ... mais registros de evolução
];

// --- FUNÇÕES DE ACESSO AOS DADOS MOCK ---

export const getCriancas = () => criancas;
export const getCriancaById = (id: string) => criancas.find(c => c.id === id);
export const getSessoesByCriancaId = (criancaId: string) => sessoes.filter(s => s.criancaId === criancaId);
export const getEvolucoesByCriancaId = (criancaId: string) => evolucoes.filter(e => e.criancaId === criancaId);

