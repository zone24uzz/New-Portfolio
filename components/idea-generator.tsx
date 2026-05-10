"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useSound } from "@/lib/sounds"

const projectConcepts = [
  {
    id: 1,
    title: "Neural Dashboard",
    description: "AI-powered analytics that predict user behavior",
    tags: ["AI", "Dashboard", "Analytics"],
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "Quantum Forms",
    description: "Form validation that exists in superposition until observed",
    tags: ["Forms", "UX", "Innovation"],
    color: "from-violet-500 to-purple-400",
  },
  {
    id: 3,
    title: "Time Capsule",
    description: "Version control visualization through time",
    tags: ["Git", "Visualization", "History"],
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: 4,
    title: "Emotion Engine",
    description: "Interfaces that adapt to user emotional states",
    tags: ["Emotion AI", "Adaptive", "UX"],
    color: "from-amber-500 to-orange-400",
  },
]

const wireframeElements = [
  { type: "header", width: "100%", height: "12%" },
  { type: "sidebar", width: "20%", height: "70%" },
  { type: "main", width: "75%", height: "50%" },
  { type: "card", width: "30%", height: "25%" },
  { type: "card", width: "30%", height: "25%" },
]

function HolographicWireframe() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px]">
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Wireframe elements */}
      <div className="absolute inset-0 p-4 flex flex-col gap-2">
        {/* Header */}
        <motion.div
          className="w-full h-[12%] rounded-lg border-2 border-dashed border-primary/40 bg-primary/5"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        />
        
        {/* Body */}
        <div className="flex-1 flex gap-2">
          {/* Sidebar */}
          <motion.div
            className="w-[20%] h-full rounded-lg border-2 border-dashed border-accent/40 bg-accent/5"
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-2">
            <motion.div
              className="w-full h-[60%] rounded-lg border-2 border-dashed border-cyan-400/40 bg-cyan-400/5"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            />
            
            {/* Cards row */}
            <div className="flex-1 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating labels */}
      <motion.div
        className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono text-primary/60 bg-primary/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        wireframe.fig
      </motion.div>
    </div>
  )
}

function ConceptCard({
  concept,
  isActive,
  onClick,
}: {
  concept: (typeof projectConcepts)[0]
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`relative cursor-pointer ${isActive ? "col-span-2 row-span-2" : ""}`}
      whileHover={{ scale: isActive ? 1 : 1.02 }}
    >
      <motion.div
        layout
        className={`glass-strong rounded-2xl overflow-hidden border transition-colors duration-300 h-full ${
          isActive ? "border-primary/50" : "border-primary/10 hover:border-primary/30"
        }`}
      >
        {/* Gradient header */}
        <motion.div
          layout
          className={`h-2 bg-gradient-to-r ${concept.color}`}
        />
        
        <motion.div layout className="p-6">
          <motion.h3
            layout
            className={`font-bold mb-2 ${isActive ? "text-2xl" : "text-lg"} text-foreground`}
          >
            {concept.title}
          </motion.h3>
          
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {concept.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {concept.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${concept.color} text-white`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <HolographicWireframe />
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isActive && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {concept.description}
            </p>
          )}
        </motion.div>
      </motion.div>
      
      {/* Glow effect */}
      {isActive && (
        <motion.div
          className={`absolute -inset-4 bg-gradient-to-r ${concept.color} opacity-10 blur-2xl -z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
        />
      )}
    </motion.div>
  )
}

export function IdeaGenerator() {
  const [activeId, setActiveId] = useState<number | null>(1)
  const { playHologram, playHover } = useSound()

  return (
    <section id="ideas" className="relative min-h-screen py-32 px-4">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
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
            className="inline-block mb-6 px-4 py-2 rounded-full glass border border-cyan-400/20"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-mono text-cyan-400">
              {"// IDEA_GENERATOR.tsx"}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
            <span className="text-foreground">The</span>{" "}
            <span className="text-cyan-400 text-glow-cyan">Idea</span>{" "}
            <span className="text-foreground">Generator</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A creative laboratory where concepts take shape. Click on any idea to
            explore its holographic wireframe and potential.
          </p>
        </motion.div>

        {/* Concept grid */}
        <motion.div
          layout
          className="grid md:grid-cols-3 gap-4"
        >
          {projectConcepts.map((concept) => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              isActive={activeId === concept.id}
              onClick={() => { playHologram(); setActiveId(activeId === concept.id ? null : concept.id); }}
                onMouseEnter={playHover}
            />
          ))}
        </motion.div>

        {/* Generate new idea button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <motion.button
            className="group relative px-8 py-4 rounded-2xl glass border border-cyan-400/30 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-primary/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10 font-medium text-cyan-400 group-hover:text-foreground transition-colors">
              ✨ Generate New Concept
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
