import { NextResponse } from "next/server";
import { db } from "@beam-coin/db";

export async function GET() {
  try {
    // TODO: Get userId from auth session
    const userId = "temp-user-id"; // Replace with actual auth

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        stripeAccountId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

