import type { Aluno, Atendimento, Relatorio } from '@/types';

const ALUNOS_KEY = 'controle_aee_alunos';
const ATENDIMENTOS_KEY = 'controle_aee_atendimentos';
const RELATORIOS_KEY = 'controle_aee_relatorios';

export const storage = {
  // ALUNOS
  getAlunos: (): Aluno[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ALUNOS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addAluno: (aluno: Omit<Aluno, 'id' | 'created_at' | 'updated_at'>) => {
    const alunos = storage.getAlunos();
    const newAluno: Aluno = {
      ...aluno,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    alunos.push(newAluno);
    localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
    return newAluno;
  },

  updateAluno: (id: string, updates: Partial<Aluno>) => {
    const alunos = storage.getAlunos();
    const index = alunos.findIndex(a => a.id === id);
    if (index !== -1) {
      alunos[index] = {
        ...alunos[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
      return alunos[index];
    }
    return null;
  },

  deleteAluno: (id: string) => {
    let alunos = storage.getAlunos();
    alunos = alunos.filter(a => a.id !== id);
    localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
    
    // Deletar atendimentos da criança
    let atendimentos = storage.getAtendimentos();
    atendimentos = atendimentos.filter(a => a.aluno_id !== id);
    localStorage.setItem(ATENDIMENTOS_KEY, JSON.stringify(atendimentos));
    
    // Deletar relatórios da criança
    let relatorios = storage.getRelatorios();
    relatorios = relatorios.filter(r => r.aluno_id !== id);
    localStorage.setItem(RELATORIOS_KEY, JSON.stringify(relatorios));
  },

  // ATENDIMENTOS
  getAtendimentos: (): Atendimento[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ATENDIMENTOS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addAtendimento: (atendimento: Omit<Atendimento, 'id' | 'created_at' | 'updated_at'>) => {
    const atendimentos = storage.getAtendimentos();
    const newAtendimento: Atendimento = {
      ...atendimento,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    atendimentos.push(newAtendimento);
    localStorage.setItem(ATENDIMENTOS_KEY, JSON.stringify(atendimentos));
    return newAtendimento;
  },

  updateAtendimento: (id: string, updates: Partial<Atendimento>) => {
    const atendimentos = storage.getAtendimentos();
    const index = atendimentos.findIndex(a => a.id === id);
    if (index !== -1) {
      atendimentos[index] = {
        ...atendimentos[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(ATENDIMENTOS_KEY, JSON.stringify(atendimentos));
      return atendimentos[index];
    }
    return null;
  },

  deleteAtendimento: (id: string) => {
    let atendimentos = storage.getAtendimentos();
    atendimentos = atendimentos.filter(a => a.id !== id);
    localStorage.setItem(ATENDIMENTOS_KEY, JSON.stringify(atendimentos));
  },

  // RELATÓRIOS
  getRelatorios: (): Relatorio[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(RELATORIOS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addRelatorio: (relatorio: Omit<Relatorio, 'id' | 'created_at' | 'updated_at'>) => {
    const relatorios = storage.getRelatorios();
    const newRelatorio: Relatorio = {
      ...relatorio,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    relatorios.push(newRelatorio);
    localStorage.setItem(RELATORIOS_KEY, JSON.stringify(relatorios));
    return newRelatorio;
  },

  updateRelatorio: (id: string, updates: Partial<Relatorio>) => {
    const relatorios = storage.getRelatorios();
    const index = relatorios.findIndex(r => r.id === id);
    if (index !== -1) {
      relatorios[index] = {
        ...relatorios[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(RELATORIOS_KEY, JSON.stringify(relatorios));
      return relatorios[index];
    }
    return null;
  },

  deleteRelatorio: (id: string) => {
    let relatorios = storage.getRelatorios();
    relatorios = relatorios.filter(r => r.id !== id);
    localStorage.setItem(RELATORIOS_KEY, JSON.stringify(relatorios));
  },

  clearAll: () => {
    localStorage.removeItem(ALUNOS_KEY);
    localStorage.removeItem(ATENDIMENTOS_KEY);
    localStorage.removeItem(RELATORIOS_KEY);
  },
};
