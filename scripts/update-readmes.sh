#!/bin/bash

# TanStack Ship README Updater
# 确保每个包的 README 都链接到主站

BASE_URL="https://tanstackship.com"
GITHUB_ORG="tanstackship"
GITHUB_REPO="packages"
ISSUES_URL="https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/issues"

# NPM packages that need to be created first (org invite required)
# @tanstackship/utm-tracker, @tanstackship/analytics, etc.

cat << 'HEADER_EOF'
# TanStack Ship

> Open-source SaaS boilerplate for modern web applications.

[![TanStack Ship](https://img.shields.io/badge/TanStack%20Ship-SaaS%20Boilerplate-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Links

- 🌐 **Website**: [https://tanstackship.com](https://tanstackship.com)
- 📚 **Documentation**: [https://tanstackship.com/docs](https://tanstackship.com/docs)
- 💬 **Discord**: [https://tanstackship.com/discord](https://tanstackship.com/discord)
- 🐛 **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)
- 📦 **npm**: [https://www.npmjs.com/org/tanstackship](https://www.npmjs.com/org/tanstackship)

## Packages

TanStack Ship provides packages across 20+ platforms:

- **JavaScript/TypeScript**: npm packages for web applications
- **Rust**: High-performance parsing libraries
- **Python**: Data science and backend integration
- **Go**: CLI tools and microservices
- **And more...**

See all packages at [https://tanstackship.com/packages](https://tanstackship.com/packages)

## Contributing

Contributions welcome! Please see our [Contributing Guide](https://github.com/tanstackship/packages/blob/main/CONTRIBUTING.md).

## License

MIT © [Huifer](https://tanstackship.com/about)
HEADER_EOF
