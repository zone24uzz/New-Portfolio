import { NextRequest, NextResponse } from "next/server"
import { heartbeat } from "@/lib/analytics/supabase"

export async function POST(req: NextRequest) {
  try {
    const { session_id, page_views } = await req.json()
    if (!session_id) return NextResponse.json({ ok: false }, { status: 400 })
    await heartbeat(session_id, page_views ?? 1)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[heartbeat route]", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
