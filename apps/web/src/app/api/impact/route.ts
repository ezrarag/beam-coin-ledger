import { NextResponse } from "next/server";
import { db } from "@beam-coin/db";

export async function GET() {
  try {
    // Calculate total issued (sum of all positive ledger entries)
    const issuanceEntries = await db.ledgerEntry.aggregate({
      where: {
        type: "ISSUANCE",
        amount: { gt: 0 },
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate total redeemed (sum of all completed redemptions)
    const completedRedemptions = await db.redemptionRequest.aggregate({
      where: {
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    const totalIssued = issuanceEntries._sum.amount ?? 0;
    const totalRedeemed = completedRedemptions._sum.amount ?? 0;
    const outstanding = totalIssued - totalRedeemed;

    return NextResponse.json({
      totalIssued,
      totalRedeemed,
      outstanding,
    });
  } catch (error) {
    console.error("Error calculating impact stats:", error);
    return NextResponse.json(
      { error: "Failed to calculate impact stats" },
      { status: 500 }
    );
  }
}

