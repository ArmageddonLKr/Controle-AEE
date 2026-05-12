'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Aluno } from '@/types';

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlunos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar alunos');
    } finally {
      setLoading(false);
    }
  };

  const createAluno = async (aluno: Omit<Aluno, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .insert([aluno])
        .select();

      if (error) throw error;
      if (data) setAlunos([data[0], ...alunos]);
      return data?.[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar aluno');
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  return { alunos, loading, error, fetchAlunos, createAluno };
}
