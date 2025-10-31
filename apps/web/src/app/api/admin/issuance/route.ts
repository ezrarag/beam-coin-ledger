import { NextResponse } from "next/server";
import { db } from "@beam-coin/db";
import { issuanceSchema } from "@beam-coin/core";

export async function POST(request: Request) {
  try {
    // TODO: Add admin auth check
    const body = await request.json();
    const validation = issuanceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error },
        { status: 400 }
      );
    }

    const { userId, amount, note } = validation.data;

    // Get or create wallet
    const wallet = await db.wallet.upsert({
      where: { userId },
      create: {
        userId,
        balance: amount,
      },
      update: {
        balance: {
          increment: amount,
        },
      },
    });

    // Create ledger entry
    const ledgerEntry = await db.ledgerEntry.create({
      data: {
        userId,
        amount,
        type: "ISSUANCE",
        note: note || `Admin issuance of ${amount} BEAM`,
      },
    });

    return NextResponse.json({
      success: true,
      wallet,
      ledgerEntry,
    });
  } catch (error) {
    console.error("Error issuing BEAM:", error);
    return NextResponse.json(
      { error: "Failed to issue BEAM" },
      { status: 500 }
    );
  }
}

