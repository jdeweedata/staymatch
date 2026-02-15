import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import LiteApi from "liteapi-node-sdk";

const client = LiteApi(process.env.LITEAPI_KEY || "");

export async function POST(
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

    const { id } = await params;

    // Get booking by ID
    const booking = await db.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to cancel this booking" },
        { status: 403 }
      );
    }

    // Check if already cancelled
    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    // Check if cancellation is allowed (before check-in)
    const now = new Date();
    const checkIn = new Date(booking.checkIn);

    if (now >= checkIn) {
      return NextResponse.json(
        { error: "Cannot cancel a booking after check-in date" },
        { status: 400 }
      );
    }

    // Cancel with LiteAPI
    try {
      await client.cancelBooking(booking.liteapiBookingId);
    } catch (liteapiError) {
      console.error("LiteAPI cancel error:", liteapiError);
      // Log but continue - update our database regardless
      // The booking might already be cancelled on their end
    }

    // Update our database
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancellationDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      id: updatedBooking.id,
      status: updatedBooking.status,
      cancellationDate: updatedBooking.cancellationDate?.toISOString(),
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
