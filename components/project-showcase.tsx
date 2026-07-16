"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useState, useRef } from "react"
import { useSound } from "@/lib/sounds"
import { useI18n } from "@/lib/i18n/i18n-context"

const projects = [
  {
    id: 1,
    title: "Keyron",
    subtitle: "IT Development Company",
    description: "Zamonaviy IT-kompaniya sayti. React va TailwindCSS asosida yaratilgan bo'lib, dasturiy ta'minot ishlab chiqish, veb va mobil ilovalar, jamoa haqida ma'lumot va aloqa bo'limlaridan iborat. Silliq animatsiyalar va interaktiv komponentlar bilan ishlab chiqilgan.",
    url: "https://testkeyron-vifj.vercel.app/",
    github: "#",
    tech: ["React", "Tailwind CSS", "Vite", "JavaScript"],
    color: "from-blue-500 via-indigo-500 to-purple-600",
    glowColor: "rgba(99, 102, 241, 0.4)",
    year: "2024",
    category: "IT Company",
    status: "LIVE",
  },
  {
    id: 2,
    title: "Velocity",
    subtitle: "Bicycle Brand Landing",
    description: "Zamonaviy velosiped brendi uchun lending sahifasi. Velosiped dizayni, texnik xizmat, upgrade xizmatlari va afzalliklar bo'limlari bilan jihozlangan. Minimalist dizayn va silliq animatsiyalar asosida yaratilgan.",
    url: "https://velocity-blush-gamma.vercel.app/",
    github: "#",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive"],
    color: "from-cyan-400 via-blue-500 to-indigo-600",
    glowColor: "rgba(34, 211, 238, 0.4)",
    year: "2024",
    category: "Landing Page",
    status: "LIVE",
  },
  {
    id: 3,
    title: "Indore Plants",
    subtitle: "Plant Shop Landing",
    description: "O'simliklar do'koni uchun zamonaviy lending sahifasi. TailwindCSS asosida yaratilgan bo'lib, mahsulotlar katalogi, xizmatlar, mijozlar fikrlari va aloqa bo'limlari bilan jihozlangan. To'liq moslashuvchan dizayn.",
    url: "https://plant-website-tailwindcss-main.vercel.app/",
    github: "#",
    tech: ["HTML5", "Tailwind CSS", "JavaScript", "Responsive"],
    color: "from-green-400 via-emerald-500 to-teal-600",
    glowColor: "rgba(52, 211, 153, 0.4)",
    year: "2024",
    category: "E-Commerce",
    status: "LIVE",
  },
  {
    id: 4,
    title: "Fast Food Burger",
    subtitle: "Restaurant Landing Page",
    description: "Burgerxona uchun zamonaviy och rangli lending sahifasi. Ishtahani ochuvchi dizayn, interaktiv elementlar, menyu, mashhur taomlar va aksiyalar bilan boyitilgan. 3D-illyustratsiyalar bilan bezatilgan.",
    url: "https://burger-landing-one.vercel.app/",
    github: "#",
    tech: ["HTML5", "CSS3", "JavaScript", "UI/UX"],
    color: "from-orange-400 via-red-500 to-rose-600",
    glowColor: "rgba(251, 146, 60, 0.4)",
    year: "2024",
    category: "Restaurant",
    status: "LIVE",
  },
  {
    id: 5,
    title: "My Stack",
    subtitle: "Full-Stack Developer Toolbox",
    description: "Mening texnologik to'plamim. Frontend: React, Vite, JavaScript, HTML5, CSS3, Tailwind CSS. Backend: Node.js, Express.js. Database: MongoDB. Tools: Git, GitHub, Figma. Doimiy ravishda yangi texnologiyalarni o'rganib, o'z malakamni oshirib boraman.",
    url: "#",
    github: "#",
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Git", "Figma"],
    color: "from-pink-500 via-purple-500 to-indigo-600",
    glowColor: "rgba(168, 85, 247, 0.4)",
    year: "2025",
    category: "Skills",
    status: "ALWAYS",
  },
  {
    id: 6,
    title: "Sansiro",
    subtitle: "Fashion Clothing Store",
    description: "Zamonaviy va foydalanuvchi uchun qulay online kiyim do'koni. Mahsulotlarni kategoriyalar bo'yicha saralash, tezkor qidiruv va filtrlar, mahsulot tafsilotlari sahifasi hamda savatcha (Shopping Cart) funksiyasi bilan jihozlangan. Mobil, planshet va kompyuter qurilmalariga moslashgan zamonaviy UI/UX dizayn.",
    url: "https://sansiro-online-shop.vercel.app/",
    github: "#",
    tech: ["React", "JavaScript", "Tailwind CSS", "Next.js", "Responsive"],
    color: "from-rose-400 via-pink-500 to-purple-600",
    glowColor: "rgba(244, 114, 182, 0.4)",
    year: "2024",
    category: "E-Commerce",
    status: "LIVE",
  },
  {
    id: 7,
    title: "ABC Auto",
    subtitle: "Automotive Marketplace",
    description: "Avtomobillarni ko'rish va qidirish uchun yaratilgan zamonaviy onlayn platforma. Avtomobillar katalogi, qidiruv va filtrlash funksiyalari, avtomobil tafsilotlari sahifasi hamda intuitiv navigatsiya bilan jihozlangan. Tezkor ishlash va yuqori foydalanuvchi tajribasi (UX) uchun mo'ljallangan.",
    url: "https://abc-auto-xidoyatovvv.vercel.app/",
    github: "#",
    tech: ["React", "JavaScript", "Tailwind CSS", "Next.js", "Responsive"],
    color: "from-red-500 via-rose-600 to-orange-700",
    glowColor: "rgba(239, 68, 68, 0.4)",
    year: "2024",
    category: "Marketplace",
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
  
  const springX = useSpring(x, { stiffness: 250, damping: 18 })
  const springY = useSpring(y, { stiffness: 250, damping: 18 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.1)
    y.set((e.clientY - centerY) * 0.1)
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
      className={`${className} cursor-pointer`}
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
  const { t } = useI18n()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { playCardHover } = useSound()

  const rotateX = useTransform(mouseY, [-150, 150], [6, -6])
  const rotateY = useTransform(mouseX, [-150, 150], [-6, 6])

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
      transition={{ duration: 0.5, delay: index * 0.08 }}
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
      {/* Animated glow border — subtle */}
      <motion.div
        className={`absolute -inset-[1px] rounded-[20px] bg-gradient-to-r ${project.color} opacity-0 blur-[2px] transition-opacity duration-500`}
        animate={{
          opacity: isHovered ? 0.4 : 0,
        }}
      />
      
      {/* Outer glow — barely there */}
      <motion.div
        className="absolute -inset-2 rounded-[28px] opacity-0 blur-md transition-all duration-700"
        style={{ background: project.glowColor }}
        animate={{
          opacity: isHovered ? 0.15 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
      />

      {/* Card container — theme-aware via CSS .project-card class */}
      <div className={`relative overflow-hidden project-card ${index % 2 === 0 ? "rounded-2xl" : "rounded-[20px]"}`}>
        {/* Animated gradient overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 transition-opacity duration-500`}
          animate={{ opacity: isHovered ? 0.08 : 0 }}
        />

        {/* Scanlines effect — subtle */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="w-full h-px bg-white"
              style={{ marginTop: `${i * 4.17}%` }}
            />
          ))}
        </div>

        {/* Moving light beam — only on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 55%, transparent 60%)",
            }}
            animate={{ x: ["0%", "200%"] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">          {/* Category & Status */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono text-muted-foreground tracking-[0.15em] uppercase">
              {project.category}
            </span>
            <motion.span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-gradient-to-r ${project.color} text-white`}
              animate={{
                boxShadow: isHovered 
                  ? `0 0 12px ${project.glowColor}` 
                  : "none",
              }}
                >
                  {project.status}
                </motion.span>
              </div>

              {/* Title */}
              <motion.h3 
                className={`font-bold text-foreground mb-0.5 tracking-tight ${index === 0 ? "text-3xl md:text-4xl" : index === 1 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}
                animate={{
                  textShadow: isHovered 
                    ? `0 0 20px ${project.glowColor}` 
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
              animate={{
                rotate: isHovered ? [0, 15, -15, 0] : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20 dark:bg-black/20 light:bg-black/10" />
                <span className="relative text-white font-bold text-sm">
                  {project.year.slice(2)}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-8">
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                viewport={{ once: true }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide border border-border bg-secondary/50 text-foreground/80 hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <MagneticButton
              href={project.url}
              className={`flex-1 relative py-4 rounded-xl bg-gradient-to-r ${project.color} text-white font-semibold text-center overflow-hidden group/btn`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t("projects.livePreview")}
              </span>
              <motion.div
                className="absolute inset-0 bg-white/15"
                initial={{ x: "-100%", skewX: "-15deg" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.4 }}
              />
            </MagneticButton>

            <MagneticButton
              href={project.github}
              className="px-6 py-4 rounded-xl border border-border bg-secondary/50 backdrop-blur-sm text-foreground font-semibold hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {t("projects.code")}
            </MagneticButton>
          </div>
        </div>

        {/* Corner accents — varied sizes */}
        <svg className={`absolute top-3 ${index % 2 === 0 ? "left-3" : "right-3"} w-5 h-5 text-muted-foreground/25`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.5" d="M4 4v6M4 4h6" />
        </svg>
        <svg className={`absolute bottom-3 ${index % 2 === 0 ? "right-3" : "left-3"} w-5 h-5 text-muted-foreground/25`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.5" d="M20 20v-6M20 20h-6" />
        </svg>

        {/* Bottom gradient line */}
        <motion.div
          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${project.color}`}
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export function ProjectShowcase() {
  const { t } = useI18n()
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="projects" className="relative min-h-screen py-28 px-4 overflow-hidden">
      {/* Animated background elements — minimal */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Single ambient glow */}
        <motion.div
          className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 60%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
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
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
            <span className="text-xs font-mono text-primary tracking-wider">
              {t("projects.badge")}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <span className="text-foreground">{t("projects.title")}</span>{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                {t("projects.titleHighlight")}
              </span>
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            {t("projects.description")}
            <span className="block mt-2 text-xs text-muted-foreground/50 font-mono">
              {t("projects.artifacts", { count: projects.length })}
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

        {/* Bottom CTA — static, no animation */}
        <div className="text-center mt-24">
          <p className="text-muted-foreground mb-4 font-mono text-xs">
            {t("projects.moreText")}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-primary/20 text-primary/40 text-xs font-mono">
            {"<"} {t("projects.comingSoon")} {"/>"}
          </div>
        </div>
      </div>
    </section>
  )
}
