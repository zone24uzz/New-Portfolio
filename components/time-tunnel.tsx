"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useI18n } from "@/lib/i18n/i18n-context"

const timelineEvents = [
  {
    year: "2019",
    title: "The Beginning",
    description: "First lines of code. The journey into the digital realm begins.",
    tech: ["HTML", "CSS", "JavaScript"],
    color: "from-emerald-500 to-teal-400",
    emotion: "curiosity",
  },
  {
    year: "2020",
    title: "React Revolution",
    description: "Discovered component-based thinking. Mind expanded.",
    tech: ["React", "Redux", "Node.js"],
    color: "from-blue-500 to-cyan-400",
    emotion: "excitement",
  },
  {
    year: "2021",
    title: "Full Stack Awakening",
    description: "Backend meets frontend. The full picture emerges.",
    tech: ["Next.js", "PostgreSQL", "GraphQL"],
    color: "from-violet-500 to-purple-400",
    emotion: "growth",
  },
  {
    year: "2022",
    title: "Design Systems",
    description: "Building blocks of digital experiences. Consistency at scale.",
    tech: ["Tailwind", "Figma", "Storybook"],
    color: "from-pink-500 to-rose-400",
    emotion: "mastery",
  },
  {
    year: "2023",
    title: "AI Integration",
    description: "Machines that think. Code that writes itself.",
    tech: ["OpenAI", "LangChain", "Vercel AI"],
    color: "from-amber-500 to-orange-400",
    emotion: "wonder",
  },
  {
    year: "2024",
    title: "The Present",
    description: "Building the future, one component at a time.",
    tech: ["Next.js 16", "AI SDK", "Edge"],
    color: "from-cyan-500 to-blue-400",
    emotion: "purpose",
  },
]

function TimelineCard({
  event,
  index,
  progress,
}: {
  event: (typeof timelineEvents)[0]
  index: number
  progress: number
}) {
  const cardProgress = Math.max(0, Math.min(1, (progress - index * 0.15) * 2))
  const isLeft = index % 2 === 0

  return (
    <motion.div
      className={`flex items-center gap-4 md:gap-8 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      style={{
        opacity: cardProgress,
        transform: `translateX(${isLeft ? -50 : 50}px) translateX(${(isLeft ? 50 : -50) * cardProgress}px)`,
      }}
    >
      {/* Content card */}
      <motion.div
        className={`flex-1 glass-strong rounded-2xl p-6 md:p-8 border border-primary/10 ${
          isLeft ? "md:text-right" : "md:text-left"
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <div className={`flex items-center gap-3 mb-4 ${isLeft ? "md:justify-end" : ""}`}>
          <span className={`px-3 py-1 rounded-full text-sm font-mono bg-gradient-to-r ${event.color} text-white`}>
            {event.year}
          </span>
          <span className="text-muted-foreground text-sm capitalize">{event.emotion}</span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
          {event.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {event.description}
        </p>
        
        <div className={`flex flex-wrap gap-2 ${isLeft ? "md:justify-end" : ""}`}>
          {event.tech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg text-xs font-mono glass border border-primary/20 text-primary"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Timeline dot */}
      <div className="relative">
        <motion.div
          className={`w-6 h-6 rounded-full bg-gradient-to-br ${event.color} z-10 relative`}
          style={{ scale: 0.5 + cardProgress * 0.5 }}
        />
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${event.color} blur-lg`}
          style={{ opacity: cardProgress * 0.5 }}
        />
      </div>

      {/* Spacer for opposite side */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}

export function TimeTunnel() {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const tunnelOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  const tunnelScale = useTransform(scrollYProgress, [0, 0.1], [0.9, 1])

  return (
    <section
      ref={containerRef}
      id="timeline"
      className="relative min-h-[300vh] py-32 px-4"
    >
      {/* Tunnel background effect */}
      <div className="sticky top-0 h-screen w-full overflow-hidden -z-10">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: tunnelOpacity, scale: tunnelScale }}
        >
          {/* Radial gradient tunnel */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-primary/10"
                style={{
                  width: `${(i + 1) * 20}%`,
                  height: `${(i + 1) * 20}%`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Perspective lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180
              const x1 = 50 + Math.cos(angle) * 50
              const y1 = 50 + Math.sin(angle) * 50
              return (
                <motion.line
                  key={i}
                  x1="50%"
                  y1="50%"
                  x2={`${x1}%`}
                  y2={`${y1}%`}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                />
              )
            })}
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 sticky top-20"
        >
          <motion.div
            className="inline-block mb-6 px-4 py-2 rounded-full glass border border-primary/20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-mono text-primary">
              {t("timeline.badge")}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            <span className="text-foreground">{t("timeline.title")}</span>{" "}
            <span className="text-primary text-glow-gold">{t("timeline.titleHighlight")}</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("timeline.description")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {timelineEvents.map((event, i) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <TimelineCard
                  event={event}
                  index={i}
                  progress={1}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
