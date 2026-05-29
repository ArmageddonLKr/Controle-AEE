-- supabase/migrations/001_initial_rls.sql

-- Etapa 1: Adicionar a coluna user_id na tabela criancas
-- Esta coluna vai armazenar a referência ao usuário autenticado que criou o registro.
-- O default auth.uid() preenche automaticamente na inserção.
ALTER TABLE public.criancas
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id)
DEFAULT auth.uid();

-- Etapa 2: Habilitar a Row Level Security na tabela
ALTER TABLE public.criancas ENABLE ROW LEVEL SECURITY;

-- Etapa 3: Criar as políticas de segurança
-- Apaga políticas antigas se existirem, para garantir um estado limpo.
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON public.criancas;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.criancas;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.criancas;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.criancas;

-- Política para SELECT: Usuários só podem ver (select) suas próprias crianças.
CREATE POLICY "Enable select for authenticated users only" ON public.criancas
AS PERMISSIVE FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política para INSERT: Usuários podem inserir (insert) crianças, associando o user_id automaticamente.
CREATE POLICY "Enable insert for authenticated users only" ON public.criancas
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE: Usuários podem atualizar (update) suas próprias crianças.
CREATE POLICY "Enable update for authenticated users only" ON public.criancas
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE: Usuários podem deletar (delete) suas próprias crianças.
CREATE POLICY "Enable delete for authenticated users only" ON public.criancas
AS PERMISSIVE FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- COMENTÁRIO IMPORTANTE:
-- Execute este script no Editor SQL do seu projeto Supabase.
-- Isso garante que os dados de cada psicólogo(a) sejam isolados e seguros.
