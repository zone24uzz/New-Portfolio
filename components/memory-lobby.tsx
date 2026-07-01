"use client"

import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { useSound } from "@/lib/sounds"
import { useI18n } from "@/lib/i18n/i18n-context"

const codeSnippets = [
  { code: "const dream = await imagine()", lang: "js" },
  { code: "<Component {...reality} />", lang: "jsx" },
  { code: "useEffect(() => createMagic())", lang: "react" },
  { code: "export default Consciousness", lang: "ts" },
]

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "📘" },
  { name: "Tailwind", icon: "🎨" },
  { name: "Framer", icon: "✨" },
  { name: "Node.js", icon: "🟢" },
]

export function MemoryLobby() {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const { playHologram, playHover } = useSound()

  return (
    <section
      ref={containerRef}
      id="lobby"
      className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[100px]"
          animate={{
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
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

        {/* Floating code snippets */}
        <div className="relative h-[300px] md:h-[400px] mb-16">
          {codeSnippets.map((snippet, i) => (
            <motion.div
              key={i}
              className="absolute glass-strong rounded-xl px-6 py-4 font-mono text-sm md:text-base"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
              style={{
                left: `${15 + (i % 2) * 50}%`,
                top: `${10 + Math.floor(i / 2) * 45}%`,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)",
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, i % 2 === 0 ? 2 : -2, 0],
              }}
              transition={{
                y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span className="text-muted-foreground mr-2">{snippet.lang}:</span>
              <span className="text-primary">{snippet.code}</span>
            </motion.div>
          ))}
        </div>

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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onHoverStart={() => { setHoveredTech(tech.name); playHologram(); }}
              onHoverEnd={() => setHoveredTech(null)}
              className="relative group"
            >
              <motion.div
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl glass flex flex-col items-center justify-center cursor-pointer border border-primary/10"
                whileHover={{
                  scale: 1.1,
                  borderColor: "rgba(59, 130, 246, 0.5)",
                }}
                animate={
                  hoveredTech === tech.name
                    ? {
                        boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
                      }
                    : {}
                }
              >
                <span className="text-2xl md:text-3xl mb-1">{tech.icon}</span>
                <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </span>
              </motion.div>

              {/* Holographic effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs font-mono tracking-widest">{t("lobby.explore")}</span>
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2"
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
