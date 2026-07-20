# UTM MCP Server

> Model Context Protocol server for UTM parsing - enables AI agents to parse and analyze UTM parameters

## Features

- 🔗 Parse UTM parameters from URLs
- 📊 Analyze marketing attribution
- 🔍 Detect platform click IDs
- 📈 Generate attribution reports

## Installation

```bash
npm install -g @tanstackship/utm-mcp-server
```

## Configuration

Add to your MCP configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "utm": {
      "command": "npx",
      "args": ["-y", "@tanstackship/utm-mcp-server"]
    }
  }
}
```

## Tools

### parse_utm

Parse UTM parameters from a URL.

```typescript
{
  name: 'parse_utm',
  description: 'Parse UTM parameters from a URL string',
  inputSchema: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'URL to parse' }
    },
    required: ['url']
  }
}
```

### analyze_attribution

Analyze marketing attribution from UTM data.

```typescript
{
  name: 'analyze_attribution',
  description: 'Analyze marketing attribution from UTM data',
  inputSchema: {
    type: 'object',
    properties: {
      source: { type: 'string' },
      medium: { type: 'string' },
      campaign: { type: 'string' }
    }
  }
}
```

## License

MIT © [Huifer](https://tanstackship.com/about)
