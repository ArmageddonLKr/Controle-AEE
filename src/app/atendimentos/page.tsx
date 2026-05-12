'use client';

import { Menu, X, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function AtendimentosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="md:hidden sticky top-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/Controle-AEE/" className="p-1">
            <ChevronLeft size={24} />
          </a>
          <h1 className="text-lg font-bold">Atendimentos</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:sticky top-14 md:top-0 left-0 z-40 w-64 h-screen bg-card border-r border-border p-4 transition-transform duration-300`}
      >
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold">Controle AEE</h1>
        </div>
        <nav className="space-y-2">
          <a href="/Controle-AEE/" className="block px-4 py-2 rounded-lg hover:bg-muted">
            📊 Dashboard
          </a>
          <a href="/Controle-AEE/criancas" className="block px-4 py-2 rounded-lg hover:bg-muted">
            👧 Crianças
          </a>
          <a href="/Controle-AEE/atendimentos" className="block px-4 py-2 rounded-lg bg-accent text-accent-foreground">
            📝 Atendimentos
          </a>
          <a href="/Controle-AEE/relatorios" className="block px-4 py-2 rounded-lg hover:bg-muted">
            📄 Relatórios
          </a>
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 p-4 md:p-6">
        <h2 className="text-3xl font-bold mb-4">Atendimentos</h2>
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">Em desenvolvimento...</p>
        </div>
      </main>
    </div>
  );
}