'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Menu, X, ChevronLeft } from 'lucide-react';
import { useAlunos } from '@/hooks/useStorage';
import type { Aluno } from '@/types';

export default function CriancasPage() {
  const { alunos, loading, addAluno, updateAluno, deleteAluno } = useAlunos();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
    responsavel: '',
    status: 'ativo' as 'ativo' | 'inativo',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateAluno(editingId, formData);
    } else {
      addAluno(formData);
    }
    
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      endereco: '',
      cidade: '',
      estado: '',
      responsavel: '',
      status: 'ativo',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (aluno: Aluno) => {
    setFormData({
      nome: aluno.nome,
      email: aluno.email || '',
      telefone: aluno.telefone || '',
      data_nascimento: aluno.data_nascimento || '',
      endereco: aluno.endereco || '',
      cidade: aluno.cidade || '',
      estado: aluno.estado || '',
      responsavel: aluno.responsavel || '',
      status: aluno.status,
    });
    setEditingId(aluno.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteAluno(id);
    setDeleteConfirm(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      endereco: '',
      cidade: '',
      estado: '',
      responsavel: '',
      status: 'ativo',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/Controle-AEE/" className="p-1">
            <ChevronLeft size={24} />
          </a>
          <h1 className="text-lg font-bold">Crianças</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:sticky top-14 md:top-0 left-0 z-40 w-64 h-screen bg-card border-r border-border p-4 transition-transform duration-300 overflow-y-auto`}
      >
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold">Controle AEE</h1>
        </div>
        <nav className="space-y-2">
          <a href="/Controle-AEE/" className="block px-4 py-2 rounded-lg hover:bg-muted">
            📊 Dashboard
          </a>
          <a href="/Controle-AEE/criancas" className="block px-4 py-2 rounded-lg bg-accent text-accent-foreground">
            👧 Crianças
          </a>
          <a href="/Controle-AEE/atendimentos" className="block px-4 py-2 rounded-lg hover:bg-muted">
            📝 Atendimentos
          </a>
          <a href="/Controle-AEE/relatorios" className="block px-4 py-2 rounded-lg hover:bg-muted">
            📄 Relatórios
          </a>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="hidden md:block">
              <h2 className="text-3xl font-bold">Crianças</h2>
              <p className="text-muted-foreground">Total: {alunos.length}</p>
            </div>
            <button
              onClick={() => {
                if (showForm) {
                  handleCancel();
                } else {
                  setShowForm(true);
                }
              }}
              className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:opacity-90 w-full md:w-auto justify-center"
            >
              <Plus size={20} />
              {showForm ? 'Cancelar' : 'Adicionar Criança'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-card border border-border rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? '✏️ Editar Criança' : '➕ Nova Criança'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Nome *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Nome da criança"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Cidade"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    placeholder="SP"
                    maxLength={2}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Responsável</label>
                  <input
                    type="text"
                    name="responsavel"
                    value={formData.responsavel}
                    onChange={handleChange}
                    placeholder="Nome do responsável"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="ativo">✅ Ativo</option>
                    <option value="inativo">❌ Inativo</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-accent text-accent-foreground py-2 rounded-lg hover:opacity-90 font-medium"
                  >
                    {editingId ? '💾 Atualizar' : '💾 Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted"
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="bg-card border border-border rounded-lg p-4 md:p-6 overflow-x-auto">
            {alunos.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma criança cadastrada. Adicione uma agora!
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 md:px-4 font-semibold">Nome</th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold hidden sm:table-cell">Responsável</th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold hidden md:table-cell">Telefone</th>
                    <th className="text-right py-3 px-2 md:px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((aluno) => (
                    <tr key={aluno.id} className="border-b border-border hover:bg-muted">
                      <td className="py-3 px-2 md:px-4 font-medium">{aluno.nome}</td>
                      <td className="py-3 px-2 md:px-4 hidden sm:table-cell text-muted-foreground">
                        {aluno.responsavel || '-'}
                      </td>
                      <td className="py-3 px-2 md:px-4 hidden md:table-cell text-muted-foreground">
                        {aluno.telefone || '-'}
                      </td>
                      <td className="py-3 px-2 md:px-4 text-right">
                        <button
                          onClick={() => handleEdit(aluno)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:bg-blue-500/10 px-2 py-1 rounded mr-2"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                          <span className="hidden sm:inline text-xs">Editar</span>
                        </button>
                        {deleteConfirm === aluno.id ? (
                          <div className="inline-flex gap-1">
                            <button
                              onClick={() => handleDelete(aluno.id)}
                              className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                              ✅ Confirmar
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
                            >
                              ❌ Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(aluno.id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:bg-red-500/10 px-2 py-1 rounded"
                            title="Deletar"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline text-xs">Deletar</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}