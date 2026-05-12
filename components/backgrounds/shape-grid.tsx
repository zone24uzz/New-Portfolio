"use client"

// ShapeGrid — Canvas-based animated grid from ReactBits
// Source: https://www.reactbits.dev/backgrounds/shape-grid
// Adapted to TypeScript + Next.js

import { useRef, useEffect } from "react"

type ShapeType = "square" | "hexagon" | "circle" | "triangle"
type DirectionType = "right" | "left" | "up" | "down" | "diagonal"

interface ShapeGridProps {
  direction?: DirectionType
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
  shape?: ShapeType
  hoverTrailAmount?: number
  className?: string
}

export function ShapeGrid({
  direction = "diagonal",
  speed = 0.4,
  borderColor = "#c7d2fe",
  squareSize = 44,
  hoverFillColor = "#e0e7ff",
  shape = "square",
  hoverTrailAmount = 3,
  className = "",
}: ShapeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const isHex = shape === "hexagon"
    const isTri = shape === "triangle"
    const hexHoriz = squareSize * 1.5
    const hexVert = squareSize * Math.sqrt(3)

    let numSquaresX = 0
    let numSquaresY = 0
    const gridOffset = { x: 0, y: 0 }
    let hoveredSquare: { x: number; y: number } | null = null
    const trailCells: { x: number; y: number }[] = []
    const cellOpacities = new Map<string, number>()

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      numSquaresX = Math.ceil(canvas.width / squareSize) + 1
      numSquaresY = Math.ceil(canvas.height / squareSize) + 1
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const drawHex = (cx: number, cy: number, size: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const vx = cx + size * Math.cos(angle)
        const vy = cy + size * Math.sin(angle)
        i === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy)
      }
      ctx.closePath()
    }

    const drawCircle = (cx: number, cy: number, size: number) => {
      ctx.beginPath()
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2)
      ctx.closePath()
    }

    const drawTriangle = (cx: number, cy: number, size: number, flip: boolean) => {
      ctx.beginPath()
      if (flip) {
        ctx.moveTo(cx, cy + size / 2)
        ctx.lineTo(cx + size / 2, cy - size / 2)
        ctx.lineTo(cx - size / 2, cy - size / 2)
      } else {
        ctx.moveTo(cx, cy - size / 2)
        ctx.lineTo(cx + size / 2, cy + size / 2)
        ctx.lineTo(cx - size / 2, cy + size / 2)
      }
      ctx.closePath()
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isHex) {
        const colShift = Math.floor(gridOffset.x / hexHoriz)
        const offsetX = ((gridOffset.x % hexHoriz) + hexHoriz) % hexHoriz
        const offsetY = ((gridOffset.y % hexVert) + hexVert) % hexVert
        const cols = Math.ceil(canvas.width / hexHoriz) + 3
        const rows = Math.ceil(canvas.height / hexVert) + 3
        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * hexHoriz + offsetX
            const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY
            const key = `${col},${row}`
            const alpha = cellOpacities.get(key)
            if (alpha) {
              ctx.globalAlpha = alpha
              drawHex(cx, cy, squareSize)
              ctx.fillStyle = hoverFillColor
              ctx.fill()
              ctx.globalAlpha = 1
            }
            drawHex(cx, cy, squareSize)
            ctx.strokeStyle = borderColor
            ctx.stroke()
          }
        }
      } else if (isTri) {
        const halfW = squareSize / 2
        const colShift = Math.floor(gridOffset.x / halfW)
        const rowShift = Math.floor(gridOffset.y / squareSize)
        const offsetX = ((gridOffset.x % halfW) + halfW) % halfW
        const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize
        const cols = Math.ceil(canvas.width / halfW) + 4
        const rows = Math.ceil(canvas.height / squareSize) + 4
        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * halfW + offsetX
            const cy = row * squareSize + squareSize / 2 + offsetY
            const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0
            const key = `${col},${row}`
            const alpha = cellOpacities.get(key)
            if (alpha) {
              ctx.globalAlpha = alpha
              drawTriangle(cx, cy, squareSize, flip)
              ctx.fillStyle = hoverFillColor
              ctx.fill()
              ctx.globalAlpha = 1
            }
            drawTriangle(cx, cy, squareSize, flip)
            ctx.strokeStyle = borderColor
            ctx.stroke()
          }
        }
      } else if (shape === "circle") {
        const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize
        const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize
        const cols = Math.ceil(canvas.width / squareSize) + 3
        const rows = Math.ceil(canvas.height / squareSize) + 3
        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * squareSize + squareSize / 2 + offsetX
            const cy = row * squareSize + squareSize / 2 + offsetY
            const key = `${col},${row}`
            const alpha = cellOpacities.get(key)
            if (alpha) {
              ctx.globalAlpha = alpha
              drawCircle(cx, cy, squareSize)
              ctx.fillStyle = hoverFillColor
              ctx.fill()
              ctx.globalAlpha = 1
            }
            drawCircle(cx, cy, squareSize)
            ctx.strokeStyle = borderColor
            ctx.stroke()
          }
        }
      } else {
        const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize
        const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize
        const cols = Math.ceil(canvas.width / squareSize) + 3
        const rows = Math.ceil(canvas.height / squareSize) + 3
        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const sx = col * squareSize + offsetX
            const sy = row * squareSize + offsetY
            const key = `${col},${row}`
            const alpha = cellOpacities.get(key)
            if (alpha) {
              ctx.globalAlpha = alpha
              ctx.fillStyle = hoverFillColor
              ctx.fillRect(sx, sy, squareSize, squareSize)
              ctx.globalAlpha = 1
            }
            ctx.strokeStyle = borderColor
            ctx.strokeRect(sx, sy, squareSize, squareSize)
          }
        }
      }
    }

    const updateCellOpacities = () => {
      const targets = new Map<string, number>()
      if (hoveredSquare) targets.set(`${hoveredSquare.x},${hoveredSquare.y}`, 1)
      if (hoverTrailAmount > 0) {
        for (let i = 0; i < trailCells.length; i++) {
          const t = trailCells[i]
          const key = `${t.x},${t.y}`
          if (!targets.has(key)) targets.set(key, (trailCells.length - i) / (trailCells.length + 1))
        }
      }
      for (const [key] of targets) {
        if (!cellOpacities.has(key)) cellOpacities.set(key, 0)
      }
      for (const [key, opacity] of cellOpacities) {
        const target = targets.get(key) ?? 0
        const next = opacity + (target - opacity) * 0.15
        if (next < 0.005) cellOpacities.delete(key)
        else cellOpacities.set(key, next)
      }
    }

    const updateAnimation = () => {
      const s = Math.max(speed, 0.1)
      const wrapX = isHex ? hexHoriz * 2 : squareSize
      const wrapY = isHex ? hexVert : isTri ? squareSize * 2 : squareSize
      switch (direction) {
        case "right":    gridOffset.x = (gridOffset.x - s + wrapX) % wrapX; break
        case "left":     gridOffset.x = (gridOffset.x + s + wrapX) % wrapX; break
        case "up":       gridOffset.y = (gridOffset.y + s + wrapY) % wrapY; break
        case "down":     gridOffset.y = (gridOffset.y - s + wrapY) % wrapY; break
        case "diagonal":
          gridOffset.x = (gridOffset.x - s + wrapX) % wrapX
          gridOffset.y = (gridOffset.y - s + wrapY) % wrapY
          break
      }
      updateCellOpacities()
      drawGrid()
      rafRef.current = requestAnimationFrame(updateAnimation)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const offsetX = ((gridOffset.x % squareSize) + squareSize) % squareSize
      const offsetY = ((gridOffset.y % squareSize) + squareSize) % squareSize
      const col = Math.floor((mx - offsetX) / squareSize)
      const row = Math.floor((my - offsetY) / squareSize)
      if (!hoveredSquare || hoveredSquare.x !== col || hoveredSquare.y !== row) {
        if (hoveredSquare && hoverTrailAmount > 0) {
          trailCells.unshift({ ...hoveredSquare })
          if (trailCells.length > hoverTrailAmount) trailCells.length = hoverTrailAmount
        }
        hoveredSquare = { x: col, y: row }
      }
    }

    const handleMouseLeave = () => {
      if (hoveredSquare && hoverTrailAmount > 0) {
        trailCells.unshift({ ...hoveredSquare })
        if (trailCells.length > hoverTrailAmount) trailCells.length = hoverTrailAmount
      }
      hoveredSquare = null
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    rafRef.current = requestAnimationFrame(updateAnimation)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [direction, speed, borderColor, hoverFillColor, squareSize, shape, hoverTrailAmount])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}
