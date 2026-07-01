"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Languages } from "lucide-react"
import { useI18n, type Language } from "@/lib/i18n/i18n-context"
import { useTheme } from "@/hooks/use-theme"

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
]

export function LanguageSwitcher() {
  const { language, setLanguage, mounted } = useI18n()
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  if (!mounted) return null

  const current = languages.find((l) => l.code === language) || languages[1]

  const triggerBg = isDark ? "rgba(10,10,20,0.85)" : "rgba(255,255,255,0.88)"
  const drawerBg = isDark
    ? "linear-gradient(160deg, rgba(8,8,20,0.97), rgba(12,8,28,0.97))"
    : "linear-gradient(160deg, rgba(248,250,255,0.97), rgba(243,244,255,0.97))"
  const drawerBorder = isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.25)"
  const drawerShadow = isDark
    ? "0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(245,158,11,0.08)"
    : "0 8px 40px rgba(99,102,241,0.12)"

  return (
    <div className="fixed top-5 left-[72px] z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch language"
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none"
        style={{
          background: triggerBg,
          border: "1px solid rgba(245,158,11,0.35)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 20px rgba(245,158,11,0.12)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Languages size={14} className="text-amber-500" />
        <span className="text-xs font-medium text-amber-600/90">{current.flag}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 min-w-[160px] rounded-xl overflow-hidden z-50"
              style={{
                background: drawerBg,
                border: `1px solid ${drawerBorder}`,
                backdropFilter: "blur(30px)",
                boxShadow: drawerShadow,
              }}
            >
              <div className="p-1.5 space-y-0.5">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      language === lang.code
                        ? "bg-amber-500/15 text-amber-600 font-semibold"
                        : "text-foreground/70 hover:text-foreground hover:bg-amber-500/8"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {language === lang.code && (
                      <motion.div
                        layoutId="langActive"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500"
                        style={{ boxShadow: "0 0 6px rgba(245,158,11,0.7)" }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
