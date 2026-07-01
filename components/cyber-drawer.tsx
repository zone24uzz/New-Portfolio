"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, FolderOpen, Cpu, User, Mail, X, Menu, Zap, Phone, Send, Github } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/hooks/use-theme"
import { useI18n } from "@/lib/i18n/i18n-context"

interface NavItem {
  id: string; labelKey: string; href: string; icon: React.ElementType
  glowColor: string; lightGlow: string; descKey: string
}
interface ContactItem {
  id: string; labelKey: string; value: string; href: string
  icon: React.ElementType | string; glowColor: string; lightGlow: string; gradient: string
}

const NAV_ITEMS: NavItem[] = [
  { id: "home",     labelKey: "nav.home",     href: "#home",     icon: Home,       glowColor: "rgba(59,130,246,0.7)",   lightGlow: "rgba(59,130,246,0.6)",   descKey: "navDesc.home"     },
  { id: "projects", labelKey: "nav.projects", href: "#projects", icon: FolderOpen, glowColor: "rgba(139,92,246,0.7)",  lightGlow: "rgba(99,102,241,0.6)",   descKey: "navDesc.projects"  },
  { id: "skills",   labelKey: "nav.skills",   href: "#skills",   icon: Cpu,        glowColor: "rgba(34,211,238,0.7)",  lightGlow: "rgba(6,182,212,0.6)",    descKey: "navDesc.skills"    },
  { id: "about",    labelKey: "nav.about",    href: "#about",    icon: User,       glowColor: "rgba(244,114,182,0.7)", lightGlow: "rgba(236,72,153,0.6)",   descKey: "navDesc.about"    },
  { id: "contact",  labelKey: "nav.contact",  href: "#contact",  icon: Mail,       glowColor: "rgba(251,191,36,0.7)",  lightGlow: "rgba(245,158,11,0.6)",   descKey: "navDesc.contact"  },
]

const CONTACT_ITEMS: ContactItem[] = [
  { id: "phone",     labelKey: "contact.phone",     value: "+998 90 999 55 26",        href: "tel:+998909995526",              icon: Phone,       glowColor: "rgba(34,211,238,0.6)",  lightGlow: "rgba(6,182,212,0.5)",   gradient: "" },
  { id: "gmail",     labelKey: "contact.gmail",     value: "xidoyatovkomron",          href: "mailto:xidoyatovkomron@gmail.com", icon: "gmail",   glowColor: "rgba(234,67,53,0.6)",   lightGlow: "rgba(220,38,38,0.5)",   gradient: "" },
  { id: "telegram",  labelKey: "contact.telegram",  value: "@kx11dvrnc",               href: "https://t.me/kx11dvrnc",         icon: Send,        glowColor: "rgba(37,150,190,0.6)",  lightGlow: "rgba(14,165,233,0.5)",  gradient: "" },
  { id: "instagram", labelKey: "contact.instagram", value: "xidoyatov01",              href: "https://instagram.com/xidoyatov01", icon: "instagram", glowColor: "rgba(225,48,108,0.6)", lightGlow: "rgba(219,39,119,0.5)", gradient: "" },
  { id: "github",    labelKey: "contact.github",    value: "zone24uzz",                href: "https://github.com/zone24uzz",   icon: Github,      glowColor: "rgba(200,200,220,0.5)", lightGlow: "rgba(100,116,139,0.5)", gradient: "" },
]

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
          <stop stopColor="rgba(253,186,73,0.8)"/><stop offset="0.5" stopColor="rgba(225,48,108,0.8)"/><stop offset="1" stopColor="rgba(131,58,180,0.8)"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

// ─── Audio ────────────────────────────────────────────────────────────────────
function createAudioCtx() {
  if (typeof window === "undefined") return null
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}
function playTone(ctx: AudioContext, freq: number, type: OscillatorType = "sine", dur = 0.08, gain = 0.05) {
  const osc = ctx.createOscillator(); const g = ctx.createGain()
  osc.connect(g); g.connect(ctx.destination); osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + dur)
  g.gain.setValueAtTime(gain, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur)
}
const playOpenSound  = (c: AudioContext) => { playTone(c,440,"sine",0.12,0.05); setTimeout(()=>playTone(c,660,"sine",0.1,0.04),60); setTimeout(()=>playTone(c,880,"sine",0.08,0.03),120) }
const playCloseSound = (c: AudioContext) => { playTone(c,880,"sine",0.08,0.04); setTimeout(()=>playTone(c,440,"sine",0.12,0.03),60) }
const playHoverSound = (c: AudioContext) => playTone(c,600,"triangle",0.05,0.025)
const playClickSound = (c: AudioContext) => { playTone(c,1200,"square",0.06,0.035); setTimeout(()=>playTone(c,800,"sine",0.08,0.025),40) }

// ─── Particle ─────────────────────────────────────────────────────────────────
function Particle({ index, isDark }: { index: number; isDark: boolean }) {
  const size = Math.random() * 3 + 1
  const x = Math.random() * 100
  const duration = Math.random() * 8 + 6
  const delay = Math.random() * 5
  const darkColors  = ["#3b82f6","#8b5cf6","#22d3ee","#f472b6","#fbbf24"]
  const lightColors = ["#6366f1","#8b5cf6","#0ea5e9","#ec4899","#f59e0b"]
  const colors = isDark ? darkColors : lightColors
  const color = colors[index % colors.length]
  return (
    <motion.div className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: `${x}%`, bottom: "-10px", background: color, boxShadow: `0 0 ${size*3}px ${color}`, opacity: isDark ? 1 : 0.5 }}
      animate={{ y: [0,-500], opacity: [0, isDark ? 0.8 : 0.4, 0], x: [0,(Math.random()-0.5)*60] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  )
}

// ─── Scan line ────────────────────────────────────────────────────────────────
function ScanLine({ isDark }: { isDark: boolean }) {
  if (!isDark) return null
  return (
    <motion.div className="absolute left-0 right-0 h-px pointer-events-none z-10"
      style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), rgba(139,92,246,0.6), rgba(34,211,238,0.4), transparent)" }}
      animate={{ top: ["-2%","102%"] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
    />
  )
}

// ─── Profile Card ─────────────────────────────────────────────────────────────
function ProfileCard({ isDark }: { isDark: boolean }) {
  const { t } = useI18n()
  const [hovered, setHovered] = useState(false)
  const ringColor    = isDark ? "rgba(139,92,246," : "rgba(99,102,241,"
  const borderColor  = isDark ? "rgba(8,8,20,0.97)" : "rgba(255,255,255,0.97)"

  return (
    <motion.div className="relative flex flex-col items-center pt-8 pb-5 px-5"
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
    >
      <div className="relative cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <motion.div className="absolute -inset-1.5 rounded-full"
          animate={{ boxShadow: hovered
            ? `0 0 0 2px ${ringColor}0.9), 0 0 30px ${ringColor}0.6), 0 0 60px ${ringColor}0.3)`
            : `0 0 0 2px ${ringColor}0.4), 0 0 15px ${ringColor}0.2)` }}
          transition={{ duration: 0.3 }} style={{ borderRadius: "50%" }}
        />
        <motion.div className="absolute -inset-3 rounded-full pointer-events-none"
          animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ border: `1px dashed ${ringColor}0.35)`, borderRadius: "50%" }}
        />
        <motion.div className="absolute -inset-5 rounded-full pointer-events-none"
          animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ border: `1px dashed ${ringColor}0.2)`, borderRadius: "50%" }}
        />
        <motion.div className="relative w-20 h-20 rounded-full overflow-hidden"
          animate={{ scale: hovered ? 1.06 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ background: `linear-gradient(135deg, ${ringColor}0.3), rgba(59,130,246,0.3))` }}
        >
          <Image src="/placeholder-user.jpg" alt={t("profile.name")} fill className="object-cover" priority />
          <AnimatePresence>
            {hovered && (
              <motion.div className="absolute inset-0"
                initial={{ opacity: 0, x: "-100%" }} animate={{ opacity: 1, x: "100%" }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2"
          style={{ background: "#34d399", borderColor }}
          animate={{ boxShadow: ["0 0 6px rgba(52,211,153,0.6)","0 0 12px rgba(52,211,153,0.9)","0 0 6px rgba(52,211,153,0.6)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <motion.div className="mt-5 text-center" animate={{ opacity: hovered ? 1 : 0.9 }}>
        <motion.h2 className="text-base font-bold tracking-wide" style={{
          background: isDark ? "linear-gradient(90deg, #a78bfa, #38bdf8, #a78bfa)" : "linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)",
          backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "gradient 3s ease infinite",
        }}>
          {t("profile.name")}
        </motion.h2>
        <p className="text-xs font-mono mt-0.5" style={{ color: isDark ? "rgba(139,92,246,0.7)" : "rgba(99,102,241,0.8)" }}>
          {t("profile.role")}
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1,0.3,1] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }}
          />
          <span className="text-xs font-mono" style={{ color: isDark ? "rgba(52,211,153,0.7)" : "rgba(16,185,129,0.8)" }}>
            {t("profile.available")}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────
function NavLink({ item, index, isActive, isDark, onHover, onClick }: {
  item: NavItem; index: number; isActive: boolean; isDark: boolean; onHover: () => void; onClick: () => void
}) {
  const { t } = useI18n()
  const Icon = item.icon
  const [hovered, setHovered] = useState(false)
  const active = hovered || isActive
  const glow = isDark ? item.glowColor : item.lightGlow

  return (
    <motion.a href={item.href} onClick={onClick}
      onMouseEnter={() => { setHovered(true); onHover() }} onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 + index * 0.065, type: "spring", stiffness: 220, damping: 22 }}
      className="relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
      style={{ textDecoration: "none" }} role="menuitem" tabIndex={0}
    >
      <AnimatePresence>
        {active && (
          <motion.div key="bg" className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{
              background: `linear-gradient(135deg, ${glow.replace(/[\d.]+\)$/, "0.12)")}, ${glow.replace(/[\d.]+\)$/, "0.04)")})`,
              border: `1px solid ${glow.replace(/[\d.]+\)$/, "0.35)")}`,
              boxShadow: `0 0 20px ${glow.replace(/[\d.]+\)$/, "0.12)")}`,
            }}
          />
        )}
      </AnimatePresence>
      {isActive && (
        <motion.div layoutId="activeBar" className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${glow}, transparent)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <motion.div className="relative flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
        animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? [0,-4,4,0] : 0 }} transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${glow.replace(/[\d.]+\)$/, "0.18)")}, ${glow.replace(/[\d.]+\)$/, "0.06)")})`,
          border: `1px solid ${glow.replace(/[\d.]+\)$/, "0.3)")}`,
          boxShadow: hovered ? `0 0 14px ${glow.replace(/[\d.]+\)$/, "0.5)")}` : "none",
        }}
      >
        <Icon size={16} style={{ color: active ? glow.replace(/[\d.]+\)$/, "1)") : isDark ? "rgba(180,180,210,0.7)" : "rgba(100,100,140,0.6)" }} />
      </motion.div>
      <div className="flex flex-col min-w-0">
        <motion.span className="text-sm font-semibold tracking-widest uppercase"
          animate={{ color: active ? (isDark ? "#fff" : "#1e1b4b") : isDark ? "rgba(170,170,200,0.8)" : "rgba(60,60,100,0.8)" }}
          style={isActive ? { textShadow: `0 0 10px ${glow}` } : {}}
        >
          {t(item.labelKey)}
        </motion.span>
        <motion.span className="text-xs font-mono truncate"
          animate={{ opacity: hovered ? 1 : 0.35, color: glow.replace(/[\d.]+\)$/, "1)") }}
        >
          {t(item.descKey)}
        </motion.span>
      </div>
      <motion.div className="ml-auto flex-shrink-0"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -5 }} transition={{ duration: 0.18 }}
      >
        <Zap size={13} style={{ color: glow.replace(/[\d.]+\)$/, "1)") }} />
      </motion.div>
    </motion.a>
  )
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({ item, index, isDark, onHover }: { item: ContactItem; index: number; isDark: boolean; onHover: () => void }) {
  const { t } = useI18n()
  const [hovered, setHovered] = useState(false)
  const IconComp = typeof item.icon === "string" ? null : item.icon as React.ElementType
  const glow = isDark ? item.glowColor : item.lightGlow

  return (
    <motion.a href={item.href}
      target={item.id !== "phone" && item.id !== "gmail" ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseEnter={() => { setHovered(true); onHover() }} onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.06, type: "spring", stiffness: 200, damping: 22 }}
      className="relative flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
      style={{ textDecoration: "none" }}
    >
      <motion.div className="absolute inset-0 rounded-xl"
        animate={{
          background: hovered
            ? `linear-gradient(135deg, ${glow.replace(/[\d.]+\)$/, "0.12)")}, ${glow.replace(/[\d.]+\)$/, "0.04)")})`
            : isDark ? "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" : "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(99,102,241,0.01))",
          borderColor: hovered ? glow.replace(/[\d.]+\)$/, "0.4)") : isDark ? "rgba(255,255,255,0.07)" : "rgba(99,102,241,0.12)",
          boxShadow: hovered ? `0 0 18px ${glow.replace(/[\d.]+\)$/, "0.18)")}` : "none",
        }}
        transition={{ duration: 0.2 }}
        style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(99,102,241,0.12)"}` }}
      />
      <motion.div className="relative flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        animate={{ scale: hovered ? 1.1 : 1 }}
        style={{
          background: `linear-gradient(135deg, ${glow.replace(/[\d.]+\)$/, "0.18)")}, ${glow.replace(/[\d.]+\)$/, "0.06)")})`,
          border: `1px solid ${glow.replace(/[\d.]+\)$/, "0.3)")}`,
          boxShadow: hovered ? `0 0 12px ${glow.replace(/[\d.]+\)$/, "0.45)")}` : "none",
        }}
      >
        {item.id === "gmail"     && <GmailIcon size={15} />}
        {item.id === "instagram" && <InstagramIcon size={15} />}
        {IconComp && <IconComp size={15} style={{ color: glow.replace(/[\d.]+\)$/, "0.9)") }} />}
      </motion.div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-mono uppercase tracking-widest"
          style={{ color: isDark ? "rgba(120,120,160,0.7)" : "rgba(100,100,140,0.6)" }}>
          {t(item.labelKey)}
        </span>
        <motion.span className="text-xs font-medium truncate"
          animate={{ color: hovered ? (isDark ? "#fff" : "#1e1b4b") : isDark ? "rgba(180,180,210,0.85)" : "rgba(60,60,100,0.8)" }}
        >
          {item.value}
        </motion.span>
      </div>
      <motion.div className="ml-auto flex-shrink-0"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }} transition={{ duration: 0.15 }}
        style={{ color: glow.replace(/[\d.]+\)$/, "0.8)") }}
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
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState("home")
  const audioCtxRef = useRef<AudioContext | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const { isDark } = useTheme()

  const getAudio = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = createAudioCtx()
    return audioCtxRef.current
  }, [])
  const open  = useCallback(() => { setIsOpen(true);  const c=getAudio(); if(c) playOpenSound(c)  }, [getAudio])
  const close = useCallback(() => { setIsOpen(false); const c=getAudio(); if(c) playCloseSound(c) }, [getAudio])
  const handleNavClick = useCallback((id: string) => {
    setActiveId(id); const c=getAudio(); if(c) playClickSound(c); setTimeout(close,280)
  }, [close, getAudio])
  const handleHover = useCallback(() => { const c=getAudio(); if(c) playHoverSound(c) }, [getAudio])

  useEffect(() => {
    if (!isOpen) return
    const h = (e: MouseEvent) => { if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) close() }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [isOpen, close])
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) close() }
    document.addEventListener("keydown", h)
    return () => document.removeEventListener("keydown", h)
  }, [isOpen, close])
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // ── Theme-aware tokens ──
  const triggerBg     = isDark ? "rgba(10,10,20,0.85)"  : "rgba(255,255,255,0.88)"
  const triggerBorder = isDark ? "rgba(139,92,246,0.4)" : "rgba(99,102,241,0.3)"
  const triggerShadow = isDark ? "0 0 20px rgba(139,92,246,0.2)" : "0 4px 20px rgba(99,102,241,0.15)"
  const iconColor     = isDark ? "text-violet-300" : "text-indigo-500"
  const backdropBg    = isDark ? "rgba(2,2,10,0.72)"    : "rgba(30,27,75,0.25)"
  const drawerBg      = isDark
    ? "linear-gradient(160deg, rgba(8,8,20,0.97) 0%, rgba(12,8,28,0.97) 50%, rgba(8,12,24,0.97) 100%)"
    : "linear-gradient(160deg, rgba(248,250,255,0.97) 0%, rgba(243,244,255,0.97) 50%, rgba(248,250,255,0.97) 100%)"
  const drawerBorder  = isDark ? "rgba(139,92,246,0.18)" : "rgba(99,102,241,0.2)"
  const drawerShadow  = isDark
    ? "4px 0 60px rgba(139,92,246,0.14), 8px 0 120px rgba(59,130,246,0.07)"
    : "4px 0 40px rgba(99,102,241,0.12), 8px 0 60px rgba(99,102,241,0.06)"
  const dividerDark   = isDark
    ? "linear-gradient(90deg, transparent, rgba(139,92,246,0.45), rgba(59,130,246,0.45), transparent)"
    : "linear-gradient(90deg, transparent, rgba(99,102,241,0.35), rgba(139,92,246,0.35), transparent)"
  const gridOpacity   = isDark ? "0.25" : "0.15"
  const gridColor     = isDark ? "rgba(59,130,246,0.04)" : "rgba(99,102,241,0.06)"
  const orb1          = isDark ? "rgba(139,92,246,0.14)" : "rgba(99,102,241,0.08)"
  const orb2          = isDark ? "rgba(59,130,246,0.1)"  : "rgba(139,92,246,0.06)"
  const footerBorder  = isDark ? "rgba(139,92,246,0.12)" : "rgba(99,102,241,0.15)"
  const footerText    = isDark ? "rgba(80,80,120,0.6)"   : "rgba(100,100,160,0.5)"
  const contactLabel  = isDark ? "rgba(139,92,246,0.6)"  : "rgba(99,102,241,0.7)"
  const contactLine   = isDark ? "rgba(139,92,246,0.3)"  : "rgba(99,102,241,0.25)"
  const scrollbar     = isDark ? "rgba(139,92,246,0.35) transparent" : "rgba(99,102,241,0.3) transparent"

  return (
    <>
      {/* Trigger */}
      <motion.button onClick={open} aria-label="Open navigation menu" aria-expanded={isOpen} aria-haspopup="dialog"
        className="fixed top-5 left-5 z-50 flex items-center justify-center w-12 h-12 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        style={{ background: triggerBg, border: `1px solid ${triggerBorder}`, backdropFilter: "blur(20px)", boxShadow: triggerShadow }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x"    initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}  transition={{duration:0.18}}><X    size={20} className={iconColor}/></motion.div>
            : <motion.div key="menu" initial={{rotate:90,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:0.18}}><Menu size={20} className={iconColor}/></motion.div>
          }
        </AnimatePresence>
        <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity:[0,0.5,0], scale:[1,1.45,1] }} transition={{ duration:2.5, repeat:Infinity, ease:"easeOut" }}
          style={{ border: `1px solid ${triggerBorder}` }}
        />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div key="backdrop" className="fixed inset-0 z-40"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.28}}
            style={{ background: backdropBg, backdropFilter: "blur(8px)" }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div ref={drawerRef} key="drawer" role="dialog" aria-modal="true" aria-label="Navigation menu"
            className="fixed top-0 left-0 bottom-0 z-50 flex flex-col w-80 max-w-[92vw] overflow-hidden"
            initial={{x:"-100%",opacity:0}} animate={{x:0,opacity:1}} exit={{x:"-100%",opacity:0}}
            transition={{ type:"spring", stiffness:280, damping:30 }}
            style={{ background: drawerBg, borderRight: `1px solid ${drawerBorder}`, boxShadow: drawerShadow, backdropFilter: "blur(40px)" }}
          >
            <ScanLine isDark={isDark} />

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({length:14}).map((_,i) => <Particle key={i} index={i} isDark={isDark} />)}
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              opacity: gridOpacity,
              backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />

            {/* Glow orbs */}
            <div className="absolute -top-24 -left-12 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${orb1} 0%, transparent 70%)`, filter: "blur(20px)" }} />
            <div className="absolute -bottom-24 -right-12 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${orb2} 0%, transparent 70%)`, filter: "blur(20px)" }} />

            {/* Scrollable */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: scrollbar }}>
              <ProfileCard isDark={isDark} />

              <motion.div className="mx-5 h-px" initial={{scaleX:0}} animate={{scaleX:1}}
                transition={{delay:0.22,duration:0.4}} style={{ background: dividerDark, transformOrigin:"left" }} />

              <nav className="px-3 py-3 space-y-0.5" role="menu" aria-label="Main navigation">
                {NAV_ITEMS.map((item,i) => (
                  <NavLink key={item.id} item={item} index={i} isActive={activeId===item.id}
                    isDark={isDark} onHover={handleHover} onClick={() => handleNavClick(item.id)} />
                ))}
              </nav>

              <motion.div className="mx-5 h-px" initial={{scaleX:0}} animate={{scaleX:1}}
                transition={{delay:0.45,duration:0.4}} style={{ background: dividerDark, transformOrigin:"left" }} />

              <div className="px-3 pt-3 pb-5">
                <motion.div className="flex items-center gap-2 px-2 mb-2"
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.38}}>
                  <span className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: contactLabel }}>
                    {t("contact.label")}
                  </span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${contactLine}, transparent)` }} />
                </motion.div>
                <div className="space-y-1">
                  {CONTACT_ITEMS.map((item,i) => (
                    <ContactCard key={item.id} item={item} index={i} isDark={isDark} onHover={handleHover} />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <motion.div className="px-5 py-3 flex-shrink-0 border-t"
              style={{ borderColor: footerBorder }}
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
            >
              <p className="text-xs font-mono text-center" style={{ color: footerText }}>
                {t("drawer.version", { theme: isDark ? t("drawer.theme_cyber") : t("drawer.theme_clean") })}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
