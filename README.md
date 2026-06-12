# Controle AEE

Sistema de gestão para psicóloga do Atendimento Educacional Especializado (AEE).

## Uso (Rafaela)

1. Acesse o sistema publicado: https://armageddonlkr.github.io/Controle-AEE/
2. Em **Crianças**, clique em **Nova Criança** para o primeiro cadastro.
3. No perfil de cada criança você registra **sessões** e **evoluções**, e exporta a ficha em PDF ou Word.
4. Os dados ficam salvos **no próprio dispositivo** (navegador). Use sempre o mesmo aparelho/navegador
   e não limpe os dados de navegação do site. A sincronização na nuvem (Supabase) virá na fase 2.
5. Dica: instale como aplicativo — no celular, use "Adicionar à tela inicial".

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Deploy (publicação)

⚠️ **O GitHub Actions está bloqueado nesta conta** ("account locked due to a billing issue"),
então o workflow `deploy.yml` não roda automaticamente — todo job falha antes de iniciar.
Enquanto a pendência não for resolvida em [github.com/settings/billing](https://github.com/settings/billing),
o deploy é feito pela branch `gh-pages`:

1. Gere a build estática:
   ```bash
   npm run build
   ```
2. Publique o conteúdo de `out/` na branch `gh-pages` (com um arquivo `.nojekyll` na raiz):
   ```bash
   git worktree add /tmp/gh-pages gh-pages
   rm -rf /tmp/gh-pages/*
   cp -r out/. /tmp/gh-pages/
   touch /tmp/gh-pages/.nojekyll
   cd /tmp/gh-pages && git add -A && git commit -m "deploy" && git push origin gh-pages
   ```
3. Confira em **Settings → Pages** que a origem está como
   **Deploy from a branch → `gh-pages` → `/ (root)`**.

O site fica disponível em `https://armageddonlkr.github.io/Controle-AEE/` alguns minutos após o push.

Quando o bloqueio de cobrança da conta for resolvido, reative o gatilho `push` no
arquivo `.github/workflows/deploy.yml` (instruções comentadas no próprio arquivo) e
volte a origem do Pages para **GitHub Actions**.
