# Controle AEE

Sistema de gestão para psicóloga do Atendimento Educacional Especializado (AEE).

## Uso (Rafaela)

1. Acesse o sistema publicado: https://armageddonlkr.github.io/Controle-AEE/
2. Em **Crianças**, clique em **Nova Criança** para o primeiro cadastro.
3. Os dados ficam salvos no Supabase (nuvem) — não há crianças de exemplo.

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Deploy

O push na branch `main` dispara o GitHub Actions e publica em GitHub Pages.
