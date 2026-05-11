"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import {
  Home,
  FolderOpen,
  Cpu,
  User,
  Mail,
  X,
  Menu,
  Zap,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  color: string
  glowColor: string
  description: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "#home",
    icon: Home,
    color: "from-blue-400 to-cyan-400",
    glowColor: "rgba(59,130,246,0.6)",
    description: "Return to base",
  },
  {
    id: "projects",
    label: "Projects",
    href: "#projects",
    icon: FolderOpen,
    color: "from-violet-400 to-purple-400",
    glowColor: "rgba(139,92,246,0.6)",
    description: "Digital creations",
  },
  {
    id: "skills",
    label: "Skills",
    href: "#skills",
    icon: Cpu,
    color: "from-cyan-400 to-teal-400",
    glowColor: "rgba(34,211,238,0.6)",
    description: "Tech arsenal",
  },
  {
    id: "about",
    label: "About",
    href: "#about",
    icon: User,
    color: "from-pink-400 to-rose-400",
    glowColor: "rgba(244,114,182,0.6)",
    description: "The human behind",
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    icon: Mail,
    color: "from-amber-400 to-orange-400",
    glowColor: "rgba(251,191,36,0.6)",
    description: "Open a channel",
  },
]

// ─── Sound helpers (Web Audio API) ────────────────────────────────────────────
function createAudioCtx() {
  if (typeof window === "undefined") return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

function playTone(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType = "sine",
  duration = 0.08,
  gain = 0.06
) {
  const osc = ctx.createOscillator()
  const gainNode = ctx.createGain()
  osc.connect(gainNode)
  gainNode.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration)
  gainNode.gain.setValueAtTime(gain, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playOpenSound(ctx: AudioContext) {
  playTone(ctx, 440, "sine", 0.12, 0.05)
  setTimeout(() => playTone(ctx, 660, "sine", 0.1, 0.04), 60)
  setTimeout(() => playTone(ctx, 880, "sine", 0.08, 0.03), 120)
}

function playCloseSound(ctx: AudioContext) {
  playTone(ctx, 880, "sine", 0.08, 0.04)
  setTimeout(() => playTone(ctx, 440, "sine", 0.12, 0.03), 60)
}

function playHoverSound(ctx: AudioContext) {
  playTone(ctx, 600, "triangle", 0.05, 0.03)
}

function playClickSound(ctx: AudioContext) {
  playTone(ctx, 1200, "square", 0.06, 0.04)
  setTimeout(() => playTone(ctx, 800, "sine", 0.08, 0.03), 40)
}

// ─── Floating Particle ────────────────────────────────────────────────────────
function Particle({ index }: { index: number }) {
  const size = Math.random() * 3 + 1
  const x = Math.random() * 100
  const duration = Math.random() * 8 + 6
  const delay = Math.random() * 4
  const colors = ["#3b82f6", "#8b5cf6", "#22d3ee", "#f472b6", "#fbbf24"]
  const color = colors[index % colors.length]

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "-10px",
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
      }}
      animate={{
        y: [0, -400],
        opacity: [0, 0.8, 0],
        x: [0, (Math.random() - 0.5) * 60],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  )
}

// ─── Holographic scan line ─────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-10"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), rgba(139,92,246,0.6), rgba(34,211,238,0.4), transparent)",
      }}
      animate={{ top: ["-2%", "102%"] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
    />
  )
}

// ─── Nav Link Item ─────────────────────────────────────────────────────────────
function NavLink({
  item,
  index,
  isActive,
  onHover,
  onClick,
}: {
  item: NavItem
  index: number
  isActive: boolean
  onHover: () => void
  onClick: () => void
}) {
  const Icon = item.icon
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); onHover() }}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07, type: "spring", stiffness: 200, damping: 20 }}
      className="relative group flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      style={{ textDecoration: "none" }}
      role="menuitem"
      tabIndex={0}
    >
      {/* Active / hover background */}
      <AnimatePresence>
        {(hovered || isActive) && (
          <motion.div
            key="bg"
            className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: `linear-gradient(135deg, ${item.glowColor}18, ${item.glowColor}08)`,
              border: `1px solid ${item.glowColor}40`,
              boxShadow: `0 0 20px ${item.glowColor}20, inset 0 0 20px ${item.glowColor}05`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="activeBar"
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${item.glowColor}, transparent)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Icon container */}
      <motion.div
        className={`relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} bg-opacity-10 flex-shrink-0`}
        animate={hovered ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${item.glowColor}20, ${item.glowColor}08)`,
          border: `1px solid ${item.glowColor}30`,
          boxShadow: hovered ? `0 0 15px ${item.glowColor}50` : "none",
        }}
      >
        <Icon
          size={18}
          className={`bg-gradient-to-br ${item.color} bg-clip-text`}
          style={{ color: hovered || isActive ? item.glowColor : "rgba(200,200,220,0.7)" }}
        />
        {/* Icon glow pulse */}
        {(hovered || isActive) && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ background: `radial-gradient(circle, ${item.glowColor}30, transparent)` }}
          />
        )}
      </motion.div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        <motion.span
          className="text-sm font-semibold tracking-wider uppercase"
          animate={{ color: hovered || isActive ? "#fff" : "rgba(180,180,200,0.8)" }}
          style={
            isActive
              ? { textShadow: `0 0 12px ${item.glowColor}` }
              : {}
          }
        >
          {item.label}
        </motion.span>
        <motion.span
          className="text-xs font-mono"
          animate={{ opacity: hovered ? 1 : 0.4, color: item.glowColor }}
        >
          {item.description}
        </motion.span>
      </div>

      {/* Right arrow indicator */}
      <motion.div
        className="ml-auto"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.2 }}
      >
        <Zap size={14} style={{ color: item.glowColor }} />
      </motion.div>

      {/* Corner accent */}
      <motion.div
        className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full"
        animate={{ opacity: isActive ? [0.5, 1, 0.5] : 0, scale: isActive ? [1, 1.5, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ background: item.glowColor }}
      />
    </motion.a>
  )
}

// ─── Main Drawer ───────────────────────────────────────────────────────────────
export function CyberDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState("home")
  const audioCtxRef = useRef<AudioContext | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Lazy-init audio context on first interaction
  const getAudio = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx()
    return audioCtxRef.current
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
    const ctx = getAudio()
    if (ctx) playOpenSound(ctx)
  }, [getAudio])

  const close = useCallback(() => {
    setIsOpen(false)
    const ctx = getAudio()
    if (ctx) playCloseSound(ctx)
  }, [getAudio])

  const handleNavClick = useCallback(
    (id: string) => {
      setActiveId(id)
      const ctx = getAudio()
      if (ctx) playClickSound(ctx)
      setTimeout(close, 300)
    },
    [close, getAudio]
  )

  const handleHover = useCallback(() => {
    const ctx = getAudio()
    if (ctx) playHoverSound(ctx)
  }, [getAudio])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen, close])

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, close])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {/* ── Trigger Button ── */}
      <motion.button
        onClick={open}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="fixed top-5 left-5 z-50 flex items-center justify-center w-12 h-12 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        style={{
          background: "rgba(10,10,20,0.8)",
          border: "1px solid rgba(139,92,246,0.4)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 20px rgba(139,92,246,0.2), 0 0 40px rgba(59,130,246,0.1)",
        }}
        whileHover={{
          scale: 1.08,
          boxShadow: "0 0 30px rgba(139,92,246,0.5), 0 0 60px rgba(59,130,246,0.2)",
          borderColor: "rgba(139,92,246,0.8)",
        }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={20} className="text-violet-300" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Menu size={20} className="text-violet-300" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          style={{ border: "1px solid rgba(139,92,246,0.5)" }}
        />
      </motion.button>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: "rgba(2,2,10,0.7)", backdropFilter: "blur(8px)" }}
          />
        )}
      </AnimatePresence>

      {/* ── Drawer Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed top-0 left-0 bottom-0 z-50 flex flex-col w-80 max-w-[90vw] overflow-hidden"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            style={{
              background: "linear-gradient(160deg, rgba(8,8,20,0.97) 0%, rgba(12,8,28,0.97) 50%, rgba(8,12,24,0.97) 100%)",
              borderRight: "1px solid rgba(139,92,246,0.2)",
              boxShadow: "4px 0 60px rgba(139,92,246,0.15), 8px 0 120px rgba(59,130,246,0.08)",
              backdropFilter: "blur(40px)",
            }}
          >
            {/* Holographic scan line */}
            <ScanLine />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 18 }).map((_, i) => (
                <Particle key={i} index={i} />
              ))}
            </div>

            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Top glow orb */}
            <div
              className="absolute -top-20 -left-10 w-60 h-60 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* Bottom glow orb */}
            <div
              className="absolute -bottom-20 -right-10 w-60 h-60 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* ── Header ── */}
            <div className="relative flex items-center justify-between px-5 pt-6 pb-4 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col"
              >
                <span
                  className="text-xs font-mono tracking-[0.3em] uppercase"
                  style={{ color: "rgba(139,92,246,0.7)" }}
                >
                  sys://nav
                </span>
                <span
                  className="text-lg font-bold tracking-wide"
                  style={{
                    background: "linear-gradient(90deg, #a78bfa, #38bdf8, #a78bfa)",
                    backgroundSize: "200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "gradient 3s ease infinite",
                  }}
                >
                  NAVIGATION
                </span>
              </motion.div>

              {/* Close button */}
              <motion.button
                onClick={close}
                aria-label="Close navigation"
                className="flex items-center justify-center w-9 h-9 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                style={{
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.25)",
                }}
                whileHover={{ scale: 1.1, background: "rgba(139,92,246,0.2)" }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2 }}
              >
                <X size={16} className="text-violet-300" />
              </motion.button>
            </div>

            {/* Divider */}
            <motion.div
              className="mx-5 h-px flex-shrink-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(59,130,246,0.5), transparent)",
                transformOrigin: "left",
              }}
            />

            {/* ── Nav Items ── */}
            <nav
              className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
              role="menu"
              aria-label="Main navigation"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(139,92,246,0.4) transparent",
              }}
            >
              {NAV_ITEMS.map((item, i) => (
                <NavLink
                  key={item.id}
                  item={item}
                  index={i}
                  isActive={activeId === item.id}
                  onHover={handleHover}
                  onClick={() => handleNavClick(item.id)}
                />
              ))}
            </nav>

            {/* Divider */}
            <motion.div
              className="mx-5 h-px flex-shrink-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent)",
                transformOrigin: "left",
              }}
            />

            {/* ── Footer ── */}
            <motion.div
              className="px-5 py-4 flex-shrink-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: "0 0 8px rgba(52,211,153,0.8)" }}
                />
                <span className="text-xs font-mono" style={{ color: "rgba(52,211,153,0.8)" }}>
                  SYSTEM ONLINE
                </span>
              </div>
              <p className="text-xs font-mono" style={{ color: "rgba(100,100,140,0.6)" }}>
                v2.0.4 // cyberpunk.ui
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
