import { NextRequest, NextResponse } from "next/server"
import { markSessionExit } from "@/lib/analytics/supabase"

export async function POST(req: NextRequest) {
  try {
    const { session_id, exit_time, duration_seconds } = await req.json()
    if (!session_id) return NextResponse.json({ ok: false }, { status: 400 })
    await markSessionExit(session_id, exit_time, duration_seconds ?? 0)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[exit route]", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
