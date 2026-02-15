import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get all bookings for this user
    const bookings = await db.booking.findMany({
      where: { userId: user.id },
      orderBy: { checkIn: "desc" },
      include: {
        hotel: {
          select: {
            images: true,
            starRating: true,
            truthScore: true,
          },
        },
        contribution: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    // Transform for frontend
    const result = bookings.map((booking) => {
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

      // Get first hotel image
      const hotelImages = booking.hotel?.images as string[] | null;
      const mainImage = Array.isArray(hotelImages) && hotelImages.length > 0 ? hotelImages[0] : null;

      return {
        id: booking.id,
        liteapiBookingId: booking.liteapiBookingId,
        hotelId: booking.liteapiHotelId,
        hotelName: booking.hotelName,
        city: booking.city,
        mainImage,
        starRating: booking.hotel?.starRating,
        truthScore: booking.hotel?.truthScore,
        checkIn: booking.checkIn.toISOString().split("T")[0],
        checkOut: booking.checkOut.toISOString().split("T")[0],
        nights: Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
        roomType: booking.roomType,
        guestCount: booking.guestCount,
        totalPrice: Number(booking.totalPrice),
        currency: booking.currency,
        status: booking.status,
        timing,
        guestName: `${booking.guestFirstName} ${booking.guestLastName}`,
        hasContribution: !!booking.contribution,
        canContribute: timing === "past" && !booking.contribution && booking.status === "CONFIRMED",
        createdAt: booking.createdAt.toISOString(),
      };
    });

    // Group by timing
    const upcoming = result.filter((b) => b.timing === "upcoming");
    const current = result.filter((b) => b.timing === "current");
    const past = result.filter((b) => b.timing === "past");

    return NextResponse.json({
      bookings: result,
      upcoming,
      current,
      past,
      total: result.length,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
