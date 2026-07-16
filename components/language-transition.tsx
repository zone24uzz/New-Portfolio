"use client"

import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n/i18n-context"
import { type ReactNode } from "react"

export function LanguageTransition({ children }: { children: ReactNode }) {
  const { language } = useI18n()

  return (
    <motion.div
      key={language}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.0, 0.0, 0.2, 1.0] }}
    >
      {children}
    </motion.div>
  )
}
