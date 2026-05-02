import Stripe from "stripe";

/**
 * Instância do cliente Stripe — server-side apenas.
 * NUNCA importar em arquivos com "use client".
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
  typescript: true,
});
