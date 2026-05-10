"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const projects = [
  {
    id: 1,
    title: "Nebula Dashboard",
    description: "A cosmic analytics platform that visualizes data as stellar patterns",
    image: "/placeholder.svg",
    tech: ["Next.js", "Three.js", "D3"],
    color: "from-blue-600 via-indigo-500 to-violet-600",
    year: "2024",
  },
  {
    id: 2,
    title: "Synapse AI",
    description: "Neural network visualization tool for understanding AI decisions",
    image: "/placeholder.svg",
    tech: ["React", "TensorFlow.js", "WebGL"],
    color: "from-emerald-500 via-teal-500 to-cyan-500",
    year: "2024",
  },
  {
    id: 3,
    title: "Chrono App",
    description: "Time-traveling todo app that predicts your future tasks",
    image: "/placeholder.svg",
    tech: ["Next.js", "OpenAI", "Prisma"],
    color: "from-amber-500 via-orange-500 to-red-500",
    year: "2023",
  },
  {
    id: 4,
    title: "Void Commerce",
    description: "E-commerce platform that exists in the space between clicks",
    image: "/placeholder.svg",
    tech: ["Next.js", "Stripe", "Supabase"],
    color: "from-pink-500 via-rose-500 to-red-500",
    year: "2023",
  },
]

function ProjectCube({
  project,
  isExpanded,
  onExpand,
}: {
  project: (typeof projects)[0]
  isExpanded: boolean
  onExpand: () => void
}) {
  return (
    <motion.div
      layout
      onClick={onExpand}
      className={`relative cursor-pointer ${
        isExpanded ? "md:col-span-2 md:row-span-2" : ""
      }`}
      whileHover={{ scale: isExpanded ? 1 : 1.02 }}
    >
      {/* Holographic glow */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${project.color} rounded-3xl opacity-0 blur-xl transition-opacity duration-500`}
        animate={{ opacity: isExpanded ? 0.3 : 0 }}
      />

      <motion.div
        layout
        className="relative glass-strong rounded-2xl overflow-hidden border border-primary/20 h-full"
        style={{
          minHeight: isExpanded ? "500px" : "280px",
        }}
      >
        {/* Gradient overlay */}
        <motion.div
          layout
          className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10`}
        />

        {/* Holographic scanlines */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-full h-px bg-white"
              style={{ marginTop: `${i * 5}%` }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div layout className="relative z-10 p-6 h-full flex flex-col">
          {/* Header */}
          <motion.div layout className="flex items-start justify-between mb-4">
            <div>
              <motion.span
                layout
                className="text-xs font-mono text-muted-foreground"
              >
                {project.year}
              </motion.span>
              <motion.h3
                layout
                className={`font-bold text-foreground ${
                  isExpanded ? "text-3xl" : "text-xl"
                }`}
              >
                {project.title}
              </motion.h3>
            </div>

            {/* Memory cube icon */}
            <motion.div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center`}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white text-lg">◈</span>
            </motion.div>
          </motion.div>

          {/* Description */}
          <motion.p
            layout
            className={`text-muted-foreground ${
              isExpanded ? "text-lg" : "text-sm line-clamp-2"
            } mb-4`}
          >
            {project.description}
          </motion.p>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex-1 flex flex-col"
              >
                {/* Project visualization */}
                <div className="flex-1 glass rounded-xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 grid-pattern" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${project.color}`}
                      animate={{
                        rotateY: [0, 360],
                        rotateX: [0, 15, 0, -15, 0],
                      }}
                      transition={{
                        rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                        rotateX: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    />
                  </div>

                  {/* Floating data points */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-white/30"
                      style={{
                        left: `${20 + (i % 3) * 30}%`,
                        top: `${20 + Math.floor(i / 3) * 50}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <motion.button
                    className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${project.color} text-white font-medium`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enter Portal
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 rounded-xl glass border border-primary/30 text-foreground font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Code
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tech stack */}
          <motion.div layout className="flex flex-wrap gap-2 mt-auto">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-mono glass border border-primary/10 text-primary"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-primary/30" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-primary/30" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-primary/30" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-primary/30" />
      </motion.div>
    </motion.div>
  )
}

export function ProjectShowcase() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <section id="projects" className="relative min-h-screen py-32 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-6 px-4 py-2 rounded-full glass border border-accent/20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-mono text-accent">
              {"// PROJECT_ARTIFACTS.tsx"}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            <span className="text-foreground">Digital</span>{" "}
            <span className="text-accent">Artifacts</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Memory cubes containing frozen moments of creation. Each project a
            portal to another dimension.
          </p>
        </motion.div>

        {/* Project grid */}
        <motion.div layout className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCube
              key={project.id}
              project={project}
              isExpanded={expandedId === project.id}
              onExpand={() =>
                setExpandedId(expandedId === project.id ? null : project.id)
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
