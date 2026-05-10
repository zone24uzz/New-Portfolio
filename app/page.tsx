"use client"

import { useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { IntroSequence } from "@/components/intro-sequence"
import { ParticleField } from "@/components/particles"
import { Navigation } from "@/components/navigation"
import { MemoryLobby } from "@/components/memory-lobby"
import { ExperimentRoom } from "@/components/experiment-room"
import { BugDimension } from "@/components/bug-dimension"
import { IdeaGenerator } from "@/components/idea-generator"
import { TimeTunnel } from "@/components/time-tunnel"
import { ProjectShowcase } from "@/components/project-showcase"
import { FinalScene } from "@/components/final-scene"

export default function FrontendMemoryPalace() {
  const [showIntro, setShowIntro] = useState(true)
  const [key, setKey] = useState(0)

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false)
  }, [])

  const handleRestart = useCallback(() => {
    setKey((prev) => prev + 1)
    setShowIntro(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <main key={key} className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Intro sequence */}
      <AnimatePresence>
        {showIntro && <IntroSequence onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Background effects */}
      {!showIntro && (
        <>
          <ParticleField />
          <Navigation />
        </>
      )}

      {/* Main content sections */}
      {!showIntro && (
        <div className="relative z-10">
          <MemoryLobby />
          <ExperimentRoom />
          <BugDimension />
          <IdeaGenerator />
          <TimeTunnel />
          <ProjectShowcase />
          <FinalScene onRestart={handleRestart} />
        </div>
      )}

      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 noise opacity-50" />
    </main>
  )
}
