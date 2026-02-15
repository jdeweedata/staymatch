import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(
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

    // Get booking by ID with related data
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        hotel: {
          select: {
            images: true,
            starRating: true,
            truthScore: true,
            description: true,
            amenities: true,
          },
        },
        contribution: {
          select: {
            id: true,
            wifiDownload: true,
            wifiUpload: true,
            hotWaterReliable: true,
            blackoutCurtains: true,
            quietAtNight: true,
            acWorksWell: true,
            workDeskPresent: true,
            additionalNotes: true,
            verified: true,
            createdAt: true,
          },
        },
      },
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
        { error: "Not authorized to view this booking" },
        { status: 403 }
      );
    }

    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    // Determine booking timing
    let timing: "upcoming" | "current" | "past";
    if (now < checkIn) {
      timing = "upcoming";
    } else if (now >= checkIn && now <= checkOut) {
      timing = "current";
    } else {
      timing = "past";
    }

    // Get hotel images
    const hotelImages = booking.hotel?.images as string[] | null;

    return NextResponse.json({
      id: booking.id,
      liteapiBookingId: booking.liteapiBookingId,
      hotelId: booking.liteapiHotelId,
      hotelName: booking.hotelName,
      city: booking.city,
      images: hotelImages || [],
      starRating: booking.hotel?.starRating,
      truthScore: booking.hotel?.truthScore,
      description: booking.hotel?.description,
      amenities: booking.hotel?.amenities || [],
      checkIn: booking.checkIn.toISOString().split("T")[0],
      checkOut: booking.checkOut.toISOString().split("T")[0],
      nights: Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
      roomType: booking.roomType,
      guestCount: booking.guestCount,
      totalPrice: Number(booking.totalPrice),
      currency: booking.currency,
      status: booking.status,
      timing,
      guestFirstName: booking.guestFirstName,
      guestLastName: booking.guestLastName,
      guestEmail: booking.guestEmail,
      contribution: booking.contribution,
      canContribute: timing === "past" && !booking.contribution && booking.status === "CONFIRMED",
      canCancel: timing === "upcoming" && booking.status === "CONFIRMED",
      cancellationDate: booking.cancellationDate?.toISOString() || null,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
