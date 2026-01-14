"use client"

import { useEffect, useRef } from "react"
import "./css/courbes.css"

export default function TopographicPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    let animationId: number
    let time = 0
    let lastTime = performance.now()

    const dpr = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const smoothMouse = { x: -1000, y: -1000 }
    const targetMouse = { x: -1000, y: -1000 }

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX
      targetMouse.y = e.clientY
      mouseRef.current.active = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    const noiseGrid: number[][] = []
    const lastNoiseTime = -1
    const gridResolution = 8

    const updateNoiseGrid = (t: number, width: number, height: number) => {
      const cols = Math.ceil(width / gridResolution) + 1
      const rows = Math.ceil(height / gridResolution) + 1

      for (let i = 0; i <= cols; i++) {
        if (!noiseGrid[i]) noiseGrid[i] = []
        for (let j = 0; j <= rows; j++) {
          const x = i * gridResolution
          const y = j * gridResolution

          const scale1 = 0.004
          const scale2 = 0.008
          const scale3 = 0.002
          const scale4 = 0.0015

          let value = 0
          value += Math.sin(x * scale1 + t * 0.15) * Math.cos(y * scale1 + t * 0.12) * 0.4
          value += Math.sin(x * scale2 - t * 0.08) * Math.cos(y * scale2 + t * 0.1) * 0.25
          value += Math.sin((x + y) * scale3 + t * 0.06) * 0.2
          value += Math.sin(x * scale4 * 2 + t * 0.05) * Math.sin(y * scale4 * 2 + t * 0.07) * 0.15

          noiseGrid[i][j] = value
        }
      }
    }

    const sampleNoise = (x: number, y: number) => {
      const gx = x / gridResolution
      const gy = y / gridResolution
      const x0 = Math.floor(gx)
      const y0 = Math.floor(gy)
      const x1 = x0 + 1
      const y1 = y0 + 1
      const fx = gx - x0
      const fy = gy - y0

      const v00 = noiseGrid[x0]?.[y0] ?? 0
      const v10 = noiseGrid[x1]?.[y0] ?? 0
      const v01 = noiseGrid[x0]?.[y1] ?? 0
      const v11 = noiseGrid[x1]?.[y1] ?? 0

      const v0 = v00 + (v10 - v00) * fx
      const v1 = v01 + (v11 - v01) * fx
      return v0 + (v1 - v0) * fy
    }

    const noise = (x: number, y: number) => {
      let baseValue = sampleNoise(x, y)

      if (mouseRef.current.active) {
        const dx = x - smoothMouse.x
        const dy = y - smoothMouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxRadius = 150

        if (distance < maxRadius) {
          const t = distance / maxRadius
          const intensity = 1 - t * t * (3 - 2 * t) // smoothstep easing
          const distortion = Math.sin(distance * 0.02 - time * 1.5) * intensity * 0.15
          baseValue += distortion
        }
      }

      return baseValue
    }

    const lerpValue = (v1: number, v2: number, threshold: number) => {
      if (Math.abs(v2 - v1) < 0.0001) return 0.5
      return (threshold - v1) / (v2 - v1)
    }

    const getContourPoints = (threshold: number, resolution: number) => {
      const width = window.innerWidth
      const height = window.innerHeight
      const segments: { x1: number; y1: number; x2: number; y2: number }[] = []

      for (let x = 0; x < width; x += resolution) {
        for (let y = 0; y < height; y += resolution) {
          const vTL = noise(x, y)
          const vTR = noise(x + resolution, y)
          const vBR = noise(x + resolution, y + resolution)
          const vBL = noise(x, y + resolution)

          const tl = vTL > threshold ? 1 : 0
          const tr = vTR > threshold ? 1 : 0
          const br = vBR > threshold ? 1 : 0
          const bl = vBL > threshold ? 1 : 0

          const state = tl * 8 + tr * 4 + br * 2 + bl

          if (state === 0 || state === 15) continue

          const tTop = lerpValue(vTL, vTR, threshold)
          const tRight = lerpValue(vTR, vBR, threshold)
          const tBottom = lerpValue(vBL, vBR, threshold)
          const tLeft = lerpValue(vTL, vBL, threshold)

          const top = { x: x + resolution * tTop, y }
          const right = { x: x + resolution, y: y + resolution * tRight }
          const bottom = { x: x + resolution * tBottom, y: y + resolution }
          const left = { x, y: y + resolution * tLeft }

          switch (state) {
            case 1:
            case 14:
              segments.push({ x1: left.x, y1: left.y, x2: bottom.x, y2: bottom.y })
              break
            case 2:
            case 13:
              segments.push({ x1: bottom.x, y1: bottom.y, x2: right.x, y2: right.y })
              break
            case 3:
            case 12:
              segments.push({ x1: left.x, y1: left.y, x2: right.x, y2: right.y })
              break
            case 4:
            case 11:
              segments.push({ x1: top.x, y1: top.y, x2: right.x, y2: right.y })
              break
            case 5:
              segments.push({ x1: left.x, y1: left.y, x2: top.x, y2: top.y })
              segments.push({ x1: bottom.x, y1: bottom.y, x2: right.x, y2: right.y })
              break
            case 6:
            case 9:
              segments.push({ x1: top.x, y1: top.y, x2: bottom.x, y2: bottom.y })
              break
            case 7:
            case 8:
              segments.push({ x1: left.x, y1: left.y, x2: top.x, y2: top.y })
              break
            case 10:
              segments.push({ x1: top.x, y1: top.y, x2: right.x, y2: right.y })
              segments.push({ x1: left.x, y1: left.y, x2: bottom.x, y2: bottom.y })
              break
          }
        }
      }
      return segments
    }

    const chainSegments = (segments: { x1: number; y1: number; x2: number; y2: number }[]) => {
      const paths: { x: number; y: number }[][] = []
      const used = new Set<number>()
      const tolerance = 0.5

      const findMatch = (x: number, y: number, excludeIdx: number) => {
        for (let i = 0; i < segments.length; i++) {
          if (used.has(i) || i === excludeIdx) continue
          const s = segments[i]
          if (Math.abs(s.x1 - x) < tolerance && Math.abs(s.y1 - y) < tolerance) return { idx: i, end: 1 }
          if (Math.abs(s.x2 - x) < tolerance && Math.abs(s.y2 - y) < tolerance) return { idx: i, end: 2 }
        }
        return null
      }

      for (let i = 0; i < segments.length; i++) {
        if (used.has(i)) continue

        const path: { x: number; y: number }[] = []
        const current = segments[i]
        used.add(i)
        path.push({ x: current.x1, y: current.y1 })
        path.push({ x: current.x2, y: current.y2 })

        let searching = true
        while (searching) {
          const match = findMatch(path[path.length - 1].x, path[path.length - 1].y, -1)
          if (match) {
            used.add(match.idx)
            const seg = segments[match.idx]
            if (match.end === 1) {
              path.push({ x: seg.x2, y: seg.y2 })
            } else {
              path.push({ x: seg.x1, y: seg.y1 })
            }
          } else {
            searching = false
          }
        }

        if (path.length >= 2) {
          paths.push(path)
        }
      }
      return paths
    }

    const drawSmoothPath = (path: { x: number; y: number }[]) => {
      if (path.length < 2) return

      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)

      if (path.length === 2) {
        ctx.lineTo(path[1].x, path[1].y)
      } else {
        for (let i = 0; i < path.length - 1; i++) {
          const p0 = path[Math.max(0, i - 1)]
          const p1 = path[i]
          const p2 = path[Math.min(path.length - 1, i + 1)]
          const p3 = path[Math.min(path.length - 1, i + 2)]

          const tension = 0.4
          const cp1x = p1.x + (p2.x - p0.x) * tension
          const cp1y = p1.y + (p2.y - p0.y) * tension
          const cp2x = p2.x - (p3.x - p1.x) * tension
          const cp2y = p2.y - (p3.y - p1.y) * tension

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
        }
      }
      ctx.stroke()
    }

    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1) // Cap delta to prevent jumps
      lastTime = currentTime

      time += deltaTime * 0.6

      if (mouseRef.current.active) {
        smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.08
        smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.08
      } else {
        // Smoothly fade out mouse position when not active
        smoothMouse.x += (-1000 - smoothMouse.x) * 0.05
        smoothMouse.y += (-1000 - smoothMouse.y) * 0.05
      }

      const width = window.innerWidth
      const height = window.innerHeight

      // Update noise grid
      updateNoiseGrid(time, width, height)

      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height),
      )
      gradient.addColorStop(0, "#0f1419")
      gradient.addColorStop(0.5, "#0a0d12")
      gradient.addColorStop(1, "#050709")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      const levels = 12 // Reduced from 25 to 12 lines
      const resolution = 8

      for (let i = 0; i < levels; i++) {
        const threshold = -0.6 + (i / levels) * 1.2 // Narrower range for less density
        const segments = getContourPoints(threshold, resolution)
        const paths = chainSegments(segments)

        const baseHue = 80
        const hue = baseHue + (i / levels) * 15
        const saturation = 50 + (i / levels) * 15
        const lightness = 30 + (i / levels) * 25
        const alpha = 0.5 + (i / levels) * 0.4

        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
        ctx.lineWidth = 1 + (i / levels) * 0.6
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        paths.forEach(drawSmoothPath)
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
