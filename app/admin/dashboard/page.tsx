"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Radio, Table2, Monitor, TrendingUp,
  RefreshCw, LogOut, Wifi, WifiOff, Zap,
} from "lucide-react"
import { AdminOverview } from "@/components/analytics/admin-overview"
import { AdminLive } from "@/components/analytics/admin-live"
import { AdminSessions } from "@/components/analytics/admin-sessions"
import { AdminDevices } from "@/components/analytics/admin-devices"
import { AdminTraffic } from "@/components/analytics/admin-traffic"
import type { VisitorSession, DashboardTab } from "@/lib/analytics/types"

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN ?? ""
const REFRESH_INTERVAL = 30_000

const TABS: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",  icon: LayoutDashboard },
  { id: "live",      label: "Live",      icon: Radio           },
  { id: "sessions",  label: "Sessions",  icon: Table2          },
  { id: "devices",   label: "Devices",   icon: Monitor         },
  { id: "traffic",   label: "Traffic",   icon: TrendingUp      },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<DashboardTab>("overview")
  const [sessions, setSessions] = useState<VisitorSession[]>([])
  const [activeSessions, setActiveSessions] = useState<VisitorSession[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [online, setOnline] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auth guard
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("__fmp_admin")) {
      router.replace("/admin")
    }
  }, [router])

  const fetchData = useCallback(async () => {
    try {
      const headers = { "x-admin-token": ADMIN_TOKEN }
      const [allRes, activeRes] = await Promise.all([
        fetch("/api/analytics/admin/sessions?type=all&limit=500", { headers }),
        fetch("/api/analytics/admin/sessions?type=active", { headers }),
      ])

      if (!allRes.ok || !activeRes.ok) throw new Error("fetch failed")

      const [allData, activeData] = await Promise.all([allRes.json(), activeRes.json()])
      setSessions(allData.data ?? [])
      setActiveSessions(activeData.data ?? [])
      setLastUpdated(new Date())
      setOnline(true)
    } catch {
      setOnline(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    timerRef.current = setInterval(fetchData, REFRESH_INTERVAL)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [fetchData])

  const handleLogout = () => {
    sessionStorage.removeItem("__fmp_admin")
    router.push("/admin")
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #04040e 0%, #060614 50%, #04080e 100%)" }}
    >
      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scan line */}
      <motion.div
        className="fixed left-0 right-0 h-px pointer-events-none z-50"
        style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.25), rgba(139,92,246,0.4), rgba(34,211,238,0.25), transparent)" }}
        animate={{ top: ["-1%", "101%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
      />

      {/* ── Header ── */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{
          background: "rgba(4,4,14,0.9)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.15))",
              border: "1px solid rgba(139,92,246,0.35)",
              boxShadow: "0 0 20px rgba(139,92,246,0.2)",
            }}
            animate={{ boxShadow: ["0 0 15px rgba(139,92,246,0.2)", "0 0 30px rgba(139,92,246,0.35)", "0 0 15px rgba(139,92,246,0.2)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap size={16} style={{ color: "rgba(139,92,246,0.9)" }} />
          </motion.div>
          <div>
            <h1
              className="text-sm font-bold tracking-wider"
              style={{
                background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MEMORY PALACE
            </h1>
            <p className="text-xs font-mono" style={{ color: "rgba(100,100,140,0.5)" }}>analytics · v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-1.5">
            {online ? (
              <><motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <Wifi size={13} style={{ color: "rgba(52,211,153,0.7)" }} /></>
            ) : (
              <><div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <WifiOff size={13} style={{ color: "rgba(239,68,68,0.7)" }} /></>
            )}
            {lastUpdated && (
              <span className="text-xs font-mono hidden sm:block" style={{ color: "rgba(100,100,140,0.5)" }}>
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* Refresh */}
          <motion.button
            onClick={fetchData}
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92, rotate: 180 }}
          >
            <RefreshCw size={13} style={{ color: "rgba(139,92,246,0.7)" }} />
          </motion.button>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.7)" }}
            whileHover={{ scale: 1.04, background: "rgba(239,68,68,0.15)" }}
            whileTap={{ scale: 0.96 }}
          >
            <LogOut size={12} /> Exit
          </motion.button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* ── Sidebar tabs (desktop) ── */}
        <aside
          className="hidden md:flex flex-col w-52 flex-shrink-0 py-4 px-3 gap-1"
          style={{ borderRight: "1px solid rgba(139,92,246,0.1)", background: "rgba(4,4,14,0.6)" }}
        >
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <motion.button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: active ? "rgba(139,92,246,0.15)" : "transparent",
                  border: `1px solid ${active ? "rgba(139,92,246,0.3)" : "transparent"}`,
                }}
              >
                {active && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                    style={{ background: "linear-gradient(to bottom, rgba(139,92,246,0.9), rgba(59,130,246,0.5))" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={15} style={{ color: active ? "rgba(139,92,246,0.9)" : "rgba(100,100,140,0.5)" }} />
                <span
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{ color: active ? "rgba(200,200,230,0.9)" : "rgba(100,100,140,0.5)" }}
                >
                  {t.label}
                </span>
                {t.id === "live" && activeSessions.length > 0 && (
                  <span
                    className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded-md"
                    style={{ background: "rgba(52,211,153,0.15)", color: "rgba(52,211,153,0.8)", border: "1px solid rgba(52,211,153,0.2)" }}
                  >
                    {activeSessions.length}
                  </span>
                )}
              </motion.button>
            )
          })}
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.3) transparent" }}>
          {/* Mobile tab bar */}
          <div className="flex md:hidden gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0 text-xs font-mono uppercase tracking-wider"
                  style={{
                    background: active ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.06)",
                    border: `1px solid ${active ? "rgba(139,92,246,0.4)" : "rgba(139,92,246,0.12)"}`,
                    color: active ? "#fff" : "rgba(100,100,140,0.6)",
                  }}
                >
                  <Icon size={12} />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-t-transparent"
                style={{ borderColor: "rgba(139,92,246,0.4)", borderTopColor: "rgba(139,92,246,0.9)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-xs font-mono" style={{ color: "rgba(139,92,246,0.5)" }}>
                // loading consciousness data…
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {tab === "overview"  && <AdminOverview sessions={sessions} activeSessions={activeSessions} />}
                {tab === "live"      && <AdminLive activeSessions={activeSessions} />}
                {tab === "sessions"  && <AdminSessions sessions={sessions} />}
                {tab === "devices"   && <AdminDevices sessions={sessions} />}
                {tab === "traffic"   && <AdminTraffic sessions={sessions} />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}
