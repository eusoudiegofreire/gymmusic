# Architecture.md — Gym Music IA

## Stack Técnica

| Camada | Tecnologia |
|--------|------------|
| Frontend / Backend | Next.js (App Router) |
| Banco de dados | Supabase (PostgreSQL + Auth + Storage) |
| Pagamento | Stripe (Subscriptions + Webhooks) |
| Automação externa | n8n (fora do codebase) |
| Deploy | Vercel |

---

## Princípio Central: Thin Client / Fat Server

Toda lógica de negócio reside no back-end. O front-end apenas renderiza dados já validados e retornados pelo servidor.

**O front-end NUNCA deve:**
- Validar CNPJ, e-mail ou qualquer regra de negócio
- Decidir se um usuário tem ou não acesso a um recurso
- Calcular status de assinatura
- Formatar preços ou aplicar descontos
- Determinar quais músicas o usuário pode ouvir

**O servidor SEMPRE faz:**
- Toda validação de entrada
- Toda verificação de sessão e permissões
- Toda consulta ao banco de dados
- Todo cálculo de estado de assinatura
- Todo registro de logs

---

## Chaves de API

- `SUPABASE_SERVICE_ROLE_KEY` — servidor apenas, nunca em arquivo com `"use client"` ou `NEXT_PUBLIC_`
- `STRIPE_SECRET_KEY` — servidor apenas
- `STRIPE_WEBHOOK_SECRET` — servidor apenas
- `ADMIN_USER_ID` — servidor apenas
- `NEXT_PUBLIC_SUPABASE_URL` — pode ser pública (sem segredo)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — pode ser pública (RLS ativa protege o banco)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — pode ser pública (só para redirect)
- `NEXT_PUBLIC_APP_URL` — pode ser pública

**Regra:** se o nome não começa com `NEXT_PUBLIC_`, ele nunca deve aparecer em nenhum arquivo com `"use client"` ou ser importado por um módulo que chegue ao bundle do cliente.

---

## Validações Sempre no Servidor

Todas as validações obrigatórias ocorrem em Server Actions ou Route Handlers:

| Dado | Onde valida |
|------|-------------|
| CNPJ (dígito verificador) | Server Action de cadastro (`lib/validations/cnpj.ts`) |
| Unicidade de e-mail | Supabase Auth (server-side) |
| Status de assinatura | Middleware + Route Handler de áudio |
| Permissão de admin | Middleware (`user_id === ADMIN_USER_ID`) |
| Hash SHA-256 de áudio | Server Action de upload de música |
| Autenticidade do webhook | Route Handler (`/api/stripe/webhook`) com `STRIPE_WEBHOOK_SECRET` |

Validações visuais no cliente (ex: campo obrigatório, máscara de CNPJ) são apenas UX — nunca substituem a validação server-side.

---

## Monitoramento de IP via Route Handler

O IP de origem de cada play de música é registrado em `logs_execucao.ip_origem`.

- Capturado no Route Handler `GET /api/audio/[musicaId]`
- Fonte: header `x-forwarded-for` (Vercel) ou `request.ip`
- Nunca capturado ou exposto no cliente
- Usado para auditoria e detecção de uso indevido

```ts
// Exemplo de captura server-side
const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
```

---

## Proteção de Rotas (Middleware)

```
Rotas públicas:    /  /validar/*  /login  /cadastro  /api/stripe/webhook
Rotas academia:    /dashboard/*  /api/audio/*
Rotas admin:       /admin/*
```

- Sem sessão em rota de academia → redirect `/login`
- Sessão sem role admin em `/admin/*` → HTTP 403
- Webhook do Stripe verificado por assinatura criptográfica, não por sessão

---

## Streaming de Áudio (Fluxo Seguro)

```
Cliente → GET /api/audio/[musicaId]
         ↓ verifica sessão + status_assinatura (servidor)
         ↓ busca link_audio no banco (service role)
         ↓ gera URL assinada Supabase Storage (exp: 60s)
         ↓ registra em logs_execucao
         → 302 redirect para URL temporária
```

A URL do Supabase Storage **nunca** é exposta diretamente ao cliente nem armazenada no front-end.
