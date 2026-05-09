# CLAUDE.md — Controle AEE
## Documento de Especificação Completa para Claude Code

> **Leia este documento inteiro antes de executar qualquer coisa.**
> Execute na ordem exata descrita. Não pule etapas. Não improvise.

---

## 1. CONTEXTO DO PROJETO

**Nome:** Controle AEE  
**Repositório:** `ArmageddonLKr/Controle-AEE` (GitHub)  
**Para:** Rafaela Dias — psicóloga que atende crianças no AEE (Atendimento Educacional Especializado)  
**Objetivo desta fase:** Sistema visual 100% funcional, bonito, instalável como PWA, acessível via link público no GitHub Pages — com dados de exemplo (mock). Supabase será conectado depois.

**O que Rafaela vai fazer nesta fase:** Apenas visualizar o sistema. Ela não vai cadastrar dados reais agora. Os dados de exemplo já existem no seed e no mock.

---

## 2. STACK TÉCNICA

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 com `output: 'export'` (estático) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Dados (agora) | Mock data local em `lib/mock-data.ts` |
| Dados (depois) | Supabase JS Client (já preparado, sem credenciais) |
| Deploy | GitHub Pages via GitHub Actions |
| PWA | manifest.json + sw.js |
| Exportação | jsPDF + jspdf-autotable + docx |
| Ícones | Lucide React |
| Fonte | Plus Jakarta Sans (Google Fonts) |

---

## 3. ESTADO ATUAL DO REPOSITÓRIO

O repositório já possui:
- Estrutura Next.js 16 com TypeScript
- Tailwind CSS + shadcn/ui configurados
- Componentes UI: Button, Input, Badge, Card, Dialog, Tabs, Select, Toast, etc.
- Páginas: `/` (dashboard), `/alunos`, `/alunos/[id]`, `/atendimentos`, `/relatorios`
- Exportação para PDF e Excel funcionando
- Prisma + SQLite configurados (vamos remover)
- Server Actions (vamos remover)
- API Routes (vamos remover)

---

## 4. O QUE DEVE SER FEITO — VISÃO GERAL

1. **Remover** toda lógica server-side: Server Actions, Prisma, API Routes
2. **Criar** camada de mock data realista
3. **Preparar** camada Supabase (pronta, sem credenciais)
4. **Reescrever** todas as páginas como Client Components
5. **Redesenhar** completamente o visual (design system, temas, logo)
6. **Adicionar** funcionalidades faltantes
7. **Configurar** PWA (manifest + service worker)
8. **Configurar** deploy automático GitHub Pages
9. **Configurar** `next.config.ts` para export estático

---

## 5. DESIGN SYSTEM

### 5.1 Logo — Controle AEE

Criar arquivo `public/logo.svg` — ícone representando uma criança sendo acolhida/apoiada, estilo minimalista. Sugestão: silhueta de criança com uma mão aberta ao lado (símbolo de cuidado e inclusão), com as iniciais "AEE" integradas de forma limpa. Cores do tema aplicadas via CSS variables. Deve funcionar bem em 32px e em tamanhos maiores.

Criar também `public/logo-text.svg` com o ícone + texto "Controle AEE" lado a lado.

### 5.2 Paleta de Cores

```css
/* Tema Claro */
--bg-primary: #F0F7FF;       /* Fundo principal — azul-gelo */
--bg-card: #FFFFFF;          /* Cards */
--bg-sidebar: #1E3A5F;       /* Sidebar azul-petróleo */
--text-primary: #1A2B45;     /* Texto principal — navy profundo */
--text-secondary: #4A6080;   /* Texto secundário */
--text-muted: #8FA3BC;       /* Texto suave */
--accent-primary: #4A9EBF;   /* Cerulean — acento principal */
--accent-secondary: #6EC6CA; /* Teal — acento secundário */
--accent-light: #E0F4F8;     /* Acento claro para badges */
--border: #D1E3F0;           /* Bordas */
--success: #2ECC8E;
--warning: #F0A500;
--danger: #E05555;

/* Tema Escuro */
--bg-primary: #0D1B2A;       /* Midnight navy */
--bg-card: #1A2E45;          /* Cards escuros */
--bg-sidebar: #0A1520;       /* Sidebar mais escuro */
--text-primary: #E8F4FD;     /* Branco-gelo */
--text-secondary: #A8C4D8;   /* Texto secundário claro */
--text-muted: #5A7A90;       /* Texto suave */
--accent-primary: #64DFDF;   /* Ciano elétrico */
--accent-secondary: #A78BFA; /* Lavanda */
--accent-light: #1A3A4A;     /* Acento claro escuro */
--border: #1E3A55;
--success: #2ECC8E;
--warning: #F0A500;
--danger: #E05555;
```

### 5.3 Tipografia

```css
font-family: 'Plus Jakarta Sans', sans-serif;
/* Importar do Google Fonts no layout.tsx */

/* Escala */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
```

### 5.4 Estilo Geral

- **Raio de borda:** `0.75rem` para cards, `0.5rem` para inputs, `9999px` para badges
- **Sombras suaves** nos cards: `0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)`
- **Sidebar fixa** com largura 240px, tema próprio (azul-petróleo no claro, quase preto no escuro)
- **Animações suaves** nas transições (200ms ease)
- **Glassmorphism leve** apenas no sidebar no tema escuro
- **Sem bordas duras** — usar sombras para separar elementos

---

## 6. ESTRUTURA DE ARQUIVOS FINAL

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions para GitHub Pages
├── public/
│   ├── logo.svg                 # Logo ícone SVG
│   ├── logo-text.svg            # Logo com texto SVG
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service Worker
│   └── icons/
│       ├── icon-192.png         # PWA icon 192x192
│       └── icon-512.png         # PWA icon 512x512
├── src/
│   ├── app/
│   │   ├── globals.css          # CSS global com variáveis de tema
│   │   ├── layout.tsx           # Layout principal (sidebar + toaster)
│   │   ├── page.tsx             # Dashboard
│   │   ├── alunos/
│   │   │   ├── page.tsx         # Catálogo de crianças (cards)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Perfil completo da criança
│   │   ├── calendario/
│   │   │   └── page.tsx         # Calendário de sessões + aniversários
│   │   ├── relatorios/
│   │   │   └── page.tsx         # Gerador de relatórios + exportação
│   │   └── configuracoes/
│   │       └── page.tsx         # Tema claro/escuro + info do sistema
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx      # Sidebar com navegação e logo
│   │   │   └── PageHeader.tsx   # Cabeçalho de páginas
│   │   ├── shared/
│   │   │   ├── AlunoCard.tsx    # Card de criança no catálogo
│   │   │   ├── StatCard.tsx     # Card de estatística no dashboard
│   │   │   ├── BirthdayAlert.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── ExportButton.tsx
│   │   └── ui/                  # shadcn components existentes
│   ├── lib/
│   │   ├── mock-data.ts         # Dados de exemplo completos e realistas
│   │   ├── supabase.ts          # Cliente Supabase (pronto, sem credenciais)
│   │   ├── theme.tsx            # Provider de tema claro/escuro
│   │   └── utils/
│   │       ├── birthday.ts
│   │       ├── export-pdf.ts
│   │       ├── export-docx.ts   # Novo: exportação Word
│   │       └── greeting.ts      # Lógica da saudação dinâmica
│   └── types/
│       └── index.ts             # Tipos TypeScript do projeto
├── next.config.ts               # Config com output: 'export'
├── tailwind.config.ts
└── CLAUDE.md                    # Este arquivo
```

---

## 7. CONFIGURAÇÕES CRÍTICAS

### 7.1 next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Controle-AEE",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

### 7.2 GitHub Actions — `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 7.3 PWA Manifest — `public/manifest.json`

```json
{
  "name": "Controle AEE",
  "short_name": "AEE",
  "description": "Sistema de gestão para psicóloga do AEE",
  "start_url": "/Controle-AEE/",
  "scope": "/Controle-AEE/",
  "display": "standalone",
  "background_color": "#F0F7FF",
  "theme_color": "#1E3A5F",
  "orientation": "any",
  "icons": [
    {
      "src": "/Controle-AEE/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/Controle-AEE/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 7.4 Service Worker — `public/sw.js`

```javascript
const CACHE_NAME = 'controle-aee-v1';
const urlsToCache = [
  '/Controle-AEE/',
  '/Controle-AEE/alunos/',
  '/Controle-AEE/calendario/',
  '/Controle-AEE/relatorios/',
  '/Controle-AEE/configuracoes/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('/Controle-AEE/'));
    })
  );
});
```

---

## 8. DADOS MOCK — `src/lib/mock-data.ts`

Criar dados realistas e completos para demonstração. Mínimo:

- **12 crianças** com nomes brasileiros variados
- Faixa etária: 5 a 14 anos
- Diagnósticos variados: TEA, TDAH, Síndrome de Down, Dislexia, Deficiência Intelectual, Deficiência Auditiva, Deficiência Visual
- Status variados: ativo (8), espera (2), inativo (2)
- **3 com aniversário nos próximos 7 dias** (um deles hoje)
- **2 com aniversário hoje** (para demonstrar o alerta)
- Escolas diferentes (mínimo 3 escolas)
- Turmas e séries variadas
- **Histórico de sessões** para cada criança (mínimo 6 sessões cada)
- **Registros de evolução** (mínimo 2 por criança)
- **Responsáveis** com telefones
- **Observações importantes** realistas

### Tipos de dados necessários:

```typescript
export interface Crianca {
  id: string;
  nome: string;
  apelido?: string;
  foto?: string; // emoji ou iniciais coloridas
  dataNascimento: string; // ISO date
  genero: 'M' | 'F';
  status: 'ativo' | 'inativo' | 'espera';
  escola: string;
  turma: string;
  serie: string;
  turno: 'manhã' | 'tarde' | 'integral';
  professorRegente?: string;
  diagnosticos: string[]; // ex: ['TEA', 'TDAH']
  cids: string[]; // ex: ['F84.0', 'F90.0']
  dataInicioAcompanhamento: string;
  responsaveis: Responsavel[];
  observacoesImportantes?: string;
  medicamentos?: string[];
  alergias?: string[];
}

export interface Responsavel {
  nome: string;
  parentesco: string;
  telefone: string;
  email?: string;
  responsavelLegal: boolean;
}

export interface Sessao {
  id: string;
  criancaId: string;
  data: string; // ISO date
  hora: string; // "09:00"
  duracao: number; // minutos
  tipo: 'individual' | 'grupo' | 'familiar' | 'orientacao';
  presente: boolean;
  motivoFalta?: string;
  anotacoes: string;
  evolucaoObservada?: string;
}

export interface Evolucao {
  id: string;
  criancaId: string;
  data: string;
  periodo: string; // "1º Semestre 2025"
  descricao: string;
  areas: string[];
  proximosPasoss?: string;
}
```

---

## 9. CAMADA SUPABASE — `src/lib/supabase.ts`

Preparar mas NÃO conectar. Deve ter comentários claros indicando onde inserir credenciais.

```typescript
// src/lib/supabase.ts
// SUPABASE — PRONTO PARA CONEXÃO
// Quando Rafaela criar a conta no Supabase:
// 1. Criar projeto em supabase.com
// 2. Copiar URL e anon key
// 3. Criar arquivo .env.local com:
//    NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
// 4. Descomentar o código abaixo
// 5. Rodar npm run build e fazer push para main

// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabase = null; // Remover quando conectar
export const isSupabaseConnected = false; // Mudar para true quando conectar
```

---

## 10. TEMA CLARO/ESCURO — `src/lib/theme.tsx`

```typescript
// Context provider para tema
// Salvar preferência no localStorage
// Aplicar classe 'dark' no <html>
// Exportar: ThemeProvider, useTheme
// Toggle acessível via botão na sidebar
```

---

## 11. SAUDAÇÃO DINÂMICA — `src/lib/utils/greeting.ts`

```typescript
export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `Bom dia, ${name} 👋`;
  if (hour >= 12 && hour < 18) return `Boa tarde, ${name} 👋`;
  return `Boa noite, ${name} 👋`;
}
// Usar com: getGreeting("Rafaela Dias")
```

---

## 12. PÁGINAS — ESPECIFICAÇÃO DETALHADA

### 12.1 Dashboard (`/`)

**Elementos obrigatórios:**
- Saudação grande no topo: `"Bom dia, Rafaela Dias 👋"` (dinâmica por horário)
- Data atual formatada em PT-BR abaixo da saudação
- **4 KPI cards** em grid 2x2 (mobile) / 4x1 (desktop):
  - Total crianças ativas (número grande + ícone)
  - Sessões este mês
  - Aniversários nos próximos 7 dias
  - Total de sessões registradas
- **Alerta de aniversário** — destaque especial se houver aniversário HOJE (banner com confete emoji)
- **Lista de aniversários próximos** (próximos 7 dias) — cards com foto/iniciais, nome, data, "Em X dias" ou "Hoje!"
- **Sessões recentes** — lista das últimas 6 sessões com nome da criança, data, tipo, presença
- **Crianças sem sessão há mais de 15 dias** — alerta visual em amarelo

### 12.2 Catálogo de Crianças (`/alunos`)

**Elementos obrigatórios:**
- Header com título + contador + botão "Nova Criança" (desabilitado nesta fase com tooltip "Disponível em breve")
- **Barra de busca** com busca por nome em tempo real
- **Chips de filtro** horizontal: Todos / Ativos / Em espera / Inativos
- **Filtros adicionais** (dropdown): por escola, por diagnóstico, por série/turma, aniversário do mês
- **Grid de cards** responsivo: 1 col mobile, 2 col tablet, 3 col desktop, 4 col wide
- **Cada card** contém:
  - Avatar circular (iniciais com cor baseada no nome, ou foto se houver)
  - Nome completo (bold)
  - Idade calculada automaticamente
  - Badge de diagnóstico principal
  - Badge de status (ativo=verde-água, espera=âmbar, inativo=cinza)
  - Escola + turma
  - Indicador 🎂 se aniversário nos próximos 7 dias
  - Botão "Ver perfil" no hover
- Animação suave de entrada nos cards (fade + slide up com stagger)

### 12.3 Perfil da Criança (`/alunos/[id]`)

**Layout:** coluna lateral esquerda (info) + área principal (abas)

**Coluna lateral:**
- Avatar grande com iniciais/foto
- Nome + status badge
- Idade + data de nascimento
- Escola + turma + série + turno
- Todos os diagnósticos (badges coloridos)
- Lista de responsáveis com telefone e parentesco
- Data de início do acompanhamento
- Observações importantes (destaque em caixa amarela se houver)
- Medicamentos (se houver)
- Mini-stats: total de sessões, taxa de presença (%), total de registros de evolução

**Abas:**
1. **📓 Sessões** — lista cronológica reversa, cada sessão com: data, tipo, duração, presente/falta, anotações. Botão "Nova Sessão" (desabilitado)
2. **📈 Evolução** — cards por período com áreas trabalhadas (chips coloridos) e descrição
3. **📋 Informações** — dados completos: família, histórico escolar, dados clínicos
4. **📤 Exportar** — selecionar o que exportar (checkboxes) e formato (PDF / Word)

### 12.4 Calendário (`/calendario`)

**Elementos:**
- Vista mensal com navegação anterior/próximo
- Dias com sessões marcados com ponto colorido
- Dias com aniversários marcados com 🎂
- Ao clicar em um dia: painel lateral mostrando sessões e aniversários do dia
- Legenda das cores
- Lista dos próximos 7 eventos (sessões + aniversários) à direita

### 12.5 Relatórios (`/relatorios`)

**Filtros:**
- Período (data início + data fim) com preset de opções: Este mês, Último mês, Este semestre
- Criança (todas ou selecionar)
- Tipo de sessão (todas, individual, grupo, familiar)
- Status de presença (todas, presentes, faltas)

**Resultado:**
- Cards de resumo: total de sessões, taxa de presença, total de horas
- Tabela com todos os registros filtrados
- Botão exportar PDF e Word com dados filtrados

**Templates de exportação (já formatados):**
- **Relatório de Atendimentos**: cabeçalho "Controle AEE", dados da psicóloga "Rafaela Dias", período, tabela com dados
- **Ficha da Criança**: todos os dados + histórico de sessões + evolução

### 12.6 Configurações (`/configuracoes`)

**Seções:**
- **Aparência**: Toggle tema claro/escuro (visual bonito, não só um switch simples)
- **Sobre o sistema**: nome, versão, info sobre o que é o AEE
- **Conexão Supabase**: card informativo explicando o que é e que estará disponível em breve (não é botão, é informativo)
- **PWA**: instrução de como instalar no celular (com screenshots ilustrativos)

---

## 13. COMPONENTES — DETALHES IMPORTANTES

### Sidebar

```
- Logo Controle AEE no topo (ícone + texto)
- Avatar de Rafaela Dias (iniciais "RD" em círculo)
- Texto "Rafaela Dias" + "Psicóloga"
- Itens de navegação:
  - 🏠 Início
  - 👧 Crianças
  - 📅 Calendário
  - 📊 Relatórios
  - ⚙️ Configurações
- Item ativo com highlight no acento do tema
- Indicador de status: "● Dados de exemplo" em badge âmbar
- Toggle de tema (sol/lua) no rodapé
```

### AlunoCard

- Hover: leve elevação de sombra + botão "Ver perfil" aparece
- Avatar: cor gerada deterministicamente a partir do nome (não aleatório)
- Badge de status com cores semânticas
- Aniversário nos próximos 7 dias: borda sutil animada dourada

### ExportButton

- Dropdown com opções: "Exportar PDF" e "Exportar Word"
- Ícones diferentes para cada formato
- Loading state durante geração

---

## 14. EXPORTAÇÃO WORD — `src/lib/utils/export-docx.ts`

Usar biblioteca `docx` (npm install docx).

```typescript
// Exportar documento Word formatado com:
// - Cabeçalho: "Controle AEE" + "Rafaela Dias — Psicóloga"
// - Data de geração
// - Conteúdo selecionado formatado profissionalmente
// - Rodapé com número de página
```

---

## 15. REMOÇÕES OBRIGATÓRIAS

Remover completamente os seguintes arquivos e referências:

- `prisma/` (pasta inteira)
- `src/app/actions/` (pasta inteira — server actions)
- `src/app/api/` (pasta inteira — api routes)
- `src/lib/prisma.ts`
- `src/lib/validations/` (substituir por validação client-side simples se necessário)
- `src/app/atendimentos/` (não teremos rota separada de atendimentos — ficam no perfil da criança)
- Todas as diretivas `"use server"` e `"use client"` desnecessárias

**Remover dependências do package.json:**
- `@prisma/client`
- `prisma`

**Adicionar dependências:**
- `docx` — exportação Word
- `@supabase/supabase-js` — preparar mas não usar ainda
- `dexie` — não precisa agora (dados são mock)

---

## 16. ÍCONES PWA — GERAÇÃO

Como Next.js static export não gera ícones automaticamente, criar um script simples ou usar um SVG da logo e gerar PNG via canvas. O ícone deve ser:
- Fundo: `#1E3A5F` (azul-petróleo)
- Ícone central: logo SVG branco
- Tamanhos: 192x192 e 512x512

Criar `public/icons/icon-192.png` e `public/icons/icon-512.png` programaticamente via script Node.js ou inline no build, **OU** criar como SVG renomeado se PNG não for possível.

---

## 17. REGISTRO DO SERVICE WORKER — layout.tsx

Adicionar no `layout.tsx`:

```typescript
// No useEffect do lado client (via componente ClientInit)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/Controle-AEE/sw.js');
}
```

Criar componente `src/components/ClientInit.tsx` que faz isso sem quebrar o SSG.

---

## 18. PACKAGE.JSON — SCRIPTS

Garantir que os scripts existam:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Remover scripts do Prisma (`db:generate`, `db:migrate`, `db:seed`, `db:studio`).

---

## 19. ORDEM DE EXECUÇÃO — PARA O CLAUDE CODE

Execute nesta ordem exata. Não pule etapas. Confirme cada etapa antes de seguir:

```
ETAPA 1 — Limpeza
  1.1 Remover arquivos listados na seção 15
  1.2 Atualizar package.json (remover Prisma, adicionar docx e supabase-js)
  1.3 Rodar: npm install

ETAPA 2 — Configuração base
  2.1 Criar next.config.ts (seção 7.1)
  2.2 Criar .github/workflows/deploy.yml (seção 7.2)
  2.3 Criar public/manifest.json (seção 7.3)
  2.4 Criar public/sw.js (seção 7.4)

ETAPA 3 — Design System
  3.1 Reescrever src/app/globals.css com variáveis de tema (seção 5.2)
  3.2 Criar src/lib/theme.tsx (provider de tema)
  3.3 Criar public/logo.svg
  3.4 Criar public/logo-text.svg
  3.5 Gerar/criar public/icons/icon-192.png e icon-512.png

ETAPA 4 — Utilitários
  4.1 Criar src/lib/utils/greeting.ts
  4.2 Criar src/lib/supabase.ts (preparado, sem credenciais)
  4.3 Atualizar src/lib/utils/export-pdf.ts
  4.4 Criar src/lib/utils/export-docx.ts
  4.5 Manter src/lib/utils/birthday.ts

ETAPA 5 — Mock Data
  5.1 Criar src/lib/mock-data.ts com dados completos e realistas
      (12 crianças, sessões, evoluções — conforme seção 8)
  5.2 Criar src/types/index.ts com todos os tipos

ETAPA 6 — Layout e Componentes base
  6.1 Reescrever src/app/layout.tsx (tema provider, fonte, PWA meta tags)
  6.2 Reescrever src/components/layout/Sidebar.tsx
  6.3 Manter/melhorar src/components/layout/PageHeader.tsx
  6.4 Criar src/components/ClientInit.tsx (service worker)
  6.5 Melhorar componentes UI existentes conforme design system

ETAPA 7 — Páginas
  7.1 Reescrever src/app/page.tsx (Dashboard)
  7.2 Reescrever src/app/alunos/page.tsx (Catálogo)
  7.3 Reescrever src/app/alunos/[id]/page.tsx (Perfil)
  7.4 Criar src/app/calendario/page.tsx
  7.5 Reescrever src/app/relatorios/page.tsx
  7.6 Criar src/app/configuracoes/page.tsx

ETAPA 8 — Componentes específicos
  8.1 Criar src/components/shared/AlunoCard.tsx
  8.2 Melhorar src/components/shared/StatCard.tsx
  8.3 Melhorar src/components/shared/BirthdayAlert.tsx
  8.4 Melhorar src/components/shared/ExportButton.tsx

ETAPA 9 — Teste local
  9.1 Rodar: npm run build
  9.2 Verificar se a pasta /out foi gerada sem erros
  9.3 Corrigir qualquer erro de build

ETAPA 10 — Commit e deploy
  10.1 Fazer commit de todas as alterações
  10.2 Push para branch main
  10.3 Verificar GitHub Actions rodando
  10.4 Confirmar URL: armageddonlkr.github.io/Controle-AEE
```

---

## 20. REGRAS INVIOLÁVEIS PARA O CLAUDE CODE

1. **NUNCA** usar `"use server"` — este é um projeto totalmente client-side
2. **NUNCA** importar Prisma — foi removido
3. **SEMPRE** usar `"use client"` nos componentes com hooks ou interatividade
4. **SEMPRE** usar dados do `mock-data.ts` — sem fetch para APIs externas
5. **NUNCA** usar `next/image` com otimização — usar `<img>` ou configurar `unoptimized: true`
6. **SEMPRE** testar `npm run build` antes de considerar uma etapa concluída
7. **NUNCA** criar rotas de API (`src/app/api/`) — não funcionam em static export
8. **SEMPRE** usar o `basePath: '/Controle-AEE'` nos links internos (Next.js resolve automaticamente com `Link`, mas atenção em URLs manuais)
9. **SEMPRE** escrever comentários em PT-BR
10. **NUNCA** instalar dependências sem verificar compatibilidade com Next.js 16 static export

---

## 21. CHECKLIST FINAL ANTES DO DEPLOY

- [ ] `npm run build` roda sem erros
- [ ] Pasta `/out` gerada com todos os arquivos HTML
- [ ] `manifest.json` presente em `/out`
- [ ] `sw.js` presente em `/out`
- [ ] Ícones PWA presentes em `/out/icons/`
- [ ] Logo SVG presente
- [ ] Tema claro funciona
- [ ] Tema escuro funciona
- [ ] Saudação dinâmica funciona
- [ ] Catálogo de crianças exibe 12 crianças com cards bonitos
- [ ] Perfil da criança exibe todas as abas
- [ ] Calendário mostra sessões e aniversários
- [ ] Relatórios filtra e exibe dados mock
- [ ] Exportação PDF funciona
- [ ] Exportação Word funciona
- [ ] Instalável como PWA (manifest válido)
- [ ] GitHub Actions configurado e rodando
- [ ] URL pública funcionando: `armageddonlkr.github.io/Controle-AEE`

---

## 22. NOTAS FINAIS

- Este documento é a **fonte de verdade** do projeto. Em caso de dúvida, consulte aqui.
- A conexão com Supabase será feita em uma segunda fase, após Rafaela criar a conta.
- O sistema deve impressionar visualmente — é uma demonstração para a cliente aprovar.
- Todos os textos da interface devem estar em **português brasileiro**.
- O sistema representa o trabalho com crianças especiais — o design deve transmitir **acolhimento, profissionalismo e confiança**.

---

*Documento criado para o projeto Controle AEE — ArmageddonLKr/Controle-AEE*
*Versão: 1.0 — Fase Visual*
