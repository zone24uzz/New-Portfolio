"use client"

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useState, useRef } from "react"
import { useSound } from "@/lib/sounds"

const projects = [
  {
    id: 1,
    title: "Mars Commerce",
    subtitle: "Interplanetary E-Commerce",
    description: "A futuristic e-commerce platform designed for the Martian colonization era. Features cosmic product catalogs, space-themed UI, and seamless shopping experience.",
    url: "https://mars-market-ashen.vercel.app/",
    github: "#",
    tech: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    color: "from-orange-500 via-red-500 to-rose-600",
    glowColor: "rgba(249, 115, 22, 0.4)",
    year: "2024",
    category: "E-Commerce",
    status: "LIVE",
  },
  {
    id: 2,
    title: "Hamster Kombat",
    subtitle: "Tap-to-Earn Game Clone",
    description: "A pixel-perfect recreation of the viral Telegram game. Features tap mechanics, upgrade systems, and engaging gameplay animations.",
    url: "https://hamster-kombat-beta.vercel.app/",
    github: "#",
    tech: ["React", "TypeScript", "CSS Animations", "Game Logic"],
    color: "from-amber-400 via-yellow-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    year: "2024",
    category: "Gaming",
    status: "LIVE",
  },
  {
    id: 3,
    title: "Hacker Portfolio",
    subtitle: "Cyberpunk Developer Site",
    description: "A neon-drenched, cyberpunk-inspired portfolio that showcases the dark side of web development. Terminal aesthetics meet modern design.",
    url: "https://komton-neon.vercel.app/",
    github: "#",
    tech: ["Next.js", "Framer Motion", "Neon UI", "TypeScript"],
    color: "from-green-400 via-emerald-500 to-cyan-500",
    glowColor: "rgba(34, 197, 94, 0.4)",
    year: "2024",
    category: "Portfolio",
    status: "LIVE",
  },
  {
    id: 4,
    title: "Foodi Restaurant",
    subtitle: "Premium Restaurant Landing",
    description: "An appetizing landing page for a modern restaurant. Features stunning food photography layouts, menu showcases, and reservation systems.",
    url: "https://foodi-lemon-one.vercel.app/",
    github: "#",
    tech: ["React", "Tailwind CSS", "Responsive Design", "UI/UX"],
    color: "from-lime-400 via-green-500 to-emerald-600",
    glowColor: "rgba(132, 204, 22, 0.4)",
    year: "2024",
    category: "Landing Page",
    status: "LIVE",
  },
  {
    id: 5,
    title: "YouTube Clone",
    subtitle: "Video Streaming Platform",
    description: "A comprehensive YouTube clone featuring video playback, search functionality, channel pages, and a familiar yet enhanced user interface.",
    url: "https://you-tube-lime.vercel.app/",
    github: "#",
    tech: ["React", "YouTube API", "Responsive", "Video Player"],
    color: "from-red-500 via-rose-500 to-pink-600",
    glowColor: "rgba(239, 68, 68, 0.4)",
    year: "2024",
    category: "Clone",
    status: "LIVE",
  },
]

function MagneticButton({ 
  children, 
  className = "",
  href,
}: { 
  children: React.ReactNode
  className?: string
  href?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const { playHover, playProjectSelect } = useSound()
  
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={playHover}
      onMouseLeave={handleMouseLeave}
      onClick={playProjectSelect}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  )
}

function ProjectCard({
  project,
  index,
  isHovered,
  onHover,
}: {
  project: (typeof projects)[0]
  index: number
  isHovered: boolean
  onHover: (id: number | null) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { playCardHover } = useSound()

  const rotateX = useTransform(mouseY, [-150, 150], [8, -8])
  const rotateY = useTransform(mouseX, [-150, 150], [-8, 8])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    onHover(null)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { onHover(project.id); playCardHover(); }}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="group relative"
    >
      {/* Animated glow border */}
      <motion.div
        className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r ${project.color} opacity-0 blur-sm transition-all duration-500`}
        animate={{
          opacity: isHovered ? 0.8 : 0,
        }}
      />
      
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-4 rounded-[2rem] opacity-0 blur-2xl transition-all duration-700"
        style={{ background: project.glowColor }}
        animate={{
          opacity: isHovered ? 0.4 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
      />

      {/* Card container */}
      <div 
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(20, 20, 35, 0.9) 0%, rgba(10, 10, 20, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 transition-opacity duration-500`}
          animate={{ opacity: isHovered ? 0.08 : 0 }}
        />

        {/* Scanlines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="w-full h-px bg-white"
              style={{ marginTop: `${i * 3.33}%` }}
            />
          ))}
        </div>

        {/* Moving light beam */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
          }}
          animate={{
            x: isHovered ? ["0%", "200%"] : "0%",
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {/* Category & Status */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  {project.category}
                </span>
                <motion.span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-gradient-to-r ${project.color} text-white`}
                  animate={{
                    boxShadow: isHovered 
                      ? `0 0 20px ${project.glowColor}` 
                      : "none",
                  }}
                >
                  {project.status}
                </motion.span>
              </div>

              {/* Title */}
              <motion.h3 
                className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight"
                animate={{
                  textShadow: isHovered 
                    ? `0 0 30px ${project.glowColor}` 
                    : "none",
                }}
              >
                {project.title}
              </motion.h3>
              
              {/* Subtitle */}
              <p className={`text-sm font-medium bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>
                {project.subtitle}
              </p>
            </div>

            {/* Year badge */}
            <motion.div
              className="relative"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div 
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <span className="relative text-white font-bold text-sm">
                  {project.year.slice(2)}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                viewport={{ once: true }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide border border-white/10 bg-white/5 text-foreground/80 hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <MagneticButton
              href={project.url}
              className={`flex-1 relative py-4 rounded-xl bg-gradient-to-r ${project.color} text-white font-semibold text-center overflow-hidden group/btn`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%", skewX: "-15deg" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </MagneticButton>

            <MagneticButton
              href={project.github}
              className="px-6 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-foreground font-semibold hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Code
            </MagneticButton>
          </div>
        </div>

        {/* Corner accents */}
        <svg className="absolute top-4 left-4 w-6 h-6 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.5" d="M4 4v6M4 4h6" />
        </svg>
        <svg className="absolute top-4 right-4 w-6 h-6 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.5" d="M20 4v6M20 4h-6" />
        </svg>
        <svg className="absolute bottom-4 left-4 w-6 h-6 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.5" d="M4 20v-6M4 20h6" />
        </svg>
        <svg className="absolute bottom-4 right-4 w-6 h-6 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.5" d="M20 20v-6M20 20h-6" />
        </svg>

        {/* Bottom gradient line */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${project.color}`}
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export function ProjectShowcase() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="projects" className="relative min-h-screen py-32 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${projects[i % projects.length].glowColor} 0%, transparent 70%)`,
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.5)", "0 0 0 8px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0.5)"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-mono text-primary tracking-wider">
              DIGITAL_ARTIFACTS.render()
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="text-foreground">Featured</span>{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Projects
              </span>
              <motion.span
                className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 blur-2xl -z-10"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            Each project is a portal to another dimension. Hover to explore, click to enter.
            <span className="block mt-2 text-sm text-muted-foreground/60 font-mono">
              // {projects.length} artifacts loaded
            </span>
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isHovered={hoveredId === project.id}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-20"
        >
          <p className="text-muted-foreground mb-6 font-mono text-sm">
            More artifacts are being forged in the digital void...
          </p>
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-primary/30 text-primary/60"
            animate={{
              borderColor: ["rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0.6)", "rgba(59, 130, 246, 0.3)"],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {"<"}
            </motion.span>
            <span className="font-mono text-sm">coming_soon</span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            >
              {"/>"}
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
