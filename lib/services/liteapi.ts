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
   * Get hotels by city code (cached for 1 hour)
   */
  async getHotelsByCity(cityCode: string, limit = 50, countryCode?: string): Promise<Hotel[]> {
    const key = cacheKey(CACHE_PREFIX.HOTELS, cityCode, limit, countryCode || "no-country");

    return cached(
      key,
      async () => {
        try {
          const response = await client.getHotels({
            cityName: cityCode, // Using cityName instead of cityCode based on function intent
            limit: limit,
            countryCode: countryCode || "" // Try empty country code if not available
          });

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
        return [];
      }

      const hotelIds = hotels.map((h) => h.id);

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
        guestNationality: "US",
      });

      // Transform response to our format
      const rates: HotelRate[] = [];

      if (response.data && Array.isArray(response.data)) {
        for (const item of response.data) {
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
};

export default liteApiService;
