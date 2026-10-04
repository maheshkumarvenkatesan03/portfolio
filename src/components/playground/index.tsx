import { lazy, Suspense, useRef, useState } from 'react'
import { Reveal } from '../../lib/reveal'
import { Section } from '../Section'

const Rasterizer = lazy(() => import('./Rasterizer').then((m) => ({ default: m.Rasterizer })))
const Bezier = lazy(() => import('./Bezier').then((m) => ({ default: m.Bezier })))
const LayoutLab = lazy(() => import('./LayoutLab').then((m) => ({ default: m.LayoutLab })))

const DEMOS = [
  {
    id: 'rasterizer',
    label: 'Rasterizer',
    blurb:
      'How a triangle becomes pixels — the first job of every renderer. A scanline sweeps the buffer; coverage mode shows 4× supersampled antialiasing.',
    component: Rasterizer,
  },
  {
    id: 'bezier',
    label: 'Bézier curves',
    blurb:
      'De Casteljau’s algorithm, live. This construction sits inside Skia and every vector engine — each curved path you’ve ever seen is repeated lerps.',
    component: Bezier,
  },
  {
    id: 'layout',
    label: 'Layout engine',
    blurb:
      'A tiny cousin of the Auto-Layout engine I built for Vani: a layout pass computes targets every frame, springs carry each node to its slot.',
    component: LayoutLab,
  },
] as const

function Skeleton() {
  return (
    <div className="flex h-80 w-full animate-pulse items-center justify-center rounded-lg border border-white/10 bg-ink sm:h-96">
      <p className="font-mono text-xs text-dim">compiling demo…</p>
    </div>
  )
}

export function Playground() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: React.KeyboardEvent) {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (active + dir + DEMOS.length) % DEMOS.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const demo = DEMOS[active]
  const Active = demo.component

  return (
    <Section
      id="playground"
      stage="07 · PRESENT"
      title="Rendering playground"
      sub="Hand-written canvas demos — no libraries, just the math my day job is made of. Poke them."
    >
      <Reveal className="panel overflow-hidden">
        {/* editor-chrome header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-3">
          <div role="tablist" aria-label="Playground demos" onKeyDown={onKeyDown} className="flex flex-wrap gap-1">
            {DEMOS.map((d, i) => (
              <button
                key={d.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`tab-${d.id}`}
                aria-selected={active === i}
                aria-controls={`panel-${d.id}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                className={`rounded-md px-3.5 py-2 font-mono text-xs transition-colors ${
                  active === i ? 'bg-white/8 text-ember' : 'text-mute hover:text-fg'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p aria-hidden="true" className="hidden font-mono text-[10px] text-dim lg:block">
            canvas2d · 0 dependencies
          </p>
        </div>

        <div id={`panel-${demo.id}`} role="tabpanel" aria-labelledby={`tab-${demo.id}`} className="p-5 sm:p-6">
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-mute">{demo.blurb}</p>
          <Suspense fallback={<Skeleton />}>
            <Active />
          </Suspense>
        </div>
      </Reveal>
    </Section>
  )
}
