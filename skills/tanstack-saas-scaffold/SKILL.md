---
name: tanstack-saas-scaffold
identifier: tanstackship-tanstack-saas-scaffold
description: |
  为 TanStack Ship 快速生成 SaaS 项目脚手架。当你需要创建新的 SaaS 项目、生成项目模板、或搭建完整的技术栈时使用此 skill。自动生成包含前端、后端、数据库、认证、支付等完整功能的 SaaS 项目结构。支持 Next.js、Remix、SvelteKit 等主流框架。
allowed-tools: Read, Write, Edit, Bash
version: 1.0.0
author: TanStack Ship
homepage: https://tanstackship.com
repository: https://github.com/tanstackship/packages
tags: saas,scaffold,boilerplate,template,fullstack,nextjs,remix
---

# TanStack SaaS Scaffold

为 TanStack Ship 快速生成 SaaS 项目脚手架和模板。

## 功能特性

- 🚀 一键生成完整 SaaS 项目
- 🎨 多种前端框架支持（Next.js、Remix、SvelteKit）
- 💾 自动配置数据库（Supabase、PostgreSQL）
- 🔐 内置认证系统
- 💳 Stripe 支付集成
- 📊 UTM 追踪和分析
- 🌍 多语言支持
- 📧 邮件系统集成

## 支持的技术栈

### 前端框架

| 框架 | 状态 | 特性 |
|------|------|------|
| Next.js | ✅ | App Router、SSR、API Routes |
| Remix | ✅ | Loader、Action、Nested Routes |
| SvelteKit | ✅ | SSR、Endpoints、Stores |
| Nuxt | 🔄 | Vue 3、Nitro、Server Routes |

### 后端框架

| 框架 | 状态 | 特性 |
|------|------|------|
| tRPC | ✅ | End-to-end typesafe APIs |
| Express | ✅ | RESTful API |
| Fastify | ✅ | 高性能 API |
| Hono | ✅ | Edge Runtime |

### 数据库

| 数据库 | 状态 | 特性 |
|--------|------|------|
| Supabase | ✅ | PostgreSQL、Auth、Storage |
| Prisma | ✅ | ORM、Migration、Types |
| PlanetScale | ✅ | MySQL、Serverless |
| Turso | ✅ | SQLite、Edge |

## 快速开始

### 1. 生成新项目

```bash
# 使用默认配置
npx @tanstackship/saas-scaffold init my-saas-app

# 使用交互式配置
npx @tanstackship/saas-scaffold init my-saas-app --interactive

# 指定框架
npx @tanstackship/saas-scaffold init my-saas-app --framework nextjs

# 完整配置
npx @tanstackship/saas-scaffold init my-saas-app \
  --framework nextjs \
  --database supabase \
  --auth supabase \
  --payment stripe \
  --analytics utm
```

### 2. 项目结构

生成的项目包含以下结构：

```
my-saas-app/
├── apps/
│   ├── web/           # 前端应用
│   └── api/           # 后端 API（可选）
├── packages/
│   ├── ui/            # UI 组件库
│   ├── config/        # 共享配置
│   ├── db/            # 数据库 schema
│   └── types/         # TypeScript 类型
├── services/
│   ├── auth/          # 认证服务
│   ├── payments/      # 支付服务
│   └── email/         # 邮件服务
├── infra/
│   ├── supabase/      # Supabase 配置
│   └── stripe/        # Stripe 配置
└── docker-compose.yml
```

### 3. 可用的功能模块

```bash
# 添加认证
npx @tanstackship/saas-scaffold add auth

# 添加支付
npx @tanstackship/saas-scaffold add payments

# 添加 UTM 追踪
npx @tanstackship/saas-scaffold add analytics

# 添加多语言
npx @tanstackship/saas-scaffold add i18n

# 添加邮件系统
npx @tanstackship/saas-scaffold add email

# 添加所有功能
npx @tanstackship/saas-scaffold add all
```

## 配置选项

### 完整配置示例

```typescript
// saas.config.ts
export default {
  framework: 'nextjs',
  database: {
    type: 'supabase',
    url: process.env.DATABASE_URL,
  },
  auth: {
    provider: 'supabase',
    providers: ['email', 'google', 'github'],
  },
  payments: {
    provider: 'stripe',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  analytics: {
    providers: ['utm', 'google-analytics', 'mixpanel'],
  },
  i18n: {
    defaultLanguage: 'en',
    languages: ['en', 'zh', 'es', 'fr', 'ja'],
  },
  email: {
    provider: 'resend',
    from: 'noreply@myapp.com',
  },
};
```

## 生成的功能

### 认证页面

自动生成完整的认证流程：

- ✅ 登录页面
- ✅ 注册页面
- ✅ 密码重置
- ✅ OAuth 登录（Google、GitHub）
- ✅ 邮箱验证

### 支付页面

- ✅ 定价页面
- ✅ 结账流程
- ✅ Webhook 处理
- ✅ 订阅管理

### 营销页面

- ✅ Landing Page
- ✅ 功能展示
- ✅ 客户案例
- ✅ 联系我们

### 管理后台

- ✅ 仪表板
- ✅ 用户管理
- ✅ 订单管理
- ✅ 数据分析

## 环境变量

生成的项目包含以下环境变量模板：

```env
# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# Email
RESEND_API_KEY=

# Analytics
GOOGLE_ANALYTICS_ID=
MIXPANEL_TOKEN=
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行数据库迁移
pnpm db:migrate

# 生成 Prisma Client
pnpm db:generate

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 部署

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Docker

```bash
# 构建镜像
docker build -t my-saas-app .

# 运行容器
docker run -p 3000:3000 my-saas-app
```

### Supabase

```bash
# 链接到 Supabase 项目
npx supabase link

# 推送到 Supabase
npx supabase db push
```

## 模板示例

### Next.js + Supabase 模板

```bash
npx @tanstackship/saas-scaffold init my-app \
  --framework nextjs \
  --database supabase \
  --auth supabase \
  --template ecommerce
```

### Remix + Prisma 模板

```bash
npx @tanstackship/saas-scaffold init my-app \
  --framework remix \
  --database prisma \
  --auth clerk \
  --template saas
```

### SvelteKit + Turso 模板

```bash
npx @tanstackship/saas-scaffold init my-app \
  --framework sveltekit \
  --database turso \
  --auth Lucia \
  --Template MVP
```

## 与 TanStack Ship 集成

生成的项目自动集成 TanStack Ship 包：

- `@tanstackship/utm-tracker` - UTM 追踪
- `@tanstackship/analytics` - 多平台分析
- `@tanstackship/referral` - 推荐系统
- `@tanstackship/stripe-utils` - Stripe 工具
- `@tanstackship/i18n` - 多语言支持

## 最佳实践

1. **选择合适的技术栈** - 根据团队经验和项目需求
2. **配置数据库** - 确保连接字符串正确
3. **设置环境变量** - 使用 `.env.local` 进行本地开发
4. **运行迁移** - 在启动应用前运行数据库迁移
5. **测试支付流程** - 使用 Stripe 测试模式

## 故障排除

### 数据库连接失败

确保 `.env` 文件中的 `DATABASE_URL` 正确。

### 认证不工作

检查 Supabase 的认证设置和回调 URL。

### Stripe Webhook 失败

确保 Webhook Secret 正确，且 Stripe 可以访问你的服务器。

## 许可证

MIT © TanStack Ship
