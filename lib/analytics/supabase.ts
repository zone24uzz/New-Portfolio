// ─── Supabase Client & DB Helpers ─────────────────────────────────────────────
// Uses env vars — set these in .env.local:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
//   SUPABASE_SERVICE_ROLE_KEY  (server-side only)

import { createClient } from "@supabase/supabase-js"
import type { VisitorSession, SessionEvent } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey

// Public client — used in browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client — used in API routes (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// ─── Session helpers ───────────────────────────────────────────────────────────

export async function upsertSession(session: Partial<VisitorSession>) {
  const { error } = await supabaseAdmin
    .from("visitor_sessions")
    .upsert(session, { onConflict: "session_id" })
  if (error) console.error("[analytics] upsert error:", error.message)
}

export async function markSessionExit(sessionId: string, exitTime: string, durationSeconds: number) {
  const { error } = await supabaseAdmin
    .from("visitor_sessions")
    .update({ exit_time: exitTime, duration_seconds: durationSeconds, is_active: false })
    .eq("session_id", sessionId)
  if (error) console.error("[analytics] exit error:", error.message)
}

export async function heartbeat(sessionId: string, pageViews: number) {
  const { error } = await supabaseAdmin
    .from("visitor_sessions")
    .update({ last_heartbeat: new Date().toISOString(), page_views: pageViews, is_active: true })
    .eq("session_id", sessionId)
  if (error) console.error("[analytics] heartbeat error:", error.message)
}

export async function logEvent(event: Omit<SessionEvent, "id" | "timestamp">) {
  const { error } = await supabaseAdmin
    .from("session_events")
    .insert({ ...event, timestamp: new Date().toISOString() })
  if (error) console.error("[analytics] event error:", error.message)
}

// ─── Admin queries ─────────────────────────────────────────────────────────────

export async function getActiveSessions() {
  const cutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 min timeout
  const { data, error } = await supabaseAdmin
    .from("visitor_sessions")
    .select("*")
    .eq("is_active", true)
    .gte("last_heartbeat", cutoff)
    .order("enter_time", { ascending: false })
  if (error) console.error("[analytics] active sessions error:", error.message)
  return data ?? []
}

export async function getAllSessions(limit = 100, offset = 0) {
  const { data, error } = await supabaseAdmin
    .from("visitor_sessions")
    .select("*")
    .order("enter_time", { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) console.error("[analytics] all sessions error:", error.message)
  return data ?? []
}

export async function getSessionStats() {
  const { data, error } = await supabaseAdmin
    .from("visitor_sessions")
    .select("is_active, duration_seconds, country, browser, device_type, referral_source, enter_time")
  if (error) console.error("[analytics] stats error:", error.message)
  return data ?? []
}
