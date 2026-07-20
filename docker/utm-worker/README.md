# UTM Tracking Worker Docker Image

> Dockerized Cloudflare Workers UTM tracking function

## Quick Start

```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/tanstackship/utm-worker:latest

# Run locally
docker run -p 8787:8787 \
  -e SITE_URL=https://tanstackship.com \
  ghcr.io/tanstackship/utm-worker:latest
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SITE_URL` | Your site URL | Yes |
| `KV_ID` | Cloudflare KV namespace ID | No (local dev) |

## Usage

```bash
# Build locally
docker build -t utm-worker .

# Run with wrangler
docker run -p 8787:8787 utm-worker
```

## Endpoints

| Path | Method | Description |
|------|--------|-------------|
| `/` | GET | Health check |
| `/?utm_source=google` | GET | Capture UTM params |

## License

MIT © [Huifer](https://tanstackship.com/about)
