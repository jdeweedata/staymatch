import { prisma } from "@/lib/db";

/**
 * Minimum contributions needed for a "confident" Truth Score.
 * Below this, truthConfidence will be scaled proportionally.
 */
const MIN_CONFIDENT_CONTRIBUTIONS = 3;

/**
 * Data dimension weights for Truth Score calculation.
 * Each dimension contributes to the overall score based on data availability.
 */
const DIMENSION_WEIGHTS = {
    wifi: 25, // WiFi speed data
    noise: 15, // Noise level data
    amenities: 30, // Amenity verification (5 boolean checks)
    photos: 10, // Photo verification
    ratings: 20, // Overall guest satisfaction
};

interface AggregatedData {
    contributionCount: number;
    avgWifiDownload: number | null;
    avgWifiUpload: number | null;
    wifiTestCount: number;
    avgNoiseLevel: number | null;
    noiseTestCount: number;
    hasHotWater: boolean | null;
    hasBlackoutCurtains: boolean | null;
    hasQuietRooms: boolean | null;
    hasGoodAC: boolean | null;
    hasWorkDesk: boolean | null;
    communityRating: number | null;
    photoCount: number;
}

/**
 * Aggregate contribution data for a hotel using majority-vote
 * for booleans and averages for numeric fields.
 */
async function aggregateContributions(
    hotelId: string
): Promise<AggregatedData | null> {
    const contributions = await prisma.contribution.findMany({
        where: { hotelId, verified: true },
        include: { photos: { select: { id: true } } },
    });

    if (contributions.length === 0) return null;

    const count = contributions.length;

    // Average numeric fields (skip nulls)
    const wifiDownloads = contributions
        .map((c) => c.wifiDownload)
        .filter((v): v is number => v !== null);
    const wifiUploads = contributions
        .map((c) => c.wifiUpload)
        .filter((v): v is number => v !== null);
    const noiseLevels = contributions
        .map((c) => c.noiseLevel)
        .filter((v): v is number => v !== null);
    const ratings = contributions
        .map((c) => c.overallRating)
        .filter((v): v is number => v !== null);

    const avg = (arr: number[]) =>
        arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    // Majority vote for boolean amenities
    const majorityVote = (
        values: (boolean | null)[]
    ): boolean | null => {
        const defined = values.filter((v): v is boolean => v !== null);
        if (defined.length === 0) return null;
        const trueCount = defined.filter((v) => v).length;
        return trueCount > defined.length / 2;
    };

    const photoCount = contributions.reduce(
        (sum, c) => sum + c.photos.length,
        0
    );

    return {
        contributionCount: count,
        avgWifiDownload: avg(wifiDownloads),
        avgWifiUpload: avg(wifiUploads),
        wifiTestCount: wifiDownloads.length,
        avgNoiseLevel: avg(noiseLevels),
        noiseTestCount: noiseLevels.length,
        hasHotWater: majorityVote(contributions.map((c) => c.hotWaterReliable)),
        hasBlackoutCurtains: majorityVote(
            contributions.map((c) => c.blackoutCurtains)
        ),
        hasQuietRooms: majorityVote(contributions.map((c) => c.quietAtNight)),
        hasGoodAC: majorityVote(contributions.map((c) => c.acWorksWell)),
        hasWorkDesk: majorityVote(contributions.map((c) => c.workDeskPresent)),
        communityRating: avg(ratings),
        photoCount,
    };
}

/**
 * Calculate the Truth Score (0-100) from aggregated data.
 *
 * Score = weighted sum of dimension scores:
 * - WiFi: based on whether download/upload data exists
 * - Noise: based on whether noise measurements exist
 * - Amenities: based on how many of the 5 amenity fields have consensus
 * - Photos: based on whether verified photos exist
 * - Ratings: based on average guest satisfaction (1-5 → 20-100)
 */
function calculateScore(data: AggregatedData): number {
    let totalWeight = 0;
    let weightedScore = 0;

    // WiFi dimension
    if (data.wifiTestCount > 0) {
        totalWeight += DIMENSION_WEIGHTS.wifi;
        // Score WiFi quality: 100Mbps+ = perfect, scaled down
        const downloadScore = data.avgWifiDownload
            ? Math.min(data.avgWifiDownload / 100, 1)
            : 0;
        weightedScore += DIMENSION_WEIGHTS.wifi * downloadScore;
    }

    // Noise dimension
    if (data.noiseTestCount > 0) {
        totalWeight += DIMENSION_WEIGHTS.noise;
        // Lower noise is better: 1.0 = quiet (score 1), 5.0 = loud (score 0.2)
        const noiseScore = data.avgNoiseLevel
            ? Math.max(0, 1 - (data.avgNoiseLevel - 1) / 5)
            : 0.5;
        weightedScore += DIMENSION_WEIGHTS.noise * noiseScore;
    }

    // Amenities dimension
    const amenityFields = [
        data.hasHotWater,
        data.hasBlackoutCurtains,
        data.hasQuietRooms,
        data.hasGoodAC,
        data.hasWorkDesk,
    ];
    const answeredAmenities = amenityFields.filter((v) => v !== null).length;
    if (answeredAmenities > 0) {
        totalWeight += DIMENSION_WEIGHTS.amenities;
        const positiveAmenities = amenityFields.filter((v) => v === true).length;
        const amenityScore = positiveAmenities / 5;
        weightedScore += DIMENSION_WEIGHTS.amenities * amenityScore;
    }

    // Photos dimension
    if (data.photoCount > 0) {
        totalWeight += DIMENSION_WEIGHTS.photos;
        const photoScore = Math.min(data.photoCount / 5, 1); // 5+ photos = full score
        weightedScore += DIMENSION_WEIGHTS.photos * photoScore;
    }

    // Ratings dimension
    if (data.communityRating !== null) {
        totalWeight += DIMENSION_WEIGHTS.ratings;
        const ratingScore = (data.communityRating - 1) / 4; // 1-5 → 0-1
        weightedScore += DIMENSION_WEIGHTS.ratings * ratingScore;
    }

    if (totalWeight === 0) return 0;

    // Normalize to 0-100 based on dimensions present
    return Math.round((weightedScore / totalWeight) * 100);
}

/**
 * Calculate confidence (0-1) based on contribution count.
 * Reaches 1.0 at MIN_CONFIDENT_CONTRIBUTIONS.
 */
function calculateConfidence(contributionCount: number): number {
    return Math.min(contributionCount / MIN_CONFIDENT_CONTRIBUTIONS, 1);
}

/**
 * Compute and store the Truth Score for a single hotel.
 * Aggregates all verified contributions and updates HotelCache.
 */
export async function computeTruthScore(hotelId: string): Promise<{
    truthScore: number | null;
    truthConfidence: number | null;
}> {
    console.log(`[truth-score] Computing score for hotel: ${hotelId}`);

    const data = await aggregateContributions(hotelId);

    if (!data) {
        console.log(`[truth-score] No verified contributions for hotel: ${hotelId}`);
        return { truthScore: null, truthConfidence: null };
    }

    const truthScore = calculateScore(data);
    const truthConfidence = calculateConfidence(data.contributionCount);

    await prisma.hotelCache.update({
        where: { id: hotelId },
        data: {
            truthScore,
            truthConfidence,
            avgWifiDownload: data.avgWifiDownload,
            avgWifiUpload: data.avgWifiUpload,
            wifiTestCount: data.wifiTestCount,
            avgNoiseLevel: data.avgNoiseLevel,
            noiseTestCount: data.noiseTestCount,
            communityRating: data.communityRating,
            contributionCount: data.contributionCount,
            hasHotWater: data.hasHotWater,
            hasBlackoutCurtains: data.hasBlackoutCurtains,
            hasQuietRooms: data.hasQuietRooms,
            hasGoodAC: data.hasGoodAC,
            hasWorkDesk: data.hasWorkDesk,
        },
    });

    console.log(
        `[truth-score] Hotel ${hotelId}: score=${truthScore}, confidence=${truthConfidence.toFixed(2)}, contributions=${data.contributionCount}`
    );

    return { truthScore, truthConfidence };
}

/**
 * Batch recompute Truth Scores for all hotels that have contributions.
 */
export async function computeAllTruthScores(): Promise<{
    processed: number;
    failed: number;
}> {
    const hotelIds = await prisma.contribution.findMany({
        where: { verified: true },
        select: { hotelId: true },
        distinct: ["hotelId"],
    });

    console.log(
        `[truth-score] Recomputing scores for ${hotelIds.length} hotels`
    );

    let processed = 0;
    let failed = 0;

    for (const { hotelId } of hotelIds) {
        try {
            await computeTruthScore(hotelId);
            processed++;
        } catch (error) {
            console.error(
                `[truth-score] Failed for hotel ${hotelId}:`,
                error
            );
            failed++;
        }
    }

    console.log(
        `[truth-score] Batch complete: ${processed} processed, ${failed} failed`
    );

    return { processed, failed };
}
