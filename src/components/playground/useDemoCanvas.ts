import { useEffect, useRef, type RefObject } from 'react'

export type DemoDraw = (
  ctx: CanvasRenderingContext2D,
  width: number, // CSS px
  height: number,
  dt: number, // seconds since last frame (clamped)
  t: number, // seconds since mount
) => void

/**
 * Canvas plumbing shared by every playground demo:
 * DPR-correct sizing, a rAF loop that pauses when the canvas is
 * offscreen or the tab is hidden, and an FPS estimate (EMA).
 */
export function useDemoCanvas(draw: DemoDraw): {
  canvasRef: RefObject<HTMLCanvasElement | null>
  fpsRef: RefObject<number>
} {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fpsRef = useRef(60)
  const drawRef = useRef(draw)
  useEffect(() => {
    drawRef.current = draw
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    const ro = new ResizeObserver(() => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
    })
    ro.observe(canvas)

    let visible = true
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(canvas)

    let raf = 0
    let last = performance.now()
    const start = last
    let stopped = false

    function frame(now: number) {
      if (stopped) return
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden || width === 0) {
        last = now
        return
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      if (dt > 0) fpsRef.current = fpsRef.current * 0.92 + (1 / dt) * 0.08
      last = now
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, width, height)
      drawRef.current(ctx!, width, height, dt, (now - start) / 1000)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return { canvasRef, fpsRef }
}

/** Convert a pointer event into canvas-local CSS-pixel coordinates. */
export function localPoint(canvas: HTMLCanvasElement, e: PointerEvent | React.PointerEvent) {
  const r = canvas.getBoundingClientRect()
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}

/* shared demo palette (canvas can't read CSS vars cheaply per frame) */
export const C = {
  ink: '#07090f',
  panel: '#0e131d',
  grid: 'rgba(148,163,184,0.10)',
  line: 'rgba(148,163,184,0.25)',
  fg: '#e9eef7',
  mute: '#93a1b5',
  dim: '#5e6c80',
  ember: '#ff942e',
  emberSoft: '#ffb970',
  ki: '#5ac8ff',
  green: '#4ade80',
} as const
