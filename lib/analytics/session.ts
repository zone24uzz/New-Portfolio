// ─── Client-Side Session Tracker ──────────────────────────────────────────────
// Lightweight, async, non-blocking. Runs entirely in the browser.
// Uses beforeunload + visibilitychange + heartbeat for reliable exit detection.

import {
  getSessionId,
  detectBrowser,
  detectOS,
  detectDevice,
  getScreenResolution,
  getReferralSource,
} from "./fingerprint"

const HEARTBEAT_INTERVAL = 30_000  // 30 seconds
const INACTIVITY_TIMEOUT = 30 * 60_000  // 30 minutes

interface TrackerState {
  sessionId: string
  enterTime: number
  pageViews: number
  heartbeatTimer: ReturnType<typeof setInterval> | null
  inactivityTimer: ReturnType<typeof setTimeout> | null
  initialized: boolean
}

const state: TrackerState = {
  sessionId: "",
  enterTime: 0,
  pageViews: 0,
  heartbeatTimer: null,
  inactivityTimer: null,
  initialized: false,
}

// ─── Public API ────────────────────────────────────────────────────────────────

export async function initSession(): Promise<void> {
  if (state.initialized || typeof window === "undefined") return
  state.initialized = true
  state.sessionId = getSessionId()
  state.enterTime = Date.now()
  state.pageViews = 1

  const { browser, version } = detectBrowser()
  const { source, url } = getReferralSource()

  // Fire-and-forget — non-blocking
  fetch("/api/analytics/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: state.sessionId,
      enter_time: new Date(state.enterTime).toISOString(),
      browser,
      browser_version: version,
      os: detectOS(),
      device_type: detectDevice(),
      screen_resolution: getScreenResolution(),
      referral_source: source,
      referral_url: url,
      user_agent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      is_active: true,
      page_views: 1,
    }),
    keepalive: true,
  }).catch(() => {}) // silent fail — never block the user

  startHeartbeat()
  attachExitListeners()
  attachActivityListeners()
}

export function trackPageView(): void {
  if (!state.initialized) return
  state.pageViews++
}

// ─── Heartbeat ─────────────────────────────────────────────────────────────────

function startHeartbeat(): void {
  state.heartbeatTimer = setInterval(() => {
    fetch("/api/analytics/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: state.sessionId, page_views: state.pageViews }),
      keepalive: true,
    }).catch(() => {})
  }, HEARTBEAT_INTERVAL)
}

function stopHeartbeat(): void {
  if (state.heartbeatTimer) {
    clearInterval(state.heartbeatTimer)
    state.heartbeatTimer = null
  }
}

// ─── Exit recording ────────────────────────────────────────────────────────────

function recordExit(): void {
  if (!state.initialized || !state.sessionId) return
  const exitTime = new Date().toISOString()
  const duration = Math.round((Date.now() - state.enterTime) / 1000)

  // Use sendBeacon for reliability on page close
  const payload = JSON.stringify({
    session_id: state.sessionId,
    exit_time: exitTime,
    duration_seconds: duration,
  })

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/exit", new Blob([payload], { type: "application/json" }))
  } else {
    fetch("/api/analytics/exit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }

  stopHeartbeat()
}

// ─── Event listeners ───────────────────────────────────────────────────────────

function attachExitListeners(): void {
  // Page close / refresh
  window.addEventListener("beforeunload", recordExit, { passive: true })

  // Tab switch / minimize
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      recordExit()
    } else if (document.visibilityState === "visible") {
      // Session recovery — re-init if returning after long absence
      const elapsed = Date.now() - state.enterTime
      if (elapsed > INACTIVITY_TIMEOUT) {
        state.initialized = false
        initSession()
      }
    }
  })
}

function attachActivityListeners(): void {
  const resetInactivity = () => {
    if (state.inactivityTimer) clearTimeout(state.inactivityTimer)
    state.inactivityTimer = setTimeout(() => {
      recordExit()
    }, INACTIVITY_TIMEOUT)
  }

  resetInactivity()
  ;["mousemove", "keydown", "scroll", "click", "touchstart"].forEach((evt) => {
    window.addEventListener(evt, resetInactivity, { passive: true })
  })
}
