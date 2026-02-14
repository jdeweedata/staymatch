# CLAUDE.md — StayMatch

AI-powered accommodation matching platform. Guidance for AI assistants working with this codebase.

## ⚠️ MANDATORY: Development Rules

> **STOP. Before ANY code change, you MUST follow these rules.**

### Planning & Execution

1. **Always slow down and think first**
   - Read through ALL relevant files in the codebase before making changes
   - Build a complete, step-by-step to-do list for every task
   - Identify all files that will be affected by the changes
   - Think through potential side effects and edge cases

2. **Explain before implementing**
   - Stop and explain your approach before making ANY code changes
   - Describe what you're about to change and why
   - Outline which files will be modified and how they connect
   - Wait for confirmation before proceeding with implementation

3. **Keep it simple**
   - Make every task and code change as simple as humanly possible
   - Only touch the files and code that absolutely need to be changed
   - Avoid over-engineering or adding unnecessary complexity
   - Don't modify or "improve" code that isn't part of the current task

### Quality Standards

4. **Never be lazy**
   - Always provide complete, production-ready solutions
   - Never skip steps or take shortcuts
   - Don't rush through implementations
   - Maintain focus even when context window is filling up

5. **No temporary fixes**
   - Only implement long-term solutions that address root causes
   - Avoid band-aid fixes, workarounds, or "TODO" items
   - If you identify a problem, fix it properly the first time
   - Don't create technical debt

6. **No hallucinations**
   - Only reference files, functions, and variables that actually exist
   - If you're unsure, check the codebase first
   - Never assume code exists — verify it
   - Ask for clarification rather than guessing

### Code Changes

7. **Minimize blast radius**
   - Isolate changes to prevent breaking existing features
   - Test that your changes don't impact unrelated functionality
   - Avoid refactoring code outside the scope of the current task
   - Keep changes focused and contained

8. **Be thorough but concise**
   - Provide complete solutions without unnecessary verbosity
   - Write clean, readable, well-documented code
   - Follow existing code patterns and conventions in the project
   - Remove any dead code or unused imports

9. **Confirm understanding**
   - If requirements are unclear or ambiguous, ask questions first
   - Propose multiple approaches when there are trade-offs
   - Highlight any assumptions you're making
   - Never proceed with major changes without explicit confirmation

10. **Know the system**
    - Read architecture/overview documentation before working on unfamiliar areas
    - Reference it to understand how systems connect and where code belongs
    - Don't assume — verify against the documented architecture

11. **Respect file placement**
    - Root-level files ONLY: Config files (package.json, tsconfig.json, etc.)
    - All other files MUST go in appropriate subdirectories
    - Create folders if they don't exist — don't use root as a shortcut
    - Never create random source or doc files in the project root

**Remember: Simplicity, thoroughness, and no shortcuts. Think first, explain second, code third.**

---

## Project Overview

**StayMatch** — AI-powered accommodation matching. Stop searching, start matching.

**Concept**: Tinder-style swipe-based hotel discovery with preference learning. Users swipe through accommodation options to build a taste profile, then receive curated matches instead of 500+ search results.

**Core Systems**:
- **StayMatch App**: Preference-based accommodation matching (swipe UX)
- **Truth Engine**: Verified post-stay data (WiFi speeds, noise levels, photo verification)
- **AI Trip Architect**: Conversational booking with multi-constraint understanding

**Stack**: Next.js 15, React 19, TypeScript, Supabase (PostgreSQL + pgvector), Upstash Redis, LiteAPI (2M+ hotels), framer-motion
**Phase**: Active Development (MVP)
**Domain**: staymatch.co

## Essential Commands

```bash
# Development (once codebase is established)
npm run dev                 # Dev server
npm run type-check          # TypeScript check
npm run build               # Production build

# Pre-Commit (MANDATORY)
npm run type-check          # Must pass before commit
```

## Key Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Monetization Ideas | `brainstorming-session/liteapi-monetization-brainstorm.jsx` | 8 product concepts with LiteAPI |
| Technical Architecture | `brainstorming-session/technical-architecture.jsx` | Data flywheel, Truth Engine schema |
| GTM Strategy | `brainstorming-session/gtm-strategy.jsx` | 3-phase launch plan |
| Financial Model | `brainstorming-session/financial-model.jsx` | Revenue projections |

## Architecture Overview

### Target Audience (ICP)
- **Primary**: Digital nomads & remote workers (18.5M in US, 40-80M globally)
- **Secondary**: Millennial couples (28-38, dual income, no kids)
- **Avoid MVP**: Families with kids, business travelers, budget backpackers

### Key Systems

**1. Preference Engine (StayMatch)**
- Swipe-based onboarding to build taste profile
- Multi-dimensional preference vectors (aesthetic, noise tolerance, price sensitivity)
- 3-5 curated matches per trip with "why this fits you" explanations

**2. Truth Engine**
- Post-stay data collection from verified guests
- Structured measurements: WiFi speed tests, noise levels (dB), photo verification
- Property Truth Scores with confidence ratings
- Data moat: 30+ verified data points per property for statistical significance

**3. AI Trip Architect**
- Conversational booking ("I'm attending a wedding in Tuscany...")
- Multi-constraint understanding
- Complete stay strategies, not just hotel lists

### Data Flywheel
```
User books → Post-stay data → Truth Score computed → AI improves → Better matches → More bookings → More data (compounds)
```

### LiteAPI Integration
- 2M+ global hotel inventory
- Real-time rates and availability
- Commission-based revenue (15-25% margin on hotel rates)

## File Organization

| Type | Location | Purpose |
|------|----------|---------|
| Brainstorming | `brainstorming-session/` | Strategy docs as React components |
| AI Skills | `.claude/skills/` | 44 installed agent skills |
| Memory | `.claude/memory/` | Project context templates |
| Agent Framework | `.bmad-core/` | BMAD framework config |
| Agent Roles | `agent-os/roles/` | Role definitions |

### Project Structure
| Type | Location |
|------|----------|
| Pages | `app/(main)/[page]/page.tsx` |
| Auth Pages | `app/(auth)/[page]/page.tsx` |
| API Routes | `app/api/[endpoint]/route.ts` |
| UI Components | `components/ui/` |
| Booking Components | `components/booking/` |
| Hotel Components | `components/hotels/` |
| Onboarding Components | `components/onboarding/` |
| Services | `lib/services/` |
| Cache | `lib/cache/` |
| Auth | `lib/auth/` |
| Database | `lib/db/` |
| Tests | `__tests__/` |

## Brand Guidelines

```css
/* StayMatch brand colors (updated 2026-02-14) */
--primary: #FF3859;      /* Coral Red - CTAs, active states */
--background: #FFFFFF;   /* White - backgrounds, cards */
--text: #272823;         /* Charcoal - text, headings */
--accent-success: #10B981;
--accent-warning: #F59E0B;
--accent-error: #EF4444;
```

**Typography**: DM Sans (body/UI), Playfair Display (headings), JetBrains Mono (code)

**Positioning**: "Stop searching. Start matching."

**Design System**: See `docs/design-system/` for full component library, tokens, and screenshots.

## Environment Variables

```env
# Database (Supabase)
DATABASE_URL=<connection string>
DIRECT_URL=<direct connection string>

# LiteAPI
LITEAPI_KEY=<sandbox or production key>

# Redis (Upstash) - optional, falls back to no-cache
UPSTASH_REDIS_REST_URL=<from upstash.com>
UPSTASH_REDIS_REST_TOKEN=<from upstash.com>

# OpenAI (for embeddings)
OPENAI_API_KEY=<key>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.example` for template.

## GTM Launch Strategy

**Phase 1 (Months 0-6)**: StayMatch MVP
- Launch cities: Lisbon → Bali → Bangkok (nomad hubs)
- Target: 5,000 users, 500 bookings
- Goal: Prove preference-matching converts better than search

**Phase 2 (Months 6-12)**: Truth Engine + AI Trip Architect
**Phase 3 (Year 2)**: AgencyOS B2B platform

---

**Version**: 1.0 | **Updated**: 2026-02-14
