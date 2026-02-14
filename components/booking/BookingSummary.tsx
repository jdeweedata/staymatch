"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GuestCount } from "./GuestSelector";

export interface BookingSummaryProps {
  /** Hotel name */
  hotelName: string;
  /** Hotel image URL */
  hotelImage?: string;
  /** Price per night */
  pricePerNight: number;
  /** Currency symbol */
  currency?: string;
  /** Check-in date */
  checkIn: Date | null;
  /** Check-out date */
  checkOut: Date | null;
  /** Guest count */
  guests: GuestCount;
  /** Discount percentage (0-100) */
  discount?: number;
  /** Service fee percentage */
  serviceFee?: number;
  /** Taxes percentage */
  taxes?: number;
  /** Whether booking is in progress */
  isLoading?: boolean;
  /** Called when book button clicked */
  onBook?: () => void;
  /** Custom className */
  className?: string;
}

export function BookingSummary({
  hotelName,
  hotelImage,
  pricePerNight,
  currency = "$",
  checkIn,
  checkOut,
  guests,
  discount = 0,
  serviceFee = 10,
  taxes = 8,
  isLoading = false,
  onBook,
  className,
}: BookingSummaryProps) {
  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  // Calculate prices
  const pricing = useMemo(() => {
    const roomSubtotal = pricePerNight * nights * guests.rooms;
    const discountAmount = roomSubtotal * (discount / 100);
    const afterDiscount = roomSubtotal - discountAmount;
    const serviceFeeAmount = afterDiscount * (serviceFee / 100);
    const taxAmount = (afterDiscount + serviceFeeAmount) * (taxes / 100);
    const total = afterDiscount + serviceFeeAmount + taxAmount;

    return {
      roomSubtotal,
      discountAmount,
      afterDiscount,
      serviceFeeAmount,
      taxAmount,
      total,
    };
  }, [pricePerNight, nights, guests.rooms, discount, serviceFee, taxes]);

  // Format currency
  const formatPrice = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const canBook = checkIn && checkOut && nights > 0;

  return (
    <div className={cn("bg-muted rounded-xl overflow-hidden", className)}>
      {/* Hotel Preview */}
      {hotelImage && (
        <div className="relative h-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${hotelImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-display text-lg font-bold text-white truncate">
              {hotelName}
            </h3>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Stay Summary */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Check-in</p>
            <p className="font-medium text-foreground">{formatDate(checkIn)}</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-px bg-border" />
            <span className="text-xs">{nights} night{nights !== 1 ? "s" : ""}</span>
            <div className="w-8 h-px bg-border" />
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Check-out</p>
            <p className="font-medium text-foreground">{formatDate(checkOut)}</p>
          </div>
        </div>

        {/* Guest Summary */}
        <div className="flex items-center justify-between py-2 border-t border-b border-border text-sm">
          <span className="text-muted-foreground">Guests</span>
          <span className="text-foreground">
            {guests.adults} adult{guests.adults !== 1 ? "s" : ""}
            {guests.children > 0 && `, ${guests.children} child${guests.children !== 1 ? "ren" : ""}`}
          </span>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {formatPrice(pricePerNight)} x {nights} night{nights !== 1 ? "s" : ""} x {guests.rooms} room{guests.rooms !== 1 ? "s" : ""}
            </span>
            <span className="text-foreground">{formatPrice(pricing.roomSubtotal)}</span>
          </div>

          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex justify-between text-accent-success"
            >
              <span>Discount ({discount}%)</span>
              <span>-{formatPrice(pricing.discountAmount)}</span>
            </motion.div>
          )}

          <div className="flex justify-between">
            <span className="text-muted-foreground">Service fee ({serviceFee}%)</span>
            <span className="text-foreground">{formatPrice(pricing.serviceFeeAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes ({taxes}%)</span>
            <span className="text-foreground">{formatPrice(pricing.taxAmount)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-border">
          <span className="font-medium text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">
            {formatPrice(pricing.total)}
          </span>
        </div>

        {/* Book Button */}
        <button
          onClick={onBook}
          disabled={!canBook || isLoading}
          className={cn(
            "w-full btn-primary flex items-center justify-center gap-2",
            (!canBook || isLoading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm Booking
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure booking
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Free cancellation
          </span>
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;
