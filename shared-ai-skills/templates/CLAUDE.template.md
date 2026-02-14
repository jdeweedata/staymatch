# CLAUDE.md — Shared Rules Template

Guidance for AI coding assistants when working with this codebase.

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

<!-- Fill in your project details -->
**[Project Name]** — [One-line description]
**Stack**: [Framework], [Language], [Database], [CSS], [Payments/Other]
**Production**: [URL]
**Staging**: [URL]

## Essential Commands

```bash
# Development
npm run dev                 # Dev server
npm run type-check          # TypeScript check
npm run build               # Production build

# Pre-Commit (MANDATORY)
npm run type-check          # Must pass before commit
```

## Architecture Overview

<!-- Document your key systems here -->

### Authentication
<!-- Describe auth system -->

### Key Systems
<!-- List major modules/features -->

## File Organization

| Type | Location | Example |
|------|----------|---------|
| Pages | `app/[page]/page.tsx` | |
| API | `app/api/[endpoint]/route.ts` | |
| Components | `components/[domain]/` | |
| Services | `lib/[service]/` | |
| Tests | `__tests__/` | |
| Docs | `docs/` | |

## Brand Guidelines

```css
/* Define your brand colors */
--primary: #000000;
--secondary: #000000;
--accent: #000000;
```

## Environment Variables

```env
# Required
# API_KEY=<key>
```

---

**Version**: 1.0 | **Updated**: YYYY-MM-DD
