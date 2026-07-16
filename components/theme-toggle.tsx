"use client"

import { motion } from "framer-motion"
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
      className="fixed top-5 right-5 z-50 flex items-center gap-2 px-3 py-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-violet-400 select-none cursor-pointer"
      style={{
        background: isDark ? "rgba(10,10,20,0.85)" : "rgba(255,255,255,0.88)",
        border: isDark ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(99,102,241,0.2)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="relative w-10 h-5 rounded-full transition-colors duration-300"
        style={{
          background: isDark ? "rgba(139,92,246,0.3)" : "rgba(251,191,36,0.3)",
          border: `1px solid ${isDark ? "rgba(139,92,246,0.3)" : "rgba(251,191,36,0.3)"}`,
        }}
      >
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          animate={{ x: isDark ? 1 : 19 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{
            background: isDark ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : "linear-gradient(135deg, #fbbf24, #f97316)",
          }}
        >
          {isDark ? <Moon size={9} className="text-white" /> : <Sun size={9} className="text-white" />}
        </motion.div>
      </div>
      <span className="text-[10px] font-mono hidden sm:block" style={{ color: isDark ? "rgba(139,92,246,0.7)" : "rgba(99,102,241,0.7)" }}>
        {isDark ? t("theme.dark") : t("theme.light")}
      </span>
    </motion.button>
  )
}
