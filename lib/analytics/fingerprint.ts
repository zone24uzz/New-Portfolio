// ─── Anonymous Visitor Fingerprinting ─────────────────────────────────────────
// Generates a stable, privacy-safe session ID without storing PII.
// Uses browser characteristics + a random salt stored in sessionStorage.

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr"

  // Per-tab session ID — regenerates on new tab/window
  const key = "__fmp_sid"
  let sid = sessionStorage.getItem(key)
  if (!sid) {
    sid = generateId()
    sessionStorage.setItem(key, sid)
  }
  return sid
}

function generateId(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function hashString(str: string): Promise<string> {
  if (typeof window === "undefined") return "server"
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16)
}

export function detectBrowser(): { browser: string; version: string } {
  if (typeof window === "undefined") return { browser: "Unknown", version: "" }
  const ua = navigator.userAgent

  if (ua.includes("Edg/")) {
    const v = ua.match(/Edg\/([\d.]+)/)?.[1] ?? ""
    return { browser: "Edge", version: v }
  }
  if (ua.includes("OPR/") || ua.includes("Opera")) {
    const v = ua.match(/OPR\/([\d.]+)/)?.[1] ?? ""
    return { browser: "Opera", version: v }
  }
  if (ua.includes("Chrome/") && !ua.includes("Chromium")) {
    const v = ua.match(/Chrome\/([\d.]+)/)?.[1] ?? ""
    return { browser: "Chrome", version: v }
  }
  if (ua.includes("Firefox/")) {
    const v = ua.match(/Firefox\/([\d.]+)/)?.[1] ?? ""
    return { browser: "Firefox", version: v }
  }
  if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    const v = ua.match(/Version\/([\d.]+)/)?.[1] ?? ""
    return { browser: "Safari", version: v }
  }
  return { browser: "Other", version: "" }
}

export function detectOS(): string {
  if (typeof window === "undefined") return "Unknown"
  const ua = navigator.userAgent
  if (ua.includes("Windows NT 10")) return "Windows 10/11"
  if (ua.includes("Windows NT 6.3")) return "Windows 8.1"
  if (ua.includes("Windows")) return "Windows"
  if (ua.includes("Mac OS X")) return "macOS"
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS"
  if (ua.includes("Android")) return "Android"
  if (ua.includes("Linux")) return "Linux"
  return "Other"
}

export function detectDevice(): "desktop" | "mobile" | "tablet" {
  if (typeof window === "undefined") return "desktop"
  const ua = navigator.userAgent
  if (/iPad|tablet|Tablet/i.test(ua)) return "tablet"
  if (/iPhone|Android.*Mobile|Mobile/i.test(ua)) return "mobile"
  return "desktop"
}

export function getScreenResolution(): string {
  if (typeof window === "undefined") return "unknown"
  return `${window.screen.width}x${window.screen.height}`
}

export function getReferralSource(): { source: string; url: string } {
  if (typeof window === "undefined") return { source: "Direct", url: "" }
  const ref = document.referrer
  if (!ref) return { source: "Direct", url: "" }

  try {
    const url = new URL(ref)
    const host = url.hostname.replace("www.", "")
    if (host.includes("google")) return { source: "Google", url: ref }
    if (host.includes("bing")) return { source: "Bing", url: ref }
    if (host.includes("twitter") || host.includes("t.co")) return { source: "Twitter/X", url: ref }
    if (host.includes("linkedin")) return { source: "LinkedIn", url: ref }
    if (host.includes("github")) return { source: "GitHub", url: ref }
    if (host.includes("facebook")) return { source: "Facebook", url: ref }
    if (host.includes("instagram")) return { source: "Instagram", url: ref }
    if (host.includes("telegram")) return { source: "Telegram", url: ref }
    return { source: host, url: ref }
  } catch {
    return { source: "Unknown", url: ref }
  }
}
