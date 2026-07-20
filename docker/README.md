# Docker Images

> TanStack Ship 相关的 Docker 镜像

## 📦 镜像列表

| 镜像 | 描述 | 状态 |
|------|------|------|
| `ghcr.io/tanstackship/utm-worker` | UTM 追踪 Worker | 🔄 开发中 |
| `ghcr.io/tanstackship/short-link-worker` | 短链接 Worker | 📋 计划 |

## 🔗 外链价值

| 平台 | DR | 外链位置 |
|------|-----|----------|
| github.com | 96 | Container Registry |
| ghcr.io | 85 | 镜像页面 |
| docker.com | 94 | Hub 页面 (如有) |

## 📁 结构

```
docker/
├── utm-worker/
│   ├── Dockerfile
│   └── wrangler.toml
└── short-link-worker/
    └── ...
```

## 🚀 发布

```bash
# 登录 GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 构建并推送
docker build -t ghcr.io/tanstackship/utm-worker:latest utm-worker/
docker push ghcr.io/tanstackship/utm-worker:latest
```
