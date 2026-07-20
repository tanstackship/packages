# TanStack Ship Supabase Template

> Complete Supabase setup for SaaS apps with UTM tracking, analytics, and more.

## Features

- 📊 **Analytics tables** - Page views, events, conversions
- 🎯 **UTM tracking** - Capture and store UTM parameters
- 👥 **User attribution** - Link users to their traffic sources
- 📈 **Funnels** - Track user journeys
- 🛒 **E-commerce** - Products, orders, subscriptions

## Structure

```
supabase-template/
├── migrations/           # Database migrations
│   ├── 001_analytics.sql
│   ├── 002_utm_tracking.sql
│   ├── 003_ecommerce.sql
│   └── 004_analytics_views.sql
├── functions/            # Edge functions
│   ├── track-event/
│   └── attribution/
├── hooks/               # Database hooks
└── README.md
```

## Quick Start

### 1. Apply Migrations

```bash
supabase db push
```

### 2. Track an Event

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

await supabase.rpc('track_page_view', {
  p_user_id: userId,
  p_url: '/dashboard',
  p_utm_source: 'google',
  p_utm_medium: 'cpc',
  p_utm_campaign: 'spring_sale',
})
```

### 3. Query Analytics

```sql
-- Top sources by conversions
SELECT 
  utm_source,
  COUNT(*) as conversions
FROM analytics_events
WHERE event_type = 'signup'
GROUP BY utm_source
ORDER BY conversions DESC;
```

## Migrations

### Analytics Tables

```sql
-- Page views
CREATE TABLE analytics_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_properties JSONB DEFAULT '{}',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Attribution

```sql
CREATE TABLE user_attributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  first_utm_source TEXT,
  first_utm_medium TEXT,
  first_utm_campaign TEXT,
  first_touch_at TIMESTAMPTZ,
  last_utm_source TEXT,
  last_utm_medium TEXT,
  last_utm_campaign TEXT,
  last_touch_at TIMESTAMPTZ,
  touch_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Edge Functions

### Track Event

```typescript
// supabase/functions/track-event/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { event_type, properties, user_id } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  await supabase.from('analytics_events').insert({
    user_id,
    event_type,
    event_properties: properties,
  })
  
  return new Response(JSON.stringify({ success: true }))
})
```

## Row Level Security

```sql
-- Only service role can insert analytics
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert"
  ON analytics_page_views FOR INSERT
  WITH CHECK (true);

-- Users can only view their own attribution
CREATE POLICY "Users view own attribution"
  ON user_attributions FOR SELECT
  USING (auth.uid() = user_id);
```

## License

MIT © [Huifer](https://tanstackship.com/about)
