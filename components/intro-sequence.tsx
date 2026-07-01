"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { soundSystem } from "@/lib/sounds"
import { useI18n } from "@/lib/i18n/i18n-context"

interface IntroSequenceProps {
  onComplete: () => void
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const { t } = useI18n()
  const [stage, setStage] = useState(0)
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1000)
    
    const timers = [
      setTimeout(() => { setStage(1); soundSystem.playBeep(); }, 500),
      setTimeout(() => { setStage(2); soundSystem.playPowerUp(); }, 2500),
      setTimeout(() => { setStage(3); soundSystem.playHologram(); }, 4500),
      setTimeout(() => { setStage(4); soundSystem.playSwoosh(); }, 6000),
      setTimeout(() => onComplete(), 7500),
    ]

    return () => {
      clearTimeout(skipTimer)
      timers.forEach(clearTimeout)
    }
  }, [onComplete])

  const handleSkip = () => {
    soundSystem.playClick()
    onComplete()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
      >
        <div className="absolute inset-0 scanline" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <AnimatePresence mode="wait">
          {stage >= 1 && stage < 2 && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="font-mono text-lg md:text-xl text-muted-foreground tracking-widest"
            >
              <span className="text-primary">{">"}</span> {t("intro.initializing")}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                _
              </motion.span>
            </motion.div>
          )}

          {stage >= 2 && stage < 3 && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-2xl md:text-4xl font-light text-foreground tracking-wide">
                {t("intro.entering")}
              </h2>
              <motion.div
                className="flex justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {stage >= 3 && stage < 4 && (
            <motion.div
              key="stage3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.h1
                className="text-4xl md:text-7xl font-bold tracking-tighter"
                initial={{ letterSpacing: "0.5em", opacity: 0 }}
                animate={{ letterSpacing: "-0.02em", opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <span className="text-glow-gold text-primary">{t("intro.frontend")}</span>
                <br />
                <span className="text-foreground">{t("intro.memoryPalace")}</span>
              </motion.h1>
            </motion.div>
          )}

          {stage >= 4 && (
            <motion.div
              key="stage4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-glow-gold">
                <span className="text-primary">{t("intro.frontend")}</span>
                <br />
                <span className="text-foreground">{t("intro.memoryPalace")}</span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-lg md:text-xl font-mono"
              >
                {t("intro.journey")}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <AnimatePresence>
        {showSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 px-4 py-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5"
          >
            {t("intro.skip")}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
    </motion.div>
  )
}
