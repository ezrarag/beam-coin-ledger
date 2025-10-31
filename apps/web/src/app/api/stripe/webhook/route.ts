import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@beam-coin/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "transfer.paid":
        const transfer = event.data.object as Stripe.Transfer;
        const redemptionId = transfer.metadata?.redemptionId;

        if (redemptionId) {
          await db.redemptionRequest.updateMany({
            where: {
              stripeTransferId: transfer.id,
            },
            data: {
              stripePayoutId: transfer.destination_payment,
              status: "COMPLETED",
            },
          });
        }
        break;

      case "account.updated":
        const account = event.data.object as Stripe.Account;
        if (account.details_submitted) {
          // Account onboarding completed
          await db.user.updateMany({
            where: { stripeAccountId: account.id },
            data: {}, // Could add more fields here if needed
          });
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
