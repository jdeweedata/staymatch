import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/contributions/[hotelId] — Get aggregated contribution data for a hotel.
 *
 * Public endpoint: returns anonymized, aggregated truth data.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ hotelId: string }> }
) {
    try {
        const { hotelId } = await params;

        // Get hotel with cached truth data
        const hotel = await prisma.hotelCache.findUnique({
            where: { id: hotelId },
            select: {
                id: true,
                name: true,
                truthScore: true,
                truthConfidence: true,
                avgWifiDownload: true,
                avgWifiUpload: true,
                wifiTestCount: true,
                avgNoiseLevel: true,
                noiseTestCount: true,
                communityRating: true,
                contributionCount: true,
                hasHotWater: true,
                hasBlackoutCurtains: true,
                hasQuietRooms: true,
                hasGoodAC: true,
                hasWorkDesk: true,
            },
        });

        if (!hotel) {
            return NextResponse.json(
                { error: "Hotel not found" },
                { status: 404 }
            );
        }

        // Format the response with readable labels
        const amenities = [];
        if (hotel.hasHotWater !== null)
            amenities.push({
                name: "Hot Water",
                verified: hotel.hasHotWater,
            });
        if (hotel.hasBlackoutCurtains !== null)
            amenities.push({
                name: "Blackout Curtains",
                verified: hotel.hasBlackoutCurtains,
            });
        if (hotel.hasQuietRooms !== null)
            amenities.push({
                name: "Quiet Rooms",
                verified: hotel.hasQuietRooms,
            });
        if (hotel.hasGoodAC !== null)
            amenities.push({
                name: "Good AC",
                verified: hotel.hasGoodAC,
            });
        if (hotel.hasWorkDesk !== null)
            amenities.push({
                name: "Work Desk",
                verified: hotel.hasWorkDesk,
            });

        return NextResponse.json({
            hotelId: hotel.id,
            hotelName: hotel.name,
            truthScore: hotel.truthScore,
            truthConfidence: hotel.truthConfidence,
            contributionCount: hotel.contributionCount,
            wifi: {
                avgDownload: hotel.avgWifiDownload,
                avgUpload: hotel.avgWifiUpload,
                testCount: hotel.wifiTestCount,
            },
            noise: {
                avgLevel: hotel.avgNoiseLevel,
                testCount: hotel.noiseTestCount,
            },
            communityRating: hotel.communityRating,
            verifiedAmenities: amenities,
        });
    } catch (error) {
        console.error("[contributions] GET error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
