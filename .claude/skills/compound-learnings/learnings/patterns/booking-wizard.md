# Booking Wizard Pattern

Multi-step booking flow with date selection, guest count, and confirmation.

## Step State Machine

```tsx
type BookingStep = "dates" | "guests" | "summary" | "confirmed";

const [step, setStep] = useState<BookingStep>("dates");

// Navigation
const goToNext = useCallback(() => {
  if (step === "dates" && checkIn && checkOut) setStep("guests");
  else if (step === "guests") setStep("summary");
}, [step, checkIn, checkOut]);

const goToPrev = useCallback(() => {
  if (step === "guests") setStep("dates");
  else if (step === "summary") setStep("guests");
}, [step]);
```

## Progress Indicator

```tsx
const steps = [
  { key: "dates", label: "Dates" },
  { key: "guests", label: "Guests" },
  { key: "summary", label: "Confirm" },
];

const currentStepIndex = steps.findIndex((s) => s.key === step);

<div className="flex items-center gap-2 px-4 pb-3">
  {steps.map((s, index) => (
    <div key={s.key} className="flex-1">
      <div className={cn(
        "h-1 rounded-full transition-all",
        index <= currentStepIndex ? "bg-primary" : "bg-muted"
      )} />
    </div>
  ))}
</div>
```

## Step Transitions

```tsx
<AnimatePresence mode="wait">
  {step === "dates" && (
    <motion.div
      key="dates"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <DatePicker ... />
    </motion.div>
  )}
  {/* Other steps... */}
</AnimatePresence>
```

## Price Calculation

```tsx
const calculateTotal = useCallback(() => {
  if (!checkIn || !checkOut) return 0;

  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  const subtotal = pricePerNight * nights * rooms;
  const serviceFee = subtotal * 0.10; // 10%
  const taxes = (subtotal + serviceFee) * 0.08; // 8%

  return subtotal + serviceFee + taxes;
}, [checkIn, checkOut, pricePerNight, rooms]);
```

## Conditional Rendering for Confirmation

```tsx
// Show full-screen confirmation on success
if (step === "confirmed" && bookingDetails) {
  return <BookingConfirmation booking={bookingDetails} />;
}

return <main>...</main>;
```

## Trust Badges

Always include trust indicators near payment:

```tsx
<div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
  <span className="flex items-center gap-1">
    <LockIcon /> Secure booking
  </span>
  <span className="flex items-center gap-1">
    <CheckIcon /> Free cancellation
  </span>
</div>
```
