import { useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { C, localPoint, useDemoCanvas } from './useDemoCanvas'
import { FpsMeter } from './FpsMeter'

type Pt = { x: number; y: number }
type Mode = 'fill' | 'coverage' | 'wireframe'

const DEFAULT_VERTS: Pt[] = [
  { x: 0.18, y: 0.82 },
  { x: 0.52, y: 0.12 },
  { x: 0.88, y: 0.68 },
]

const edge = (a: Pt, b: Pt, px: number, py: number) => (b.x - a.x) * (py - a.y) - (b.y - a.y) * (px - a.x)

/** Distance from point to segment — used for wireframe cell tests. */
function segDist(px: number, py: number, a: Pt, b: Pt) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len2 = dx * dx + dy * dy || 1e-9
  const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / len2))
  const qx = a.x + t * dx
  const qy = a.y + t * dy
  return Math.hypot(px - qx, py - qy)
}

export function Rasterizer() {
  const verts = useRef<Pt[]>(DEFAULT_VERTS.map((v) => ({ ...v })))
  const dragIdx = useRef(-1)
  const [mode, setMode] = useState<Mode>('coverage')
  const reduced = useReducedMotion()

  const { canvasRef, fpsRef } = useDemoCanvas((ctx, w, h, _dt, t) => {
    const cell = Math.max(14, Math.min(26, Math.floor(w / 34)))
    const cols = Math.floor(w / cell)
    const rows = Math.floor(h / cell)
    const ox = (w - cols * cell) / 2
    const oy = (h - rows * cell) / 2
    const V = verts.current.map((v) => ({ x: ox + v.x * cols * cell, y: oy + v.y * rows * cell }))
    const area = edge(V[0], V[1], V[2].x, V[2].y)
    const sign = area >= 0 ? 1 : -1

    // scanline sweep: loops forever, pauses briefly when complete
    const cycle = rows + 14
    const scanRow = reduced ? rows : Math.floor(((t * 10) % cycle))

    // grid
    ctx.strokeStyle = C.grid
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 0; i <= cols; i++) {
      ctx.moveTo(ox + i * cell + 0.5, oy)
      ctx.lineTo(ox + i * cell + 0.5, oy + rows * cell)
    }
    for (let j = 0; j <= rows; j++) {
      ctx.moveTo(ox, oy + j * cell + 0.5)
      ctx.lineTo(ox + cols * cell, oy + j * cell + 0.5)
    }
    ctx.stroke()

    // cells
    let covered = 0
    let total = 0
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const cx = ox + i * cell
        const cy = oy + j * cell
        let alpha = 0
        if (mode === 'wireframe') {
          const px = cx + cell / 2
          const py = cy + cell / 2
          const d = Math.min(
            segDist(px, py, V[0], V[1]),
            segDist(px, py, V[1], V[2]),
            segDist(px, py, V[2], V[0]),
          )
          alpha = d < cell * 0.55 ? 1 : 0
        } else if (mode === 'fill') {
          const px = cx + cell / 2
          const py = cy + cell / 2
          const inside =
            sign * edge(V[0], V[1], px, py) >= 0 &&
            sign * edge(V[1], V[2], px, py) >= 0 &&
            sign * edge(V[2], V[0], px, py) >= 0
          alpha = inside ? 1 : 0
        } else {
          // coverage: 2×2 subsamples per cell — antialiasing, visualized
          let hits = 0
          for (const [sx, sy] of [
            [0.25, 0.25],
            [0.75, 0.25],
            [0.25, 0.75],
            [0.75, 0.75],
          ]) {
            const px = cx + sx * cell
            const py = cy + sy * cell
            if (
              sign * edge(V[0], V[1], px, py) >= 0 &&
              sign * edge(V[1], V[2], px, py) >= 0 &&
              sign * edge(V[2], V[0], px, py) >= 0
            )
              hits++
          }
          alpha = hits / 4
        }
        if (alpha > 0) {
          total++
          if (j <= scanRow) {
            covered++
            ctx.fillStyle = `rgba(255,148,46,${0.18 + 0.72 * alpha})`
            ctx.fillRect(cx + 1, cy + 1, cell - 2, cell - 2)
          } else {
            // not yet reached by the scanline — ghost cell
            ctx.fillStyle = 'rgba(148,163,184,0.07)'
            ctx.fillRect(cx + 1, cy + 1, cell - 2, cell - 2)
          }
        }
      }
    }

    // scanline highlight
    if (!reduced && scanRow < rows) {
      const y = oy + scanRow * cell
      const grad = ctx.createLinearGradient(0, y - 20, 0, y + cell)
      grad.addColorStop(0, 'rgba(90,200,255,0)')
      grad.addColorStop(1, 'rgba(90,200,255,0.16)')
      ctx.fillStyle = grad
      ctx.fillRect(ox, y - 20, cols * cell, 20 + cell)
      ctx.fillStyle = 'rgba(90,200,255,0.65)'
      ctx.fillRect(ox, y + cell - 1, cols * cell, 1.5)
    }

    // the mathematical triangle on top — vectors vs. pixels
    ctx.strokeStyle = C.emberSoft
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(V[0].x, V[0].y)
    ctx.lineTo(V[1].x, V[1].y)
    ctx.lineTo(V[2].x, V[2].y)
    ctx.closePath()
    ctx.stroke()

    // vertex handles
    V.forEach((v, i) => {
      ctx.beginPath()
      ctx.arc(v.x, v.y, 7, 0, Math.PI * 2)
      ctx.fillStyle = C.ink
      ctx.fill()
      ctx.strokeStyle = C.ki
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = C.ki
      ctx.font = '10px JetBrains Mono, monospace'
      ctx.fillText(`v${i}`, v.x + 10, v.y - 8)
    })

    // HUD stats
    ctx.fillStyle = C.dim
    ctx.font = '10px JetBrains Mono, monospace'
    ctx.fillText(`${cols}×${rows} buffer · ${covered}/${total} px shaded · mode: ${mode}`, 10, h - 10)
  })

  function hitVertex(p: Pt, canvas: HTMLCanvasElement): number {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const cell = Math.max(14, Math.min(26, Math.floor(w / 34)))
    const cols = Math.floor(w / cell)
    const rows = Math.floor(h / cell)
    const ox = (w - cols * cell) / 2
    const oy = (h - rows * cell) / 2
    return verts.current.findIndex(
      (v) => Math.hypot(ox + v.x * cols * cell - p.x, oy + v.y * rows * cell - p.y) < 22,
    )
  }

  function toNorm(p: Pt, canvas: HTMLCanvasElement): Pt {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const cell = Math.max(14, Math.min(26, Math.floor(w / 34)))
    const cols = Math.floor(w / cell)
    const rows = Math.floor(h / cell)
    const ox = (w - cols * cell) / 2
    const oy = (h - rows * cell) / 2
    return {
      x: Math.max(0, Math.min(1, (p.x - ox) / (cols * cell))),
      y: Math.max(0, Math.min(1, (p.y - oy) / (rows * cell))),
    }
  }

  return (
    <div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Interactive triangle rasterizer: a scanline sweeps a pixel grid, filling the cells covered by a draggable triangle"
          className="h-80 w-full cursor-crosshair touch-none rounded-lg border border-white/10 bg-ink sm:h-96"
          onPointerDown={(e) => {
            const canvas = canvasRef.current
            if (!canvas) return
            const p = localPoint(canvas, e)
            dragIdx.current = hitVertex(p, canvas)
            if (dragIdx.current >= 0) canvas.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            const canvas = canvasRef.current
            if (!canvas || dragIdx.current < 0) return
            verts.current[dragIdx.current] = toNorm(localPoint(canvas, e), canvas)
          }}
          onPointerUp={() => (dragIdx.current = -1)}
          onPointerCancel={() => (dragIdx.current = -1)}
        />
        <FpsMeter fpsRef={fpsRef} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Rasterization mode" className="flex overflow-hidden rounded-lg border border-white/12">
          {(['fill', 'coverage', 'wireframe'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`px-3.5 py-2 font-mono text-xs transition-colors ${
                mode === m ? 'bg-ember text-ink' : 'text-mute hover:bg-white/5 hover:text-fg'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="chip"
          onClick={() => {
            verts.current = Array.from({ length: 3 }, () => ({
              x: 0.1 + Math.random() * 0.8,
              y: 0.1 + Math.random() * 0.8,
            }))
          }}
        >
          randomize
        </button>
        <button type="button" className="chip" onClick={() => (verts.current = DEFAULT_VERTS.map((v) => ({ ...v })))}>
          reset
        </button>
        <p className="w-full pt-1 font-mono text-[11px] leading-relaxed text-dim sm:w-auto sm:pt-0 sm:pl-2">
          drag v0–v2 · coverage = 4 samples/px
        </p>
      </div>
    </div>
  )
}
