# Publishing Guide

## TanStack Ship Packages Publishing Guide

本指南说明如何发布和管理 TanStack Ship 独立包。

## 📦 包列表

### npm 包 (@tanstackship/*)

| 包名 | 描述 | 状态 | 来源 |
|------|------|------|------|
| `@tanstackship/utm-tracker` | UTM 追踪与归因系统 | ✅ Ready | TanStack Ship |
| `@tanstackship/short-link` | 短链接 + 追踪系统 | 🔄 WIP | TanStack Ship |
| `@tanstackship/pricing-engine` | 动态定价引擎 | 🔄 WIP | TanStack Ship |
| `@tanstackship/schema-builder` | JSON-LD Schema 生成器 | 🔄 WIP | TanStack Ship |
| `@tanstackship/auth` | 认证中间件 | 📋 Plan | TanStack Ship |
| `@tanstackship/stripe-utils` | Stripe 集成工具 | 📋 Plan | TanStack Ship |
| `@tanstackship/i18n` | 多语言支持 | 📋 Plan | TanStack Ship |
| `@tanstackship/rate-limit` | 速率限制中间件 | 📋 Plan | TanStack Ship |

### crates.io 包

| 包名 | 描述 | 状态 |
|------|------|------|
| `utm-parse` | Rust UTM 解析库 | 🔄 WIP |
| `short-link-parse` | Rust 短链接解析库 | 📋 Plan |

## 🚀 发布流程

### 1. 准备工作

#### npm 包

1. 确保你已经在 npm 上注册并创建了组织
   - 访问 https://www.npmjs.com/org/create
   - 创建 `@tanstackship` 组织

2. 获取 npm token
   - 访问 https://www.npmjs.com/settings/tokens
   - 创建 Classic Token (Automation)
   - 权限: Publish

3. 添加 Secrets 到 GitHub
   - 进入 GitHub 仓库 Settings → Secrets
   - 添加 `NPM_TOKEN`

#### Rust 包

1. 登录 crates.io
   ```bash
   cargo login <API_TOKEN>
   ```

2. 获取 API Token
   - 访问 https://crates.io/settings/tokens
   - 创建新 token

3. 添加 Secrets 到 GitHub
   - 添加 `CRATES_IO_TOKEN`

### 2. 发布 npm 包

#### 方式 A: GitHub Actions (推荐)

1. 进入仓库 Actions 页面
2. 选择 "Publish npm Packages" workflow
3. 点击 "Run workflow"
4. 选择要发布的包
5. 选择版本类型 (patch/minor/major)

#### 方式 B: 手动发布

```bash
cd packages/utm-tracker

# 更新版本
npm version patch  # 或 minor, major

# 构建
pnpm build

# 发布
npm publish --access public
```

### 3. 发布 Rust 包

#### 方式 A: GitHub Actions (推荐)

1. 进入仓库 Actions 页面
2. 选择 "Publish Rust Crates" workflow
3. 点击 "Run workflow"
4. 选择要发布的 crate
5. 选择版本类型

#### 方式 B: 手动发布

```bash
cd rust/utm-parse

# 更新版本
cargo release patch  # 需要先安装 cargo-release
# 或者手动编辑 Cargo.toml

# 测试
cargo test

# 发布
cargo publish
```

### 4. 发布后检查

```bash
# npm 包
npm view @tanstackship/utm-tracker
npm info @tanstackship/utm-tracker

# Rust 包
cargo search utm-parse
```

## 📊 外链价值

发布后，以下平台会产生外链：

| 平台 | DR | 外链位置 |
|------|-----|----------|
| npmjs.com | 93 | 包页面 → homepage 字段 |
| GitHub | 96 | 包页面 → repository 字段 |
| crates.io | 92 | crate 页面 → repository 字段 |
| docs.rs | 85 | 文档页面 |

## 🔄 版本管理

### SemVer 规则

- **patch**: 修复 bug，向后兼容
- **minor**: 新功能，向后兼容
- **major**: 破坏性更改

### Changelog

每个发布都需要更新 CHANGELOG.md：

```markdown
## [1.0.0] - 2024-01-01

### Added
- Initial release
- UTM tracking support

### Fixed
- Bug in parsing
```

## 🧪 测试策略

### CI 检查项

1. ✅ Type check
2. ✅ Lint
3. ✅ Unit tests
4. ✅ Build

### 发布前检查清单

- [ ] 所有测试通过
- [ ] 无 lint 警告
- [ ] 类型检查通过
- [ ] 构建成功
- [ ] README 完整
- [ ] CHANGELOG 更新

## 📝 最佳实践

### 包命名

- 使用 scope: `@tanstackship`
- 简短、描述性的名称
- 避免过长的包名

### README 结构

```markdown
# Package Name

> 一句话描述

## Features
- Feature 1
- Feature 2

## Installation
```bash
npm install @tanstackship/package-name
```

## Quick Start
```typescript
// Basic usage
```

## API Reference
// Detailed API

## License
MIT
```

### package.json

```json
{
  "name": "@tanstackship/package-name",
  "version": "1.0.0",
  "description": "Clear, concise description",
  "keywords": ["keyword1", "keyword2"],
  "homepage": "https://tanstackship.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/orgs/tanstackship",
    "directory": "packages/package-name"
  },
  "license": "MIT",
  "author": {
    "name": "Huifer",
    "url": "https://tanstackship.com/about"
  }
}
```

## 🌐 外链监控

发布后监控外链增长：

```bash
# 使用 Ahrefs 或 Moz 检查
# 目标域名:
# - npmjs.com
# - registry.npmjs.org
# - github.com/orgs/tanstackship
# - crates.io
# - docs.rs
```

## ❓ 常见问题

### Q: 包名被占用怎么办？
A: 选择不同的名称或联系 npm 支持

### Q: 发布失败？
A: 检查:
1. npm token 权限
2. 版本号是否已存在
3. package.json 是否正确

### Q: 如何撤回发布？
A:
```bash
# npm
npm unpublish @tanstackship/package-name@1.0.0

# crates.io
# 登录 crates.io 后在包页面撤回
```

## 📞 支持

- GitHub Issues: https://github.com/orgs/tanstackship/issues
- Website: https://tanstackship.com
