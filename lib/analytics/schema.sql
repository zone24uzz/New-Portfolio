-- ─── Supabase Schema ──────────────────────────────────────────────────────────
-- Run this in your Supabase SQL editor to set up the analytics tables.

-- Visitor sessions table
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id         TEXT UNIQUE NOT NULL,
  ip_hash            TEXT NOT NULL DEFAULT '',
  enter_time         TIMESTAMPTZ NOT NULL,
  exit_time          TIMESTAMPTZ,
  duration_seconds   INTEGER,
  is_active          BOOLEAN DEFAULT true,
  browser            TEXT DEFAULT 'Unknown',
  browser_version    TEXT DEFAULT '',
  os                 TEXT DEFAULT 'Unknown',
  device_type        TEXT DEFAULT 'desktop' CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  screen_resolution  TEXT DEFAULT 'unknown',
  country            TEXT DEFAULT 'Unknown',
  city               TEXT DEFAULT 'Unknown',
  referral_source    TEXT DEFAULT 'Direct',
  referral_url       TEXT DEFAULT '',
  user_agent         TEXT DEFAULT '',
  language           TEXT DEFAULT '',
  timezone           TEXT DEFAULT '',
  last_heartbeat     TIMESTAMPTZ DEFAULT NOW(),
  page_views         INTEGER DEFAULT 1,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Session events table (for future heatmap / replay)
CREATE TABLE IF NOT EXISTS session_events (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id   TEXT NOT NULL REFERENCES visitor_sessions(session_id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL,
  event_data   JSONB DEFAULT '{}',
  timestamp    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sessions_active       ON visitor_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_enter_time   ON visitor_sessions(enter_time DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_heartbeat    ON visitor_sessions(last_heartbeat DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_country      ON visitor_sessions(country);
CREATE INDEX IF NOT EXISTS idx_events_session_id     ON session_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp      ON session_events(timestamp DESC);

-- Auto-mark stale sessions as inactive (run as a cron or scheduled function)
-- UPDATE visitor_sessions
-- SET is_active = false
-- WHERE is_active = true
--   AND last_heartbeat < NOW() - INTERVAL '2 minutes';

-- Row Level Security — allow service role full access, deny anon
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events   ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically.
-- Deny all access to anon/authenticated roles (admin API uses service key):
CREATE POLICY "deny_all_visitor_sessions" ON visitor_sessions FOR ALL TO anon, authenticated USING (false);
CREATE POLICY "deny_all_session_events"   ON session_events   FOR ALL TO anon, authenticated USING (false);
