# useCallback Dependency Ordering

**Pattern**: Define useCallback functions in dependency order - helpers first, consumers second.

## The Problem

Unlike `function` declarations, `const` arrow functions and `useCallback` are NOT hoisted. If callback A depends on callback B, B must be defined first.

```tsx
// ❌ WRONG - TypeScript error: 'helper' used before declaration
const consumer = useCallback(() => {
  helper(); // Error!
}, [helper]);

const helper = useCallback(() => {
  return something;
}, []);
```

## The Solution

```tsx
// ✅ CORRECT - Define in dependency order
const helper = useCallback(() => {
  return something;
}, []);

const consumer = useCallback(() => {
  helper(); // Works!
}, [helper]);
```

## Real Example (StayMatch booking page)

```tsx
// Helper defined first
const getNights = useCallback(() => {
  if (!checkIn || !checkOut) return 1;
  return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
}, [checkIn, checkOut]);

// Consumer defined after
const fetchRates = useCallback(async () => {
  const nights = getNights();
  // ... fetch logic
}, [hotel, checkIn, checkOut, guests, getNights]);
```

## Quick Check

When adding a callback:
1. Does it reference other callbacks?
2. Are those callbacks defined ABOVE this one?
3. Are they in the dependency array?

## Error Messages

```
TS2448: Block-scoped variable 'X' used before its declaration
TS2454: Variable 'X' is used before being assigned
```

Both indicate a hoisting issue - reorder your function definitions.
