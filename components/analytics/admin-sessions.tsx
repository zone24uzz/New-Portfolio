"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Monitor, Smartphone, Tablet, ChevronUp, ChevronDown } from "lucide-react"
import type { VisitorSession } from "@/lib/analytics/types"

type SortKey = "enter_time" | "duration_seconds" | "country" | "browser"

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—"
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

const DEVICE_ICON = { desktop: Monitor, mobile: Smartphone, tablet: Tablet }

export function AdminSessions({ sessions }: { sessions: VisitorSession[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("enter_time")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 15

  const sorted = [...sessions].sort((a, b) => {
    const av = a[sortKey] ?? ""
    const bv = b[sortKey] ?? ""
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir === "asc" ? cmp : -cmp
  })

  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
    setPage(0)
  }
  const setDir = setSortDir

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null

  const colStyle = "text-xs font-mono uppercase tracking-widest cursor-pointer select-none flex items-center gap-1 whitespace-nowrap"
  const headerColor = "rgba(100,100,150,0.6)"

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(139,92,246,0.15)" }}>
        <table className="w-full text-xs font-mono">
          <thead>
            <tr style={{ background: "rgba(10,10,22,0.95)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}>
              {[
                { key: "enter_time" as SortKey, label: "Enter" },
                { key: null, label: "Exit" },
                { key: "duration_seconds" as SortKey, label: "Duration" },
                { key: null, label: "Status" },
                { key: null, label: "Device" },
                { key: "browser" as SortKey, label: "Browser" },
                { key: "country" as SortKey, label: "Country" },
                { key: null, label: "IP Hash" },
              ].map(({ key, label }) => (
                <th
                  key={label}
                  className="px-4 py-3 text-left"
                  onClick={() => key && toggleSort(key)}
                >
                  <span className={colStyle} style={{ color: headerColor }}>
                    {label} {key && <SortIcon k={key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((s, i) => {
              const Icon = DEVICE_ICON[s.device_type] ?? Monitor
              return (
                <motion.tr
                  key={s.session_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b transition-colors"
                  style={{
                    borderColor: "rgba(255,255,255,0.04)",
                    background: i % 2 === 0 ? "rgba(10,10,22,0.6)" : "rgba(8,8,18,0.6)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,92,246,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "rgba(10,10,22,0.6)" : "rgba(8,8,18,0.6)")}
                >
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(180,180,220,0.8)" }}>
                    {format(new Date(s.enter_time), "MMM d, HH:mm:ss")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(140,140,180,0.6)" }}>
                    {s.exit_time ? format(new Date(s.exit_time), "HH:mm:ss") : "—"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "rgba(251,191,36,0.8)" }}>
                    {formatDuration(s.duration_seconds)}
                  </td>
                  <td className="px-4 py-3">
                    {s.is_active ? (
                      <span className="flex items-center gap-1.5">
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span style={{ color: "rgba(52,211,153,0.8)" }}>online</span>
                      </span>
                    ) : (
                      <span style={{ color: "rgba(100,100,140,0.5)" }}>offline</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Icon size={13} style={{ color: "rgba(59,130,246,0.7)" }} />
                  </td>
                  <td className="px-4 py-3" style={{ color: "rgba(139,92,246,0.8)" }}>{s.browser}</td>
                  <td className="px-4 py-3" style={{ color: "rgba(34,211,238,0.8)" }}>{s.country}</td>
                  <td className="px-4 py-3" style={{ color: "rgba(100,100,140,0.5)" }}>
                    {s.ip_hash?.slice(0, 12)}…
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono" style={{ color: "rgba(100,100,140,0.5)" }}>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-7 h-7 rounded-lg text-xs font-mono transition-all"
                style={{
                  background: page === i ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.08)",
                  border: `1px solid ${page === i ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.15)"}`,
                  color: page === i ? "#fff" : "rgba(139,92,246,0.6)",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
