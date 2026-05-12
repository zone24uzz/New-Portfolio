"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShapeGrid } from "./shape-grid"

export function DynamicBackground() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)

    const check = () => setIsDark(
      document.documentElement.classList.contains("dark") ||
      !document.documentElement.classList.contains("light")
    )
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="crossfade">
        {isDark ? (
          <motion.div key="dark-bg" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(160deg, #04040e 0%, #060614 50%, #04080e 100%)" }} />
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
          </motion.div>
        ) : (
          <motion.div key="light-bg" className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(160deg, #f8faff 0%, #f0f4ff 50%, #f5f8ff 100%)" }} />
            {/* ShapeGrid только на десктопе */}
            {!isMobile && (
              <ShapeGrid
                direction="diagonal" speed={0.35}
                borderColor="#c7d2fe" squareSize={44}
                hoverFillColor="#e0e7ff" shape="square" hoverTrailAmount={4}
              />
            )}
            <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
