# SPEC.md — Gym Music IA

> Versão: 1.2  
> Data: 2026-05-01  
> Autor: Diego  
> Status: Draft

---

## 1. Visão Geral do Produto

**Gym Music IA** é uma plataforma SaaS de assinatura mensal que fornece músicas geradas por IA para academias tocarem em seus estabelecimentos. As músicas são licenciadas diretamente pelo autor (Diego), eliminando a necessidade de pagamento ao ECAD.

### Proposta de Valor
- Academias pagam uma mensalidade e recebem acesso a um catálogo curado de músicas
- Licença legal documentada por CNPJ (endereço autorizado)
- Músicas geradas por IA com estilo adequado para treino
- Página pública de validação de licença para fiscalização ou auditoria

### Princípio Arquitetural Central
**Thin Client / Fat Server**: toda lógica de negócio reside no back-end (Server Components, Route Handlers, Server Actions do Next.js). O front-end apenas renderiza dados já validados pelo servidor. Chaves de API e segredos jamais chegam ao bundle do cliente.

---

## 2. Stack Técnica

| Camada | Tecnologia |
|--------|------------|
| Frontend / Backend | Next.js (App Router) |
| Banco de dados | Supabase (PostgreSQL + Auth + Storage) |
| Pagamento | Stripe (Subscriptions + Webhooks) |
| Automação externa | n8n (fora do codebase) |
| Deploy | Vercel |

---

## 3. Banco de Dados (Supabase)

### 3.1 Tabela `musicas`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PRIMARY KEY | Identificador único |
| `nome` | `text` NOT NULL | Nome/título da música |
| `estilo` | `text` | Gênero ou estilo (ex: "funk workout", "eletrônico") |
| `letra` | `text` | Letra da música (se houver) |
| `prompt_usado` | `text` | Prompt usado para gerar a música |
| `link_audio` | `text` NOT NULL | URL do arquivo de áudio no Supabase Storage |
| `hash_sha256` | `text` NOT NULL UNIQUE | Hash do arquivo para integridade |
| `data_criacao` | `timestamptz` DEFAULT now() | Data de criação |
| `curado_por` | `text` | Quem aprovou a música (ex: "Diego") |
| `data_curadoria` | `timestamptz` | Quando a curadoria foi realizada (prova de autoria) |

**RLS**: Leitura pública bloqueada no cliente. Acesso apenas via Server Components ou Route Handlers autenticados. Admin (Diego) tem acesso total via service role key.

### 3.2 Tabela `clientes_academias`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PRIMARY KEY | Identificador único |
| `razao_social` | `text` NOT NULL | Razão social da academia |
| `cnpj` | `text` NOT NULL UNIQUE | CNPJ (14 dígitos, sem pontuação) |
| `endereco_autorizado` | `text` NOT NULL | Endereço do estabelecimento licenciado |
| `status_assinatura` | `text` NOT NULL | `ativa` / `cancelada` / `inadimplente` / `trial` |
| `token_acesso` | `text` UNIQUE | Token para validação externa (UUID v4) |
| `stripe_customer_id` | `text` UNIQUE | ID do customer no Stripe |
| `stripe_subscription_id` | `text` UNIQUE | ID da subscription no Stripe |
| `data_inicio` | `timestamptz` | Início da assinatura |
| `data_validade` | `timestamptz` | Validade atual da assinatura |
| `user_id` | `uuid` FK → auth.users | Usuário Supabase Auth vinculado |

**RLS**: cada academia só lê/altera o próprio registro via `user_id`. Admin acessa tudo via service role.

### 3.3 Tabela `logs_execucao`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `uuid` PRIMARY KEY | Identificador único |
| `cliente_id` | `uuid` FK → clientes_academias | Academia que tocou |
| `musica_id` | `uuid` FK → musicas | Música tocada |
| `data_hora` | `timestamptz` DEFAULT now() | Timestamp do evento |
| `ip_origem` | `text` | IP do request |

**RLS**: Insert permitido apenas via service role (Route Handler). Leitura restrita ao admin.

---

## 4. Arquitetura de Rotas (Next.js App Router)

```
app/
├── (public)/
│   ├── page.tsx                    # Landing page
│   ├── validar/[cnpj]/page.tsx     # Validação pública de licença
│   ├── login/page.tsx              # Login da academia
│   └── cadastro/page.tsx           # Cadastro da academia
├── (academia)/
│   └── dashboard/
│       ├── page.tsx                # Dashboard principal / player
│       └── playlists/page.tsx      # Gerenciamento de playlists
├── (admin)/
│   └── admin/
│       ├── page.tsx                # Painel admin — visão geral
│       ├── musicas/page.tsx        # Gerenciar músicas
│       └── clientes/page.tsx       # Ver clientes e status
└── api/
    ├── stripe/webhook/route.ts     # Webhook do Stripe
    ├── audio/[musicaId]/route.ts   # Streaming de áudio autenticado
    └── validar/[cnpj]/route.ts     # API de validação de licença
```

---

## 5. Páginas — Detalhamento

---

### 5.1 Landing Page (`/`)

**Objetivo**: Converter visitantes (donos de academia) em assinantes.

#### Seções e Componentes Visuais

| Seção | Componentes | Comportamento |
|-------|-------------|---------------|
| **Hero** | Headline, subheadline, botão CTA "Começar agora", badge "Sem ECAD" | CTA rola até seção de planos ou redireciona para `/cadastro` |
| **Problema** | Cards de dor: "ECAD cobra caro", "Música genérica", "Sem licença clara" | Estático, informativo |
| **Solução** | 3 pilares: IA, Licença direta, Playlist focada em treino | Ícones + texto curto |
| **Player de Demo** | Player de áudio embutido com 1-2 faixas de amostra | Faixas servidas por URL pública (sem autenticação). Player HTML5 nativo ou lib leve |
| **Planos** | Cards de plano (ex: Básico, Pro) com preço, features e botão | Preço vindo de variável de ambiente ou hardcoded inicialmente. CTA redireciona para `/cadastro?plano=X` |
| **Prova Social** | Depoimentos (placeholder inicial) | Estático |
| **FAQ** | Accordion com perguntas frequentes sobre ECAD, licença, etc. | Expansão client-side |
| **Footer** | Logo, links legais, contato | Estático |

#### Regras de Negócio
- Sem autenticação necessária
- Preços exibidos são informativos; cobrança real ocorre no Stripe
- Nenhum dado sensível renderizado

---

### 5.2 Cadastro (`/cadastro`)

**Objetivo**: Registrar nova academia e iniciar o fluxo de assinatura no Stripe.

#### Fluxo do Usuário

1. Usuário preenche formulário
2. Submit → Server Action valida campos no servidor
3. Cria usuário no Supabase Auth (email + senha)
4. Cria registro em `clientes_academias` com `status_assinatura = 'trial'`
5. Redireciona para Stripe Checkout (URL gerada no servidor, nunca exposta antes)
6. Após pagamento confirmado via webhook, `status_assinatura` atualizado para `ativa`
7. Usuário recebe e-mail de boas-vindas (via n8n acionado por webhook do Stripe)

#### Campos do Formulário

| Campo | Validação |
|-------|-----------|
| Razão social | Obrigatório, mín. 3 chars |
| CNPJ | Obrigatório, validação de dígito verificador no servidor |
| Endereço do estabelecimento | Obrigatório |
| E-mail | Formato válido, único no Supabase Auth |
| Senha | Mín. 8 chars, confirmação de senha |
| Plano selecionado | Vem do query param `?plano=X` ou selecionado na página |

#### Componentes Visuais
- Formulário de cadastro (multi-step opcional: dados da academia → dados de acesso → plano)
- Indicador de progresso (se multi-step)
- Feedback de erro inline por campo
- Loader no botão durante submit
- Redirecionamento automático para Stripe Checkout (sem intervenção do usuário)

#### Regras de Segurança
- CNPJ validado no servidor (Server Action), não no cliente
- Criação do Stripe Customer e geração da URL de checkout feita no servidor
- A `stripe_secret_key` nunca sai do servidor

---

### 5.3 Login (`/login`)

**Objetivo**: Autenticar academia existente.

#### Fluxo do Usuário
1. Usuário insere e-mail e senha
2. Server Action chama `supabase.auth.signInWithPassword`
3. Sessão criada (cookie HttpOnly gerenciado pelo Supabase SSR)
4. Redirecionamento para `/dashboard`
5. Se `status_assinatura !== 'ativa'`, dashboard exibe banner de assinatura inativa

#### Componentes Visuais
- Formulário e-mail + senha
- Link "Esqueci minha senha" → fluxo de reset via Supabase Auth
- Link para `/cadastro`
- Loader no botão durante autenticação

#### Regras de Segurança
- Cookie de sessão HttpOnly (gerenciado pelo `@supabase/ssr`)
- Middleware Next.js (`middleware.ts`) verifica sessão em todas as rotas protegidas
- Rate limit no servidor para tentativas de login (implementado via Supabase ou middleware)

---

### 5.4 Dashboard da Academia (`/dashboard`)

**Objetivo**: Permitir que a academia ouça músicas licenciadas.

#### Guarda de Acesso
O middleware verifica:
1. Sessão Supabase válida
2. `status_assinatura === 'ativa'` (consultado no servidor)

Se qualquer condição falhar → redirect para `/login` ou página de assinatura inativa.

#### Componentes Visuais

| Componente | Descrição |
|------------|-----------|
| **Header** | Logo, nome da academia, botão "Sair" |
| **Banner de status** | Exibido se assinatura vencer em ≤ 7 dias ou estiver inadimplente |
| **Player de Música** | Tocando faixa atual: capa (placeholder), nome, estilo, controles (play/pause, próxima, anterior), barra de progresso, volume |
| **Lista de Músicas** | Tabela ou grid: nome, estilo, duração. Clique → carrega no player |
| **Filtro por Estilo** | Chips/tags filtráveis (Funk, Eletrônico, Pop, etc.) |
| **Info de Licença** | Card compacto: CNPJ, endereço autorizado, validade, link para `/validar/[cnpj]` |

#### Fluxo de Streaming de Áudio
- O player faz request para `/api/audio/[musicaId]`
- Route Handler verifica sessão e `status_assinatura` no servidor
- Se válido, faz stream/redirect do áudio do Supabase Storage
- Registra o play em `logs_execucao` (cliente_id, musica_id, ip_origem)
- A URL do Supabase Storage **nunca** é exposta diretamente ao cliente

#### Regras de Segurança
- Áudio nunca servido via URL direta do Storage; sempre via Route Handler autenticado
- Log de execução inserido server-side a cada play

---

### 5.5 Página Pública de Validação (`/validar/[cnpj]`)

**Objetivo**: Qualquer pessoa (fiscal, parceiro, curioso) pode verificar se uma academia tem licença ativa, sem precisar de login.

#### Fluxo
1. Usuário acessa `/validar/12345678000195`
2. Server Component busca em `clientes_academias` pelo CNPJ (via service role, dados não-sensíveis)
3. Renderiza resultado

#### Estados Possíveis

| Estado | Exibição |
|--------|----------|
| Licença **ativa** | Card verde: razão social, CNPJ formatado, endereço autorizado, validade, badge "Licença Ativa - Gym Music IA" |
| Licença **inativa/cancelada** | Card amarelo/vermelho: "Este CNPJ não possui licença ativa no momento" |
| CNPJ **não encontrado** | Card cinza: "CNPJ não cadastrado na plataforma" |
| CNPJ **inválido** (formato errado) | Erro 400: "CNPJ inválido" |

#### Componentes Visuais
- Header simples com logo Gym Music IA
- Card centralizado com resultado
- Informações exibidas: razão social, CNPJ (formatado), endereço autorizado, validade da licença
- **Não exibir**: token de acesso, dados de pagamento, e-mail, stripe IDs
- QR Code opcional apontando para a URL (gerado no servidor)

#### Regras de Segurança
- Dados sensíveis (stripe_customer_id, token_acesso, e-mail) nunca retornados
- CNPJ validado no servidor antes da query
- Rate limit por IP para prevenir scraping

---

### 5.6 Painel Admin (`/admin`)

**Objetivo**: Diego gerencia todo o sistema.

#### Guarda de Acesso
- Rota protegida por role de admin
- Implementação: variável de ambiente `ADMIN_USER_ID` comparada com o `user_id` da sessão no middleware, **ou** role customizado no Supabase JWT
- Qualquer usuário não-admin tentando acessar `/admin/*` recebe 403

#### Sub-páginas

##### `/admin` — Visão Geral
| Componente | Dados |
|------------|-------|
| Cards de métricas | Total de clientes ativos, receita MRR estimada, músicas no catálogo, logs de execução (últimas 24h) |
| Tabela de assinaturas recentes | Últimas 10 academias que assinaram |
| Status do sistema | Supabase: OK, Stripe Webhook: último evento recebido |

##### `/admin/musicas` — Gerenciar Músicas
| Componente | Comportamento |
|------------|---------------|
| Tabela de músicas | Nome, estilo, data de criação, curado_por, ações |
| Botão "Adicionar Música" | Modal com formulário: nome, estilo, letra, prompt_usado, upload de arquivo de áudio |
| Upload de áudio | Arquivo enviado para Supabase Storage via Server Action. Hash SHA-256 calculado no servidor antes de salvar |
| Ação "Editar" | Modal pré-preenchido |
| Ação "Excluir" | Confirmação → remove do Storage e do banco |
| Filtro por estilo | Dropdown |
| Badge "Curado" | Ícone de check se `curado_por` preenchido |

##### `/admin/clientes` — Gerenciar Clientes
| Componente | Comportamento |
|------------|---------------|
| Tabela de academias | Razão social, CNPJ, status (badge colorido), validade, data de início |
| Filtro por status | Ativa / Cancelada / Inadimplente / Trial |
| Ação "Ver detalhes" | Drawer/modal: todos os dados da academia, link para Stripe Customer, histórico de logs |
| Ação "Cancelar assinatura" | Chama API do Stripe via Server Action, atualiza status no banco |
| Busca por CNPJ ou razão social | Filtro client-side ou server-side |
| Link "Validar licença" | Abre `/validar/[cnpj]` em nova aba |

---

## 6. API Routes

### `POST /api/stripe/webhook`
- Recebe eventos do Stripe (assinado com `STRIPE_WEBHOOK_SECRET`)
- Eventos tratados:
  - `checkout.session.completed` → ativa assinatura, salva `stripe_customer_id`, `stripe_subscription_id`, `data_inicio`, `data_validade`
  - `invoice.paid` → renova `data_validade`
  - `invoice.payment_failed` → muda `status_assinatura` para `inadimplente`
  - `customer.subscription.deleted` → muda `status_assinatura` para `cancelada`
- Responde 200 imediatamente; processamento assíncrono

### `GET /api/audio/[musicaId]`
- Verifica sessão Supabase e `status_assinatura`
- Busca `link_audio` no banco (server-side)
- Faz redirect 302 com URL temporária assinada do Supabase Storage (expiração curta: 60s)
- Registra em `logs_execucao`

### `GET /api/validar/[cnpj]`
- Versão JSON da página pública (para integrações externas / n8n)
- Retorna apenas campos públicos: `razao_social`, `cnpj`, `endereco_autorizado`, `status_assinatura`, `data_validade`

---

## 7. Middleware (`middleware.ts`)

```
Rotas públicas:      /  /validar/*  /login  /cadastro  /api/stripe/webhook
Rotas de academia:   /dashboard/*  /api/audio/*
Rotas de admin:      /admin/*
```

Lógica:
1. Rotas públicas → passa sem verificação
2. Rotas de academia → verifica sessão; se sem sessão → redirect `/login`
3. Rotas de admin → verifica sessão + `user_id === ADMIN_USER_ID`; se não autorizado → 403

---

## 8. Variáveis de Ambiente

Todas as variáveis abaixo ficam **somente no servidor** (sem prefixo `NEXT_PUBLIC_`), exceto as marcadas:

| Variável | Onde | Descrição |
|----------|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente + Servidor | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente + Servidor | Anon key (acesso público, RLS ativa) |
| `SUPABASE_SERVICE_ROLE_KEY` | Servidor apenas | Service role (bypassa RLS, nunca no cliente) |
| `STRIPE_SECRET_KEY` | Servidor apenas | Chave secreta do Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Cliente + Servidor | Chave pública do Stripe (para Checkout redirect) |
| `STRIPE_WEBHOOK_SECRET` | Servidor apenas | Segredo de verificação do webhook |
| `ADMIN_USER_ID` | Servidor apenas | UUID do usuário admin (Diego) |
| `NEXT_PUBLIC_APP_URL` | Cliente + Servidor | URL base da aplicação |

---

## 9. Integrações com n8n (Externas)

O n8n não faz parte do codebase. Ele é acionado via webhooks do Stripe ou diretamente pelo Supabase (Database Webhooks).

| Automação | Trigger | Ação |
|-----------|---------|------|
| Boas-vindas | `checkout.session.completed` | Enviar e-mail de boas-vindas com dados da licença |
| Inadimplência | `invoice.payment_failed` | Notificar academia por e-mail |
| Cancelamento | `customer.subscription.deleted` | E-mail de confirmação de cancelamento |
| Nova música adicionada | Insert em `musicas` (DB Webhook) | Notificar Diego por e-mail/Telegram |
| Geração de músicas | Schedule ou manual | Chamar API de IA, salvar resultado no Supabase |

---

## 10. Fluxo Completo do Usuário (Happy Path)

```
1. Acessa / (landing page)
2. Clica "Assinar agora" → vai para /cadastro
3. Preenche dados da academia
4. Submit → Server Action cria usuário Supabase + registro no banco
5. Redirecionado para Stripe Checkout (URL gerada no servidor)
6. Conclui pagamento no Stripe
7. Stripe dispara webhook → /api/stripe/webhook
8. Webhook atualiza status_assinatura para 'ativa'
9. n8n envia e-mail de boas-vindas
10. Usuário faz login em /login
11. Redirecionado para /dashboard
12. Seleciona música → request para /api/audio/[musicaId]
13. Servidor verifica sessão e status, retorna URL temporária
14. Play registrado em logs_execucao
15. Fiscal acessa /validar/12345678000195 → vê licença ativa
```

---

## 11. Design Visual — Identidade "Energia Elétrica"

### Paleta de Cores

| Token | Valor | Uso |
|-------|-------|-----|
| Primária | `#F97316` | Botões principais, destaques, ícones ativos |
| Secundária | `#EF4444` | Alertas, ações destrutivas, acentos |
| Fundo principal | `#0A0A0A` | Background do app |
| Fundo de superfícies | `#1A1A1A` | Cards, modais, sidebars |
| Texto primário | `#FFFFFF` | Títulos, corpo principal |
| Texto secundário | `#999999` | Labels, metadados, placeholders |
| Bordas | `#333333` | Divisores, inputs, bordas de card |

### Tom e Conceito
**"Energia Elétrica"** — alta intensidade, música de treino, confiança legal. Visual escuro com laranja vibrante como foco de atenção.

### Componentes shadcn/ui Customizados

| Componente | Especificação |
|------------|---------------|
| **Botão primário** | Fundo `#F97316`, hover `#EA6E0A`, texto branco, sem borda |
| **Botão secundário** | Fundo transparente, borda `#333333`, texto `#FFFFFF`, hover fundo `#1A1A1A` |
| **Card** | Fundo `#1A1A1A`, borda `#333333`, border-radius 8px |
| **Input** | Fundo `#0A0A0A`, borda `#333333`, foco borda `#F97316` |
| **Player** | Minimalista, fundo `#1A1A1A`, barra de progresso cor `#F97316` |

### Badges de Status de Assinatura

| Status | Cor de fundo | Significado |
|--------|-------------|-------------|
| `ativa` | `#F97316` | Licença válida e em dia |
| `trial` | `#EAB308` | Período de teste / pendente |
| `inadimplente` | `#EF4444` | Pagamento falhou |
| `cancelada` | `#666666` | Assinatura encerrada |

### Tipografia e Ícones

| Elemento | Diretriz |
|----------|----------|
| Tipografia | Geist Sans (padrão Next.js) ou Inter — sem-serif geométrica |
| Ícones | Lucide React |
| Responsividade | Mobile-first; dashboard otimizado para tablet/desktop |

---

## 12. Itens Fora do Escopo (v1)

- App mobile nativo
- Múltiplos usuários por academia
- Upload de músicas pelo cliente
- Sistema de avaliação/rating de músicas
- Integração com outros gateways de pagamento
- Relatórios avançados de analytics
- Multi-idioma

---

## 13. Definição de Pronto (DoD) por Página

| Página | Critério mínimo de entrega |
|--------|---------------------------|
| Landing | Deploy em produção, CTA funcional, player de demo tocando |
| Cadastro | Cria usuário, redireciona para Stripe Checkout |
| Login | Autentica, redireciona para dashboard, middleware protege rota |
| Dashboard | Player toca música via `/api/audio`, log registrado |
| `/validar/[cnpj]` | Exibe status correto para CNPJ ativo e inativo |
| Admin | Lista clientes e músicas, upload de música funciona |
| Webhook Stripe | Atualiza `status_assinatura` em todos os eventos críticos |
