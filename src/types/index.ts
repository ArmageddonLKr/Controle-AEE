export interface Responsavel {
  nome: string;
  parentesco: string;
  telefone: string;
  email?: string;
  responsavelLegal: boolean;
}

export interface Crianca {
  id: string;
  nome: string;
  apelido?: string;
  foto?: string;
  dataNascimento: string;
  genero: "M" | "F";
  status: "ativo" | "inativo" | "espera";
  escola: string;
  turma: string;
  serie: string;
  /** Pasta / nível em que a criança fica organizada na aba Crianças */
  nivel?: string;
  turno: "manhã" | "tarde" | "integral";
  professorRegente?: string;
  diagnosticos: string[];
  cids: string[];
  dataInicioAcompanhamento: string;
  responsaveis: Responsavel[];
  observacoesImportantes?: string;
  medicamentos?: string[];
  alergias?: string[];
}

export interface Sessao {
  id: string;
  criancaId: string;
  data: string;
  hora: string;
  duracao: number;
  tipo: "individual" | "grupo" | "familiar" | "orientacao";
  presente: boolean;
  motivoFalta?: string;
  anotacoes: string;
  evolucaoObservada?: string;
}

export interface Evolucao {
  id: string;
  criancaId: string;
  data: string;
  periodo: string;
  descricao: string;
  areas: string[];
  proximosPassos?: string;
}

export interface Reuniao {
  id: string;
  data: string; // ISO date
  hora: string; // "09:00"
  duracao: number; // minutos
  titulo: string;
  tipo: 'pedagogica' | 'familiar' | 'multiprofissional' | 'formacao' | 'outra';
  participantes: string[]; // nomes
  local: string;
  anotacoes: string;
  criancasRelacionadas?: string[]; // IDs das crianças discutidas
}
