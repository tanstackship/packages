# @tanstackship/campaigns

> Email campaign management. Send transactional and marketing emails.

## Features

- 📧 **Email templates** - Create and manage email templates
- 🎯 **Segmentation** - Send to specific user segments
- 📊 **Analytics** - Track opens, clicks, bounces
- ⏰ **Scheduling** - Schedule emails for later
- 🔄 **Automation** - Trigger emails based on events

## Installation

```bash
npm install @tanstackship/campaigns
```

## Quick Start

```typescript
import { createCampaignSystem } from '@tanstackship/campaigns'

const campaigns = createCampaignSystem()

// Create a campaign
const campaign = await campaigns.createCampaign({
  name: 'Welcome Series',
  subject: 'Welcome to TanStack Ship!',
  template: 'welcome-email',
  segment: 'new_users',
})

// Send to segment
await campaigns.sendToSegment({
  campaignId: campaign.id,
  segment: 'new_users',
})
```

## License

MIT © [Huifer](https://tanstackship.com/about)
