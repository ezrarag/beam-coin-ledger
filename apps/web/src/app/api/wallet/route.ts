import { NextResponse } from "next/server";
import { db } from "@beam-coin/db";

export async function GET() {
  try {
    // TODO: Get userId from auth session
    const userId = "temp-user-id"; // Replace with actual auth

    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    return NextResponse.json({
      balance: wallet?.balance ?? 0,
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}

