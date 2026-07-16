"use client"

import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { useSound } from "@/lib/sounds"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Code2, BookOpen, Palette, Atom, Box, Globe } from "lucide-react"

const techStack = [
  { name: "React", icon: Code2 },
  { name: "Next.js", icon: Box },
  { name: "TypeScript", icon: BookOpen },
  { name: "Tailwind", icon: Palette },
  { name: "Framer", icon: Atom },
  { name: "Node.js", icon: Globe },
]

export function MemoryLobby() {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const { playHologram } = useSound()

  return (
    <section
      ref={containerRef}
      id="lobby"
      className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
    >
      {/* Background gradient orbs — subtle static */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px]"
        />
        <div
          className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[80px]"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-6 px-4 py-2 rounded-full glass border border-primary/20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-mono text-primary">
              {t("lobby.badge")}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6">
            <span className="text-foreground">{t("lobby.title")}</span>
            <br />
            <span className="text-primary text-glow-gold">{t("lobby.titleHighlight")}</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("lobby.description")}
          </p>
        </motion.div>



        {/* Tech stack orbs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 md:gap-6"
        >
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onMouseEnter={() => { setHoveredTech(tech.name); playHologram(); }}
              onMouseLeave={() => setHoveredTech(null)}
              className="relative group"
            >
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl glass flex flex-col items-center justify-center cursor-pointer border border-primary/10 group-hover:border-primary/30 transition-all duration-300"
              >
                {(() => { const Icon = tech.icon; return <Icon size={24} className="mb-1" />; })()}
                <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>


      </div>
    </section>
  )
}
