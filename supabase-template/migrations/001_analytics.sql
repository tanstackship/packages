-- Analytics Tables Migration
-- Run: supabase db push

-- Page Views
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  url TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_properties JSONB DEFAULT '{}',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Attributions
CREATE TABLE IF NOT EXISTS user_attributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_utm_source TEXT,
  first_utm_medium TEXT,
  first_utm_campaign TEXT,
  first_utm_term TEXT,
  first_utm_content TEXT,
  first_touch_at TIMESTAMPTZ,
  first_touch_url TEXT,
  last_utm_source TEXT,
  last_utm_medium TEXT,
  last_utm_campaign TEXT,
  last_utm_term TEXT,
  last_utm_content TEXT,
  last_touch_at TIMESTAMPTZ,
  last_touch_url TEXT,
  touch_count INT DEFAULT 1,
  gclid TEXT,
  fbclid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_user ON analytics_page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON analytics_page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_utm ON analytics_page_views(utm_source, utm_medium, utm_campaign);
CREATE INDEX IF NOT EXISTS idx_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attributions_user ON user_attributions(user_id);

-- Functions
CREATE OR REPLACE FUNCTION track_page_view(
  p_user_id UUID,
  p_session_id TEXT,
  p_url TEXT,
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_term TEXT DEFAULT NULL,
  p_utm_content TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO analytics_page_views (
    user_id, session_id, url, utm_source, utm_medium,
    utm_campaign, utm_term, utm_content, referrer
  ) VALUES (
    p_user_id, p_session_id, p_url, p_utm_source, p_utm_medium,
    p_utm_campaign, p_utm_term, p_utm_content, p_referrer
  );
  
  -- Update attribution if user is logged in
  IF p_user_id IS NOT NULL THEN
    UPDATE user_attributions SET
      last_utm_source = COALESCE(p_utm_source, last_utm_source),
      last_utm_medium = COALESCE(p_utm_medium, last_utm_medium),
      last_utm_campaign = COALESCE(p_utm_campaign, last_utm_campaign),
      last_utm_term = COALESCE(p_utm_term, last_utm_term),
      last_utm_content = COALESCE(p_utm_content, last_utm_content),
      last_touch_at = NOW(),
      last_touch_url = p_url,
      touch_count = touch_count + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION track_event(
  p_user_id UUID,
  p_session_id TEXT,
  p_event_type TEXT,
  p_event_properties JSONB DEFAULT '{}',
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_term TEXT DEFAULT NULL,
  p_utm_content TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO analytics_events (
    user_id, session_id, event_type, event_properties,
    utm_source, utm_medium, utm_campaign, utm_term, utm_content
  ) VALUES (
    p_user_id, p_session_id, p_event_type, p_event_properties,
    p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_utm_content
  );
END;
$$;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_attributions_updated_at
  BEFORE UPDATE ON user_attributions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
