-- supabase/migrations/002_revert_rls.sql

-- Etapa 1: Remover as políticas de segurança da tabela criancas
-- É crucial remover as políticas antes de desabilitar a RLS.
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON public.criancas;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.criancas;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.criancas;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.criancas;

-- Etapa 2: Desabilitar a Row Level Security na tabela
-- Isso efetivamente torna a tabela pública novamente, respeitando as permissões da API Key.
ALTER TABLE public.criancas DISABLE ROW LEVEL SECURITY;

-- Etapa 3: Remover a coluna user_id, que não é mais necessária
-- Mantém o schema limpo e alinhado com a nova estratégia de acesso direto.
ALTER TABLE public.criancas
DROP COLUMN IF EXISTS user_id;

-- COMENTÁRIO IMPORTANTE:
-- Execute este script no Editor SQL do seu projeto Supabase.
-- Isso é ESSENCIAL para que a aplicação volte a funcionar sem um sistema de login.
