#!/bin/bash

# TanStack Ship Skills Marketplace Publisher
# 发布 skills 到多个 AI 技能市场平台

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SKILLS_DIR="$PROJECT_ROOT/skills"
REPO_URL="https://github.com/tanstackship/packages"

echo "🚀 TanStack Ship Skills Marketplace Publisher"
echo "============================================="
echo ""
echo "📦 Repository: $REPO_URL"
echo ""

# 检查 skills 目录
if [ ! -d "$SKILLS_DIR" ]; then
    echo "❌ Skills directory not found: $SKILLS_DIR"
    exit 1
fi

# 获取所有 skills
SKILLS=($(find "$SKILLS_DIR" -name "SKILL.md" -exec dirname {} \;))

echo "📦 Found ${#SKILLS[@]} skills to publish:"
for skill in "${SKILLS[@]}"; do
    echo "   - $(basename "$skill")"
done
echo ""

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 发布函数
publish_lobehub() {
    echo -e "${BLUE}📤 Publishing to LobeHub Skills Marketplace...${NC}"
    echo "   URL: https://lobehub.com/skills"
    echo "   Submit: https://lobehub.com/skills/skill.md"
    echo ""
    echo "📝 Instructions:"
    echo "   1. Visit https://lobehub.com/skills/skill.md"
    echo "   2. Run: npx @lobehub/skill-submit@latest"
    echo "   3. Or submit via PR to their catalog"
    echo ""
    echo "   Repository URL: $REPO_URL/tree/main/skills"
    echo ""
}

publish_augmentclaude() {
    echo -e "${BLUE}📤 Publishing to AugmentClaude...${NC}"
    echo "   URL: https://augmentclaude.com/submit"
    echo ""
    echo "📝 Instructions:"
    echo "   1. Visit https://augmentclaude.com/submit"
    echo "   2. Sign in with GitHub"
    echo "   3. Link your repository: $REPO_URL"
    echo "   4. Skills will be auto-discovered"
    echo ""
}

publish_skillplugs() {
    echo -e "${BLUE}📤 Publishing to Skillplugs...${NC}"
    echo "   URL: https://skillplugs.com/submit"
    echo ""
    echo "📝 Instructions:"
    echo "   1. Visit https://skillplugs.com/submit"
    echo "   2. Enter repository URL: $REPO_URL"
    echo "   3. Skills will be auto-fetched"
    echo ""
}

publish_developers_digest() {
    echo -e "${BLUE}📤 Publishing to Developers Digest...${NC}"
    echo "   URL: https://skills.developersdigest.tech/submit"
    echo ""
    echo "📝 Instructions:"
    echo "   1. Fork: https://github.com/developersdigest/skills"
    echo "   2. Add your skill to the catalog"
    echo "   3. Submit a Pull Request"
    echo ""
    echo "   Example entry:"
    echo "   {"
    echo "     \"name\": \"tanstack-multi-language\","
    echo "     \"description\": \"TanStack Ship multi-language i18n support\","
    echo "     \"repo\": \"$REPO_URL\","
    echo "     \"path\": \"skills/tanstack-multi-language\""
    echo "   }"
    echo ""
}

publish_agent_skills_cc() {
    echo -e "${BLUE}📤 Publishing to Agent Skills CC (中文市场)...${NC}"
    echo "   URL: https://agent-skills.cc/zh"
    echo ""
    echo "📝 Instructions:"
    echo "   1. Visit https://agent-skills.cc"
    echo "   2. Submit your GitHub repository"
    echo "   3. Chinese-language marketplace (1K+ skills)"
    echo ""
}

publish_claudeskills_info() {
    echo -e "${BLUE}📤 Publishing to ClaudeSkills.info...${NC}"
    echo "   URL: https://claudeskills.info"
    echo ""
    echo "📝 Instructions:"
    echo "   1. Visit claudeskills.info"
    echo "   2. Submit via their form or contact"
    echo "   3. Curated marketplace (381 skills)"
    echo ""
}

publish_skillsmp() {
    echo -e "${GREEN}✅ SkillsMP (Automatic Indexing)${NC}"
    echo "   URL: https://skillsmp.com"
    echo ""
    echo "📝 Info:"
    echo "   SkillsMP automatically indexes public GitHub repos"
    echo "   Your skill should already be indexed!"
    echo ""
    echo "   Search for: tanstackship"
    echo "   Direct: https://skillsmp.com?q=tanstackship"
    echo ""
}

# 显示所有平台
echo "🌐 Available Marketplaces:"
echo "================================"
echo ""
echo "1. LobeHub          - 332K+ skills  (npx submit)"
echo "2. SkillsMP         - 2M+ skills   (auto-indexed) ✅"
echo "3. ClaudeSkills.info- 381 skills   (form submit)"
echo "4. Agent Skills CC  - 1K+ skills   (Chinese)"
echo "5. Developers Digest- 312 skills   (PR submit)"
echo "6. AugmentClaude    - New market   (URL submit)"
echo "7. Skillplugs       - Auto-fetch   (URL submit)"
echo ""

# 如果提供了参数，显示特定平台的发布指南
if [ $# -gt 0 ]; then
    case $1 in
        lobehub|lobehub)
            publish_lobehub
            ;;
        augmentclaude|augment)
            publish_augmentclaude
            ;;
        skillplugs)
            publish_skillplugs
            ;;
        developers-digest|dd)
            publish_developers_digest
            ;;
        agent-skills-cc|cc)
            publish_agent_skills_cc
            ;;
        claudeskills|claudeskills-info)
            publish_claudeskills_info
            ;;
        skillsmp)
            publish_skillsmp
            ;;
        all)
            publish_lobehub
            publish_augmentclaude
            publish_skillplugs
            publish_developers_digest
            publish_agent_skills_cc
            publish_claudeskills_info
            publish_skillsmp
            ;;
        *)
            echo "Unknown platform: $1"
            echo ""
            echo "Available platforms:"
            echo "  - lobehub"
            echo "  - augmentclaude"
            echo "  - skillplugs"
            echo "  - developers-digest"
            echo "  - agent-skills-cc"
            echo "  - claudeskills-info"
            echo "  - skillsmp"
            echo "  - all"
            exit 1
            ;;
    esac
else
    # 默认显示 SkillsMP 状态和其他平台概览
    publish_skillsmp

    echo "📖 For detailed instructions, run:"
    echo "   $0 lobehub"
    echo "   $0 augmentclaude"
    echo "   $0 skillplugs"
    echo "   $0 developers-digest"
    echo "   $0 agent-skills-cc"
    echo "   $0 claudeskills-info"
    echo "   $0 all"
    echo ""
fi

echo "🔗 Skills Repository:"
echo "   $REPO_URL/tree/main/skills"
echo ""
