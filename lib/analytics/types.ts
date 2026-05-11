// ─── Analytics Type Definitions ───────────────────────────────────────────────

export interface VisitorSession {
  id: string                    // UUID
  session_id: string            // anonymous fingerprint-based ID
  ip_hash: string               // SHA-256 hash of IP (never raw IP)
  enter_time: string            // ISO timestamp
  exit_time: string | null      // ISO timestamp or null if still active
  duration_seconds: number | null
  is_active: boolean
  browser: string
  browser_version: string
  os: string
  device_type: "desktop" | "mobile" | "tablet"
  screen_resolution: string
  country: string
  city: string
  referral_source: string
  referral_url: string
  user_agent: string
  language: string
  timezone: string
  last_heartbeat: string        // ISO timestamp — updated every 30s
  page_views: number
  created_at: string
}

export interface SessionEvent {
  id: string
  session_id: string
  event_type: "enter" | "exit" | "page_view" | "click" | "scroll" | "idle" | "active"
  event_data: Record<string, unknown>
  timestamp: string
}

export interface AnalyticsSummary {
  total_sessions: number
  active_now: number
  avg_duration_seconds: number
  bounce_rate: number
  top_countries: { country: string; count: number }[]
  top_browsers: { browser: string; count: number }[]
  top_devices: { device_type: string; count: number }[]
  top_referrers: { referral_source: string; count: number }[]
  sessions_by_hour: { hour: number; count: number }[]
  sessions_by_day: { date: string; count: number }[]
}

export interface LiveVisitor {
  session_id: string
  enter_time: string
  country: string
  device_type: string
  browser: string
  page_views: number
  last_heartbeat: string
}

export type DashboardTab = "overview" | "live" | "sessions" | "devices" | "traffic"
