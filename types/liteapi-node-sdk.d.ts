declare module "liteapi-node-sdk" {
  interface LiteApiClient {
    getCitiesByCountryCode(countryCode: string): Promise<{ data?: unknown[] }>;
    getHotels(
      parameters: Record<string, string | number>,
      language?: string
    ): Promise<{ data?: unknown[] }>;
    getHotelDetails(hotelId: string, language?: string): Promise<{ data?: unknown }>;
    getFullRates(params: {
      hotelIds: string[];
      checkin: string;
      checkout: string;
      occupancies: Array<{ adults: number; children?: number[] }>;
      currency?: string;
      guestNationality?: string;
    }): Promise<{ data?: unknown[] }>;
    preBook(params: { rateId: string }): Promise<{ data?: unknown }>;
    book(params: {
      prebookId: string;
      guestInfo: {
        guestFirstName: string;
        guestLastName: string;
        guestEmail: string;
      };
      payment?: string;
    }): Promise<{ data?: unknown }>;
    retrieveBooking(bookingId: string): Promise<{ data?: unknown }>;
    cancelBooking(bookingId: string): Promise<{ data?: unknown }>;
  }

  function LiteApi(apiKey: string): LiteApiClient;
  export = LiteApi;
}
