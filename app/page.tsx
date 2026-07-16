"use client"

import { lazy, Suspense } from "react"
import { ParticleField } from "@/components/particles"
import { Navigation } from "@/components/navigation"
import { SoundControls } from "@/components/sound-controls"
import { CyberDrawer } from "@/components/cyber-drawer"

const MemoryLobby = lazy(() => import("@/components/memory-lobby").then(m => ({ default: m.MemoryLobby })))
const ExperimentRoom = lazy(() => import("@/components/experiment-room").then(m => ({ default: m.ExperimentRoom })))
const BugDimension = lazy(() => import("@/components/bug-dimension").then(m => ({ default: m.BugDimension })))
const IdeaGenerator = lazy(() => import("@/components/idea-generator").then(m => ({ default: m.IdeaGenerator })))
const ProjectShowcase = lazy(() => import("@/components/project-showcase").then(m => ({ default: m.ProjectShowcase })))
const FinalScene = lazy(() => import("@/components/final-scene").then(m => ({ default: m.FinalScene })))

export default function FrontendMemoryPalace() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Background effects */}
      <ParticleField />
      <Navigation />
      <CyberDrawer />

      {/* Main content sections */}
      <div className="relative z-10">
        <Suspense fallback={null}>
          <MemoryLobby />
          <ExperimentRoom />
          <BugDimension />
          <IdeaGenerator />
          <ProjectShowcase />
          <FinalScene />
        </Suspense>
      </div>

      {/* Sound controls */}
      <SoundControls />

      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 noise opacity-50" />
    </main>
  )
}
