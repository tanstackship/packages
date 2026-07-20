/**
 * UTM MCP Server
 * 
 * Model Context Protocol server for UTM parsing.
 * Enables AI agents to parse and analyze UTM parameters.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Platform click IDs
const PLATFORM_CLICK_IDS: Record<string, string> = {
  gclid: 'google',
  fbclid: 'facebook',
  msclkid: 'bing',
  ttclid: 'tiktok',
  li_fat_id: 'linkedin',
};

// Non-standard source params
const NON_STANDARD_SOURCE_PARAMS = [
  'ref', 'referrer', 'refer', 'source', 'via', 'from', 'origin', 'src'
];

/**
 * Parse UTM parameters from URL
 */
function parseUtm(url: string): Record<string, string | null> {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    let source: string | null = params.get('utm_source');
    const medium = params.get('utm_medium');
    const campaign = params.get('utm_campaign');
    const term = params.get('utm_term');
    const content = params.get('utm_content');
    let platform: string | null = null;

    // If no utm_source, try platform click IDs
    if (!source) {
      for (const [clickId, plat] of Object.entries(PLATFORM_CLICK_IDS)) {
        if (params.has(clickId)) {
          source = plat;
          platform = plat;
          break;
        }
      }
    }

    // If still no source, try non-standard params
    if (!source) {
      for (const param of NON_STANDARD_SOURCE_PARAMS) {
        const value = params.get(param);
        if (value) {
          source = value;
          break;
        }
      }
    }

    return {
      source,
      medium,
      campaign,
      term,
      content,
      platform,
      referrer: document?.referrer || null,
    };
  } catch {
    return {
      source: null,
      medium: null,
      campaign: null,
      term: null,
      content: null,
      platform: null,
      referrer: null,
    };
  }
}

/**
 * Analyze attribution from UTM data
 */
function analyzeAttribution(source: string | null, medium: string | null, campaign: string | null): string {
  if (!source) {
    return 'Unknown source - no UTM parameters detected';
  }

  const analysis = [
    `Source: ${source}`,
    medium ? `Medium: ${medium}` : null,
    campaign ? `Campaign: ${campaign}` : null,
    '',
    'Attribution Summary:',
  ];

  // Channel categorization
  const socialChannels = ['facebook', 'twitter', 'instagram', 'linkedin', 'reddit'];
  const searchChannels = ['google', 'bing', 'yahoo'];
  const emailChannels = ['newsletter', 'email'];

  if (socialChannels.includes(source.toLowerCase())) {
    analysis.push('Channel Type: Social Media');
  } else if (searchChannels.includes(source.toLowerCase())) {
    analysis.push('Channel Type: Organic/Paid Search');
  } else if (emailChannels.includes(source.toLowerCase())) {
    analysis.push('Channel Type: Email Marketing');
  } else if (source === 'direct') {
    analysis.push('Channel Type: Direct (no referrer)');
  } else {
    analysis.push('Channel Type: Other/Referral');
  }

  return analysis.filter(Boolean).join('\n');
}

// Create MCP server
const server = new Server(
  {
    name: 'utm-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'parse_utm',
        description: 'Parse UTM parameters from a URL string',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to parse UTM parameters from',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'analyze_attribution',
        description: 'Analyze marketing attribution from UTM data',
        inputSchema: {
          type: 'object',
          properties: {
            source: { type: 'string', description: 'UTM source' },
            medium: { type: 'string', description: 'UTM medium' },
            campaign: { type: 'string', description: 'UTM campaign' },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'parse_utm') {
    const { url } = args as { url: string };
    const result = parseUtm(url);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  if (name === 'analyze_attribution') {
    const { source, medium, campaign } = args as {
      source: string | null;
      medium: string | null;
      campaign: string | null;
    };
    const analysis = analyzeAttribution(source, medium, campaign);
    return {
      content: [
        {
          type: 'text',
          text: analysis,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('UTM MCP Server running on stdio');
}

main().catch(console.error);
