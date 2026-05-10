"use client"

import { useState, useCallback, lazy, Suspense } from "react"
import { AnimatePresence } from "framer-motion"
import { IntroSequence } from "@/components/intro-sequence"
import { ParticleField } from "@/components/particles"
import { Navigation } from "@/components/navigation"
import { SoundControls } from "@/components/sound-controls"

const MemoryLobby = lazy(() => import("@/components/memory-lobby").then(m => ({ default: m.MemoryLobby })))
const ExperimentRoom = lazy(() => import("@/components/experiment-room").then(m => ({ default: m.ExperimentRoom })))
const BugDimension = lazy(() => import("@/components/bug-dimension").then(m => ({ default: m.BugDimension })))
const IdeaGenerator = lazy(() => import("@/components/idea-generator").then(m => ({ default: m.IdeaGenerator })))
const TimeTunnel = lazy(() => import("@/components/time-tunnel").then(m => ({ default: m.TimeTunnel })))
const ProjectShowcase = lazy(() => import("@/components/project-showcase").then(m => ({ default: m.ProjectShowcase })))
const FinalScene = lazy(() => import("@/components/final-scene").then(m => ({ default: m.FinalScene })))

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
          <Suspense fallback={null}>
            <MemoryLobby />
            <ExperimentRoom />
            <BugDimension />
            <IdeaGenerator />
            <TimeTunnel />
            <ProjectShowcase />
            <FinalScene onRestart={handleRestart} />
          </Suspense>
        </div>
      )}

      {/* Sound controls */}
      <SoundControls />

      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 noise opacity-50" />
    </main>
  )
}
