import { about } from '../data/profile'
import { Reveal } from '../lib/reveal'
import { Section } from './Section'

/** The cross-platform architecture, drawn as the pipeline it is. */
function PipelineDiagram() {
  const { core, stages, targets } = about.pipeline
  return (
    <figure className="panel relative overflow-hidden p-6 sm:p-7" aria-label="Architecture: one shared C++ core rendering through Skia to four platforms">
      <div aria-hidden="true" className="dotgrid absolute inset-0 opacity-60" />
      <figcaption className="hud relative mb-6 text-ki/80">how a frame ships at Vani</figcaption>

      <div className="relative space-y-5">
        {/* core */}
        <div className="rounded-xl border border-ember/50 bg-ember/8 px-5 py-4 text-center shadow-[0_0_30px_-8px_rgb(255_148_46/0.35)]">
          <p className="font-semibold text-fg">{core}</p>
          <p className="mt-0.5 font-mono text-[11px] text-ember/80">write once · render everywhere</p>
        </div>

        <p aria-hidden="true" className="text-center font-mono text-dim">
          ↓
        </p>

        {/* machinery */}
        <div className="grid grid-cols-3 gap-2.5">
          {stages.map((s) => (
            <div key={s.label} className="rounded-lg border border-white/10 bg-ink-2/80 px-2 py-3 text-center">
              <p className="text-sm font-medium text-fg">{s.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-dim">{s.detail}</p>
            </div>
          ))}
        </div>

        <p aria-hidden="true" className="text-center font-mono text-dim">
          ↓
        </p>

        {/* targets */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {targets.map((t) => (
            <div
              key={t.label}
              className="group rounded-lg border border-ki/25 bg-ki/4 px-2 py-3 text-center transition-colors hover:border-ki/60"
            >
              <p className="text-sm font-medium text-fg">{t.label}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ki/70">{t.detail}</p>
            </div>
          ))}
        </div>

        <p className="pt-1 text-center font-mono text-[11px] text-dim">
          one change → four platforms → zero drift
        </p>
      </div>
    </figure>
  )
}

export function About() {
  return (
    <Section
      id="about"
      stage="02 · GEOMETRY"
      title="The shape of what I do"
      sub="Framework engineering for an infinite canvas — the parts users never see but always feel."
    >
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="space-y-5 text-pretty">
          <Reveal as="p" className="text-lg leading-relaxed text-fg sm:text-xl">
            {about.lede}
          </Reveal>
          {about.paragraphs.map((p, i) => (
            <Reveal as="p" key={i} delay={i * 90} className="leading-relaxed text-mute">
              {p}
            </Reveal>
          ))}
        </div>
        <Reveal delay={150} className="lg:sticky lg:top-24">
          <PipelineDiagram />
        </Reveal>
      </div>
    </Section>
  )
}
