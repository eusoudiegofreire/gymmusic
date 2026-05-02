/**
 * Next.js Instrumentation Hook — executado uma vez na inicialização do servidor.
 * Valida todas as variáveis de ambiente obrigatórias antes de aceitar requests.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/env");
  }
}
