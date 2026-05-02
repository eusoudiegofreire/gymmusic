"use server";

import Stripe from "stripe";
import { createServerClient, createAdminClient } from "@/lib/supabase/server";

export interface AdminClienteState {
  error?: string;
  success?: boolean;
}

async function assertAdmin(): Promise<void> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    throw new Error("Acesso negado.");
  }
}

export async function cancelarAssinatura(
  clienteId: string
): Promise<AdminClienteState> {
  try {
    await assertAdmin();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
    const admin = createAdminClient();

    const { data: cliente } = await admin
      .from("clientes_academias")
      .select("stripe_subscription_id, status_assinatura")
      .eq("id", clienteId)
      .single();

    if (!cliente) return { error: "Cliente não encontrado." };
    if (cliente.status_assinatura === "cancelada")
      return { error: "Assinatura já está cancelada." };
    if (!cliente.stripe_subscription_id)
      return { error: "Nenhuma assinatura ativa encontrada no Stripe." };

    // Cancela ao final do período atual — não interrompe acesso imediatamente
    await stripe.subscriptions.update(
      cliente.stripe_subscription_id as string,
      { cancel_at_period_end: true }
    );

    // Atualiza status no banco imediatamente
    const { error: updateError } = await admin
      .from("clientes_academias")
      .update({ status_assinatura: "cancelada" })
      .eq("id", clienteId);

    if (updateError) {
      console.error("[cancelarAssinatura] update", updateError);
      return { error: "Stripe atualizado, mas falha ao salvar no banco." };
    }

    return { success: true };
  } catch (err) {
    console.error("[cancelarAssinatura]", err);
    return {
      error: err instanceof Error ? err.message : "Erro inesperado.",
    };
  }
}
