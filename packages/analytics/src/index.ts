/**
 * Analytics SDK
 */

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp?: string
}

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void
  identify(userId: string, traits?: Record<string, unknown>): void
  page(name?: string, properties?: Record<string, unknown>): void
}

export interface AnalyticsConfig {
  providers: AnalyticsProvider[]
  consent: boolean
  batchSize?: number
  batchInterval?: number
}

export function createAnalytics(config: AnalyticsConfig): AnalyticsProvider {
  

  return {
    track(event) {
      if (!config.consent) return
      config.providers.forEach(p => p.track(event))
    },
    identify(userId, traits) {
      if (!config.consent) return
      config.providers.forEach(p => p.identify(userId, traits))
    },
    page(name, properties) {
      if (!config.consent) return
      config.providers.forEach(p => p.page(name, properties))
    },
  }
}

export function track(name: string, properties?: Record<string, unknown>) {
  console.log('Track:', name, properties)
}
