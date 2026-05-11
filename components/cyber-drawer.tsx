"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, FolderOpen, Cpu, User, Mail, X, Menu, Zap, Phone, Send, Github } from "lucide-react"
import Image from "next/image"

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  glowColor: string
  description: string
}

interface ContactItem {
  id: string
  label: string
  value: string
  href: string
  icon: React.ElementType | string
  glowColor: string
  gradient: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { id: "home",     label: "Home",     href: "#home",     icon: Home,      glowColor: "rgba(59,130,246,0.7)",   description: "Return to base"      },
  { id: "projects", label: "Projects", href: "#projects", icon: FolderOpen,glowColor: "rgba(139,92,246,0.7)",  description: "Digital creations"   },
  { id: "skills",   label: "Skills",   href: "#skills",   icon: Cpu,       glowColor: "rgba(34,211,238,0.7)",  description: "Tech arsenal"        },
  { id: "about",    label: "About",    href: "#about",    icon: User,      glowColor: "rgba(244,114,182,0.7)", description: "The human behind"    },
  { id: "contact",  label: "Contact",  href: "#contact",  icon: Mail,      glowColor: "rgba(251,191,36,0.7)",  description: "Open a channel"      },
]

const CONTACT_ITEMS: ContactItem[] = [
  {
    id: "phone",
    label: "Phone",
    value: "+998 90 999 55 26",
    href: "tel:+998909995526",
    icon: Phone,
    glowColor: "rgba(34,211,238,0.6)",
    gradient: "from-cyan-500/20 to-blue-500/10",
  },
  {
    id: "gmail",
    label: "Gmail",
    value: "xidoyatovkomron",
    href: "mailto:xidoyatovkomron@gmail.com",
    icon: "gmail",
    glowColor: "rgba(234,67,53,0.6)",
    gradient: "from-red-500/20 to-orange-500/10",
  },
  {
    id: "telegram",
    label: "Telegram",
    value: "@kx11dvrnc",
    href: "https://t.me/kx11dvrnc",
    icon: Send,
    glowColor: "rgba(37,150,190,0.6)",
    gradient: "from-sky-500/20 to-cyan-500/10",
  },
  {
    id: "instagram",
    label: "Instagram",
    value: "xidoyatov01",
    href: "https://instagram.com/xidoyatov01",
    icon: "instagram",
    glowColor: "rgba(225,48,108,0.6)",
    gradient: "from-pink-500/20 to-purple-500/10",
  },
  {
    id: "github",
    label: "GitHub",
    value: "zone24uzz",
    href: "https://github.com/zone24uzz",
    icon: Github,
    glowColor: "rgba(200,200,220,0.5)",
    gradient: "from-slate-500/20 to-gray-500/10",
  },
]

// ─── SVG brand icons ──────────────────────────────────────────────────────────
function GmailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6z" fill="rgba(234,67,53,0.15)" stroke="rgba(234,67,53,0.6)" strokeWidth="1"/>
      <path d="M22 6l-10 7L2 6" stroke="rgba(234,67,53,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#igGrad)" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="4.5" stroke="url(#igGrad)" strokeWidth="1.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="rgba(225,48,108,0.8)"/>
      <defs>
        <linearGradient id="igGrad" x1="2" y1="22" x2="22" y2="2">
          <stop stopColor="rgba(253,186,73,0.8)"/>
          <stop offset="0.5" stopColor="rgba(225,48,108,0.8)"/>
          <stop offset="1" stopColor="rgba(131,58,180,0.8)"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ─── Sound helpers ────────────────────────────────────────────────────────────
function createAudioCtx() {
  if (typeof window === "undefined") return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}
function playTone(ctx: AudioContext, freq: number, type: OscillatorType = "sine", duration = 0.08, gain = 0.05) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.connect(g); g.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration)
  g.gain.setValueAtTime(gain, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime + duration)
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
function playHoverSound(ctx: AudioContext) { playTone(ctx, 600, "triangle", 0.05, 0.025) }
function playClickSound(ctx: AudioContext) {
  playTone(ctx, 1200, "square", 0.06, 0.035)
  setTimeout(() => playTone(ctx, 800, "sine", 0.08, 0.025), 40)
}

// ─── Floating Particle ────────────────────────────────────────────────────────
function Particle({ index }: { index: number }) {
  const size = Math.random() * 3 + 1
  const x = Math.random() * 100
  const duration = Math.random() * 8 + 6
  const delay = Math.random() * 5
  const colors = ["#3b82f6", "#8b5cf6", "#22d3ee", "#f472b6", "#fbbf24"]
  const color = colors[index % colors.length]
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: `${x}%`, bottom: "-10px", background: color, boxShadow: `0 0 ${size * 3}px ${color}` }}
      animate={{ y: [0, -500], opacity: [0, 0.8, 0], x: [0, (Math.random() - 0.5) * 60] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  )
}

// ─── Scan line ────────────────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-10"
      style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), rgba(139,92,246,0.6), rgba(34,211,238,0.4), transparent)" }}
      animate={{ top: ["-2%", "102%"] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
    />
  )
}

// ─── Profile Card ─────────────────────────────────────────────────────────────
function ProfileCard() {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="relative flex flex-col items-center pt-8 pb-5 px-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
    >
      {/* Avatar ring */}
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Animated outer glow ring */}
        <motion.div
          className="absolute -inset-1.5 rounded-full"
          animate={{
            boxShadow: hovered
              ? "0 0 0 2px rgba(139,92,246,0.9), 0 0 30px rgba(139,92,246,0.6), 0 0 60px rgba(59,130,246,0.3)"
              : "0 0 0 2px rgba(139,92,246,0.4), 0 0 15px rgba(139,92,246,0.2)",
          }}
          transition={{ duration: 0.3 }}
          style={{ borderRadius: "50%" }}
        />
        {/* Spinning dashed ring */}
        <motion.div
          className="absolute -inset-3 rounded-full pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            border: "1px dashed rgba(139,92,246,0.35)",
            borderRadius: "50%",
          }}
        />
        {/* Second counter-spin ring */}
        <motion.div
          className="absolute -inset-5 rounded-full pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{
            border: "1px dashed rgba(59,130,246,0.2)",
            borderRadius: "50%",
          }}
        />

        {/* Photo */}
        <motion.div
          className="relative w-20 h-20 rounded-full overflow-hidden"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))",
          }}
        >
          <Image
            src="/placeholder-user.jpg"
            alt="Komron Xidoyatov"
            fill
            className="object-cover"
            priority
          />
          {/* Holographic shimmer on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Online dot */}
        <motion.div
          className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2"
          style={{ background: "#34d399", borderColor: "rgba(8,8,20,0.97)" }}
          animate={{ boxShadow: ["0 0 6px rgba(52,211,153,0.6)", "0 0 12px rgba(52,211,153,0.9)", "0 0 6px rgba(52,211,153,0.6)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Name & title */}
      <motion.div className="mt-5 text-center" animate={{ opacity: hovered ? 1 : 0.9 }}>
        <motion.h2
          className="text-base font-bold tracking-wide"
          style={{
            background: "linear-gradient(90deg, #a78bfa, #38bdf8, #a78bfa)",
            backgroundSize: "200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "gradient 3s ease infinite",
          }}
        >
          Komron Xidoyatov
        </motion.h2>
        <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(139,92,246,0.7)" }}>
          Frontend Developer
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }}
          />
          <span className="text-xs font-mono" style={{ color: "rgba(52,211,153,0.7)" }}>
            Available for work
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────
function NavLink({
  item, index, isActive, onHover, onClick,
}: {
  item: NavItem; index: number; isActive: boolean; onHover: () => void; onClick: () => void
}) {
  const Icon = item.icon
  const [hovered, setHovered] = useState(false)
  const active = hovered || isActive

  return (
    <motion.a
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); onHover() }}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -36 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 + index * 0.065, type: "spring", stiffness: 220, damping: 22 }}
      className="relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      style={{ textDecoration: "none" }}
      role="menuitem"
      tabIndex={0}
    >
      <AnimatePresence>
        {active && (
          <motion.div
            key="bg"
            className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{
              background: `linear-gradient(135deg, ${item.glowColor.replace("0.7", "0.12")}, ${item.glowColor.replace("0.7", "0.05")})`,
              border: `1px solid ${item.glowColor.replace("0.7", "0.35")}`,
              boxShadow: `0 0 20px ${item.glowColor.replace("0.7", "0.15")}`,
            }}
          />
        )}
      </AnimatePresence>

      {isActive && (
        <motion.div
          layoutId="activeBar"
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${item.glowColor}, transparent)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <motion.div
        className="relative flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
        animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? [0, -4, 4, 0] : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${item.glowColor.replace("0.7", "0.18")}, ${item.glowColor.replace("0.7", "0.06")})`,
          border: `1px solid ${item.glowColor.replace("0.7", "0.3")}`,
          boxShadow: hovered ? `0 0 14px ${item.glowColor.replace("0.7", "0.5")}` : "none",
        }}
      >
        <Icon size={16} style={{ color: active ? item.glowColor.replace("0.7", "1") : "rgba(180,180,210,0.7)" }} />
      </motion.div>

      <div className="flex flex-col min-w-0">
        <motion.span
          className="text-sm font-semibold tracking-widest uppercase"
          animate={{ color: active ? "#fff" : "rgba(170,170,200,0.8)" }}
          style={isActive ? { textShadow: `0 0 10px ${item.glowColor}` } : {}}
        >
          {item.label}
        </motion.span>
        <motion.span
          className="text-xs font-mono truncate"
          animate={{ opacity: hovered ? 1 : 0.35, color: item.glowColor.replace("0.7", "1") }}
        >
          {item.description}
        </motion.span>
      </div>

      <motion.div
        className="ml-auto flex-shrink-0"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -5 }}
        transition={{ duration: 0.18 }}
      >
        <Zap size={13} style={{ color: item.glowColor.replace("0.7", "1") }} />
      </motion.div>
    </motion.a>
  )
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({ item, index, onHover }: { item: ContactItem; index: number; onHover: () => void }) {
  const [hovered, setHovered] = useState(false)
  const IconComp = typeof item.icon === "string" ? null : item.icon as React.ElementType

  return (
    <motion.a
      href={item.href}
      target={item.id !== "phone" && item.id !== "gmail" ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseEnter={() => { setHovered(true); onHover() }}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.06, type: "spring", stiffness: 200, damping: 22 }}
      className="relative flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      style={{ textDecoration: "none" }}
    >
      {/* Card bg */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          background: hovered
            ? `linear-gradient(135deg, ${item.glowColor.replace("0.6", "0.14")}, ${item.glowColor.replace("0.6", "0.05")})`
            : "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          borderColor: hovered ? item.glowColor.replace("0.6", "0.45") : "rgba(255,255,255,0.07)",
          boxShadow: hovered ? `0 0 18px ${item.glowColor.replace("0.6", "0.2")}` : "none",
        }}
        transition={{ duration: 0.2 }}
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      />

      {/* Icon */}
      <motion.div
        className="relative flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        animate={{ scale: hovered ? 1.1 : 1 }}
        style={{
          background: `linear-gradient(135deg, ${item.glowColor.replace("0.6", "0.18")}, ${item.glowColor.replace("0.6", "0.06")})`,
          border: `1px solid ${item.glowColor.replace("0.6", "0.3")}`,
          boxShadow: hovered ? `0 0 12px ${item.glowColor.replace("0.6", "0.5")}` : "none",
        }}
      >
        {item.id === "gmail" && <GmailIcon size={15} />}
        {item.id === "instagram" && <InstagramIcon size={15} />}
        {IconComp && <IconComp size={15} style={{ color: item.glowColor.replace("0.6", "0.9") }} />}
      </motion.div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(120,120,160,0.7)" }}>
          {item.label}
        </span>
        <motion.span
          className="text-xs font-medium truncate"
          animate={{ color: hovered ? "#fff" : "rgba(180,180,210,0.85)" }}
        >
          {item.value}
        </motion.span>
      </div>

      {/* Arrow */}
      <motion.div
        className="ml-auto flex-shrink-0"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
        transition={{ duration: 0.15 }}
        style={{ color: item.glowColor.replace("0.6", "0.8") }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.a>
  )
}

// ─── Main Drawer ───────────────────────────────────────────────────────────────
export function CyberDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState("home")
  const audioCtxRef = useRef<AudioContext | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const getAudio = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx()
    return audioCtxRef.current
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
    const ctx = getAudio(); if (ctx) playOpenSound(ctx)
  }, [getAudio])

  const close = useCallback(() => {
    setIsOpen(false)
    const ctx = getAudio(); if (ctx) playCloseSound(ctx)
  }, [getAudio])

  const handleNavClick = useCallback((id: string) => {
    setActiveId(id)
    const ctx = getAudio(); if (ctx) playClickSound(ctx)
    setTimeout(close, 280)
  }, [close, getAudio])

  const handleHover = useCallback(() => {
    const ctx = getAudio(); if (ctx) playHoverSound(ctx)
  }, [getAudio])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen, close])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) close() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, close])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {/* ── Trigger ── */}
      <motion.button
        onClick={open}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="fixed top-5 left-5 z-50 flex items-center justify-center w-12 h-12 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        style={{
          background: "rgba(10,10,20,0.85)",
          border: "1px solid rgba(139,92,246,0.4)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 20px rgba(139,92,246,0.2), 0 0 40px rgba(59,130,246,0.1)",
        }}
        whileHover={{ scale: 1.08, boxShadow: "0 0 30px rgba(139,92,246,0.55), 0 0 60px rgba(59,130,246,0.2)" }}
        whileTap={{ scale: 0.93 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={20} className="text-violet-300" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <Menu size={20} className="text-violet-300" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.45, 1] }}
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ background: "rgba(2,2,10,0.72)", backdropFilter: "blur(8px)" }}
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
            className="fixed top-0 left-0 bottom-0 z-50 flex flex-col w-80 max-w-[92vw] overflow-hidden"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            style={{
              background: "linear-gradient(160deg, rgba(8,8,20,0.97) 0%, rgba(12,8,28,0.97) 50%, rgba(8,12,24,0.97) 100%)",
              borderRight: "1px solid rgba(139,92,246,0.18)",
              boxShadow: "4px 0 60px rgba(139,92,246,0.14), 8px 0 120px rgba(59,130,246,0.07)",
              backdropFilter: "blur(40px)",
            }}
          >
            <ScanLine />

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => <Particle key={i} index={i} />)}
            </div>

            {/* Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-25" style={{
              backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

            {/* Glow orbs */}
            <div className="absolute -top-24 -left-12 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)", filter: "blur(20px)" }} />
            <div className="absolute -bottom-24 -right-12 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", filter: "blur(20px)" }} />

            {/* ── Scrollable content ── */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.35) transparent" }}
            >
              {/* Profile */}
              <ProfileCard />

              {/* Divider */}
              <motion.div
                className="mx-5 h-px"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.22, duration: 0.4 }}
                style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.45), rgba(59,130,246,0.45), transparent)", transformOrigin: "left" }}
              />

              {/* Nav */}
              <nav className="px-3 py-3 space-y-0.5" role="menu" aria-label="Main navigation">
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
                className="mx-5 h-px"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(139,92,246,0.3), transparent)", transformOrigin: "left" }}
              />

              {/* Contact section */}
              <div className="px-3 pt-3 pb-5">
                <motion.div
                  className="flex items-center gap-2 px-2 mb-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                >
                  <span className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: "rgba(139,92,246,0.6)" }}>
                    // contact
                  </span>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.3), transparent)" }} />
                </motion.div>

                <div className="space-y-1">
                  {CONTACT_ITEMS.map((item, i) => (
                    <ContactCard key={item.id} item={item} index={i} onHover={handleHover} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <motion.div
              className="px-5 py-3 flex-shrink-0 border-t"
              style={{ borderColor: "rgba(139,92,246,0.12)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            >
              <p className="text-xs font-mono text-center" style={{ color: "rgba(80,80,120,0.6)" }}>
                v2.0.4 // cyberpunk.portfolio
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
