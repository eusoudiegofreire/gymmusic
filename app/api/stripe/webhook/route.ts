import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-04-30.basil",
  });
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const sub = await stripe.subscriptions.retrieve(session.subscription as string);

        await admin
          .from("clientes_academias")
          .update({
            status_assinatura: "ativa",
            stripe_subscription_id: sub.id,
            data_inicio: new Date(sub.current_period_start * 1000).toISOString(),
            data_validade: new Date(sub.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_customer_id", session.customer as string);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const periodEnd = invoice.lines.data[0]?.period?.end;
        if (!periodEnd) break;

        await admin
          .from("clientes_academias")
          .update({
            status_assinatura: "ativa",
            data_validade: new Date(periodEnd * 1000).toISOString(),
          })
          .eq("stripe_customer_id", invoice.customer as string);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        await admin
          .from("clientes_academias")
          .update({ status_assinatura: "inadimplente" })
          .eq("stripe_customer_id", invoice.customer as string);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        await admin
          .from("clientes_academias")
          .update({ status_assinatura: "cancelada" })
          .eq("stripe_customer_id", sub.customer as string);
        break;
      }
    }
  } catch (err) {
    console.error("[stripe/webhook]", event.type, err);
    // Sempre responde 200 para evitar retries desnecessários do Stripe
  }

  return NextResponse.json({ received: true });
}
