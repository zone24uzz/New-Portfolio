"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useI18n } from "@/lib/i18n/i18n-context"

export function ThemeToggle() {
  const { t } = useI18n()
  const { isDark, toggle, mounted } = useTheme()

  if (!mounted) return null

  return (
    <motion.button
      onClick={toggle}
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      className="fixed top-5 right-5 z-50 flex items-center gap-2 px-3 py-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-400 select-none"
      style={{
        background: isDark
          ? "rgba(10,10,20,0.85)"
          : "rgba(255,255,255,0.85)",
        border: isDark
          ? "1px solid rgba(139,92,246,0.35)"
          : "1px solid rgba(99,102,241,0.25)",
        backdropFilter: "blur(20px)",
        boxShadow: isDark
          ? "0 0 20px rgba(139,92,246,0.15)"
          : "0 4px 20px rgba(99,102,241,0.1)",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Track */}
      <div
        className="relative w-11 h-6 rounded-full transition-colors duration-300"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(59,130,246,0.4))"
            : "linear-gradient(135deg, rgba(251,191,36,0.5), rgba(249,115,22,0.4))",
          border: isDark
            ? "1px solid rgba(139,92,246,0.4)"
            : "1px solid rgba(251,191,36,0.4)",
        }}
      >
        {/* Thumb */}
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center"
          animate={{ x: isDark ? 1 : 21 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{
            background: isDark
              ? "linear-gradient(135deg, #8b5cf6, #3b82f6)"
              : "linear-gradient(135deg, #fbbf24, #f97316)",
            boxShadow: isDark
              ? "0 0 8px rgba(139,92,246,0.7)"
              : "0 0 8px rgba(251,191,36,0.7)",
          }}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div key="moon" initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 30, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Moon size={11} className="text-white" />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ rotate: 30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -30, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Sun size={11} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-xs font-mono hidden sm:block"
          style={{ color: isDark ? "rgba(139,92,246,0.8)" : "rgba(99,102,241,0.8)" }}
        >
          {isDark ? t("theme.dark") : t("theme.light")}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
