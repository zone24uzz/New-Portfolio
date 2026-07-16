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
}: {
  event: (typeof timelineEvents)[0]
  index: number
}) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`flex items-center gap-4 md:gap-8 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Content card */}
      <div
        className={`flex-1 glass-strong p-6 md:p-8 border border-primary/10 transition-all duration-300 hover:border-primary/30 ${
          isLeft ? "md:text-right" : "md:text-left"
        } ${index === 0 ? "rounded-2xl" : index % 2 === 0 ? "rounded-[20px]" : "rounded-xl"}`}
      >
        <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
          <span className={`px-3 py-1 rounded-md text-sm font-mono bg-gradient-to-r ${event.color} text-white`}>
            {event.year}
          </span>
          <span className="text-muted-foreground text-xs capitalize">{event.emotion}</span>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
          {event.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {event.description}
        </p>
        
        <div className={`flex flex-wrap gap-1.5 ${isLeft ? "md:justify-end" : ""}`}>
          {event.tech.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-xs font-mono border border-primary/20 text-primary/80"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline dot */}
      <div className="relative flex-shrink-0">
        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${event.color} z-10 relative`} />
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
      {/* Tunnel background effect — static, subtle */}
      <div className="sticky top-0 h-screen w-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute inset-0" style={{ opacity: 0.6 }}>
          {/* Radial gradient tunnel */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-primary/10"
                style={{
                  width: `${(i + 1) * 25}%`,
                  height: `${(i + 1) * 25}%`,
                }}
              />
            ))}
          </div>
        </div>
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

          <div className="space-y-12 md:space-y-20">
            {timelineEvents.map((event, i) => (
              <TimelineCard
                key={event.year}
                event={event}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
