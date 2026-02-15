# Vercel Build Fixes & Production Error Handling

**Date**: 2026-02-15
**Task**: Fix production build errors and deploy landing page

## Issues Encountered

### 1. ESLint `any` Type Errors

**Error**:
```
./app/HomePage.tsx
12:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
```

**Root Cause**: Vercel build enforces ESLint rules that may pass locally with `tsc --noEmit`.

**Solution**: Replace `any` with proper interfaces:
```tsx
// ❌ Bad
interface LandingPageData {
  recommended: any[];
  nearby: any[];
}

// ✅ Good
interface HotelData {
  id?: string;
  name: string;
  image?: string;
  price?: number;
  // ... specific fields
}

interface LandingPageData {
  recommended: HotelData[];
  nearby: HotelData[];
}
```

### 2. Server Components Crash

**Error**:
```
An error occurred in the Server Components render. The specific message
is omitted in production builds to avoid leaking sensitive details.
```

**Root Cause**: `getCurrentUser()` makes database call that fails when DB is unavailable.

**Solution**: Wrap async data fetches in try-catch:
```tsx
export default async function Page() {
  try {
    const user = await getCurrentUser();
    if (user) redirect("/matches");
  } catch (error) {
    console.error("Auth check failed:", error);
  }
  // Always render something on error
  return <LandingPage />;
}
```

### 3. Unused Variables

**Error**:
```
162:10  Warning: 'currentIndex' is assigned a value but never used.
```

**Solution**: Remove immediately or use underscore prefix:
```tsx
// ❌ Unused
const [currentIndex, setCurrentIndex] = useState(0);

// ✅ Remove if not needed
const [cards, setCards] = useState(previewCards);

// ✅ Or prefix with underscore
const [_currentIndex, setCurrentIndex] = useState(0);
```

### 4. useMemo for Callback Dependencies

**Warning**:
```
The 'allItems' array makes the dependencies of useCallback Hook change on every render.
```

**Solution**: Wrap array construction in useMemo:
```tsx
// ❌ Recreated every render
const allItems = [];
items.forEach(i => allItems.push(i));

// ✅ Memoized
const allItems = useMemo(() => {
  const items = [];
  data.forEach(i => items.push(i));
  return items;
}, [data]);
```

## Prevention Checklist

Before pushing to production:

- [ ] Run `npm run build` locally (not just `tsc --noEmit`)
- [ ] Check for any `any` types
- [ ] Remove unused variables
- [ ] Wrap Server Component data fetches in try-catch
- [ ] Test with database disconnected

## Key Insight

**Local TypeScript check (`tsc --noEmit`) is NOT enough.**

Vercel runs full ESLint during build, which catches:
- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/no-unused-vars`
- `react-hooks/exhaustive-deps`
- `@next/next/no-img-element`

Always run `npm run build` locally before pushing to catch these.
