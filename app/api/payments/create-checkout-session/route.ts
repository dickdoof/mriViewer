import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tempStudyId } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal", "link"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: parseInt(
              process.env.PRICE_PER_STUDY_CENTS || "2900",
              10
            ),
            product_data: {
              name: "MRI Full Analysis Report",
              description:
                "Full resolution viewer, all findings, doctor's letter PDF",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/processing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/upload?cancelled=true`,
      metadata: {
        userId: user.id,
        tempStudyId: tempStudyId || "",
      },
      client_reference_id: user.id,
    });

    // Save pending payment
    await supabase.from("payments").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      status: "pending",
      amount: parseInt(process.env.PRICE_PER_STUDY_CENTS || "2900", 10),
      currency: "usd",
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
