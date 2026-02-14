import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get swipe ID from route params
    const { id } = await params;

    // Delete swipe only if owned by current user
    const deleted = await db.swipe.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });

    // Return 404 if swipe not found or not owned by user
    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Swipe not found" },
        { status: 404 }
      );
    }

    // Count remaining swipes
    const count = await db.swipe.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Delete swipe error:", error);
    return NextResponse.json(
      { error: "Failed to delete swipe" },
      { status: 500 }
    );
  }
}
