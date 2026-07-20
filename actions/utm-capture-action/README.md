# UTM Capture GitHub Action

> Capture UTM parameters from git commits and pull requests in CI/CD workflows.

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-tanstackship.com-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/actions](https://tanstackship.com/docs)
- **GitHub Marketplace**: [https://github.com/marketplace](https://github.com/marketplace)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Usage

```yaml
- name: Capture UTM
  uses: tanstackship/utm-capture-action@v1
  with:
    ref: ${{ github.event.head_commit.message }}

- name: Use UTM
  run: |
    echo "Source: ${{ steps.utm.outputs.utm_source }}"
```

## Inputs

| Input | Description |
|-------|-------------|
| `ref` | Text to parse |
| `source` | Override source |
| `medium` | Set UTM medium |
| `campaign` | Set UTM campaign |

## Outputs

| Output | Description |
|--------|-------------|
| `utm_source` | UTM source |
| `utm_medium` | UTM medium |
| `utm_campaign` | UTM campaign |
| `utm_json` | All params as JSON |

## License

MIT © [Huifer](https://tanstackship.com/about)
