-- =============================================================
-- Gym Music IA — Migration 001: Initial Schema
-- Tabelas: musicas, clientes_academias, logs_execucao
-- RLS habilitado em todas as tabelas
-- =============================================================

-- Garante extensão de UUID disponível
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- TABELA: musicas
-- Acesso de leitura: authenticated (via Server Components)
-- Escrita: service_role apenas (Server Actions admin)
-- =============================================================

CREATE TABLE musicas (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome           TEXT        NOT NULL,
  estilo         TEXT,
  letra          TEXT,
  prompt_usado   TEXT,
  link_audio     TEXT        NOT NULL,
  hash_sha256    TEXT        NOT NULL UNIQUE,
  data_criacao   TIMESTAMPTZ NOT NULL DEFAULT now(),
  curado_por     TEXT,
  data_curadoria TIMESTAMPTZ
);

ALTER TABLE musicas ENABLE ROW LEVEL SECURITY;

-- Usuários autenticados podem listar e buscar músicas
-- (acesso real feito via service_role em Server Components)
CREATE POLICY "musicas_select_authenticated"
  ON musicas
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT / UPDATE / DELETE bloqueados para todos exceto service_role
-- (nenhuma policy = bloqueado para anon e authenticated)


-- =============================================================
-- TABELA: clientes_academias
-- Acesso: cada academia lê/atualiza só o próprio registro (user_id)
-- Admin: acesso total via service_role
-- =============================================================

CREATE TABLE clientes_academias (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social          TEXT        NOT NULL,
  cnpj                  TEXT        NOT NULL UNIQUE,
  endereco_autorizado   TEXT        NOT NULL,
  status_assinatura     TEXT        NOT NULL DEFAULT 'trial'
                          CHECK (status_assinatura IN ('ativa', 'cancelada', 'inadimplente', 'trial')),
  token_acesso          TEXT        UNIQUE DEFAULT gen_random_uuid()::TEXT,
  stripe_customer_id    TEXT        UNIQUE,
  stripe_subscription_id TEXT       UNIQUE,
  data_inicio           TIMESTAMPTZ,
  data_validade         TIMESTAMPTZ,
  user_id               UUID        REFERENCES auth.users (id) ON DELETE CASCADE
);

ALTER TABLE clientes_academias ENABLE ROW LEVEL SECURITY;

-- Academia lê somente o próprio registro
CREATE POLICY "clientes_select_own"
  ON clientes_academias
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Academia pode atualizar somente o próprio registro
-- (em geral a atualização de status ocorre via service_role no webhook,
--  mas mantemos a policy para atualizações permitidas pela própria academia)
CREATE POLICY "clientes_update_own"
  ON clientes_academias
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- INSERT feito via service_role na Server Action de cadastro
-- DELETE feito via service_role no admin

-- Índices para queries frequentes
CREATE INDEX idx_clientes_academias_cnpj    ON clientes_academias (cnpj);
CREATE INDEX idx_clientes_academias_user_id ON clientes_academias (user_id);
CREATE INDEX idx_clientes_academias_status  ON clientes_academias (status_assinatura);


-- =============================================================
-- TABELA: logs_execucao
-- INSERT: somente via service_role (Route Handler /api/audio)
-- SELECT: somente via service_role (painel admin)
-- Nenhuma policy = bloqueado para anon e authenticated
-- =============================================================

CREATE TABLE logs_execucao (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID        NOT NULL REFERENCES clientes_academias (id) ON DELETE CASCADE,
  musica_id  UUID        NOT NULL REFERENCES musicas (id)            ON DELETE CASCADE,
  data_hora  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_origem  TEXT
);

ALTER TABLE logs_execucao ENABLE ROW LEVEL SECURITY;

-- Sem policies: todo acesso direto ao cliente é bloqueado pelo RLS.
-- Toda interação com esta tabela ocorre via service_role:
--   - INSERT: Route Handler /api/audio/[musicaId]
--   - SELECT: Server Components do painel admin

-- Índices para queries admin (logs por cliente, logs recentes)
CREATE INDEX idx_logs_execucao_cliente_id ON logs_execucao (cliente_id);
CREATE INDEX idx_logs_execucao_data_hora  ON logs_execucao (data_hora DESC);
CREATE INDEX idx_logs_execucao_musica_id  ON logs_execucao (musica_id);
