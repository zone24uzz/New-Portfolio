"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSound } from "@/lib/sounds";
import { useI18n } from "@/lib/i18n/i18n-context";

export function SoundControls() {
  const { t } = useI18n();
  const { volume, muted, setVolume, toggleMute, playClick } = useSound();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    playClick();
    setIsOpen(!isOpen);
  };

  const handleMuteToggle = () => {
    playClick();
    toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 p-4 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl min-w-[200px]"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/10 blur-xl -z-10" />
            
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-mono text-white/70 uppercase tracking-wider">
                  {t("sound.audioSystem")}
                </span>
              </div>

              {/* Mute Toggle */}
              <button
                onClick={handleMuteToggle}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">{t("sound.soundEffects")}</span>
                <div
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    muted ? "bg-white/20" : "bg-amber-500/50"
                  }`}
                >
                  <motion.div
                    animate={{ x: muted ? 0 : 20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-colors ${
                      muted ? "bg-white/50" : "bg-amber-400"
                    }`}
                  />
                </div>
              </button>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 font-mono">{t("sound.volume")}</span>
                  <span className="text-xs text-amber-400 font-mono">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={muted}
                    className="w-full h-2 rounded-full appearance-none bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-4
                      [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-amber-400
                      [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.5)]
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-moz-range-thumb]:w-4
                      [&::-moz-range-thumb]:h-4
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-amber-400
                      [&::-moz-range-thumb]:border-0
                      [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.5)]
                      [&::-moz-range-thumb]:cursor-pointer"
                  />
                  {/* Volume bar fill */}
                  <div
                    className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-500 pointer-events-none"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>

              {/* Visualizer bars */}
              <div className="flex items-end justify-center gap-1 h-8 pt-2">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: muted ? 4 : [8, 16 + Math.random() * 16, 8],
                    }}
                    transition={{
                      duration: 0.5 + Math.random() * 0.3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.1,
                    }}
                    className={`w-1 rounded-full ${
                      muted
                        ? "bg-white/20"
                        : "bg-gradient-to-t from-amber-500 to-amber-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-14 h-14 rounded-full border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isOpen
            ? "border-amber-500/50 bg-amber-500/20"
            : "border-white/20 bg-black/50 hover:border-white/40"
        }`}
      >
        {/* Glow ring */}
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{
            boxShadow: "0 0 30px rgba(245, 158, 11, 0.3)",
          }}
        />

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          {muted ? (
            <svg
              className="w-6 h-6 text-white/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          ) : (
            <svg
              className={`w-6 h-6 transition-colors ${
                isOpen ? "text-amber-400" : "text-white/70"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          )}
        </div>

        {/* Pulse animation when active */}
        {!muted && (
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full border border-amber-400/50"
          />
        )}
      </motion.button>
    </div>
  );
}
