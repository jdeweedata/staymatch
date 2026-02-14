# User Preferences

Learned preferences for this project and user.

---

## Code Style

- Use TypeScript strict mode
- Prefer explicit types over inference for function parameters
- Use early returns for guard clauses
- Keep functions focused and under 50 lines when possible
- Use Zod for runtime validation of API responses

## Commit Conventions

- Use conventional commits: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `test:`
- Include scope when relevant: `feat(truth-engine): add WiFi speed aggregation`
- Keep subject line under 72 characters
- Reference related issues/PRs in commit body

## Workflow

- Always run type checks before committing
- Test changes locally before pushing
- Push to staging first for testing
- Use PR workflow for production changes
- Verify systemd service status after deploying Python services

## Communication

- Be concise, skip unnecessary explanations
- Show code diffs for changes when helpful
- Summarize actions at end of complex tasks
- Use tables for structured information

## File Organization

- Never create files in project root (except configs)
- Documentation goes in `docs/` subdirectories
- Skills go in `.claude/skills/`
- Follow existing naming conventions
- Brainstorming docs stay in `brainstorming-session/`

---

## StayMatch-Specific Preferences

### Brand & Design
- Primary color: `#8B5CF6` (purple)
- Dark theme default (`#0A0A0A` background)
- Typography: JetBrains Mono (code), Playfair Display (headings), DM Sans (body)
- Tone: Confident but not arrogant; "Stop searching. Start matching."

### Data Handling
- Always capture metadata with measurements (time, location, device)
- Trust verified guest data over listing claims
- Aggregate before displaying (single data points aren't useful)
- Show confidence levels when Truth Score is based on < 30 data points

### Target Audience Context
- Primary: Digital nomads (WiFi is non-negotiable)
- Secondary: Millennial couples (aesthetics matter)
- Avoid: Families with kids, business travelers, budget backpackers

### Launch Cities Priority
1. Lisbon (strongest nomad community)
2. Bali (high nomad density)
3. Bangkok (growing hub)
4. Fallbacks: Porto, Chiang Mai, Mexico City

### LiteAPI Integration
- Always handle rate limits gracefully
- Cache aggressively (search results: 15m, property data: 24h)
- Map LiteAPI IDs to internal IDs for Truth Engine

---

## Add New Preferences Below

[New preferences will be added as learned]
