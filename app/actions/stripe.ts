"use server";

import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

type Plano = "basico" | "pro";

function getPriceId(plano: Plano): string {
  const ids: Record<Plano, string | undefined> = {
    basico: process.env.STRIPE_PRICE_BASICO,
    pro: process.env.STRIPE_PRICE_PRO,
  };
  const id = ids[plano];
  if (!id) throw new Error(`STRIPE_PRICE_${plano.toUpperCase()} não configurado.`);
  return id;
}

export interface CheckoutState {
  url?: string;
  error?: string;
}

/**
 * Cria (ou recupera) um Stripe Customer para o userId,
 * depois cria uma Checkout Session de assinatura.
 * Retorna a URL de redirect para o Stripe Checkout.
 */
export async function createCheckoutSession(
  userId: string,
  plano: Plano
): Promise<CheckoutState> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
    const admin = createAdminClient();

    // Busca dados da academia
    const { data: cliente, error: clienteError } = await admin
      .from("clientes_academias")
      .select("razao_social, cnpj, stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (clienteError || !cliente) {
      return { error: "Cadastro não encontrado. Tente novamente." };
    }

    // Busca e-mail do usuário no Auth
    const { data: authData } = await admin.auth.admin.getUserById(userId);
    const email = authData.user?.email;

    // Cria ou recupera Stripe Customer
    let customerId = cliente.stripe_customer_id as string | null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: cliente.razao_social,
        metadata: {
          cnpj: cliente.cnpj,
          user_id: userId,
        },
      });
      customerId = customer.id;

      // Persiste stripe_customer_id
      await admin
        .from("clientes_academias")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId);
    }

    // Cria Checkout Session de assinatura
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: getPriceId(plano), quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?cadastro=sucesso`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cadastro?plano=${plano}`,
      metadata: {
        user_id: userId,
        plano,
      },
      subscription_data: {
        metadata: { user_id: userId, plano },
      },
    });

    return { url: session.url! };
  } catch (err) {
    console.error("[createCheckoutSession]", err);
    return { error: "Erro ao criar sessão de pagamento. Tente novamente." };
  }
}
