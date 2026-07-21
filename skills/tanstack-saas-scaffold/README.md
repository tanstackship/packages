# TanStack SaaS Scaffold Skill

> 为 AI 助手添加 TanStack Ship SaaS 项目脚手架生成能力

这是一个 Claude Code/Cline/OpenClaw skill，帮助你快速生成完整的 SaaS 项目。

## 功能

- 🚀 一键生成 SaaS 项目结构
- 🎨 支持多种前端框架（Next.js、Remix、SvelteKit）
- 💾 自动配置数据库
- 🔐 内置认证和支付系统

## 安装

### Claude Code

```bash
cp -r skills/tanstack-saas-scaffold ~/.claude/skills/
```

### Cline

```bash
cp -r skills/tanstack-saas-scaffold ~/.cline/skills/
```

### OpenClaw

```bash
cp -r skills/tanstack-saas-scaffold ~/.openclaw/skills/
```

## 使用

在 AI 助手中说：

> "使用 tanstack-saas-scaffold skill 生成一个带认证和支付的 Next.js SaaS 项目"

AI 助手会自动：
1. 分析你的需求
2. 生成项目结构
3. 配置所有必要的文件
4. 创建数据库 schema
5. 设置认证和支付流程

## 支持

- Website: https://tanstackship.com
- Issues: https://github.com/tanstackship/packages/issues

## License

MIT
