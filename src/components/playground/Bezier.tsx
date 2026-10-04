import { useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { PauseIcon, PlayIcon } from '../../lib/icons'
import { C, localPoint, useDemoCanvas } from './useDemoCanvas'
import { FpsMeter } from './FpsMeter'

type Pt = { x: number; y: number }

const DEFAULT: Pt[] = [
  { x: 0.08, y: 0.78 },
  { x: 0.3, y: 0.1 },
  { x: 0.68, y: 0.95 },
  { x: 0.93, y: 0.22 },
]

const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })

function cubic(P: Pt[], t: number): Pt {
  const a = lerp(P[0], P[1], t)
  const b = lerp(P[1], P[2], t)
  const c = lerp(P[2], P[3], t)
  return lerp(lerp(a, b, t), lerp(b, c, t), t)
}

export function Bezier() {
  const pts = useRef<Pt[]>(DEFAULT.map((p) => ({ ...p })))
  const dragIdx = useRef(-1)
  const tRef = useRef(0.35)
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(!reduced)

  const { canvasRef, fpsRef } = useDemoCanvas((ctx, w, h, dt) => {
    const pad = 28
    const sx = (v: number) => pad + v * (w - pad * 2)
    const sy = (v: number) => pad + v * (h - pad * 2)
    const P = pts.current.map((p) => ({ x: sx(p.x), y: sy(p.y) }))

    if (playing) {
      tRef.current += dt * 0.22
      if (tRef.current > 1.15) tRef.current = -0.15 // brief pause at the ends
    }
    const t = Math.max(0, Math.min(1, tRef.current))

    // control polygon
    ctx.setLineDash([4, 5])
    ctx.strokeStyle = C.line
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(P[0].x, P[0].y)
    for (let i = 1; i < 4; i++) ctx.lineTo(P[i].x, P[i].y)
    ctx.stroke()
    ctx.setLineDash([])

    // full curve, faint
    ctx.strokeStyle = 'rgba(233,238,247,0.16)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i <= 64; i++) {
      const q = cubic(P, i / 64)
      if (i === 0) ctx.moveTo(q.x, q.y)
      else ctx.lineTo(q.x, q.y)
    }
    ctx.stroke()

    // traced curve up to t
    ctx.strokeStyle = C.ember
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.beginPath()
    const steps = Math.max(2, Math.ceil(64 * t))
    for (let i = 0; i <= steps; i++) {
      const q = cubic(P, (i / steps) * t)
      if (i === 0) ctx.moveTo(q.x, q.y)
      else ctx.lineTo(q.x, q.y)
    }
    ctx.stroke()

    // de Casteljau construction
    const A = lerp(P[0], P[1], t)
    const B = lerp(P[1], P[2], t)
    const Cc = lerp(P[2], P[3], t)
    const D = lerp(A, B, t)
    const E = lerp(B, Cc, t)
    const F = lerp(D, E, t)

    ctx.strokeStyle = 'rgba(90,200,255,0.55)'
    ctx.lineWidth = 1.25
    for (const [m, n] of [
      [A, B],
      [B, Cc],
      [D, E],
    ] as const) {
      ctx.beginPath()
      ctx.moveTo(m.x, m.y)
      ctx.lineTo(n.x, n.y)
      ctx.stroke()
    }
    for (const q of [A, B, Cc, D, E]) {
      ctx.beginPath()
      ctx.arc(q.x, q.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = C.ki
      ctx.fill()
    }

    // the point being drawn
    ctx.beginPath()
    ctx.arc(F.x, F.y, 6, 0, Math.PI * 2)
    ctx.fillStyle = C.ember
    ctx.shadowColor = C.ember
    ctx.shadowBlur = 14
    ctx.fill()
    ctx.shadowBlur = 0

    // control handles
    P.forEach((p, i) => {
      ctx.beginPath()
      ctx.rect(p.x - 5.5, p.y - 5.5, 11, 11)
      ctx.fillStyle = C.ink
      ctx.fill()
      ctx.strokeStyle = i === 0 || i === 3 ? C.fg : C.mute
      ctx.lineWidth = 1.75
      ctx.stroke()
      ctx.fillStyle = C.dim
      ctx.font = '10px JetBrains Mono, monospace'
      ctx.fillText(`P${i}`, p.x + 10, p.y - 9)
    })

    ctx.fillStyle = C.dim
    ctx.font = '10px JetBrains Mono, monospace'
    ctx.fillText(`B(t) · t = ${t.toFixed(2)} · de Casteljau, 3 levels`, 10, h - 10)
  })

  return (
    <div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Interactive cubic Bézier curve: drag the four control points and watch de Casteljau's construction trace the curve"
          className="h-80 w-full cursor-crosshair touch-none rounded-lg border border-white/10 bg-ink sm:h-96"
          onPointerDown={(e) => {
            const canvas = canvasRef.current
            if (!canvas) return
            const p = localPoint(canvas, e)
            const pad = 28
            const W = canvas.clientWidth - pad * 2
            const H = canvas.clientHeight - pad * 2
            dragIdx.current = pts.current.findIndex(
              (q) => Math.hypot(pad + q.x * W - p.x, pad + q.y * H - p.y) < 22,
            )
            if (dragIdx.current >= 0) canvas.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            const canvas = canvasRef.current
            if (!canvas || dragIdx.current < 0) return
            const p = localPoint(canvas, e)
            const pad = 28
            const W = canvas.clientWidth - pad * 2
            const H = canvas.clientHeight - pad * 2
            pts.current[dragIdx.current] = {
              x: Math.max(0, Math.min(1, (p.x - pad) / W)),
              y: Math.max(0, Math.min(1, (p.y - pad) / H)),
            }
          }}
          onPointerUp={() => (dragIdx.current = -1)}
          onPointerCancel={() => (dragIdx.current = -1)}
        />
        <FpsMeter fpsRef={fpsRef} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          className="inline-flex items-center gap-2 rounded-lg bg-ember px-4 py-2 font-mono text-xs font-semibold text-ink transition-colors hover:bg-ember-soft"
        >
          {playing ? <PauseIcon size={13} /> : <PlayIcon size={13} />}
          {playing ? 'pause t' : 'animate t'}
        </button>
        <button
          type="button"
          className="chip"
          onClick={() => {
            pts.current = Array.from({ length: 4 }, () => ({
              x: 0.06 + Math.random() * 0.88,
              y: 0.06 + Math.random() * 0.88,
            }))
          }}
        >
          randomize
        </button>
        <button type="button" className="chip" onClick={() => (pts.current = DEFAULT.map((p) => ({ ...p })))}>
          reset
        </button>
        <p className="w-full pt-1 font-mono text-[11px] leading-relaxed text-dim sm:w-auto sm:pt-0 sm:pl-2">
          drag P0–P3 · every curved path you’ve ever seen is built from these
        </p>
      </div>
    </div>
  )
}
