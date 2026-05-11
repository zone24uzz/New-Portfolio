"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (v) =>
    `${prefix}${v.toFixed(decimals)}${suffix}`
  )

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return <motion.span className={className}>{display}</motion.span>
}

// Compact version for stat cards
export function StatNumber({
  value,
  label,
  glowColor = "rgba(139,92,246,0.6)",
  suffix = "",
}: {
  value: number
  label: string
  glowColor?: string
  suffix?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <AnimatedCounter
        value={value}
        suffix={suffix}
        className="text-3xl font-bold font-mono"
        // inline style applied via wrapper
      />
      <span className="text-xs font-mono uppercase tracking-widest opacity-50">{label}</span>
    </div>
  )
}
