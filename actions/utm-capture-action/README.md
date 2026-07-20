# UTM Capture GitHub Action

> Capture UTM parameters from referrer URLs in GitHub Actions workflows.

## Features

- 🎯 Capture standard UTM parameters
- 📱 Auto-detect platform from click IDs (gclid, fbclid, etc.)
- 🔄 Map non-standard params (ref, source, via)
- ⚡ Zero dependencies

## Usage

```yaml
- name: Capture UTM
  uses: tanstackship/utm-capture-action@v1
  with:
    ref: ${{ github.event.client_payload.ref }}

- name: Use UTM values
  run: |
    echo "Source: ${{ steps.utm.outputs.utm_source }}"
    echo "Campaign: ${{ steps.utm.outputs.utm_campaign }}"
```

## Inputs

| Input | Description | Required |
|-------|-------------|----------|
| `ref` | URL or string containing UTM params | No |

## Outputs

| Output | Description |
|--------|-------------|
| `utm_source` | UTM source |
| `utm_medium` | UTM medium |
| `utm_campaign` | UTM campaign |
| `utm_term` | UTM term |
| `utm_content` | UTM content |

## License

MIT © [Huifer](https://tanstackship.com/about)
