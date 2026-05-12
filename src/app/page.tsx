'use client';

import { useState } from 'react';
import { Menu, X, Users, Calendar, FileText, CheckCircle } from 'lucide-react';
import { useAlunos } from '@/hooks/useStorage';

export default function Dashboard() {
  const { alunos } = useAlunos();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { 
      label: 'Total de Crianças', 
      value: alunos.length.toString(), 
      color: 'bg-blue-500', 
      icon: Users 
    },
    { 
      label: 'Atendimentos', 
      value: '156', 
      color: 'bg-green-500', 
      icon: Calendar 
    },
    { 
      label: 'Relatórios', 
      value: '8', 
      color: 'bg-yellow-500', 
      icon: FileText 
    },
    { 
      label: 'Atividades', 
      value: '234', 
      color: 'bg-purple-500', 
      icon: CheckCircle 
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Controle AEE</h1>
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
          <p className="text-xs text-muted-foreground mt-2">Gestão de Crianças</p>
        </div>
        <nav className="space-y-2">
          <a href="/Controle-AEE/" className="block px-4 py-2 rounded-lg bg-accent text-accent-foreground">
            📊 Dashboard
          </a>
          <a href="/Controle-AEE/criancas" className="block px-4 py-2 rounded-lg hover:bg-muted">
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="hidden md:block">
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <p className="text-muted-foreground">Bem-vindo ao Controle AEE</p>
            </div>
            <a
              href="/Controle-AEE/criancas"
              className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:opacity-90 w-full md:w-auto justify-center"
            >
              ➕ Adicionar Criança
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-lg p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
                      <p className="text-2xl md:text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg opacity-20`}>
                      <Icon size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Crianças Cadastradas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 md:px-4 font-semibold">Nome</th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold hidden sm:table-cell">Responsável</th>
                    <th className="text-left py-3 px-2 md:px-4 font-semibold hidden md:table-cell">Status</th>
                    <th className="text-right py-3 px-2 md:px-4 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-muted-foreground">
                        Nenhuma criança cadastrada. Comece a adicionar!
                      </td>
                    </tr>
                  ) : (
                    alunos.slice(0, 5).map((aluno) => (
                      <tr key={aluno.id} className="border-b border-border hover:bg-muted">
                        <td className="py-3 px-2 md:px-4 font-medium">{aluno.nome}</td>
                        <td className="py-3 px-2 md:px-4 hidden sm:table-cell text-muted-foreground">
                          {aluno.responsavel || '-'}
                        </td>
                        <td className="py-3 px-2 md:px-4 hidden md:table-cell">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-700 dark:text-green-400">
                            Ativo
                          </span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right">
                          <a
                            href={`/Controle-AEE/criancas?id=${aluno.id}`}
                            className="text-blue-600 hover:underline text-xs md:text-sm"
                          >
                            Ver
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}