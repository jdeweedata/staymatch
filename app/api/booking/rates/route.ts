import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import LiteApi from "liteapi-node-sdk";

const client = LiteApi(process.env.LITEAPI_KEY || "");

interface RateInfo {
  rateId: string;
  roomName: string;
  rateName: string;
  boardType: string;
  price: number;
  currency: string;
  cancellationPolicy: string | null;
  maxOccupancy: number | null;
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

    const { hotelId, checkIn, checkOut, adults, children, rooms, currency } = body as Record<string, unknown>;

    // Validate required fields
    if (!hotelId || typeof hotelId !== "string") {
      return NextResponse.json(
        { error: "hotelId is required and must be a string" },
        { status: 400 }
      );
    }

    if (!checkIn || typeof checkIn !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(checkIn)) {
      return NextResponse.json(
        { error: "checkIn is required and must be in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    if (!checkOut || typeof checkOut !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
      return NextResponse.json(
        { error: "checkOut is required and must be in YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    const adultsNum = typeof adults === "number" ? adults : 2;
    const childrenNum = typeof children === "number" ? children : 0;
    const roomsNum = typeof rooms === "number" ? rooms : 1;
    const currencyStr = typeof currency === "string" ? currency : "USD";

    // Call LiteAPI getFullRates for this specific hotel
    const response = await client.getFullRates({
      hotelIds: [hotelId],
      checkin: checkIn,
      checkout: checkOut,
      occupancies: [
        {
          adults: adultsNum,
          children: childrenNum > 0 ? Array(childrenNum).fill(10) : [], // LiteAPI expects child ages
        },
      ],
      currency: currencyStr,
      guestNationality: "US",
    });

    // Transform response to our format
    const rates: RateInfo[] = [];

    if (response.data && Array.isArray(response.data)) {
      for (const hotel of response.data) {
        const roomTypes = (hotel as { roomTypes?: unknown[] }).roomTypes;
        if (roomTypes && Array.isArray(roomTypes)) {
          for (const room of roomTypes) {
            const roomData = room as {
              name?: string;
              maxOccupancy?: number;
              rates?: Array<{
                rateId?: string;
                name?: string;
                boardType?: string;
                cancellationPolicy?: { type?: string };
                retailRate?: { total?: Array<{ amount?: number; currency?: string }> };
              }>;
            };

            if (roomData.rates && Array.isArray(roomData.rates)) {
              for (const rate of roomData.rates) {
                const price = rate.retailRate?.total?.[0]?.amount;
                if (rate.rateId && price) {
                  rates.push({
                    rateId: rate.rateId,
                    roomName: roomData.name || "Standard Room",
                    rateName: rate.name || "",
                    boardType: rate.boardType || "Room Only",
                    price: price,
                    currency: rate.retailRate?.total?.[0]?.currency || currencyStr,
                    cancellationPolicy: rate.cancellationPolicy?.type || null,
                    maxOccupancy: roomData.maxOccupancy || null,
                  });
                }
              }
            }
          }
        }
      }
    }

    // Sort by price ascending
    rates.sort((a, b) => a.price - b.price);

    return NextResponse.json({
      hotelId,
      checkIn,
      checkOut,
      guests: { adults: adultsNum, children: childrenNum, rooms: roomsNum },
      rates,
      currency: currencyStr,
    });
  } catch (error) {
    console.error("Booking rates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rates" },
      { status: 500 }
    );
  }
}
