import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { MinusIcon, PlusIcon } from '../../lib/icons'
import { C, useDemoCanvas } from './useDemoCanvas'
import { FpsMeter } from './FpsMeter'

type Item = {
  id: number
  w: number
  h: number
  x: number
  y: number
  vx: number
  vy: number
}

type Direction = 'row' | 'column'

let nextId = 0
const ACCENTS = [C.ember, C.ki, C.mute] as const

function makeItem(x = 30, y = -60): Item {
  return {
    id: nextId++,
    w: 46 + Math.round(Math.random() * 15) * 6,
    h: 34 + Math.round(Math.random() * 8) * 6,
    x,
    y,
    vx: 0,
    vy: 0,
  }
}

export function LayoutLab() {
  const items = useRef<Item[]>([])
  const layoutMs = useRef(0)
  const [direction, setDirection] = useState<Direction>('row')
  const [gap, setGap] = useState(12)
  const [count, setCount] = useState(0)
  const reduced = useReducedMotion()

  // seed the scene on mount — boxes spring in from scattered spawn points
  useEffect(() => {
    if (items.current.length === 0) {
      items.current = Array.from({ length: 7 }, () => makeItem(Math.random() * 400, Math.random() * 200))
      setCount(items.current.length)
    }
  }, [])

  const { canvasRef, fpsRef } = useDemoCanvas((ctx, w, h, dt) => {
    const pad = 22

    // --- layout pass: recomputed every frame, immediate-mode style ---
    const t0 = performance.now()
    const targets = new Map<number, { x: number; y: number }>()
    if (direction === 'row') {
      let cx = pad
      let cy = pad
      let rowH = 0
      for (const it of items.current) {
        if (cx + it.w > w - pad && cx > pad) {
          cx = pad
          cy += rowH + gap
          rowH = 0
        }
        targets.set(it.id, { x: cx, y: cy })
        cx += it.w + gap
        rowH = Math.max(rowH, it.h)
      }
    } else {
      let cx = pad
      let cy = pad
      let colW = 0
      for (const it of items.current) {
        if (cy + it.h > h - pad && cy > pad) {
          cy = pad
          cx += colW + gap
          colW = 0
        }
        targets.set(it.id, { x: cx, y: cy })
        cy += it.h + gap
        colW = Math.max(colW, it.w)
      }
    }
    layoutMs.current = layoutMs.current * 0.9 + (performance.now() - t0) * 0.1

    // --- animation pass: springs carry every box to its slot ---
    const K = 170
    const D = 21
    for (const it of items.current) {
      const tgt = targets.get(it.id)!
      if (reduced) {
        it.x = tgt.x
        it.y = tgt.y
      } else {
        it.vx += ((tgt.x - it.x) * K - it.vx * D) * dt
        it.vy += ((tgt.y - it.y) * K - it.vy * D) * dt
        it.x += it.vx * dt
        it.y += it.vy * dt
      }
    }

    // container
    ctx.strokeStyle = C.line
    ctx.setLineDash([5, 5])
    ctx.strokeRect(pad - 10.5, pad - 10.5, w - (pad - 10) * 2, h - (pad - 10) * 2)
    ctx.setLineDash([])

    // items
    items.current.forEach((it, i) => {
      const accent = ACCENTS[i % 3]
      const moving = Math.hypot(it.vx, it.vy) > 18
      ctx.beginPath()
      ctx.roundRect(it.x, it.y, it.w, it.h, 8)
      ctx.fillStyle = moving ? 'rgba(255,148,46,0.14)' : 'rgba(233,238,247,0.045)'
      ctx.fill()
      ctx.strokeStyle = accent
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = C.mute
      ctx.font = '10px JetBrains Mono, monospace'
      ctx.fillText(`#${i}`, it.x + 8, it.y + 16)
    })

    ctx.fillStyle = C.dim
    ctx.font = '10px JetBrains Mono, monospace'
    ctx.fillText(
      `${items.current.length} nodes · ${direction}-wrap · gap ${gap}px · layout pass: ${layoutMs.current.toFixed(3)}ms`,
      10,
      h - 10,
    )
  })

  const add = () => {
    if (items.current.length >= 24) return
    items.current.push(makeItem())
    setCount(items.current.length)
  }
  const remove = () => {
    if (items.current.length <= 2) return
    items.current.pop()
    setCount(items.current.length)
  }
  const shuffle = () => {
    for (const it of items.current) {
      it.w = 46 + Math.round(Math.random() * 15) * 6
      it.h = 34 + Math.round(Math.random() * 8) * 6
    }
  }

  return (
    <div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Mini auto-layout engine: boxes animate into a flow layout as you add or remove them and adjust gap and direction"
          className="h-80 w-full touch-none rounded-lg border border-white/10 bg-ink sm:h-96"
        />
        <FpsMeter fpsRef={fpsRef} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Flow direction" className="flex overflow-hidden rounded-lg border border-white/12">
          {(['row', 'column'] as Direction[]).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={direction === d}
              onClick={() => setDirection(d)}
              className={`px-3.5 py-2 font-mono text-xs transition-colors ${
                direction === d ? 'bg-ember text-ink' : 'text-mute hover:bg-white/5 hover:text-fg'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button type="button" className="chip inline-flex items-center gap-1.5" onClick={add} aria-label="Add a box">
          <PlusIcon size={13} /> node <span className="text-dim">({count})</span>
        </button>
        <button type="button" className="chip inline-flex items-center gap-1.5" onClick={remove} aria-label="Remove a box">
          <MinusIcon size={13} /> node
        </button>
        <button type="button" className="chip" onClick={shuffle}>
          shuffle sizes
        </button>
        <label className="flex items-center gap-2.5 pl-1 font-mono text-xs text-mute">
          gap
          <input
            type="range"
            min={4}
            max={28}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="w-28 accent-(--color-ember)"
          />
          <span className="w-8 text-dim">{gap}px</span>
        </label>
      </div>
    </div>
  )
}
