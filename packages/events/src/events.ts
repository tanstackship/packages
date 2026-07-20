/**
 * Event System Implementation
 */

export interface AppEvent {
  id: string
  type: string
  userId?: string
  properties: Record<string, unknown>
  createdAt: string
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  secret: string
  active: boolean
}

export interface EventSystem {
  emit(event: Omit<AppEvent, 'id' | 'createdAt'>): Promise<AppEvent>
  on(type: string, handler: (event: AppEvent) => Promise<void> | void): void
  off(type: string, handler: (event: AppEvent) => Promise<void> | void): void
  registerWebhook(config: { url: string; events: string[]; secret: string }): Promise<void>
  listWebhooks(): Promise<Webhook[]>
}

export function createEventSystem(): EventSystem {
  const handlers = new Map<string, Set<(event: AppEvent) => Promise<void> | void>>()
  const webhooks: Webhook[] = []

  async function emit(event: Omit<AppEvent, 'id' | 'createdAt'>): Promise<AppEvent> {
    const appEvent: AppEvent = {
      id: Math.random().toString(36).substring(7),
      type: event.type,
      userId: event.userId,
      properties: event.properties,
      createdAt: new Date().toISOString(),
    }

    const typeHandlers = handlers.get(event.type)
    if (typeHandlers) {
      await Promise.all(Array.from(typeHandlers).map(h => h(appEvent)))
    }

    const wildcardHandlers = handlers.get('*')
    if (wildcardHandlers) {
      await Promise.all(Array.from(wildcardHandlers).map(h => h(appEvent)))
    }

    return appEvent
  }

  return {
    emit,
    on(type, handler) {
      if (!handlers.has(type)) handlers.set(type, new Set())
      handlers.get(type)!.add(handler)
    },
    off(type, handler) {
      handlers.get(type)?.delete(handler)
    },
    async registerWebhook({ url, events: eventsList, secret }) {
      webhooks.push({ id: Math.random().toString(36).substring(7), url, events: eventsList, secret, active: true })
    },
    async listWebhooks() {
      return webhooks
    },
  }
}
