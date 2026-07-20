# TanStack Ship Docker - UTM Worker

> Docker image for running UTM tracking worker at scale.

[![Docker](https://img.shields.io/badge/Docker-tanstackship.com-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/docker](https://tanstackship.com/docs)
- **Docker Hub**: [https://hub.docker.com/r/tanstackship/utm-worker](https://hub.docker.com)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
docker pull tanstackship/utm-worker:latest
```

## Quick Start

```bash
docker run -p 8787:8787 \
  -e KV_REST_API_URL=https://api.cloudflare.com/client/v4/accounts/xxx/storage/kv/namespaces/xxx \
  -e KV_REST_API_TOKEN=xxx \
  tanstackship/utm-worker:latest
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8787) |
| `KV_REST_API_URL` | Cloudflare KV REST API URL |
| `KV_REST_API_TOKEN` | Cloudflare KV API token |
| `POSTHOG_API_KEY` | PostHog API key (optional) |

## Docker Compose

```yaml
version: '3.8'
services:
  utm-worker:
    image: tanstackship/utm-worker:latest
    ports:
      - "8787:8787"
    environment:
      - KV_REST_API_URL=${KV_REST_API_URL}
      - KV_REST_API_TOKEN=${KV_REST_API_TOKEN}
```

## License

MIT © [Huifer](https://tanstackship.com/about)
