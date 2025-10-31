import { NextResponse } from "next/server";
import { db } from "@beam-coin/db";

export async function GET() {
  try {
    // TODO: Add admin auth check
    const redemptions = await db.redemptionRequest.findMany({
      where: {
        status: {
          in: ["PENDING", "PROCESSING"],
        },
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(redemptions);
  } catch (error) {
    console.error("Error fetching redemptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch redemptions" },
      { status: 500 }
    );
  }
}

