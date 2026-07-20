# @tanstackship/utm-mcp-server

> MCP server for UTM parsing and analytics. Use with Claude Desktop, Cursor, and other MCP-compatible AI tools.

[![MCP](https://img.shields.io/badge/MCP-tanstackship.com-purple)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/mcp](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/utm-mcp-server](https://www.npmjs.com/package/@tanstackship/utm-mcp-server)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```bash
npm install -g @tanstackship/utm-mcp-server
```

## Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tanstackship-utm": {
      "command": "node",
      "args": ["/path/to/@tanstackship/utm-mcp-server/dist/index.js"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `parse_utm_url` | Parse UTM from URL |
| `parse_utm_text` | Extract UTM from text |
| `generate_utm_url` | Create URL with UTM params |
| `track_attribution` | Track attribution data |

## License

MIT © [Huifer](https://tanstackship.com/about)
