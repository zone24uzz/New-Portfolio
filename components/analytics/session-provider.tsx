"use client"

import { useEffect, useRef } from "react"
import { initSession, trackPageView } from "@/lib/analytics/session"

/**
 * Drop this anywhere in the component tree (ideally in layout or page root).
 * It auto-initializes the session tracker once on mount.
 * Completely silent — no UI, no blocking.
 */
export function SessionProvider({ children }: { children?: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Defer slightly so it never blocks first paint
    const timer = setTimeout(() => {
      initSession().catch(() => {})
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return <>{children}</>
}

/**
 * Call this on route changes to increment page view count.
 */
export function usePageView() {
  useEffect(() => {
    trackPageView()
  }, [])
}
