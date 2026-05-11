import { NextRequest, NextResponse } from "next/server"
import { upsertSession } from "@/lib/analytics/supabase"
import { hashString } from "@/lib/analytics/fingerprint"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Get IP from headers (Vercel / Cloudflare / standard)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"

    const ipHash = await hashString(ip)

    // Geo from Vercel headers (available on Vercel deployments)
    const country = req.headers.get("x-vercel-ip-country") ?? "Unknown"
    const city = req.headers.get("x-vercel-ip-city") ?? "Unknown"

    await upsertSession({
      session_id: body.session_id,
      ip_hash: ipHash,
      enter_time: body.enter_time,
      exit_time: null,
      duration_seconds: null,
      is_active: true,
      browser: body.browser ?? "Unknown",
      browser_version: body.browser_version ?? "",
      os: body.os ?? "Unknown",
      device_type: body.device_type ?? "desktop",
      screen_resolution: body.screen_resolution ?? "unknown",
      country,
      city,
      referral_source: body.referral_source ?? "Direct",
      referral_url: body.referral_url ?? "",
      user_agent: body.user_agent ?? "",
      language: body.language ?? "",
      timezone: body.timezone ?? "",
      last_heartbeat: new Date().toISOString(),
      page_views: body.page_views ?? 1,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[session route]", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
