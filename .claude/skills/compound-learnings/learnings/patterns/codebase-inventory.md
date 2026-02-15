# Codebase Inventory Pattern

Quick structural understanding of any codebase in <30 seconds using parallel glob scans.

## Pattern

Run these globs in parallel to understand codebase structure:

```typescript
// Database schema
Glob: prisma/schema.prisma
// or: supabase/migrations/*.sql

// API routes
Glob: app/api/**/*.ts

// Components
Glob: components/**/*.tsx

// Services/business logic
Glob: lib/**/*.ts

// Pages/routes
Glob: app/**/page.tsx
```

## Quick Counts

After scanning, report:

| Metric | How to Count |
|--------|--------------|
| Tables | Count models in schema.prisma |
| API Routes | Count route.ts files |
| Components | Count .tsx files in components/ |
| Services | Count .ts files in lib/ |
| Pages | Count page.tsx files |

## Domain Detection

Map files to domains by path/name:

| Path Pattern | Domain |
|--------------|--------|
| `/auth/`, `session`, `user` | Authentication |
| `/booking/`, `reservation` | Booking |
| `/payment/`, `invoice`, `billing` | Payments |
| `/hotel/`, `property`, `listing` | Inventory |
| `/swipe/`, `match`, `preference` | Matching |
| `/admin/`, `dashboard` | Admin |
| `/cache/`, `redis` | Caching |

## Example Output

```markdown
**Codebase State**: 9 tables, 17 routes, 17 components, 12 services

| Domain | Tables | Routes | Components |
|--------|--------|--------|------------|
| Auth | 2 | 4 | 0 |
| Booking | 2 | 5 | 4 |
| Hotels | 2 | 2 | 3 |
| Matching | 1 | 2 | 3 |
```

## When to Use

- Starting work on unfamiliar codebase
- Roadmap/audit analysis
- Onboarding to new project
- Estimating feature scope
- Identifying coverage gaps

## Time Saved

~15 minutes vs. manual exploration
