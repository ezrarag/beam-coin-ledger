import { NextResponse } from "next/server";
import { db } from "@beam-coin/db";
import { redemptionRequestSchema } from "@beam-coin/core";

export async function POST(request: Request) {
  try {
    // TODO: Get userId from auth session
    const userId = "temp-user-id"; // Replace with actual auth

    const body = await request.json();
    const validation = redemptionRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error },
        { status: 400 }
      );
    }

    const { amount } = validation.data;

    // Check wallet balance
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Check weekly limit (500 BEAM per week)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentRedemptions = await db.redemptionRequest.findMany({
      where: {
        userId,
        createdAt: { gte: weekAgo },
        status: { in: ["PENDING", "APPROVED", "PROCESSING", "COMPLETED"] },
      },
    });

    const weeklyTotal = recentRedemptions.reduce((sum, r) => sum + r.amount, 0);
    if (weeklyTotal + amount > 500) {
      return NextResponse.json(
        { error: "Weekly redemption limit exceeded" },
        { status: 400 }
      );
    }

    // Create redemption request
    const redemption = await db.redemptionRequest.create({
      data: {
        userId,
        amount,
        status: "PENDING",
        feeBps: 50, // 0.5%
      },
    });

    return NextResponse.json(redemption);
  } catch (error) {
    console.error("Error creating redemption:", error);
    return NextResponse.json(
      { error: "Failed to create redemption" },
      { status: 500 }
    );
  }
}

