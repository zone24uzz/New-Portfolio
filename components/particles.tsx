"use client"

import { useEffect, useRef } from "react"

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Отключаем на мобильных — главный источник lag
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    interface Particle {
      x: number; y: number; vx: number; vy: number
      size: number; color: string
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    const colors = [
      "rgba(59,130,246,0.5)",
      "rgba(139,92,246,0.4)",
      "rgba(34,211,238,0.35)",
    ]

    // Уменьшаем количество частиц с 60 до 35
    const COUNT = 35
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    const mouse = { x: -9999, y: -9999 }
    const handleMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    // Throttle: рисуем каждый второй кадр
    let frame = 0
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      frame++
      if (frame % 2 !== 0) return // 30fps вместо 60fps

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse repulsion
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        if (Math.abs(dx) < 150 && Math.abs(dy) < 150) {
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150
            p.vx -= (dx / dist) * force * 0.015
            p.vy -= (dy / dist) * force * 0.015
          }
        }

        p.x += p.vx; p.y += p.vy
        p.vx *= 0.99; p.vy *= 0.99
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        // Соединения только для каждой 3-й частицы
        if (i % 3 === 0) {
          for (let j = i + 1; j < particles.length; j += 3) {
            const o = particles[j]
            const ddx = o.x - p.x; const ddy = o.y - p.y
            if (Math.abs(ddx) > 100 || Math.abs(ddy) > 100) continue
            const d = Math.sqrt(ddx * ddx + ddy * ddy)
            if (d < 100) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(o.x, o.y)
              ctx.strokeStyle = `rgba(59,130,246,${0.08 * (1 - d / 100)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 hidden md:block"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  )
}
