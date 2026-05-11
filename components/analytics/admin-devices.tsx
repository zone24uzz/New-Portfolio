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
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))
}

function ChartCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 22 }}
      className="p-5 rounded-2xl"
      style={{ background: "rgba(10,10,22,0.9)", border: "1px solid rgba(139,92,246,0.15)" }}
    >
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(139,92,246,0.6)" }}>
        // {title}
      </p>
      {children}
    </motion.div>
  )
}

export function AdminDevices({ sessions }: { sessions: VisitorSession[] }) {
  const devices = tally(sessions, "device_type")
  const browsers = tally(sessions, "browser")
  const os = tally(sessions, "os")
  const resolutions = tally(sessions, "screen_resolution")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="device types" delay={0}>
        <CyberDonutChart data={devices} height={220} />
      </ChartCard>
      <ChartCard title="browsers" delay={0.08}>
        <CyberBarChart data={browsers} dataKey="value" xKey="name" color="#3b82f6" height={220} />
      </ChartCard>
      <ChartCard title="operating systems" delay={0.16}>
        <CyberBarChart data={os} dataKey="value" xKey="name" color="#22d3ee" height={220} />
      </ChartCard>
      <ChartCard title="screen resolutions" delay={0.24}>
        <CyberBarChart data={resolutions} dataKey="value" xKey="name" color="#f472b6" height={220} />
      </ChartCard>
    </div>
  )
}
