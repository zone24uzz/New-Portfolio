"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { useSound } from "@/lib/sounds"
import { useI18n } from "@/lib/i18n/i18n-context"
import { X, Check } from "lucide-react"

const consoleErrorKeys = [
  "misc.errors.typeError",
  "misc.errors.refError",
  "misc.errors.memoryLeak",
  "misc.errors.maxDepth",
  "misc.errors.syntaxError",
]

const brokenElements = [
  { text: "div", broken: "d̷̰̍i̸̱͝v̶̱̈́" },
  { text: "button", broken: "b̴͎̽u̶̓t̸̛t̵̲̎o̶͖͝n̵̰̕" },
  { text: "component", broken: "c̸̣̈o̵͓̒m̷̱̌p̴̱̾o̷͙̍n̶̰̊t̶̝" },
]

function GlitchText({ children }: { children: string }) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className={`relative ${isGlitching ? "glitch" : ""}`}>
      <span className="relative z-10">{children}</span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-destructive"
            style={{ clipPath: "inset(20% 0 30% 0)", transform: "translateX(-2px)" }}
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-amber-400"
            style={{ clipPath: "inset(50% 0 20% 0)", transform: "translateX(2px)" }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
}

function ConsoleOverlay({ errors }: { errors: string[] }) {
  const { t } = useI18n()
  return (
    <motion.div
      className="absolute inset-4 md:inset-8 glass-strong rounded-xl border border-destructive/30 overflow-hidden font-mono text-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-destructive/20 bg-destructive/10">
        <div className="w-3 h-3 rounded-full bg-destructive" />
        <span className="text-destructive">{t("bug.console")}</span>
      </div>
      <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
        {errors.map((error, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex items-start gap-2 text-destructive/80"
          >
            <X size={14} className="text-destructive shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function FixingAnimation({ onComplete }: { onComplete: () => void }) {
  const { t } = useI18n()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return p + 5
      })
    }, 100)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center space-y-6">
        <motion.div
          className="w-24 h-24 mx-auto rounded-full border-4 border-primary/30 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="space-y-2">
          <p className="text-foreground font-mono">{t("bug.repairing")}</p>
          <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-amber-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-muted-foreground text-sm">{progress}%</p>
        </div>
      </div>
    </motion.div>
  )
}

export function BugDimension() {
  const { t } = useI18n()
  const [phase, setPhase] = useState<"broken" | "fixing" | "fixed">("broken")
  const [hasTriggered, setHasTriggered] = useState(false)
  const { playGlitch, playBeep, playPing } = useSound()
  
  const handleEnterView = useCallback(() => {
    if (hasTriggered) return
    playGlitch()
    setHasTriggered(true)
    setTimeout(() => { setPhase("fixing"); playBeep() }, 4000)
  }, [hasTriggered, playGlitch, playBeep])

  const handleFixComplete = useCallback(() => {
    setPhase("fixed"); playPing()
  }, [playPing])

  const handleReset = useCallback(() => {
    setPhase("broken")
    setHasTriggered(false)
    setTimeout(() => {
      setHasTriggered(true)
      setTimeout(() => setPhase("fixing"), 4000)
    }, 100)
  }, [])

  return (
    <section id="bug-dimension" className="relative min-h-screen py-32 px-4 overflow-hidden">
      {/* Background - changes based on phase */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor:
            phase === "broken"
              ? "rgba(220, 38, 38, 0.05)"
              : phase === "fixing"
              ? "rgba(245, 158, 11, 0.03)"
              : "rgba(245, 158, 11, 0.03)",
        }}
        transition={{ duration: 1 }}
      />

      {/* Scanlines for broken phase */}
      <AnimatePresence>
        {phase === "broken" && (
          <motion.div
            className="absolute inset-0 pointer-events-none scanline opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Warning lights */}
      <AnimatePresence>
        {phase === "broken" && (
          <>
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-destructive"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              style={{ transformOrigin: "left" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-full h-1 bg-destructive"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              style={{ transformOrigin: "right" }}
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto"
        onViewportEnter={handleEnterView}
        viewport={{ once: false, margin: "-100px" }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className={`inline-block mb-6 px-4 py-2 rounded-full glass border ${
              phase === "broken"
                ? "border-destructive/50 bg-destructive/10"
                : phase === "fixing"
                ? "border-primary/30"
                : "border-amber-400/30 bg-amber-400/10"
            } transition-colors duration-500`}
          >
            <span
              className={`text-sm font-mono ${
                phase === "broken"
                  ? "text-destructive"
                  : phase === "fixing"
                  ? "text-primary"
                  : "text-amber-400"
              }`}
            >
              {phase === "broken"
                ? t("bug.errorBadge")
                : phase === "fixing"
                ? t("bug.repairBadge")
                : t("bug.fixedBadge")}
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {phase === "broken" ? (
              <>
                <GlitchText>{t("bug.title")}</GlitchText>{" "}
                <span className="text-destructive">{t("bug.titleEnd")}</span>
              </>
            ) : phase === "fixing" ? (
              <span className="text-primary">{t("bug.restoring")}</span>
            ) : (
              <>
                <span className="text-amber-400 text-glow-amber">{t("bug.system")}</span>{" "}
                <span className="text-foreground">{t("bug.restored")}</span>
              </>
            )}
          </h2>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {phase === "broken"
              ? t("bug.descBroken")
              : phase === "fixing"
              ? t("bug.descFixing")
              : t("bug.descFixed")}
          </p>
        </motion.div>

        {/* Main content area */}
        <div className="relative min-h-[400px] glass-strong rounded-2xl overflow-hidden border border-border/50">
          <AnimatePresence mode="wait">
            {phase === "broken" && (
              <motion.div
                key="broken"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ConsoleOverlay errors={consoleErrorKeys.map(k => t(k))} />

                {/* Fragmented UI elements */}
                <div className="absolute inset-0 p-8">
                  {brokenElements.map((el, i) => (
                    <motion.div
                      key={el.text}
                      className="absolute glass px-4 py-2 rounded-lg border border-destructive/30"
                      style={{
                        top: `${20 + i * 25}%`,
                        left: `${10 + i * 20}%`,
                      }}
                      animate={{
                        x: [0, 3, -2, 0],
                        y: [0, -2, 3, 0],
                        rotate: [0, 2, -1, 0],
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <span className="font-mono text-destructive/80">
                        {"<"}{el.broken}{" />"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {phase === "fixing" && (
              <FixingAnimation key="fixing" onComplete={handleFixComplete} />
            )}

            {phase === "fixed" && (
              <motion.div
                key="fixed"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="text-center space-y-6">
                  <motion.div
                    className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-primary flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Check size={28} className="text-white" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      {t("bug.realityRestored")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("bug.bugsEliminated")}
                    </p>
                  </div>
                  <motion.button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl glass border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t("bug.experienceAgain")}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
