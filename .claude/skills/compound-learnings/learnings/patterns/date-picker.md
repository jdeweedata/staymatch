# Date Picker Pattern

Calendar-based date range selection for check-in/check-out.

## Core State

```tsx
const [currentMonth, setCurrentMonth] = useState(() => {
  const date = checkIn || new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
});

const [selecting, setSelecting] = useState<"checkIn" | "checkOut">("checkIn");
```

## Calendar Grid Generation

```tsx
const calendarDays = useMemo(() => {
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days: (Date | null)[] = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  return days;
}, [currentMonth]);
```

## Date Selection Logic

```tsx
const handleDateClick = useCallback((date: Date) => {
  if (isDisabled(date)) return;

  if (selecting === "checkIn") {
    onChange(date, null);
    setSelecting("checkOut");
  } else {
    if (checkIn && date <= checkIn) {
      // Reset if selected before check-in
      onChange(date, null);
      setSelecting("checkOut");
    } else {
      onChange(checkIn, date);
      setSelecting("checkIn");
    }
  }
}, [selecting, checkIn, onChange, isDisabled]);
```

## Date State Classes

```tsx
const isDisabled = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today || (minDate && date < minDate);
};

const isSelected = (date: Date) => {
  return checkIn?.toDateString() === date.toDateString()
      || checkOut?.toDateString() === date.toDateString();
};

const isInRange = (date: Date) => {
  return checkIn && checkOut && date > checkIn && date < checkOut;
};
```

## Visual Styling

```tsx
<button
  className={cn(
    "aspect-square rounded-lg text-sm font-medium",
    disabled && "text-muted-foreground/30 cursor-not-allowed",
    !disabled && !selected && !inRange && "hover:bg-card",
    inRange && "bg-primary/10",
    selected && "bg-primary text-white",
    isCheckIn && checkOut && "rounded-r-none",
    isCheckOut && checkIn && "rounded-l-none",
  )}
>
  {date.getDate()}
</button>
```

## Month Navigation

```tsx
const goToPrevMonth = () => {
  setCurrentMonth(new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1,
    1
  ));
};

const goToNextMonth = () => {
  setCurrentMonth(new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1
  ));
};
```
