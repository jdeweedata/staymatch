import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import LiteApi from "liteapi-node-sdk";
import db from "@/lib/db";

const client = LiteApi(process.env.LITEAPI_KEY || "");

const COMMISSION_RATE = 0.12; // 12% margin on bookings

interface ConfirmRequest {
  prebookId: string;
  hotelId: string;
  hotelName: string;
  city: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  currency: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  transactionId?: string; // For Payment SDK
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const data = body as Partial<ConfirmRequest>;

    // Validate required fields
    if (!data.prebookId || typeof data.prebookId !== "string") {
      return NextResponse.json(
        { error: "prebookId is required" },
        { status: 400 }
      );
    }

    if (!data.guestFirstName || !data.guestLastName || !data.guestEmail) {
      return NextResponse.json(
        { error: "Guest details (firstName, lastName, email) are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.guestEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Determine payment method
    // If transactionId provided, payment was processed via Payment SDK
    // Otherwise, use CREDIT_CARD for sandbox
    const paymentMethod = data.transactionId ? "TRANSACTION" : "ACC_CREDIT_CARD";

    // Call LiteAPI book endpoint
    const bookResponse = await client.book({
      prebookId: data.prebookId,
      guestInfo: {
        guestFirstName: data.guestFirstName,
        guestLastName: data.guestLastName,
        guestEmail: data.guestEmail,
      },
      payment: paymentMethod,
      ...(data.transactionId && { transactionId: data.transactionId }),
    });

    if (!bookResponse.data) {
      return NextResponse.json(
        { error: "Booking failed - no response from provider" },
        { status: 500 }
      );
    }

    const bookData = bookResponse.data as {
      bookingId?: string;
      status?: string;
      hotelConfirmationCode?: string;
      hotelName?: string;
    };

    if (!bookData.bookingId) {
      return NextResponse.json(
        { error: "Booking failed - no booking ID returned" },
        { status: 500 }
      );
    }

    // Calculate commission
    const totalPrice = data.totalPrice || 0;
    const commission = totalPrice * COMMISSION_RATE;

    // Save booking to database
    // First, ensure hotel exists in HotelCache (or create minimal entry)
    let hotelCacheId = data.hotelId || "";

    try {
      // Check if hotel exists in cache
      const existingHotel = await db.hotelCache.findUnique({
        where: { id: hotelCacheId },
      });

      if (!existingHotel && hotelCacheId) {
        // Create minimal hotel cache entry
        await db.hotelCache.create({
          data: {
            id: hotelCacheId,
            name: data.hotelName || "Unknown Hotel",
            city: data.city || "Unknown",
            country: "Unknown",
            images: [],
          },
        });
      }
    } catch (hotelError) {
      // Log but don't fail the booking
      console.error("Hotel cache creation error:", hotelError);
      // Use a fallback if hotel cache fails
      const fallbackHotel = await db.hotelCache.findFirst();
      if (fallbackHotel) {
        hotelCacheId = fallbackHotel.id;
      }
    }

    // Save the booking
    const booking = await db.booking.create({
      data: {
        userId: user.id,
        liteapiBookingId: bookData.bookingId,
        liteapiHotelId: hotelCacheId,
        hotelName: data.hotelName || bookData.hotelName || "Unknown Hotel",
        city: data.city || "Unknown",
        checkIn: new Date(data.checkIn || new Date()),
        checkOut: new Date(data.checkOut || new Date()),
        roomType: data.roomType || "Standard Room",
        guestCount: data.guestCount || 1,
        totalPrice: totalPrice,
        currency: data.currency || "USD",
        commission: commission,
        commissionRate: COMMISSION_RATE,
        guestFirstName: data.guestFirstName,
        guestLastName: data.guestLastName,
        guestEmail: data.guestEmail,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      liteapiBookingId: bookData.bookingId,
      confirmationCode: bookData.hotelConfirmationCode || bookData.bookingId,
      status: bookData.status || "CONFIRMED",
      hotelName: data.hotelName,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guestName: `${data.guestFirstName} ${data.guestLastName}`,
      totalPrice: totalPrice,
      currency: data.currency || "USD",
    });
  } catch (error) {
    console.error("Booking confirm error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Check for specific error types
    if (errorMessage.includes("prebook expired") || errorMessage.includes("session expired")) {
      return NextResponse.json(
        { error: "Your booking session has expired. Please start over." },
        { status: 410 }
      );
    }

    if (errorMessage.includes("payment")) {
      return NextResponse.json(
        { error: "Payment processing failed. Please try again." },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: "Failed to complete booking" },
      { status: 500 }
    );
  }
}
