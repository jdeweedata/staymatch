import LiteApi from "liteapi-node-sdk";
import { cached, cacheKey, CACHE_TTL, CACHE_PREFIX } from "@/lib/cache";

// Initialize LiteAPI client
const apiKey = process.env.LITEAPI_KEY || "";
const client = LiteApi(apiKey);

// Types
export interface HotelSearchParams {
  cityCode: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults: number;
  children?: number;
  rooms?: number;
  currency?: string;
  limit?: number;
  countryCode?: string;
}

export interface Hotel {
  id: string;
  name: string;
  hotelDescription?: string;
  starRating?: number;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  main_photo?: string;
  images?: string[];
  amenities?: string[];
}

export interface HotelRate {
  hotelId: string;
  roomName: string;
  rateName: string;
  boardType: string;
  price: number;
  currency: string;
  cancellationPolicy?: string;
  rateId: string;
}

export interface PrebookResult {
  prebookId: string;
  hotelId: string;
  roomName: string;
  price: number;
  currency: string;
  cancellationPolicy?: string;
}

export interface BookingResult {
  bookingId: string;
  status: string;
  hotelName: string;
  confirmationNumber?: string;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// City search types
export interface City {
  code: string;
  name: string;
  country: string;
  countryCode: string;
}

interface LiteApiCity {
  cityCode?: string;
  cityName?: string;
  countryCode?: string;
  countryName?: string;
}

function normalizeCity(raw: unknown): City | null {
  const c = raw as LiteApiCity;
  if (!c || !c.cityName) return null;

  return {
    code: c.cityCode || c.cityName || "",
    name: c.cityName || "",
    country: c.countryName || "",
    countryCode: c.countryCode || "",
  };
}

// Type guards and helpers
interface LiteApiHotel {
  id?: string;
  hotelId?: string;
  name?: string;
  hotelDescription?: string;
  starRating?: number;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  main_photo?: string;
  images?: string[];
  amenities?: string[];
}

interface LiteApiRateResponse {
  hotelId?: string;
  roomTypes?: Array<{
    name?: string;
    rates?: Array<{
      name?: string;
      boardType?: string;
      rateId?: string;
      cancellationPolicy?: { type?: string };
      retailRate?: { total?: Array<{ amount?: number }> };
    }>;
  }>;
}

interface LiteApiPrebookResponse {
  prebookId?: string;
  hotelId?: string;
  roomName?: string;
  price?: number;
  currency?: string;
  cancellationPolicy?: string;
}

interface LiteApiBookResponse {
  bookingId?: string;
  status?: string;
  hotelName?: string;
  hotelConfirmationCode?: string;
}

function normalizeHotel(raw: unknown): Hotel | null {
  const h = raw as LiteApiHotel;
  if (!h || (!h.id && !h.hotelId)) return null;

  return {
    id: h.id || h.hotelId || "",
    name: h.name || "Unknown Hotel",
    hotelDescription: h.hotelDescription,
    starRating: h.starRating,
    address: h.address,
    city: h.city,
    country: h.country,
    latitude: h.latitude,
    longitude: h.longitude,
    main_photo: h.main_photo,
    images: h.images,
    amenities: h.amenities,
  };
}

// Service functions
export const liteApiService = {
  /**
   * Get list of available cities (cached for 24 hours)
   */
  async getCities(countryCode?: string) {
    const key = cacheKey(CACHE_PREFIX.CITIES, countryCode || "all");

    return cached(
      key,
      async () => {
        try {
          const response = await client.getCitiesByCountryCode(countryCode || "US");
          return response.data || [];
        } catch (error) {
          console.error("LiteAPI getCities error:", error);
          throw error;
        }
      },
      CACHE_TTL.CITIES
    );
  },

  /**
   * Search cities by query with fuzzy matching (uses cached city list)
   * Returns starts-with matches first, then contains matches
   */
  async searchCities(query: string, countryCode?: string, limit = 10): Promise<City[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      // Get cached city list (fetches from LiteAPI if not cached)
      const rawCities = await this.getCities(countryCode);

      // Normalize all cities
      const cities: City[] = [];
      if (Array.isArray(rawCities)) {
        for (const raw of rawCities) {
          const city = normalizeCity(raw);
          if (city) cities.push(city);
        }
      }

      // Fuzzy match: starts-with first, then contains
      const normalizedQuery = query.toLowerCase().trim();

      const startsWithMatches = cities.filter((c) =>
        c.name.toLowerCase().startsWith(normalizedQuery)
      );

      const containsMatches = cities.filter(
        (c) =>
          !c.name.toLowerCase().startsWith(normalizedQuery) &&
          c.name.toLowerCase().includes(normalizedQuery)
      );

      // Return starts-with first, then contains, limited to requested count
      return [...startsWithMatches, ...containsMatches].slice(0, limit);
    } catch (error) {
      console.error("LiteAPI searchCities error:", error);
      return [];
    }
  },

  /**
   * Get hotels by city code (cached for 1 hour)
   */
  async getHotelsByCity(cityCode: string, limit = 50, countryCode?: string): Promise<Hotel[]> {
    const key = cacheKey(CACHE_PREFIX.HOTELS, cityCode, limit, countryCode || "no-country");

    return cached(
      key,
      async () => {
        try {
          console.log(`Calling LiteAPI getHotels: city=${cityCode}, country=${countryCode}, limit=${limit}`);
          const response = await client.getHotels({
            cityName: cityCode, // Using cityName instead of cityCode based on function intent
            limit: limit,
            countryCode: countryCode || "" // Try empty country code if not available
          });

          console.log(`LiteAPI getHotels response data length: ${response.data?.length}`);

          const hotels: Hotel[] = [];
          if (response.data && Array.isArray(response.data)) {
            for (const item of response.data) {
              const hotel = normalizeHotel(item);
              if (hotel) hotels.push(hotel);
            }
          }
          return hotels;
        } catch (error) {
          console.error("LiteAPI getHotelsByCity error:", error);
          throw error;
        }
      },
      CACHE_TTL.HOTELS_BY_CITY
    );
  },

  /**
   * Get hotel details by ID (cached for 6 hours)
   */
  async getHotelDetails(hotelId: string): Promise<Hotel | null> {
    const key = cacheKey(CACHE_PREFIX.HOTEL_DETAILS, hotelId);

    return cached(
      key,
      async () => {
        try {
          const response = await client.getHotelDetails(hotelId);
          return normalizeHotel(response.data);
        } catch (error) {
          console.error("LiteAPI getHotelDetails error:", error);
          throw error;
        }
      },
      CACHE_TTL.HOTEL_DETAILS
    );
  },

  /**
   * Search for hotel rates
   */
  async searchRates(params: HotelSearchParams): Promise<HotelRate[]> {
    try {
      // First get hotels in the city
      const hotels = await this.getHotelsByCity(params.cityCode, params.limit || 30, params.countryCode);

      if (!hotels.length) {
        console.log(`No hotels found for city ${params.cityCode}`);
        return [];
      }

      const hotelIds = hotels.map((h) => h.id);
      console.log(`Searching rates for ${hotelIds.length} hotels in ${params.cityCode}: ${hotelIds.join(', ')}`);

      // Get rates for these hotels
      const response = await client.getFullRates({
        hotelIds,
        checkin: params.checkIn,
        checkout: params.checkOut,
        occupancies: [
          {
            adults: params.adults,
            children: params.children ? [params.children] : [],
          },
        ],
        currency: params.currency || "USD",
        guestNationality: "US", // 'US' is standard for testing, but maybe 'SG' for Singapore?
      });
      console.log(`LiteAPI getFullRates response for ${params.cityCode}`);

      // Transform response to our format
      const rates: HotelRate[] = [];

      const responseData = (response as any).data;
      // Handle potential nested data structure (some endpoints return { data: [...] }, some { data: { data: [...] } })
      const rawRates = Array.isArray(responseData) ? responseData : responseData?.data;

      if (rawRates && Array.isArray(rawRates)) {
        for (const item of rawRates) {
          const hotel = item as LiteApiRateResponse;
          if (hotel.roomTypes) {
            for (const room of hotel.roomTypes) {
              if (room.rates) {
                for (const rate of room.rates) {
                  rates.push({
                    hotelId: hotel.hotelId || "",
                    roomName: room.name || "Standard Room",
                    rateName: rate.name || "",
                    boardType: rate.boardType || "",
                    price: rate.retailRate?.total?.[0]?.amount || 0,
                    currency: params.currency || "USD",
                    cancellationPolicy: rate.cancellationPolicy?.type,
                    rateId: rate.rateId || "",
                  });
                }
              }
            }
          }
        }
      }

      console.log(`Parsed ${rates.length} rates for ${params.cityCode}`);

      return rates;
    } catch (error) {
      console.error("LiteAPI searchRates error:", error);
      throw error;
    }
  },

  /**
   * Prebook a rate (validate availability and hold)
   */
  async prebook(rateId: string): Promise<PrebookResult | null> {
    try {
      const response = await client.preBook({
        rateId,
      });

      if (response.data) {
        const data = response.data as LiteApiPrebookResponse;
        return {
          prebookId: data.prebookId || "",
          hotelId: data.hotelId || "",
          roomName: data.roomName || "",
          price: data.price || 0,
          currency: data.currency || "USD",
          cancellationPolicy: data.cancellationPolicy,
        };
      }

      return null;
    } catch (error) {
      console.error("LiteAPI prebook error:", error);
      throw error;
    }
  },

  /**
   * Complete a booking
   */
  async book(
    prebookId: string,
    guest: GuestDetails,
    paymentMethod?: string
  ): Promise<BookingResult | null> {
    try {
      const response = await client.book({
        prebookId,
        guestInfo: {
          guestFirstName: guest.firstName,
          guestLastName: guest.lastName,
          guestEmail: guest.email,
        },
        payment: paymentMethod || "CREDIT_CARD",
      });

      if (response.data) {
        const data = response.data as LiteApiBookResponse;
        return {
          bookingId: data.bookingId || "",
          status: data.status || "",
          hotelName: data.hotelName || "",
          confirmationNumber: data.hotelConfirmationCode,
        };
      }

      return null;
    } catch (error) {
      console.error("LiteAPI book error:", error);
      throw error;
    }
  },

  /**
   * Get booking details
   */
  async getBooking(bookingId: string) {
    try {
      const response = await client.retrieveBooking(bookingId);
      return response.data || null;
    } catch (error) {
      console.error("LiteAPI getBooking error:", error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string) {
    try {
      const response = await client.cancelBooking(bookingId);
      return response.data || null;
    } catch (error) {
      console.error("LiteAPI cancelBooking error:", error);
      throw error;
    }
  },

  /**
   * Get hotels with images for onboarding swipe deck (cached for 2 hours)
   */
  async getSwipeDeckHotels(cities: string[] = ["lisbon", "bali", "bangkok"], limit = 50) {
    const key = cacheKey(CACHE_PREFIX.SWIPE, cities.sort().join("-"), limit);

    return cached(
      key,
      async () => {
        try {
          const allHotels: Hotel[] = [];

          const cityMap: Record<string, string> = {
            "lisbon": "PT",
            "bali": "ID",
            "bangkok": "TH"
          };

          for (const city of cities) {
            const country = cityMap[city.toLowerCase()] || "";
            const hotels = await this.getHotelsByCity(city, Math.ceil(limit / cities.length), country);
            allHotels.push(...hotels);
          }

          // Filter to hotels with images
          return allHotels.filter((h) => h.main_photo || (h.images && h.images.length > 0));
        } catch (error) {
          console.error("LiteAPI getSwipeDeckHotels error:", error);
          throw error;
        }
      },
      CACHE_TTL.SWIPE_DECK
    );
  },

  /**
   * Get data for the landing page (Recommended & Nearby hotels with prices)
   * Fetches rates for a default search window (2 weeks from now, 1 night stay)
   */
  async getLandingPageData() {
    console.log("Starting getLandingPageData...");
    // 1. Calculate dates: 2 weeks from now
    const today = new Date();
    const checkInDate = new Date(today);
    checkInDate.setDate(today.getDate() + 14);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + 1);

    const checkIn = checkInDate.toISOString().split('T')[0];
    const checkOut = checkOutDate.toISOString().split('T')[0];

    console.log(`Dates: ${checkIn} to ${checkOut}`);

    // 2. Define cities to fetch
    // "Recommended" -> Mix of popular cities
    // "Nearby" -> We'll simulate this with a specific city (e.g., Bali for now)
    // In a real app, we'd use IP geolocation or user preference

    // We'll fetch a batch of hotels and then split them
    // Let's fetch Bali (ID) and Singapore (SG) as they are close to "home" context usually
    const searchParams: HotelSearchParams[] = [
      { cityCode: "Bali", countryCode: "ID", checkIn, checkOut, adults: 2, limit: 10 },
      { cityCode: "Singapore", countryCode: "SG", checkIn, checkOut, adults: 2, limit: 10 }
    ];

    try {
      const recommended: HotelRate[] = [];
      const nearby: HotelRate[] = [];

      // Run searches in parallel
      console.log("Running searchRates...");
      const results = await Promise.all(
        searchParams.map(params => this.searchRates(params))
      );

      console.log("Search results counts:", results.map(r => r.length));

      // Flatten and distribute
      // Singapore -> Recommended
      // Bali -> Nearby

      const baliRates = results[0] || [];
      const sgRates = results[1] || [];

      // Enrich with images (searchRates currently returns HotelRate which doesn't have images)
      // We need to fetch hotel details or use cached hotels to get images
      // Optimization: searchRates calls getHotelsByCity internally which caches hotels.
      // We can retrieve them from cache or re-fetch (efficiently) to map images.

      // Let's create a helper to merge rates with hotel info
      const enrichRates = async (rates: HotelRate[], city: string) => {
        console.log(`Enriching ${rates.length} rates for ${city}...`);
        const uniqueRates = new Map<string, HotelRate>();
        // Keep only lowest price per hotel
        rates.forEach(r => {
          if (!uniqueRates.has(r.hotelId) || r.price < uniqueRates.get(r.hotelId)!.price) {
            uniqueRates.set(r.hotelId, r);
          }
        });
        console.log(`Unique hotels for ${city}: ${uniqueRates.size}`);

        const enriched = [];
        for (const rate of uniqueRates.values()) {
          try {
            // We can use getHotelDetails, but let's see if we can get it from cache first
            // Since searchRates called getHotelsByCity, it should be in cache
            // But getHotelsByCity uses cityCode as cache key.
            // Let's just call getHotelDetails for now, it handles caching
            const hotel = await this.getHotelDetails(rate.hotelId);
            if (hotel) {
              if (hotel.main_photo || (hotel.images && hotel.images.length > 0)) {
                enriched.push({
                  ...rate,
                  ...hotel,
                  image: hotel.main_photo || hotel.images?.[0] || ""
                });
              } else {
                console.log(`Hotel ${rate.hotelId} has no images.`);
              }
            } else {
              console.log(`Could not find details for hotel ${rate.hotelId}`);
            }
          } catch (e) {
            console.error(`Error enriching hotel ${rate.hotelId}:`, e);
          }
        }
        return enriched;
      };

      const enrichedBali = await enrichRates(baliRates, "Bali");
      const enrichedSg = await enrichRates(sgRates, "Singapore");

      console.log(`Enriched counts: Bali=${enrichedBali.length}, Singapore=${enrichedSg.length}`);

      return {
        recommended: enrichedSg.slice(0, 4), // Top 4 Singapore hotels
        nearby: enrichedBali.slice(0, 6)     // Top 6 Bali hotels
      };

    } catch (error) {
      console.error("LiteAPI getLandingPageData error:", error);
      // Return empty arrays so the page doesn't crash
      return { recommended: [], nearby: [] };
    }
  },
};

export default liteApiService;
