# ISSUES.md — Gym Music IA
# Lista de Issues em Ordem de Execução

> Gerado com base no SPEC.md v1.2  
> Data: 2026-05-01  
> Regra: Front-end sempre antes do back-end. Escopo pequeno por issue.

---

## FASE 0 — Setup do Projeto

---

### #01 — Inicializar projeto Next.js com shadcn/ui

**O que será criado**  
Scaffold base do projeto com Next.js App Router, Tailwind CSS, shadcn/ui inicializado e design tokens da identidade "Energia Elétrica" configurados em CSS.

**Arquivos tocados**
- `package.json`
- `tailwind.config.ts`
- `app/globals.css`
- `components.json` (shadcn)
- `app/layout.tsx`

**Definition of Done**
- `npx shadcn@latest init` executado com sucesso
- Paleta de cores (`#F97316`, `#0A0A0A`, `#1A1A1A`, etc.) definida como variáveis CSS em `globals.css`
- `npm run dev` sobe sem erros
- Página raiz renderiza com fundo `#0A0A0A` e texto branco

---

### #02 — Criar estrutura de pastas do App Router

**O que será criado**  
Estrutura de diretórios conforme o SPEC (grupos de rotas públicas, academia e admin), com arquivos `page.tsx` e `layout.tsx` vazios (só o scaffold).

**Arquivos tocados**
- `app/(public)/page.tsx`
- `app/(public)/login/page.tsx`
- `app/(public)/cadastro/page.tsx`
- `app/(public)/validar/[cnpj]/page.tsx`
- `app/(academia)/dashboard/page.tsx`
- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/musicas/page.tsx`
- `app/(admin)/admin/clientes/page.tsx`

**Definition of Done**
- Todas as rotas respondem 200 com placeholder "Em breve" ao acessar no browser
- Nenhuma lógica de negócio, apenas estrutura

---

## FASE 1 — Componentes Visuais Base

---

### #03 — Componente: StatusBadge

**O que será criado**  
Componente reutilizável de badge de status de assinatura com as 4 variantes definidas no SPEC.

**Arquivos tocados**
- `components/ui/status-badge.tsx`

**Definition of Done**
- Badge renderiza com cor correta para cada status: `ativa` (#F97316), `trial` (#EAB308), `inadimplente` (#EF4444), `cancelada` (#666666)
- Aceita prop `status: 'ativa' | 'trial' | 'inadimplente' | 'cancelada'`
- Visível em Storybook ou em página de teste temporária

---

### #04 — Componente: AppHeader (público)

**O que será criado**  
Header simples com logo "Gym Music IA" e botão de CTA, usado na landing page e página de validação.

**Arquivos tocados**
- `components/layout/app-header.tsx`

**Definition of Done**
- Logo renderiza com tipografia correta
- Botão CTA estilizado com `#F97316` e hover `#EA6E0A`
- Responsivo (mobile: menu colapsado ou simplificado)

---

### #05 — Componente: DashboardHeader

**O que será criado**  
Header do dashboard da academia com logo, nome da academia (prop) e botão "Sair".

**Arquivos tocados**
- `components/layout/dashboard-header.tsx`

**Definition of Done**
- Recebe prop `razaoSocial: string`
- Botão "Sair" renderiza (sem lógica ainda — só visual)
- Fundo `#0A0A0A`, borda inferior `#333333`

---

### #06 — Componente: MusicPlayer (visual)

**O que será criado**  
Player de música estático com todos os elementos visuais: capa placeholder, nome da faixa, estilo, controles (play/pause, anterior, próxima), barra de progresso e volume. Sem lógica de áudio ainda.

**Arquivos tocados**
- `components/player/music-player.tsx`

**Definition of Done**
- Todos os elementos visuais presentes e estilizados
- Barra de progresso usa cor `#F97316`
- Controles são ícones Lucide React clicáveis (sem handler ainda)
- Responsivo

---

## FASE 2 — Landing Page (Front-end)

---

### #07 — Landing Page: seção Hero

**O que será criado**  
Seção hero com headline principal, subheadline, badge "Sem ECAD" e botão CTA "Começar agora".

**Arquivos tocados**
- `app/(public)/page.tsx`
- `components/landing/hero-section.tsx`

**Definition of Done**
- Headline e subheadline visíveis com tipografia correta
- Badge "Sem ECAD" estilizado
- Botão CTA laranja, scroll suave até seção de planos ao clicar
- Fundo `#0A0A0A`, layout centralizado

---

### #08 — Landing Page: seção Problema

**O que será criado**  
3 cards de "dor" do cliente: ECAD cobra caro, Música genérica, Sem licença clara.

**Arquivos tocados**
- `app/(public)/page.tsx`
- `components/landing/problema-section.tsx`

**Definition of Done**
- 3 cards renderizados com ícone Lucide + título + texto curto
- Cards com fundo `#1A1A1A`, borda `#333333`
- Layout responsivo (coluna no mobile, row no desktop)

---

### #09 — Landing Page: seção Solução

**O que será criado**  
3 pilares da solução com ícone, título e texto: IA, Licença Direta, Playlist de Treino.

**Arquivos tocados**
- `app/(public)/page.tsx`
- `components/landing/solucao-section.tsx`

**Definition of Done**
- 3 blocos renderizados com ícone laranja
- Layout responsivo

---

### #10 — Landing Page: Player de Demo

**O que será criado**  
Player de áudio embutido na landing page com 1-2 faixas de amostra públicas. Usa o componente `MusicPlayer` com URLs hardcoded de áudio público.

**Arquivos tocados**
- `app/(public)/page.tsx`
- `components/landing/demo-player-section.tsx`

**Definition of Done**
- Player renderiza com faixa de exemplo
- Botão play/pause funciona (áudio HTML5 nativo)
- Faixas são URLs públicas (sem autenticação)

---

### #11 — Landing Page: Cards de Planos

**O que será criado**  
Seção de planos com 2 cards (Básico e Pro), features listadas e botão CTA que redireciona para `/cadastro?plano=basico` ou `/cadastro?plano=pro`.

**Arquivos tocados**
- `app/(public)/page.tsx`
- `components/landing/planos-section.tsx`

**Definition of Done**
- 2 cards renderizados com preço, lista de features e botão
- Um plano pode ter badge "Mais popular"
- Preços hardcoded (placeholder)
- Botão redireciona para `/cadastro?plano=X`

---

### #12 — Landing Page: FAQ + Footer

**O que será criado**  
Seção de FAQ com accordion e footer com logo, links legais e contato.

**Arquivos tocados**
- `app/(public)/page.tsx`
- `components/landing/faq-section.tsx`
- `components/landing/footer.tsx`

**Definition of Done**
- FAQ com pelo menos 5 perguntas, accordion abre/fecha client-side
- Footer com logo, texto de copyright e links placeholder
- Landing page completa de ponta a ponta visualmente

---

## FASE 3 — Páginas de Autenticação (Front-end)

---

### #13 — Página de Login (visual)

**O que será criado**  
Formulário de login com campos de e-mail e senha, loader no botão, link "Esqueci minha senha" e link para `/cadastro`. Apenas visual, sem lógica.

**Arquivos tocados**
- `app/(public)/login/page.tsx`
- `components/auth/login-form.tsx`

**Definition of Done**
- Formulário renderiza com campos estilizados (fundo `#0A0A0A`, borda `#333333`, foco `#F97316`)
- Botão "Entrar" com estado de loading (spinner)
- Links de navegação funcionam
- Layout centralizado, responsivo

---

### #14 — Página de Cadastro: Step 1 — Dados da Academia (visual)

**O que será criado**  
Primeiro step do formulário multi-step de cadastro: razão social, CNPJ, endereço. Indicador de progresso "Passo 1 de 3".

**Arquivos tocados**
- `app/(public)/cadastro/page.tsx`
- `components/auth/cadastro-step1.tsx`
- `components/auth/step-indicator.tsx`

**Definition of Done**
- Formulário com 3 campos estilizados
- Indicador de progresso visual (3 etapas)
- Botão "Continuar" avança para Step 2 (state local, sem submit real)
- Validação visual de CNPJ no formato (máscara, sem validar dígito ainda)

---

### #15 — Página de Cadastro: Step 2 — Dados de Acesso (visual)

**O que será criado**  
Segundo step: e-mail, senha e confirmação de senha.

**Arquivos tocados**
- `components/auth/cadastro-step2.tsx`

**Definition of Done**
- Campos e-mail, senha, confirmar senha estilizados
- Botão "Voltar" retorna ao Step 1
- Botão "Continuar" avança para Step 3
- Ícone de mostrar/ocultar senha funciona

---

### #16 — Página de Cadastro: Step 3 — Confirmação de Plano (visual)

**O que será criado**  
Terceiro step: resumo do plano selecionado (vindo do query param `?plano=X`) e botão "Assinar agora".

**Arquivos tocados**
- `components/auth/cadastro-step3.tsx`

**Definition of Done**
- Plano selecionado exibido com nome e preço
- Botão "Assinar agora" com estado de loading
- Botão "Voltar" retorna ao Step 2
- Formulário completo multi-step funciona visualmente de ponta a ponta

---

## FASE 4 — Dashboard da Academia (Front-end)

---

### #17 — Dashboard: layout e header

**O que será criado**  
Layout base do dashboard com header (`DashboardHeader`) e área de conteúdo. Dados da academia com placeholder hardcoded.

**Arquivos tocados**
- `app/(academia)/dashboard/layout.tsx`
- `app/(academia)/dashboard/page.tsx`

**Definition of Done**
- Header renderiza com nome de academia fictício
- Layout tem sidebar ou header fixo
- Fundo `#0A0A0A`, superfícies `#1A1A1A`

---

### #18 — Dashboard: lista de músicas + filtro por estilo

**O que será criado**  
Grid ou tabela de músicas com dados mockados, chips de filtro por estilo (Funk, Eletrônico, Pop, etc.) funcionando client-side.

**Arquivos tocados**
- `components/dashboard/musica-list.tsx`
- `components/dashboard/estilo-filter.tsx`

**Definition of Done**
- Lista renderiza com 5-8 músicas mockadas (nome, estilo, duração)
- Filtro por estilo filtra a lista visualmente
- Clique em uma música a seleciona (estado local)

---

### #19 — Dashboard: player integrado com seleção de música

**O que será criado**  
Integração entre lista de músicas e o `MusicPlayer`: clicar em uma música da lista carrega seus dados no player.

**Arquivos tocados**
- `app/(academia)/dashboard/page.tsx`
- `components/dashboard/musica-list.tsx`

**Definition of Done**
- Clicar em uma música atualiza nome/estilo no player
- Estado gerenciado no page (sem áudio real ainda)

---

### #20 — Dashboard: card de info de licença + banner de status

**O que será criado**  
Card compacto com CNPJ, endereço autorizado, validade e link para `/validar/[cnpj]`. Banner de aviso quando assinatura vence em ≤ 7 dias (com dados mockados).

**Arquivos tocados**
- `components/dashboard/licenca-card.tsx`
- `components/dashboard/status-banner.tsx`

**Definition of Done**
- Card renderiza com dados placeholder
- Banner de alerta renderiza em amarelo quando status é mockado para "vencendo"
- Link do card abre `/validar/[cnpj]` em nova aba

---

## FASE 5 — Página de Validação Pública (Front-end)

---

### #21 — Página /validar/[cnpj]: todos os estados visuais

**O que será criado**  
Página com 4 estados visuais (ativa, inativa, não encontrado, inválido) usando dados mockados via query param ou condicional temporária.

**Arquivos tocados**
- `app/(public)/validar/[cnpj]/page.tsx`
- `components/validar/licenca-card-result.tsx`

**Definition of Done**
- Card "ativa" renderiza em verde/laranja com razão social, CNPJ formatado, endereço, validade e badge
- Card "inativa" renderiza em vermelho com mensagem adequada
- Card "não encontrado" renderiza em cinza
- Header simples com logo presente
- Layout responsivo e centralizado

---

## FASE 6 — Painel Admin (Front-end)

---

### #22 — Admin: layout com sidebar

**O que será criado**  
Layout do painel admin com sidebar de navegação (links: Visão Geral, Músicas, Clientes) e área de conteúdo.

**Arquivos tocados**
- `app/(admin)/admin/layout.tsx`
- `components/admin/admin-sidebar.tsx`

**Definition of Done**
- Sidebar renderiza com 3 itens de navegação e ícones Lucide
- Item ativo tem destaque em `#F97316`
- Layout responsivo (sidebar colapsada no mobile)

---

### #23 — Admin: página de visão geral (cards de métricas)

**O que será criado**  
4 cards de métricas com dados mockados: clientes ativos, MRR estimado, músicas no catálogo, plays nas últimas 24h.

**Arquivos tocados**
- `app/(admin)/admin/page.tsx`
- `components/admin/metric-card.tsx`

**Definition of Done**
- 4 cards renderizados com número, label e ícone
- Estilo: fundo `#1A1A1A`, borda `#333333`
- Dados são props fixas (mock)

---

### #24 — Admin: tabela de músicas + badge de curado

**O que será criado**  
Tabela de músicas com dados mockados: nome, estilo, data de criação, badge "Curado" (quando `curado_por` preenchido), coluna de ações.

**Arquivos tocados**
- `app/(admin)/admin/musicas/page.tsx`
- `components/admin/musicas-table.tsx`

**Definition of Done**
- Tabela renderiza com 5 músicas mockadas
- Badge "Curado" com ícone de check exibido quando curado
- Coluna de ações com botões "Editar" e "Excluir" (sem handler ainda)
- Dropdown de filtro por estilo funciona client-side

---

### #25 — Admin: modal de adicionar/editar música (visual)

**O que será criado**  
Modal com formulário completo para adicionar música: nome, estilo, letra (textarea), prompt usado (textarea), upload de arquivo de áudio.

**Arquivos tocados**
- `components/admin/musica-form-modal.tsx`

**Definition of Done**
- Modal abre ao clicar "Adicionar Música"
- Todos os campos renderizados e estilizados
- Campo de upload mostra nome do arquivo selecionado
- Botão "Salvar" com estado de loading (sem submit real)
- Modal fecha ao clicar em cancelar ou fora dele

---

### #26 — Admin: tabela de clientes + filtros

**O que será criado**  
Tabela de clientes com dados mockados: razão social, CNPJ, `StatusBadge`, validade, data de início. Filtro por status e busca por texto.

**Arquivos tocados**
- `app/(admin)/admin/clientes/page.tsx`
- `components/admin/clientes-table.tsx`

**Definition of Done**
- Tabela renderiza com 5 academias mockadas
- `StatusBadge` com cores corretas por status
- Filtro por status funciona client-side
- Campo de busca filtra por razão social ou CNPJ
- Botão "Ver detalhes" presente (sem handler ainda)

---

### #27 — Admin: drawer de detalhes do cliente

**O que será criado**  
Drawer lateral com todos os dados da academia selecionada: dados cadastrais, link para Stripe Customer (placeholder), botão "Cancelar assinatura" e histórico de plays recentes.

**Arquivos tocados**
- `components/admin/cliente-details-drawer.tsx`

**Definition of Done**
- Drawer abre ao clicar "Ver detalhes" em um cliente
- Todos os campos de dados da academia exibidos
- Link "Ver no Stripe" renderiza (href placeholder)
- Botão "Cancelar assinatura" renderiza em vermelho (sem handler ainda)
- Lista de plays recentes com dados mockados

---

## FASE 7 — Back-end: Infraestrutura

---

### #28 — Supabase: schema SQL das 3 tabelas

**O que será criado**  
Script SQL de criação das tabelas `musicas`, `clientes_academias` e `logs_execucao` com todos os campos, tipos, constraints e políticas RLS conforme o SPEC.

**Arquivos tocados**
- `supabase/migrations/001_initial_schema.sql`

**Definition of Done**
- Script executado no Supabase sem erros
- RLS habilitado nas 3 tabelas
- Políticas: academias leem/escrevem só o próprio registro; admin usa service role; `logs_execucao` insert apenas via service role
- Índice em `clientes_academias.cnpj` e `clientes_academias.user_id`

---

### #29 — Supabase: configurar cliente SSR (server + client)

**O que será criado**  
Utilitários de cliente Supabase para uso em Server Components, Server Actions e Route Handlers (com `@supabase/ssr`), e cliente leve para uso em Client Components.

**Arquivos tocados**
- `lib/supabase/server.ts`
- `lib/supabase/client.ts`

**Definition of Done**
- `createServerClient()` disponível para uso em Server Components e Actions
- `createBrowserClient()` disponível para Client Components (apenas anon key)
- Nenhum uso de `SUPABASE_SERVICE_ROLE_KEY` em arquivos com `"use client"`

---

### #30 — Next.js: middleware de proteção de rotas

**O que será criado**  
`middleware.ts` que protege rotas de academia e admin verificando sessão Supabase e, para admin, comparando `user_id` com `ADMIN_USER_ID`.

**Arquivos tocados**
- `middleware.ts`

**Definition of Done**
- Acessar `/dashboard` sem sessão redireciona para `/login`
- Acessar `/admin` sem ser admin retorna 403
- Rotas públicas passam sem verificação
- Cookie de sessão renovado automaticamente pelo middleware

---

## FASE 8 — Back-end: Autenticação

---

### #31 — Server Action: login da academia

**O que será criado**  
Server Action que recebe e-mail e senha, chama `supabase.auth.signInWithPassword`, cria cookie de sessão e redireciona para `/dashboard`.

**Arquivos tocados**
- `app/actions/auth.ts`
- `app/(public)/login/page.tsx` (conectar formulário)

**Definition of Done**
- Login com credenciais corretas redireciona para `/dashboard`
- Login com credenciais erradas retorna mensagem de erro inline
- Cookie HttpOnly criado corretamente
- `status_assinatura` verificado ao entrar no dashboard

---

### #32 — Server Action: cadastro da academia (parte 1 — criar usuário)

**O que será criado**  
Server Action que valida os dados do formulário de cadastro no servidor: validação de CNPJ (dígito verificador), unicidade de e-mail, cria usuário no Supabase Auth e insere registro em `clientes_academias` com `status_assinatura = 'trial'`.

**Arquivos tocados**
- `app/actions/auth.ts`
- `lib/validations/cnpj.ts`

**Definition of Done**
- CNPJ inválido retorna erro sem criar usuário
- E-mail duplicado retorna erro adequado
- Usuário e registro em `clientes_academias` criados com sucesso no banco
- `token_acesso` gerado (UUID v4) e salvo

---

## FASE 9 — Back-end: Stripe

---

### #33 — Stripe: criar Checkout Session (Server Action)

**O que será criado**  
Server Action chamada após criar o usuário no cadastro: cria ou recupera Stripe Customer, cria Checkout Session com o price_id do plano e retorna a URL de redirect.

**Arquivos tocados**
- `app/actions/stripe.ts`
- `lib/stripe.ts` (instância do cliente Stripe)
- `app/(public)/cadastro/page.tsx` (conectar ao Step 3)

**Definition of Done**
- `STRIPE_SECRET_KEY` usada apenas server-side
- Checkout Session criada com sucesso
- Usuário redirecionado para URL do Stripe após cadastro
- `stripe_customer_id` salvo em `clientes_academias`

---

### #34 — Stripe: webhook handler

**O que será criado**  
Route Handler `POST /api/stripe/webhook` que verifica assinatura do payload, processa os 4 eventos críticos e atualiza `status_assinatura` em `clientes_academias`.

**Arquivos tocados**
- `app/api/stripe/webhook/route.ts`

**Definition of Done**
- Payload verificado com `STRIPE_WEBHOOK_SECRET` (rejeita requests sem assinatura válida)
- `checkout.session.completed` → status `ativa`, salva datas e IDs
- `invoice.paid` → renova `data_validade`
- `invoice.payment_failed` → status `inadimplente`
- `customer.subscription.deleted` → status `cancelada`
- Responde 200 imediatamente em todos os casos

---

## FASE 10 — Back-end: Streaming de Áudio

---

### #35 — API Route: /api/audio/[musicaId]

**O que será criado**  
Route Handler que autentica a sessão, verifica `status_assinatura === 'ativa'`, gera URL temporária assinada do Supabase Storage (60s) e redireciona com 302. Registra play em `logs_execucao`.

**Arquivos tocados**
- `app/api/audio/[musicaId]/route.ts`

**Definition of Done**
- Request sem sessão retorna 401
- Request com `status_assinatura !== 'ativa'` retorna 403
- musicaId inválido retorna 404
- URL assinada com expiração de 60s gerada e retornada via redirect 302
- Log inserido em `logs_execucao` com `cliente_id`, `musica_id`, `ip_origem`

---

### #36 — Dashboard: conectar player ao /api/audio

**O que será criado**  
Integração do `MusicPlayer` com a API de áudio: ao clicar em play, o player faz `fetch` para `/api/audio/[musicaId]` e carrega o áudio recebido.

**Arquivos tocados**
- `components/player/music-player.tsx`
- `components/dashboard/musica-list.tsx`
- `app/(academia)/dashboard/page.tsx`

**Definition of Done**
- Clicar em "play" dispara request autenticado para `/api/audio/[musicaId]`
- Áudio toca no browser via elemento `<audio>`
- Barra de progresso avança em tempo real
- Próxima/anterior navega entre músicas da lista

---

### #37 — Dashboard: conectar lista de músicas ao Supabase

**O que será criado**  
Server Component no dashboard que busca lista de músicas do banco via service role e passa como props para os componentes client-side.

**Arquivos tocados**
- `app/(academia)/dashboard/page.tsx`

**Definition of Done**
- Músicas reais do banco exibidas na lista
- Dados mockados removidos
- Filtro por estilo funciona com dados reais

---

## FASE 11 — Back-end: Validação Pública

---

### #38 — API Route: /api/validar/[cnpj]

**O que será criado**  
Route Handler público que valida o formato do CNPJ, busca em `clientes_academias` e retorna JSON com campos públicos apenas (`razao_social`, `cnpj`, `endereco_autorizado`, `status_assinatura`, `data_validade`).

**Arquivos tocados**
- `app/api/validar/[cnpj]/route.ts`

**Definition of Done**
- CNPJ com formato inválido retorna 400
- CNPJ não encontrado retorna 404 com mensagem adequada
- Campos sensíveis (`token_acesso`, `stripe_customer_id`, e-mail) nunca retornados
- Rate limit básico por IP implementado

---

### #39 — Página /validar/[cnpj]: conectar ao banco

**O que será criado**  
Server Component da página de validação que busca dados reais do banco e renderiza o estado correto (ativa, inativa, não encontrado, inválido).

**Arquivos tocados**
- `app/(public)/validar/[cnpj]/page.tsx`

**Definition of Done**
- CNPJ ativo renderiza card com dados reais da academia
- CNPJ inativo renderiza card de licença inativa
- CNPJ inexistente renderiza card "não cadastrado"
- CNPJ malformado renderiza erro 400
- Dados mockados removidos

---

## FASE 12 — Back-end: Ações Admin

---

### #40 — Server Actions: gerenciar músicas (adicionar)

**O que será criado**  
Server Action para upload de nova música: recebe FormData, calcula hash SHA-256 do arquivo no servidor, faz upload para Supabase Storage, insere em `musicas` com todos os campos.

**Arquivos tocados**
- `app/actions/admin-musicas.ts`
- `components/admin/musica-form-modal.tsx` (conectar submit)

**Definition of Done**
- Apenas usuário admin pode chamar a action (verificação server-side)
- Hash SHA-256 calculado no servidor antes do upload
- Arquivo salvo no Supabase Storage, `link_audio` registrado no banco
- `curado_por` e `data_curadoria` preenchidos automaticamente com o usuário e timestamp atual
- Modal fecha após sucesso e tabela atualiza

---

### #41 — Server Actions: gerenciar músicas (editar e excluir)

**O que será criado**  
Server Actions para editar metadados de uma música e excluí-la (remove do Storage e do banco).

**Arquivos tocados**
- `app/actions/admin-musicas.ts`
- `components/admin/musicas-table.tsx` (conectar botões)

**Definition of Done**
- Edição salva campos atualizados no banco
- Exclusão remove arquivo do Storage e registro do banco (em transação ou sequencial com rollback)
- Apenas admin pode executar

---

### #42 — Admin: conectar tabela de músicas ao Supabase

**O que será criado**  
Server Component em `/admin/musicas` que busca músicas reais do banco e remove os dados mockados.

**Arquivos tocados**
- `app/(admin)/admin/musicas/page.tsx`

**Definition of Done**
- Músicas reais exibidas na tabela
- Paginação básica ou scroll infinito se houver muitas músicas
- Badge "Curado" funciona com dados reais

---

### #43 — Server Action: cancelar assinatura de academia

**O que será criado**  
Server Action que chama a API do Stripe para cancelar a subscription e atualiza `status_assinatura` para `cancelada` no banco.

**Arquivos tocados**
- `app/actions/admin-clientes.ts`
- `components/admin/cliente-details-drawer.tsx` (conectar botão)

**Definition of Done**
- Apenas admin pode chamar
- Subscription cancelada no Stripe com `cancel_at_period_end: true`
- Status atualizado no banco imediatamente
- Confirmação exigida antes de executar (dialog de confirmação)

---

### #44 — Admin: conectar tabelas de clientes e visão geral ao Supabase

**O que será criado**  
Server Components em `/admin` e `/admin/clientes` buscando dados reais: métricas de clientes, MRR estimado, plays nas últimas 24h e lista de academias.

**Arquivos tocados**
- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/clientes/page.tsx`

**Definition of Done**
- Métricas calculadas com dados reais do banco
- Tabela de clientes com dados reais
- Busca e filtro funcionam com dados reais
- Dados mockados removidos

---

## FASE 13 — Qualidade e Deploy

---

### #45 — Configurar variáveis de ambiente

**O que será criado**  
Arquivo `.env.example` documentado com todas as variáveis do SPEC, e validação em runtime das variáveis obrigatórias.

**Arquivos tocados**
- `.env.example`
- `lib/env.ts` (validação com Zod ou verificação manual)

**Definition of Done**
- `.env.example` tem todas as 8 variáveis com comentários explicando cada uma
- App falha na inicialização com erro claro se variável obrigatória estiver ausente
- `.env.local` está no `.gitignore`

---

### #46 — Deploy na Vercel + configuração de domínio

**O que será criado**  
Projeto conectado à Vercel, variáveis de ambiente configuradas no painel, domínio configurado e webhook do Stripe apontando para URL de produção.

**Arquivos tocados**
- `vercel.json` (se necessário configurar rewrites)

**Definition of Done**
- Deploy em produção sem erros de build
- Todas as variáveis de ambiente configuradas na Vercel (não no código)
- Webhook do Stripe configurado com a URL de produção
- HTTPS ativo
- Fluxo completo do happy path testado em produção

---

## Resumo por Fase

| Fase | Issues | Escopo |
|------|--------|--------|
| 0 — Setup | #01 – #02 | Projeto e estrutura de pastas |
| 1 — Componentes base | #03 – #06 | StatusBadge, headers, player visual |
| 2 — Landing Page FE | #07 – #12 | 6 seções da landing |
| 3 — Auth FE | #13 – #16 | Login + Cadastro multi-step |
| 4 — Dashboard FE | #17 – #20 | Layout, player, lista, licença |
| 5 — Validação FE | #21 | Página /validar com 4 estados |
| 6 — Admin FE | #22 – #27 | Layout, métricas, músicas, clientes |
| 7 — Infra BE | #28 – #30 | Schema SQL, clientes Supabase, middleware |
| 8 — Auth BE | #31 – #32 | Login e cadastro server actions |
| 9 — Stripe BE | #33 – #34 | Checkout e webhook |
| 10 — Áudio BE | #35 – #37 | API de streaming + integração dashboard |
| 11 — Validação BE | #38 – #39 | API JSON + página server component |
| 12 — Admin BE | #40 – #44 | CRUD músicas, cancelar assinatura, dados reais |
| 13 — Deploy | #45 – #46 | Env vars + Vercel |

**Total: 46 issues**
