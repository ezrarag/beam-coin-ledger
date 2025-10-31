import { NextResponse } from "next/server";
import { db } from "@beam-coin/db";

export async function GET() {
  try {
    // TODO: Get userId from auth session
    const userId = "temp-user-id"; // Replace with actual auth

    const entries = await db.ledgerEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching ledger:", error);
    return NextResponse.json(
      { error: "Failed to fetch ledger" },
      { status: 500 }
    );
  }
}

