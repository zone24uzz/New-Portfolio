"use client"

import { motion } from "framer-motion"
import { CyberDonutChart, CyberBarChart } from "./cyber-chart"
import type { VisitorSession } from "@/lib/analytics/types"

function tally(sessions: VisitorSession[], key: keyof VisitorSession) {
  const map: Record<string, number> = {}
  sessions.forEach((s) => {
    const v = String(s[key] ?? "Unknown")
    map[v] = (map[v] ?? 0) + 1
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }))
}

function RankRow({ rank, name, count, total, color }: { rank: number; name: string; count: number; total: number; color: string }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-5 text-xs font-mono text-center" style={{ color: "rgba(100,100,140,0.5)" }}>{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono truncate" style={{ color: "rgba(200,200,230,0.85)" }}>{name}</span>
          <span className="text-xs font-mono ml-2 flex-shrink-0" style={{ color }}>{count}</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ background: color }}
          />
        </div>
      </div>
      <span className="w-8 text-xs font-mono text-right flex-shrink-0" style={{ color: "rgba(100,100,140,0.5)" }}>{pct}%</span>
    </div>
  )
}

export function AdminTraffic({ sessions }: { sessions: VisitorSession[] }) {
  const referrers = tally(sessions, "referral_source")
  const countries = tally(sessions, "country")
  const languages = tally(sessions, "language")
  const timezones = tally(sessions, "timezone")
  const total = sessions.length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Referral sources */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="p-5 rounded-2xl"
          style={{ background: "rgba(10,10,22,0.9)", border: "1px solid rgba(139,92,246,0.15)" }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(139,92,246,0.6)" }}>
            // traffic sources
          </p>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {referrers.map((r, i) => (
              <RankRow key={r.name} rank={i + 1} name={r.name} count={r.value} total={total} color="rgba(139,92,246,0.8)" />
            ))}
          </div>
        </motion.div>

        {/* Countries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="p-5 rounded-2xl"
          style={{ background: "rgba(10,10,22,0.9)", border: "1px solid rgba(34,211,238,0.15)" }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(34,211,238,0.6)" }}>
            // top countries
          </p>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {countries.map((c, i) => (
              <RankRow key={c.name} rank={i + 1} name={c.name} count={c.value} total={total} color="rgba(34,211,238,0.8)" />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          className="p-5 rounded-2xl"
          style={{ background: "rgba(10,10,22,0.9)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(59,130,246,0.6)" }}>
            // languages
          </p>
          <CyberBarChart data={languages} dataKey="value" xKey="name" color="#3b82f6" height={180} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
          className="p-5 rounded-2xl"
          style={{ background: "rgba(10,10,22,0.9)", border: "1px solid rgba(251,191,36,0.15)" }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(251,191,36,0.6)" }}>
            // timezones
          </p>
          <CyberDonutChart data={timezones.slice(0, 6)} height={180} />
        </motion.div>
      </div>
    </div>
  )
}
