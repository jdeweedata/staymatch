# Booking Flow TypeScript Fixes

**Date**: 2026-02-15
**Context**: Fixing TypeScript errors after LiteAPI booking flow integration

## Issues Encountered

### 1. useCallback Hoisting Error
```
error TS2448: Block-scoped variable 'getNights' used before its declaration
```

**Root Cause**: `fetchRates` callback referenced `getNights` in its dependency array, but `getNights` was defined AFTER `fetchRates`.

**Fix**: Move helper functions BEFORE callbacks that depend on them:
```tsx
// ✅ Correct order
const getNights = useCallback(() => { ... }, [checkIn, checkOut]);
const fetchRates = useCallback(() => {
  // uses getNights
}, [getNights, ...]);

// ❌ Wrong order (causes TS2448)
const fetchRates = useCallback(() => { ... }, [getNights]);
const getNights = useCallback(() => { ... }, []);
```

**Pattern**: In React components, define useCallback functions in dependency order - helpers first, consumers second.

### 2. Prisma Select Non-Existent Field
```
error TS2353: 'address' does not exist in type 'HotelCacheSelect'
```

**Root Cause**: Tried to select `address` field that doesn't exist on HotelCache model.

**Fix**: Check `prisma/schema.prisma` before writing select queries. HotelCache has `city` and `country` but no `address`.

**Pattern**: Always verify Prisma model fields before writing select/include. Use IDE autocomplete or read schema.

### 3. SDK Type Mismatch
```
error TS2353: 'usePaymentSdk' does not exist in type '{ rateId: string }'
```

**Root Cause**: Passed extra property to `preBook()` that isn't in the type definition.

**Fix**: Check `types/liteapi-node-sdk.d.ts` for allowed properties. Only pass what's typed.

**Pattern**: Custom SDK type definitions are the contract. Extend them properly when adding features.

## Prevention Checklist

- [ ] Run `npm run type-check` after ANY code changes
- [ ] Define useCallback helpers BEFORE callbacks that use them
- [ ] Verify Prisma schema before writing queries
- [ ] Check SDK type definitions before API calls
- [ ] Quote paths with special characters in git commands
