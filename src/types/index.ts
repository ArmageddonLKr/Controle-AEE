export interface Aluno {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  responsavel?: string;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

export interface Atendimento {
  id: string;
  aluno_id: string;
  data_atendimento: string;
  tipo_atendimento: string;
  observacoes?: string;
  resultado?: string;
  created_at: string;
  updated_at: string;
}

export interface Relatorio {
  id: string;
  aluno_id: string;
  data_relatorio: string;
  titulo: string;
  conteudo?: string;
  created_at: string;
  updated_at: string;
}