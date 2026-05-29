// src/hooks/useAlunos.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Crianca } from '@/types';

const fetchAlunos = async (): Promise<Crianca[]> => {
  const { data, error } = await supabase
    .from('criancas') // O nome da sua tabela no Supabase
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar crianças:', error);
    throw new Error('Não foi possível buscar os dados das crianças.');
  }

  return data || [];
};

export const useAlunos = () => {
  return useQuery<Crianca[], Error>({
    queryKey: ['criancas'], // Chave única para a query
    queryFn: fetchAlunos,
  });
};
