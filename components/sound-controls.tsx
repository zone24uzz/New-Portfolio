"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useSound } from "@/lib/sounds"
import { useI18n } from "@/lib/i18n/i18n-context"

export function SoundControls() {
  const { t } = useI18n()
  const { volume, muted, setVolume, toggleMute, playClick } = useSound()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => { playClick(); setIsOpen(!isOpen) }
  const handleMuteToggle = () => { playClick(); toggleMute() }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 p-4 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl min-w-[180px]"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-mono text-white/70 uppercase tracking-wider">{t("sound.audioSystem")}</span>
              </div>

              <button onClick={handleMuteToggle} className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <span className="text-sm text-white/80">{t("sound.soundEffects")}</span>
                <div className={`w-9 h-4.5 rounded-full transition-colors relative ${muted ? "bg-white/20" : "bg-amber-500/50"}`}>
                  <motion.div animate={{ x: muted ? 0 : 18 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full ${muted ? "bg-white/50" : "bg-amber-400"}`} />
                </div>
              </button>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 font-mono">{t("sound.volume")}</span>
                  <span className="text-xs text-amber-400 font-mono">{Math.round(volume * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  disabled={muted}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer disabled:opacity-50
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={handleToggle} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        className={`relative w-12 h-12 rounded-full border backdrop-blur-xl transition-all duration-300 cursor-pointer ${
          isOpen ? "border-amber-500/40 bg-amber-500/15" : "border-white/20 bg-black/50 hover:border-white/30"
        }`}>
        <div className="relative z-10 flex items-center justify-center">
          {muted ? (
            <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className={`w-5 h-5 ${isOpen ? "text-amber-400" : "text-white/70"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </div>
      </motion.button>
    </div>
  )
}

