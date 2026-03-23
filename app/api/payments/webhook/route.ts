import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SupabaseClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Update payment status
        await supabase
          .from("payments")
          .update({
            status: "paid",
            stripe_payment_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id);

        // Broadcast payment confirmation via Supabase Realtime
        const channel = supabase.channel(`payment:${session.id}`);
        await channel.send({
          type: "broadcast",
          event: "payment_confirmed",
          payload: {
            sessionId: session.id,
            userId: session.metadata?.userId,
            tempStudyId: session.metadata?.tempStudyId,
          },
        });

        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Webhook processing failed";
    console.error("Stripe webhook error:", message);
  }

  return NextResponse.json({ received: true });
}
