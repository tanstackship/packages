# Cloudflare Workers Templates

> TanStack Ship 相关的 Cloudflare Workers 模板

## 📦 模板列表

| 模板 | 描述 | 状态 |
|------|------|------|
| `tanstackship-utm-worker` | UTM 追踪 Worker | 🔄 开发中 |
| `tanstackship-short-link` | 短链接服务 | 📋 计划 |

## 🔗 外链价值

| 平台 | DR | 外链位置 |
|------|-----|----------|
| developers.cloudflare.com | 90 | 模板市场 |
| workers.cloudflare.com | 85 | Workers.new |

## 🚀 发布到 Workers.new

1. Fork 模板仓库
2. 在 `workers.cloudflare.com/workspaces/templates` 提交
3. 或提交 PR 到 Cloudflare 官方模板

## 📁 结构

```
cloudflare-template/
├── utm-worker/
│   ├── wrangler.toml
│   ├── src/
│   │   └── index.ts
│   └── package.json
└── short-link/
    └── ...
```
