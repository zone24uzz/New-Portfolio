"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Monitor, Smartphone, Tablet, Globe, Wifi } from "lucide-react"
import type { VisitorSession } from "@/lib/analytics/types"

const DEVICE_ICON = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
}

function LiveRow({ session, index }: { session: VisitorSession; index: number }) {
  const Icon = DEVICE_ICON[session.device_type] ?? Monitor
  const elapsed = formatDistanceToNow(new Date(session.enter_time), { addSuffix: false })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.97 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 220, damping: 24 }}
      className="relative flex items-center gap-4 px-4 py-3.5 rounded-xl"
      style={{
        background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(59,130,246,0.03))",
        border: "1px solid rgba(52,211,153,0.15)",
      }}
    >
      {/* Live pulse */}
      <div className="relative flex-shrink-0">
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-emerald-400"
          animate={{ boxShadow: ["0 0 4px rgba(52,211,153,0.6)", "0 0 12px rgba(52,211,153,0.9)", "0 0 4px rgba(52,211,153,0.6)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-400"
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Device icon */}
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
      >
        <Icon size={14} style={{ color: "rgba(59,130,246,0.8)" }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-0.5">
        <div>
          <p className="text-xs font-mono" style={{ color: "rgba(100,100,140,0.6)" }}>session</p>
          <p className="text-xs font-mono text-white truncate">{session.session_id.slice(0, 8)}…</p>
        </div>
        <div>
          <p className="text-xs font-mono" style={{ color: "rgba(100,100,140,0.6)" }}>browser</p>
          <p className="text-xs font-mono" style={{ color: "rgba(139,92,246,0.9)" }}>{session.browser}</p>
        </div>
        <div>
          <p className="text-xs font-mono" style={{ color: "rgba(100,100,140,0.6)" }}>country</p>
          <p className="text-xs font-mono flex items-center gap-1" style={{ color: "rgba(34,211,238,0.9)" }}>
            <Globe size={10} /> {session.country}
          </p>
        </div>
        <div>
          <p className="text-xs font-mono" style={{ color: "rgba(100,100,140,0.6)" }}>active for</p>
          <p className="text-xs font-mono" style={{ color: "rgba(251,191,36,0.9)" }}>{elapsed}</p>
        </div>
      </div>

      {/* Page views badge */}
      <div
        className="flex-shrink-0 px-2 py-0.5 rounded-md text-xs font-mono"
        style={{ background: "rgba(139,92,246,0.15)", color: "rgba(139,92,246,0.9)", border: "1px solid rgba(139,92,246,0.2)" }}
      >
        {session.page_views}pv
      </div>
    </motion.div>
  )
}

export function AdminLive({ activeSessions }: { activeSessions: VisitorSession[] }) {
  const [log, setLog] = useState<string[]>([])

  // Build activity log from sessions
  useEffect(() => {
    const entries = activeSessions.slice(0, 8).map(
      (s) => `[${new Date(s.enter_time).toLocaleTimeString()}] New consciousness connected · ${s.country} · ${s.browser}`
    )
    setLog(entries)
  }, [activeSessions])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.div
          className="w-3 h-3 rounded-full bg-emerald-400"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ boxShadow: "0 0 10px rgba(52,211,153,0.8)" }}
        />
        <span className="text-sm font-mono" style={{ color: "rgba(52,211,153,0.9)" }}>
          {activeSessions.length} consciousness{activeSessions.length !== 1 ? "es" : ""} connected
        </span>
      </div>

      {/* Live rows */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activeSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-12 font-mono text-sm"
              style={{ color: "rgba(100,100,140,0.5)" }}
            >
              // no active connections
            </motion.div>
          ) : (
            activeSessions.map((s, i) => <LiveRow key={s.session_id} session={s} index={i} />)
          )}
        </AnimatePresence>
      </div>

      {/* Activity log terminal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl p-4 font-mono text-xs space-y-1.5"
        style={{
          background: "rgba(4,4,12,0.95)",
          border: "1px solid rgba(34,211,238,0.15)",
          boxShadow: "inset 0 0 30px rgba(34,211,238,0.03)",
        }}
      >
        <p className="text-xs mb-3" style={{ color: "rgba(34,211,238,0.5)" }}>// activity log</p>
        {log.length === 0 ? (
          <p style={{ color: "rgba(100,100,140,0.4)" }}>awaiting connections…</p>
        ) : (
          log.map((entry, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ color: i === 0 ? "rgba(52,211,153,0.8)" : "rgba(100,100,140,0.5)" }}
            >
              {entry}
            </motion.p>
          ))
        )}
        {/* Blinking cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ color: "rgba(34,211,238,0.6)" }}
        >
          █
        </motion.span>
      </motion.div>
    </div>
  )
}
