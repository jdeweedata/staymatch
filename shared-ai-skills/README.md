# Shared AI Skills Library

A portable collection of **44 AI-assistant skills**, **2 frameworks**, **3 hooks**, and **templates** that can be installed into any project to supercharge your AI coding workflow.

## Quick Start

```bash
# Install everything into a new project
./bootstrap.sh /path/to/your/project

# Install only specific categories
./bootstrap.sh /path/to/project --category productivity --category debugging

# Use symlinks instead of copying (saves disk space, stays in sync)
./bootstrap.sh /path/to/project --symlink

# Preview what would be installed
./bootstrap.sh /path/to/project --dry-run
```

## What's Included

### Skills (44 total)

| Category | Skills | Purpose |
|----------|--------|---------|
| **debugging/** (2) | bug-fixing, error-registry | Systematic debugging & error tracking |
| **development/** (6) | refactor, quality-gates, database-migration, mobile-testing, schema-markup, skill-creator | Code quality, migrations, testing |
| **productivity/** (10) | session-manager, async-runner, context-manager, stats-tracker, compound-learnings, filesystem-context, project-sync, rules-organizer, screenshot-analyzer, prompt-optimizer | AI assistant efficiency tools |
| **content/** (4) | copy-editing, copywriting, content-strategy, social-content | Content creation & editing |
| **growth/** (22) | seo-audit, analytics-tracking, ab-test-setup, pricing-strategy, marketing-ideas, marketing-psychology, email-sequence, paid-ads, launch-strategy, free-tool-strategy, referral-program, competitor-alternatives, programmatic-seo, product-marketing-context, roadmap-advisor, pm-agent, page-cro, form-cro, signup-flow-cro, onboarding-cro, popup-cro, paywall-upgrade-cro | Growth marketing & CRO |

### Frameworks

| Framework | Location | Purpose |
|-----------|----------|---------|
| **BMAD Method** | `frameworks/bmad-core/` | Structured AI-assisted development (Analyst → Architect → Scrum Master → Developer → QA) |
| **Agent-OS** | `frameworks/agent-os/` | Spec-to-implementation pipeline (5 implementer + 3 verifier roles) |

### Templates

| Template | Installed To | Purpose |
|----------|-------------|---------|
| `gotchas.template.md` | `.claude/memory/gotchas.md` | Track "Symptom → Cause → Fix" issues |
| `patterns.template.md` | `.claude/memory/patterns.md` | Document codebase patterns |
| `preferences.template.md` | `.claude/memory/preferences.md` | User/project preferences |
| `decisions.template.md` | `.claude/context/decisions.md` | Architecture decision log |
| `agent-template.md` | `.claude/agents/agent-template.md` | Custom agent definition template |
| `CLAUDE.template.md` | `CLAUDE.md` | 11 universal dev rules + project structure |

### Hooks

| Hook | Purpose |
|------|---------|
| `session-start.ps1` | Auto-run context analyzer on new sessions |
| `backup-before-edit.ps1` | Backup files before editing |
| `log-bash-commands.ps1` | Audit log all bash commands |

### Slash Commands

| Command | Purpose |
|---------|---------|
| `compound.md` | Accumulate session learnings |
| `generate-spec.md` | Generate feature specifications |
| `quick-analysis.md` | Quick code analysis |
| `health-check.md` | Run type-check + context analyzer |

## Bootstrap Options

```
./bootstrap.sh /path/to/project [OPTIONS]

Options:
  --all           Install everything (default)
  --skills        Install skills only
  --templates     Install templates only
  --hooks         Install hooks only
  --frameworks    Install frameworks only
  --category CAT  Install specific category (can repeat)
  --symlink       Use symlinks instead of copying
  --dry-run       Preview what would be installed
```

## After Installation

1. **Update `CLAUDE.md`** with your project details (stack, URLs, architecture)
2. **Fill in `.claude/memory/`** templates with project-specific patterns and gotchas
3. **Customize `.bmad-core/core-config.yaml`** for your project context
4. **Review installed skills** in `.claude/skills/` — remove any you don't need

## Directory Structure

```
shared-ai-skills/
├── bootstrap.sh                    # Install script
├── README.md                       # This file
├── debugging/                      # 2 skills
│   ├── bug-fixing/
│   └── error-registry/
├── development/                    # 6 skills
│   ├── refactor/
│   ├── quality-gates/
│   ├── database-migration/
│   ├── mobile-testing/
│   ├── schema-markup/
│   └── skill-creator/
├── productivity/                   # 10 skills
│   ├── session-manager/
│   ├── async-runner/
│   ├── context-manager/
│   ├── stats-tracker/
│   ├── compound-learnings/
│   ├── filesystem-context/
│   ├── project-sync/
│   ├── rules-organizer/
│   ├── screenshot-analyzer/
│   └── prompt-optimizer/
├── content/                        # 4 skills
│   ├── copy-editing/
│   ├── copywriting/
│   ├── content-strategy/
│   └── social-content/
├── growth/                         # 22 skills
│   ├── seo-audit/
│   ├── analytics-tracking/
│   ├── ab-test-setup/
│   ├── ... (19 more)
│   └── paywall-upgrade-cro/
├── frameworks/
│   ├── bmad-core/                  # BMAD Method config
│   └── agent-os/                   # Spec-to-implementation roles
├── templates/
│   ├── CLAUDE.template.md          # Portable CLAUDE.md with 11 rules
│   ├── memory/                     # gotchas, patterns, preferences
│   ├── context/                    # decisions log
│   ├── agent-definition/           # agent template
│   └── slash-commands/             # 4 reusable commands
└── hooks/                          # 3 PowerShell hooks
    ├── session-start.ps1
    ├── backup-before-edit.ps1
    └── log-bash-commands.ps1
```

## Origin

Extracted from the [CircleTel](https://www.circletel.co.za) Next.js platform codebase.
