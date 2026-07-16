"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useSound } from "@/lib/sounds"
import { useI18n } from "@/lib/i18n/i18n-context"
import { RotateCcw, ArrowUp } from "lucide-react"

const terminalLines = [
  { textKey: "finale.lines.0.text" as const, delay: 0 },
  { textKey: "finale.lines.1.text" as const, delay: 0.5 },
  { textKey: "finale.lines.2.text" as const, delay: 1 },
  { textKey: "finale.lines.3.text" as const, delay: 1.5 },
  { textKey: "finale.lines.4.text" as const, delay: 2 },
  { textKey: "finale.lines.5.text" as const, delay: 2.5 },
]

function TypewriterLine({ textKey, delay }: { textKey: string; delay: number }) {
  const { t } = useI18n()
  const text = t(textKey)
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setTimeout(() => setShowCursor(false), 500)
        }
      }, 30)

      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span>
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-primary"
        >
          _
        </motion.span>
      )}
    </span>
  )
}

export function FinalScene({ onRestart }: { onRestart: () => void }) {
  const { t } = useI18n()
  const [showTerminal, setShowTerminal] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const { playClick, playHover, playPing, playWhoosh } = useSound()

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTerminal(true), 500)
    const timer2 = setTimeout(() => { setShowMessage(true); playPing(); }, 4500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [playPing])

  const handleRestart = () => {
    playWhoosh()
    onRestart()
  }

  return (
    <section
      id="finale"
      className="relative min-h-screen flex items-center justify-center py-32 px-4"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />

        {/* Grid */}
        <div className="absolute inset-0 grid-pattern opacity-10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showTerminal ? 1 : 0, y: showTerminal ? 0 : 30 }}
          className="glass-strong rounded-2xl overflow-hidden border border-primary/20 mb-12"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10 bg-primary/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs font-mono text-muted-foreground ml-2">
              {t("finale.terminal")}
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-6 text-left font-mono text-sm space-y-2">
            {terminalLines.map((line, i) => (
              <div key={i} className="text-muted-foreground">
                <TypewriterLine textKey={line.textKey} delay={line.delay} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: showMessage ? 1 : 0,
            scale: showMessage ? 1 : 0.9,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="text-foreground">{t("finale.thanks")}</span>
            <br />
            <span className="text-primary">{t("finale.thanksHighlight")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showMessage ? 1 : 0 }}
            transition={{ delay: 1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
          >
            {t("finale.description")}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showMessage ? 1 : 0, y: showMessage ? 0 : 20 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <motion.button
              onClick={handleRestart}
              onMouseEnter={playHover}
              className="group relative px-8 py-4 rounded-2xl overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient" />
              <span className="relative z-10 font-medium text-white flex items-center gap-2">
                <RotateCcw size={18} />
                {t("finale.restart")}
              </span>
            </motion.button>

            <motion.a
              href="#lobby"
              onMouseEnter={playHover}
              onClick={playClick}
              className="px-8 py-4 rounded-2xl glass border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp size={18} />
              {t("finale.backToLobby")}
            </motion.a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showMessage ? 1 : 0 }}
            transition={{ delay: 2 }}
            className="pt-8 flex justify-center gap-6"
          >
            {["GitHub", "LinkedIn", "Twitter"].map((platform) => (
              <motion.a
                key={platform}
                href="#"
                onMouseEnter={playHover}
                onClick={playClick}
                className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                whileHover={{ y: -2 }}
              >
                [{platform}]
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showMessage ? 0.5 : 0 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-muted-foreground"
        >
          {t("finale.builtWith")}
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-primary/15" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-primary/15" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-primary/15" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-primary/15" />
    </section>
  )
}
