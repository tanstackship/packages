# @tanstackship/events

> Event tracking and webhooks system for SaaS apps.

## Features

- 📡 **Event emission** - Emit events from your app
- 🪝 **Webhook delivery** - Send events to external URLs  
- 🔄 **Retry logic** - Automatic retry with exponential backoff
- 📊 **Event history** - Store and query event history
- 🔒 **Security** - HMAC signature verification

## Installation

```bash
npm install @tanstackship/events
```

## Quick Start

```typescript
import { createEventSystem } from '@tanstackship/events'

const events = createEventSystem()

// Emit an event
await events.emit({
  type: 'user.signup',
  userId: 'user_123',
  properties: { plan: 'pro' },
})

// Listen to events
events.on('user.signup', async (event) => {
  console.log(`New user: ${event.userId}`)
})
```

## API Reference

### `createEventSystem(config)`

Create event system.

```typescript
const events = createEventSystem({
  storage: 'database', // or 'memory'
  retentionDays: 90,
})
```

### `events.emit(event)`

Emit an event.

```typescript
await events.emit({
  type: 'order.completed',
  userId: 'user_123',
  properties: { orderId: 'order_456', amount: 99.99 },
})
```

### `events.on(eventType, handler)`

Listen to events.

```typescript
events.on('user.signup', async (event) => {
  await sendAnalytics(event)
})
```

### `events.registerWebhook(config)`

Register a webhook.

```typescript
await events.registerWebhook({
  url: 'https://api.example.com/webhook',
  events: ['order.completed'],
  secret: 'whsec_xxx',
})
```

## License

MIT © [Huifer](https://tanstackship.com/about)
