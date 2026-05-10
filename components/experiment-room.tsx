"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"

const experiments = [
  {
    title: "Liquid Morphism",
    description: "Fluid interfaces that respond to your presence",
    gradient: "from-blue-500 via-cyan-400 to-emerald-400",
  },
  {
    title: "Magnetic Fields",
    description: "Elements that gravitate towards curiosity",
    gradient: "from-violet-500 via-purple-400 to-pink-400",
  },
  {
    title: "Neural Patterns",
    description: "AI-driven visual systems that learn and adapt",
    gradient: "from-amber-500 via-orange-400 to-red-400",
  },
  {
    title: "Quantum States",
    description: "Components existing in multiple states simultaneously",
    gradient: "from-cyan-500 via-blue-400 to-indigo-400",
  },
]

function LiquidButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 50 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 50 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  const translateX = useTransform(mouseXSpring, [-100, 100], [-10, 10])
  const translateY = useTransform(mouseYSpring, [-100, 100], [-10, 10])

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
      }}
      style={{
        x: translateX,
        y: translateY,
      }}
      className="relative px-8 py-4 rounded-2xl font-medium overflow-hidden group"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
        animate={{
          backgroundPosition: isHovered ? ["0% 0%", "100% 0%"] : "0% 0%",
        }}
        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
      />
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.2), transparent 50%)",
        }}
      />
      <span className="relative z-10 text-white">{children}</span>
    </motion.button>
  )
}

function MagneticCard({
  experiment,
  index,
}: {
  experiment: (typeof experiments)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      <motion.div
        className="glass-strong rounded-3xl p-8 h-full border border-primary/10 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Gradient background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${experiment.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${experiment.gradient} mb-6 flex items-center justify-center`}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl text-white">✦</span>
          </motion.div>

          <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
            {experiment.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {experiment.description}
          </p>
        </div>

        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1), transparent 70%)",
          }}
        />
      </motion.div>

      {/* Card reflection */}
      <div className="absolute -bottom-4 left-4 right-4 h-8 bg-gradient-to-b from-primary/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}

export function ExperimentRoom() {
  return (
    <section id="experiments" className="relative min-h-screen py-32 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-block mb-6 px-4 py-2 rounded-full glass border border-accent/20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-mono text-accent">
              {"// EXPERIMENT_ROOM.tsx"}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            <span className="text-foreground">The</span>{" "}
            <span className="text-accent">Experiment</span>{" "}
            <span className="text-foreground">Room</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Where imagination meets implementation. Interactive experiments that
            push the boundaries of what&apos;s possible in the browser.
          </p>
        </motion.div>

        {/* Experiment cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {experiments.map((experiment, i) => (
            <MagneticCard key={experiment.title} experiment={experiment} index={i} />
          ))}
        </div>

        {/* Interactive demo button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <LiquidButton>Explore All Experiments</LiquidButton>
        </motion.div>
      </div>
    </section>
  )
}
