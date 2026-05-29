-- supabase/migrations/003_create_sessoes_table.sql

-- Etapa 1: Criar um tipo ENUM para os tipos de sessão
-- Isso garante que apenas valores válidos possam ser inseridos na coluna `tipo`.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sessao_tipo') THEN
        CREATE TYPE sessao_tipo AS ENUM ('individual', 'grupo', 'familiar', 'orientacao');
    END IF;
END$$;

-- Etapa 2: Criar a tabela `sessoes`
CREATE TABLE IF NOT EXISTS public.sessoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crianca_id UUID NOT NULL REFERENCES public.criancas(id) ON DELETE CASCADE,
    data TIMESTAMPTZ NOT NULL,
    hora TEXT,
    duracao INT, -- em minutos
    tipo sessao_tipo NOT NULL,
    presente BOOLEAN DEFAULT true,
    motivo_falta TEXT,
    anotacoes TEXT NOT NULL,
    evolucao_observada TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Etapa 3: Criar índices para otimizar as consultas
-- Um índice na chave estrangeira é crucial para a performance de joins e lookups.
CREATE INDEX IF NOT EXISTS idx_sessoes_crianca_id ON public.sessoes(crianca_id);

-- Etapa 4: Comentários sobre as colunas para documentação
COMMENT ON COLUMN public.sessoes.crianca_id IS 'Referencia o ID da criança na tabela `criancas`.';
COMMENT ON COLUMN public.sessoes.data IS 'Data e hora de início da sessão.';
COMMENT ON COLUMN public.sessoes.duracao IS 'Duração da sessão em minutos.';
COMMENT ON COLUMN public.sessoes.anotacoes IS 'Anotações detalhadas sobre a sessão.';
COMMENT ON COLUMN public.sessoes.evolucao_observada IS 'Breve resumo da evolução observada na sessão.';

-- Como decidido, não estamos adicionando RLS (Row Level Security) a esta tabela no momento.
