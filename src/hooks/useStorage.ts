'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import type { Aluno, Atendimento, Relatorio } from '@/types';

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const data = storage.getAlunos();
    setAlunos(data);
    setLoading(false);
  }, []);

  const addAluno = (aluno: Omit<Aluno, 'id' | 'created_at' | 'updated_at'>) => {
    const newAluno = storage.addAluno(aluno);
    setAlunos([newAluno, ...alunos]);
    return newAluno;
  };

  const updateAluno = (id: string, updates: Partial<Aluno>) => {
    const updated = storage.updateAluno(id, updates);
    if (updated) {
      setAlunos(alunos.map(a => a.id === id ? updated : a));
    }
    return updated;
  };

  const deleteAluno = (id: string) => {
    storage.deleteAluno(id);
    setAlunos(alunos.filter(a => a.id !== id));
  };

  return { alunos, loading, addAluno, updateAluno, deleteAluno };
}

export function useAtendimentos() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const data = storage.getAtendimentos();
    setAtendimentos(data);
    setLoading(false);
  }, []);

  const addAtendimento = (atendimento: Omit<Atendimento, 'id' | 'created_at' | 'updated_at'>) => {
    const newAtendimento = storage.addAtendimento(atendimento);
    setAtendimentos([newAtendimento, ...atendimentos]);
    return newAtendimento;
  };

  const updateAtendimento = (id: string, updates: Partial<Atendimento>) => {
    const updated = storage.updateAtendimento(id, updates);
    if (updated) {
      setAtendimentos(atendimentos.map(a => a.id === id ? updated : a));
    }
    return updated;
  };

  const deleteAtendimento = (id: string) => {
    storage.deleteAtendimento(id);
    setAtendimentos(atendimentos.filter(a => a.id !== id));
  };

  return { atendimentos, loading, addAtendimento, updateAtendimento, deleteAtendimento };
}

export function useRelatorios() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const data = storage.getRelatorios();
    setRelatorios(data);
    setLoading(false);
  }, []);

  const addRelatorio = (relatorio: Omit<Relatorio, 'id' | 'created_at' | 'updated_at'>) => {
    const newRelatorio = storage.addRelatorio(relatorio);
    setRelatorios([newRelatorio, ...relatorios]);
    return newRelatorio;
  };

  const updateRelatorio = (id: string, updates: Partial<Relatorio>) => {
    const updated = storage.updateRelatorio(id, updates);
    if (updated) {
      setRelatorios(relatorios.map(r => r.id === id ? updated : r));
    }
    return updated;
  };

  const deleteRelatorio = (id: string) => {
    storage.deleteRelatorio(id);
    setRelatorios(relatorios.filter(r => r.id !== id));
  };

  return { relatorios, loading, addRelatorio, updateRelatorio, deleteRelatorio };
}