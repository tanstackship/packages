#!/bin/bash

# TanStack Ship Skills Publisher
# 一键发布 skills 到多个平台

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SKILLS_DIR="$PROJECT_ROOT/skills"

echo "🚀 TanStack Ship Skills Publisher"
echo "=================================="
echo ""

# 检查 skills 目录
if [ ! -d "$SKILLS_DIR" ]; then
    echo "❌ Skills directory not found: $SKILLS_DIR"
    exit 1
fi

# 获取所有 skills
SKILLS=($(find "$SKILLS_DIR" -name "SKILL.md" -exec dirname {} \;))

echo "📦 Found ${#SKILLS[@]} skills:"
for skill in "${SKILLS[@]}"; do
    echo "   - $(basename "$skill")"
done
echo ""

# 发布函数
publish_to_claude_code() {
    local skill=$1
    local skill_name=$(basename "$skill")
    local target="$HOME/.claude/skills/$skill_name"

    echo "📤 Publishing $skill_name to Claude Code..."
    mkdir -p "$target"
    cp -r "$skill"/* "$target/"
    echo "   ✅ Published to $target"
}

publish_to_cline() {
    local skill=$1
    local skill_name=$(basename "$skill")
    local target="$HOME/.cline/skills/$skill_name"

    echo "📤 Publishing $skill_name to Cline..."
    mkdir -p "$target"
    cp -r "$skill"/* "$target/"
    echo "   ✅ Published to $target"
}

publish_to_openclaw() {
    local skill=$1
    local skill_name=$(basename "$skill")
    local target="$HOME/.openclaw/skills/$skill_name"

    echo "📤 Publishing $skill_name to OpenClaw..."
    mkdir -p "$target"
    cp -r "$skill"/* "$target/"
    echo "   ✅ Published to $target"
}

# 解析命令行参数
PLATFORMS=()

while [[ $# -gt 0 ]]; do
    case $1 in
        --claude-code)
            PLATFORMS+=("claude-code")
            shift
            ;;
        --cline)
            PLATFORMS+=("cline")
            shift
            ;;
        --openclaw)
            PLATFORMS+=("openclaw")
            shift
            ;;
        --all)
            PLATFORMS=("claude-code" "cline" "openclaw")
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--claude-code] [--cline] [--openclaw] [--all]"
            exit 1
            ;;
    esac
done

# 如果没有指定平台，默认发布到所有
if [ ${#PLATFORMS[@]} -eq 0 ]; then
    PLATFORMS=("claude-code" "cline" "openclaw")
fi

echo "🎯 Publishing to: ${PLATFORMS[*]}"
echo ""

# 发布每个 skill
for skill in "${SKILLS[@]}"; do
    echo "=================================="
    skill_name=$(basename "$skill")
    echo "📦 Processing: $skill_name"

    for platform in "${PLATFORMS[@]}"; do
        case $platform in
            claude-code)
                publish_to_claude_code "$skill"
                ;;
            cline)
                publish_to_cline "$skill"
                ;;
            openclaw)
                publish_to_openclaw "$skill"
                ;;
        esac
    done
    echo ""
done

echo "=================================="
echo "✅ All skills published successfully!"
echo ""
echo "📊 Summary:"
for platform in "${PLATFORMS[@]}"; do
    case $platform in
        claude-code)
            echo "   Claude Code: $HOME/.claude/skills/"
            ;;
        cline)
            echo "   Cline: $HOME/.cline/skills/"
            ;;
        openclaw)
            echo "   OpenClaw: $HOME/.openclaw/skills/"
            ;;
    esac
done
echo ""
echo "🔗 View skills: https://github.com/tanstackship/packages/tree/main/skills"
