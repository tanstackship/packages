# @tanstackship/campaigns

> Email campaign management. Send transactional and marketing emails.

[![npm](https://img.shields.io/badge/npm-tanstackship.com-red)](https://www.npmjs.com/org/tanstackship)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/campaigns](https://tanstackship.com/docs)
- **npm**: [https://www.npmjs.com/package/@tanstackship/campaigns](https://www.npmjs.com/package/@tanstackship/campaigns)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 📧 Email templates
- 🎯 Segmentation
- 📊 Analytics
- ⏰ Scheduling
- 🔄 Automation

## Installation

```bash
npm install @tanstackship/campaigns
```

## Quick Start

```typescript
import { createCampaignSystem } from '@tanstackship/campaigns'

const campaigns = createCampaignSystem()

const campaign = await campaigns.createCampaign({
  name: 'Welcome Series',
  subject: 'Welcome to TanStack Ship!',
  template: 'welcome-email',
})
```

## License

MIT © [Huifer](https://tanstackship.com/about)
