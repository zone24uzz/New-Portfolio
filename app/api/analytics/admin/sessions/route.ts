import { NextRequest, NextResponse } from "next/server"
import { getAllSessions, getActiveSessions, getSessionStats } from "@/lib/analytics/supabase"

// Simple token auth — set ANALYTICS_ADMIN_TOKEN in env
function isAuthorized(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token")
  return token === process.env.ANALYTICS_ADMIN_TOKEN
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type") ?? "all"
  const limit = parseInt(searchParams.get("limit") ?? "100")
  const offset = parseInt(searchParams.get("offset") ?? "0")

  try {
    if (type === "active") {
      const data = await getActiveSessions()
      return NextResponse.json({ data })
    }
    if (type === "stats") {
      const data = await getSessionStats()
      return NextResponse.json({ data })
    }
    const data = await getAllSessions(limit, offset)
    return NextResponse.json({ data })
  } catch (err) {
    console.error("[admin sessions]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
