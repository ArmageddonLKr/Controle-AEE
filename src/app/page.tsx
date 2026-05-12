'use client';

import { useState } from 'react';
import { Plus, Menu, X } from 'lucide-react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: 'Total de Alunos', value: '42', color: 'bg-blue-500' },
    { label: 'Atendimentos Mês', value: '156', color: 'bg-green-500' },
    { label: 'Relatórios Pendentes', value: '8', color: 'bg-yellow-500' },
    { label: 'Atividades Concluídas', value: '234', color: 'bg-purple-500' },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="md:hidden sticky top-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Controle AEE</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:sticky top-14 md:top-0 left-0 z-40 w-64 h-screen bg-card border-r border-border p-4 transition-transform duration-300`}>
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold">Controle AEE</h1>
        </div>
        <nav className="space-y-2">
          <a href="#" className="block px-4 py-2 rounded-lg bg-accent text-accent-foreground">Dashboard</a>
          <a href="#" className="block px-4 py-2 rounded-lg hover:bg-muted">Alunos</a>
          <a href="#" className="block px-4 py-2 rounded-lg hover:bg-muted">Atendimentos</a>
          <a href="#" className="block px-4 py-2 rounded-lg hover:bg-muted">Relatórios</a>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="hidden md:block">
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <p className="text-muted-foreground">Bem-vindo ao Controle AEE</p>
            </div>
            <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg w-full md:w-auto justify-center">
              <Plus size={20} /> Novo Aluno
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4 md:p-6">
                <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Atendimentos Recentes</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 md:px-4">Aluno</th>
                  <th className="text-left py-2 px-2 md:px-4 hidden sm:table-cell">Data</th>
                  <th className="text-left py-2 px-2 md:px-4">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { nome: 'João Silva', data: '12/05/2026', tipo: 'Avaliação' },
                  { nome: 'Maria Santos', data: '11/05/2026', tipo: 'Acompanhamento' },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted">
                    <td className="py-3 px-2 md:px-4">{item.nome}</td>
                    <td className="py-3 px-2 md:px-4 hidden sm:table-cell">{item.data}</td>
                    <td className="py-3 px-2 md:px-4">{item.tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
