#!/bin/bash
# ============================================================================
# AI Skills Bootstrapper
# Sets up the shared AI skills library for a new project.
# ============================================================================
#
# Usage:
#   ./bootstrap.sh /path/to/your/project [OPTIONS]
#
# Options:
#   --all           Install everything (default)
#   --skills        Install skills only
#   --templates     Install templates only
#   --hooks         Install hooks only
#   --frameworks    Install frameworks only
#   --category CAT  Install specific category: debugging, development,
#                   productivity, content, growth
#   --symlink       Use symlinks instead of copying (saves disk space)
#   --dry-run       Show what would be installed without doing it
#
# Examples:
#   ./bootstrap.sh ~/my-new-project
#   ./bootstrap.sh ~/my-new-project --category productivity --category debugging
#   ./bootstrap.sh ~/my-new-project --skills --hooks --symlink
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${1:-.}"
INSTALL_ALL=true
INSTALL_SKILLS=false
INSTALL_TEMPLATES=false
INSTALL_HOOKS=false
INSTALL_FRAMEWORKS=false
USE_SYMLINK=false
DRY_RUN=false
CATEGORIES=()

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

shift || true

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            INSTALL_ALL=true
            shift ;;
        --skills)
            INSTALL_ALL=false
            INSTALL_SKILLS=true
            shift ;;
        --templates)
            INSTALL_ALL=false
            INSTALL_TEMPLATES=true
            shift ;;
        --hooks)
            INSTALL_ALL=false
            INSTALL_HOOKS=true
            shift ;;
        --frameworks)
            INSTALL_ALL=false
            INSTALL_FRAMEWORKS=true
            shift ;;
        --category)
            INSTALL_ALL=false
            INSTALL_SKILLS=true
            CATEGORIES+=("$2")
            shift 2 ;;
        --symlink)
            USE_SYMLINK=true
            shift ;;
        --dry-run)
            DRY_RUN=true
            shift ;;
        *)
            echo "Unknown option: $1"
            exit 1 ;;
    esac
done

# Resolve project directory
mkdir -p "$PROJECT_DIR"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"

echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     AI Skills Library Bootstrapper            ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Source:${NC}  $SCRIPT_DIR"
echo -e "${BLUE}Target:${NC}  $PROJECT_DIR"
echo -e "${BLUE}Method:${NC}  $([ "$USE_SYMLINK" = true ] && echo 'Symlink' || echo 'Copy')"
echo ""

# Helper function — copy or symlink
install_dir() {
    local src="$1"
    local dest="$2"
    local name="$(basename "$src")"

    if [ "$DRY_RUN" = true ]; then
        echo -e "  ${YELLOW}[dry-run]${NC} Would install: $name → $dest"
        return
    fi

    mkdir -p "$(dirname "$dest")"

    if [ "$USE_SYMLINK" = true ]; then
        ln -sfn "$src" "$dest"
        echo -e "  ${GREEN}✓${NC} Linked: $name"
    else
        cp -r "$src" "$dest"
        echo -e "  ${GREEN}✓${NC} Copied: $name"
    fi
}

install_file() {
    local src="$1"
    local dest="$2"
    local name="$(basename "$src")"

    if [ "$DRY_RUN" = true ]; then
        echo -e "  ${YELLOW}[dry-run]${NC} Would install: $name → $dest"
        return
    fi

    mkdir -p "$(dirname "$dest")"

    if [ "$USE_SYMLINK" = true ]; then
        ln -sf "$src" "$dest"
        echo -e "  ${GREEN}✓${NC} Linked: $name"
    else
        cp "$src" "$dest"
        echo -e "  ${GREEN}✓${NC} Copied: $name"
    fi
}

# ============================================================================
# Install Skills
# ============================================================================
install_skills() {
    local categories=("$@")
    local skill_dest="$PROJECT_DIR/.claude/skills"
    local count=0

    # If no specific categories, install all
    if [ ${#categories[@]} -eq 0 ]; then
        categories=("debugging" "development" "productivity" "content" "growth")
    fi

    for category in "${categories[@]}"; do
        local category_dir="$SCRIPT_DIR/$category"

        if [ ! -d "$category_dir" ]; then
            echo -e "  ${YELLOW}⚠${NC}  Category not found: $category"
            continue
        fi

        echo -e "\n${BLUE}📦 Skills — $category${NC}"

        for skill_dir in "$category_dir"/*/; do
            if [ -d "$skill_dir" ]; then
                local skill_name="$(basename "$skill_dir")"
                install_dir "$skill_dir" "$skill_dest/$skill_name"
                count=$((count + 1))
            fi
        done
    done

    echo -e "\n  ${GREEN}Installed $count skills${NC}"
}

# ============================================================================
# Install Templates
# ============================================================================
install_templates() {
    echo -e "\n${BLUE}📋 Templates${NC}"
    local template_dir="$SCRIPT_DIR/templates"

    # Memory templates
    mkdir -p "$PROJECT_DIR/.claude/memory"
    for f in "$template_dir"/memory/*.template.md; do
        local basename="$(basename "$f" .template.md)"
        install_file "$f" "$PROJECT_DIR/.claude/memory/$basename.md"
    done

    # Context templates
    mkdir -p "$PROJECT_DIR/.claude/context"
    for f in "$template_dir"/context/*.template.md; do
        local basename="$(basename "$f" .template.md)"
        install_file "$f" "$PROJECT_DIR/.claude/context/$basename.md"
    done

    # Agent definition template
    mkdir -p "$PROJECT_DIR/.claude/agents"
    install_file "$template_dir/agent-definition/agent-template.md" \
                 "$PROJECT_DIR/.claude/agents/agent-template.md"

    # Slash commands
    mkdir -p "$PROJECT_DIR/.claude/commands"
    for f in "$template_dir"/slash-commands/*.md; do
        install_file "$f" "$PROJECT_DIR/.claude/commands/$(basename "$f")"
    done

    # CLAUDE.md template (only if none exists)
    if [ "$DRY_RUN" = true ]; then
        echo -e "  ${YELLOW}[dry-run]${NC} Would install: CLAUDE.template.md → $PROJECT_DIR/CLAUDE.md (if not exists)"
    elif [ ! -f "$PROJECT_DIR/CLAUDE.md" ]; then
        install_file "$template_dir/CLAUDE.template.md" "$PROJECT_DIR/CLAUDE.md"
        echo -e "  ${GREEN}✓${NC} Created CLAUDE.md from template"
    else
        echo -e "  ${YELLOW}⚠${NC}  CLAUDE.md already exists — skipped (template at templates/CLAUDE.template.md)"
    fi

    echo -e "\n  ${GREEN}Templates installed${NC}"
}

# ============================================================================
# Install Hooks
# ============================================================================
install_hooks() {
    echo -e "\n${BLUE}🪝 Hooks${NC}"
    mkdir -p "$PROJECT_DIR/.claude/hooks"

    for f in "$SCRIPT_DIR/hooks"/*.ps1; do
        install_file "$f" "$PROJECT_DIR/.claude/hooks/$(basename "$f")"
    done

    echo -e "\n  ${GREEN}Hooks installed${NC}"
}

# ============================================================================
# Install Frameworks
# ============================================================================
install_frameworks() {
    echo -e "\n${BLUE}🏗️  Frameworks${NC}"

    # BMAD
    install_dir "$SCRIPT_DIR/frameworks/bmad-core" "$PROJECT_DIR/.bmad-core"

    # Agent-OS
    mkdir -p "$PROJECT_DIR/agent-os"
    install_dir "$SCRIPT_DIR/frameworks/agent-os/roles" "$PROJECT_DIR/agent-os/roles"
    install_file "$SCRIPT_DIR/frameworks/agent-os/README.md" "$PROJECT_DIR/agent-os/README.md"

    echo -e "\n  ${GREEN}Frameworks installed${NC}"
}

# ============================================================================
# Main
# ============================================================================
if [ "$INSTALL_ALL" = true ]; then
    install_skills
    install_templates
    install_hooks
    install_frameworks
else
    [ "$INSTALL_SKILLS" = true ] && install_skills "${CATEGORIES[@]}"
    [ "$INSTALL_TEMPLATES" = true ] && install_templates
    [ "$INSTALL_HOOKS" = true ] && install_hooks
    [ "$INSTALL_FRAMEWORKS" = true ] && install_frameworks
fi

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     ✅ Bootstrap Complete!                    ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Update CLAUDE.md with your project details"
echo "  2. Fill in .claude/memory/ templates with project-specific info"
echo "  3. Customize .bmad-core/core-config.yaml for your project"
echo "  4. Review installed skills in .claude/skills/"
echo ""
