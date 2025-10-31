import { NextResponse } from "next/server";
import { db } from "@beam-coin/db";
import { approveRedemptionSchema } from "@beam-coin/core";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  try {
    // TODO: Add admin auth check
    const body = await request.json();
    const validation = approveRedemptionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error },
        { status: 400 }
      );
    }

    const { redemptionId } = validation.data;

    const redemption = await db.redemptionRequest.findUnique({
      where: { id: redemptionId },
      include: { user: true },
    });

    if (!redemption) {
      return NextResponse.json(
        { error: "Redemption not found" },
        { status: 404 }
      );
    }

    if (redemption.status !== "PENDING") {
      return NextResponse.json(
        { error: "Redemption already processed" },
        { status: 400 }
      );
    }

    if (!redemption.user.stripeAccountId) {
      return NextResponse.json(
        { error: "User has not completed Stripe onboarding" },
        { status: 400 }
      );
    }

    // Calculate payout amount (in cents)
    const feeAmount = Math.floor((redemption.amount * redemption.feeBps) / 10000);
    const payoutAmount = redemption.amount - feeAmount;
    const payoutAmountCents = payoutAmount * 100; // Convert to cents

    // Update redemption status
    await db.redemptionRequest.update({
      where: { id: redemptionId },
      data: { status: "PROCESSING" },
    });

    // Debit wallet
    await db.wallet.update({
      where: { userId: redemption.userId },
      data: {
        balance: {
          decrement: redemption.amount,
        },
      },
    });

    // Create ledger entry
    await db.ledgerEntry.create({
      data: {
        userId: redemption.userId,
        amount: -redemption.amount,
        type: "REDEMPTION",
        refId: redemptionId,
        note: `Redemption request ${redemptionId}`,
      },
    });

    // Create Stripe Transfer to connected account
    let transfer;
    try {
      transfer = await stripe.transfers.create({
        amount: payoutAmountCents,
        currency: "usd",
        destination: redemption.user.stripeAccountId,
        metadata: {
          redemptionId,
          userId: redemption.userId,
        },
      });

      await db.redemptionRequest.update({
        where: { id: redemptionId },
        data: {
          stripeTransferId: transfer.id,
          status: "COMPLETED",
        },
      });
    } catch (stripeError: any) {
      // Rollback if Stripe fails
      await db.wallet.update({
        where: { userId: redemption.userId },
        data: {
          balance: {
            increment: redemption.amount,
          },
        },
      });

      await db.redemptionRequest.update({
        where: { id: redemptionId },
        data: { status: "REJECTED" },
      });

      return NextResponse.json(
        { error: "Stripe transfer failed", details: stripeError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      redemption,
    });
  } catch (error) {
    console.error("Error approving redemption:", error);
    return NextResponse.json(
      { error: "Failed to approve redemption" },
      { status: 500 }
    );
  }
}

