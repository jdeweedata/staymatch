declare module "liteapi-node-sdk" {
  interface LiteApiClient {
    getDataCities(countryCode?: string): Promise<{ data?: unknown[] }>;
    getDataHotels(
      countryCode: string,
      cityCode: string,
      offset?: number,
      limit?: number,
      longitude?: string,
      latitude?: string,
      distance?: string
    ): Promise<{ data?: unknown[] }>;
    getDataHotelDetails(hotelId: string): Promise<{ data?: unknown }>;
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
  export default LiteApi;
}
