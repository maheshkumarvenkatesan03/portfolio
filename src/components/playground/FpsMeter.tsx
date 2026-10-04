import { useEffect, useState, type RefObject } from 'react'

/** Small frame-time readout — rendering engineers check this first. */
export function FpsMeter({ fpsRef }: { fpsRef: RefObject<number> }) {
  const [fps, setFps] = useState(60)

  useEffect(() => {
    const id = window.setInterval(() => setFps(Math.round(fpsRef.current)), 300)
    return () => window.clearInterval(id)
  }, [fpsRef])

  const ms = fps > 0 ? (1000 / fps).toFixed(1) : '—'
  return (
    <p className="pointer-events-none absolute top-3 right-3 rounded-md border border-white/10 bg-ink/70 px-2 py-1 font-mono text-[10px] text-dim backdrop-blur-sm">
      <span className={fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-ember' : 'text-red-400'}>
        {fps} fps
      </span>
      <span aria-hidden="true"> · {ms}ms</span>
    </p>
  )
}
