"use client"

import { motion } from "framer-motion"
import { Users, Activity, Clock, TrendingUp, Globe, Zap } from "lucide-react"
import { AnimatedCounter } from "./animated-counter"
import { CyberAreaChart, CyberBarChart } from "./cyber-chart"
import type { VisitorSession } from "@/lib/analytics/types"

interface Props {
  sessions: VisitorSession[]
  activeSessions: VisitorSession[]
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  glowColor,
  delay = 0,
}: {
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
  glowColor: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 22 }}
      className="relative p-5 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(15,15,30,0.9), rgba(10,10,22,0.9))",
        border: `1px solid ${glowColor.replace("0.6", "0.2")}`,
        boxShadow: `0 0 30px ${glowColor.replace("0.6", "0.08")}`,
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor.replace("0.6", "0.12")} 0%, transparent 70%)`, transform: "translate(30%, -30%)" }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(140,140,180,0.6)" }}>
            {label}
          </p>
          <AnimatedCounter
            value={value}
            suffix={suffix}
            className="text-3xl font-bold font-mono"
          />
        </div>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${glowColor.replace("0.6", "0.2")}, ${glowColor.replace("0.6", "0.05")})`,
            border: `1px solid ${glowColor.replace("0.6", "0.3")}`,
            boxShadow: `0 0 12px ${glowColor.replace("0.6", "0.3")}`,
          }}
        >
          <Icon size={18} style={{ color: glowColor.replace("0.6", "0.9") }} />
        </div>
      </div>
    </motion.div>
  )
}

export function AdminOverview({ sessions, activeSessions }: Props) {
  const totalSessions = sessions.length
  const activeNow = activeSessions.length
  const avgDuration = sessions.length
    ? Math.round(sessions.filter((s) => s.duration_seconds).reduce((a, s) => a + (s.duration_seconds ?? 0), 0) / sessions.filter((s) => s.duration_seconds).length || 0)
    : 0
  const bounceCount = sessions.filter((s) => (s.duration_seconds ?? 0) < 30).length
  const bounceRate = totalSessions ? Math.round((bounceCount / totalSessions) * 100) : 0

  // Sessions by day (last 14 days)
  const dayMap: Record<string, number> = {}
  const now = Date.now()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 86400000)
    dayMap[d.toLocaleDateString("en", { month: "short", day: "numeric" })] = 0
  }
  sessions.forEach((s) => {
    const d = new Date(s.enter_time)
    const key = d.toLocaleDateString("en", { month: "short", day: "numeric" })
    if (key in dayMap) dayMap[key]++
  })
  const dailyData = Object.entries(dayMap).map(([date, count]) => ({ date, count }))

  // Sessions by hour
  const hourMap: Record<number, number> = {}
  for (let h = 0; h < 24; h++) hourMap[h] = 0
  sessions.forEach((s) => { hourMap[new Date(s.enter_time).getHours()]++ })
  const hourlyData = Object.entries(hourMap).map(([hour, count]) => ({ hour: `${hour}h`, count }))

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users}      label="Total Sessions"  value={totalSessions}  glowColor="rgba(139,92,246,0.6)"  delay={0}    />
        <StatCard icon={Activity}   label="Active Now"      value={activeNow}      glowColor="rgba(52,211,153,0.6)"  delay={0.05} />
        <StatCard icon={Clock}      label="Avg Duration"    value={avgDuration}    suffix="s" glowColor="rgba(59,130,246,0.6)"  delay={0.1}  />
        <StatCard icon={TrendingUp} label="Bounce Rate"     value={bounceRate}     suffix="%" glowColor="rgba(251,191,36,0.6)"  delay={0.15} />
        <StatCard icon={Globe}      label="Countries"       value={new Set(sessions.map((s) => s.country)).size} glowColor="rgba(34,211,238,0.6)" delay={0.2} />
        <StatCard icon={Zap}        label="Page Views"      value={sessions.reduce((a, s) => a + (s.page_views ?? 0), 0)} glowColor="rgba(244,114,182,0.6)" delay={0.25} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl"
          style={{ background: "rgba(10,10,22,0.9)", border: "1px solid rgba(139,92,246,0.15)" }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(139,92,246,0.7)" }}>
            // sessions · last 14 days
          </p>
          <CyberAreaChart data={dailyData} dataKey="count" xKey="date" color="#8b5cf6" height={180} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="p-5 rounded-2xl"
          style={{ background: "rgba(10,10,22,0.9)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(59,130,246,0.7)" }}>
            // traffic · by hour
          </p>
          <CyberBarChart data={hourlyData} dataKey="count" xKey="hour" color="#3b82f6" height={180} />
        </motion.div>
      </div>
    </div>
  )
}
