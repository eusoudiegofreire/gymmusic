/**
 * Validação de variáveis de ambiente server-side.
 * NUNCA importar em arquivos "use client".
 * Este módulo lança erro na inicialização se alguma variável obrigatória estiver ausente.
 */

const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_BASICO",
  "STRIPE_PRICE_PRO",
  "NEXT_PUBLIC_APP_URL",
  "ADMIN_USER_ID",
] as const;

type EnvKey = (typeof REQUIRED_VARS)[number];

function validateEnv(): Record<EnvKey, string> {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      [
        "",
        "❌ Variáveis de ambiente obrigatórias não configuradas:",
        ...missing.map((k) => `   • ${k}`),
        "",
        "Copie .env.example para .env.local e preencha os valores.",
        "",
      ].join("\n")
    );
  }

  return Object.fromEntries(
    REQUIRED_VARS.map((key) => [key, process.env[key]!])
  ) as Record<EnvKey, string>;
}

export const env = validateEnv();
