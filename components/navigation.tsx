"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useSound } from "@/lib/sounds"
import { useI18n } from "@/lib/i18n/i18n-context"

const navItems = [
  { id: "lobby", key: "nav.lobby", icon: "◈" },
  { id: "experiments", key: "nav.experiments", icon: "⬡" },
  { id: "bug-dimension", key: "nav.bugDimension", icon: "⚠" },
  { id: "ideas", key: "nav.ideas", icon: "✧" },
  { id: "timeline", key: "nav.timeline", icon: "◎" },
  { id: "projects", key: "nav.projects", icon: "◇" },
  { id: "finale", key: "nav.finale", icon: "★" },
]

export function Navigation() {
  const { t } = useI18n()
  const [activeSection, setActiveSection] = useState("lobby")
  const [isExpanded, setIsExpanded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { playNavClick, playHover, playSwoosh } = useSound()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollTop / docHeight)

      // Find active section
      const sections = navItems.map((item) => document.getElementById(item.id))
      const scrollPosition = scrollTop + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    playNavClick()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsExpanded(false)
  }

  const handleToggleExpand = () => {
    playSwoosh()
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Desktop navigation */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
      >
        <div className="glass-strong rounded-2xl p-3 border border-primary/10">
          <div className="space-y-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={playHover}
                className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{item.icon}</span>

                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg glass-strong text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {t(item.key)}
                </div>

                {/* Active indicator */}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-xl border-2 border-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Mobile navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-4 left-4 right-4 z-40 lg:hidden"
      >
        <div className="glass-strong rounded-2xl border border-primary/10 overflow-hidden">
          {/* Expanded menu */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-primary/10"
              >
                <div className="p-4 grid grid-cols-4 gap-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-primary/10 text-muted-foreground"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs font-medium truncate w-full text-center">
                        {t(item.key)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle bar */}
          <button
            onClick={handleToggleExpand}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {navItems.find((i) => i.id === activeSection)?.icon}
              </span>
              <span className="font-medium text-foreground">
                {t(navItems.find((i) => i.id === activeSection)?.key || 'nav.lobby')}
              </span>
            </div>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-muted-foreground"
            >
              ▲
            </motion.span>
          </button>
        </div>
      </motion.div>
    </>
  )
}
