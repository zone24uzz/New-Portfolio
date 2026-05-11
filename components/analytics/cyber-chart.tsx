"use client"

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

const NEON_COLORS = ["#8b5cf6", "#3b82f6", "#22d3ee", "#f472b6", "#fbbf24", "#34d399"]

// ─── Custom tooltip ────────────────────────────────────────────────────────────
function CyberTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs font-mono"
      style={{
        background: "rgba(8,8,20,0.95)",
        border: "1px solid rgba(139,92,246,0.4)",
        boxShadow: "0 0 20px rgba(139,92,246,0.2)",
      }}
    >
      <p className="text-violet-300 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? "#fff" }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Area chart ───────────────────────────────────────────────────────────────
export function CyberAreaChart({
  data,
  dataKey,
  xKey = "date",
  color = "#8b5cf6",
  height = 200,
}: {
  data: any[]
  dataKey: string
  xKey?: string
  color?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey={xKey} tick={{ fill: "rgba(180,180,220,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(180,180,220,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CyberTooltip />} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${dataKey})`}
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: "rgba(8,8,20,0.9)", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Bar chart ────────────────────────────────────────────────────────────────
export function CyberBarChart({
  data,
  dataKey,
  xKey = "name",
  color = "#3b82f6",
  height = 200,
}: {
  data: any[]
  dataKey: string
  xKey?: string
  color?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "rgba(180,180,220,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(180,180,220,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CyberTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[3, 3, 0, 0]} maxBarSize={40}>
          {data.map((_, i) => (
            <Cell key={i} fill={NEON_COLORS[i % NEON_COLORS.length]} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
export function CyberDonutChart({
  data,
  nameKey = "name",
  valueKey = "value",
  height = 200,
}: {
  data: any[]
  nameKey?: string
  valueKey?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="75%"
          dataKey={valueKey}
          nameKey={nameKey}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={NEON_COLORS[i % NEON_COLORS.length]} fillOpacity={0.85} />
          ))}
        </Pie>
        <Tooltip content={<CyberTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: "rgba(180,180,220,0.7)", fontSize: 11, fontFamily: "monospace" }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
