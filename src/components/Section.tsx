import type { ReactNode } from 'react'
import { Reveal } from '../lib/reveal'

type SectionProps = {
  id: string
  stage: string // e.g. "02 · GEOMETRY"
  title: string
  sub?: string
  children: ReactNode
  className?: string
}

/**
 * Every section is a stage in the render pipeline — numbered, labeled,
 * and consistent so the page reads as one continuous frame being drawn.
 */
export function Section({ id, stage, title, sub, children, className = '' }: SectionProps) {
  const [num] = stage.split(' ')
  return (
    <section id={id} className={`relative scroll-mt-24 ${className}`} aria-labelledby={`${id}-title`}>
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal as="header" className="mb-10 sm:mb-14">
          <p className="hud flex items-center gap-3">
            <span className="text-ember/80">{`STAGE ${stage}`}</span>
            <span aria-hidden="true" className="h-px flex-1 max-w-32 bg-linear-to-r from-ember/40 to-transparent" />
          </p>
          <h2
            id={`${id}-title`}
            className="mt-3 flex items-baseline gap-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            <span aria-hidden="true" className="outline-num hidden text-5xl font-bold sm:block sm:text-7xl">
              {num}
            </span>
            {title}
          </h2>
          {sub && <p className="mt-4 max-w-2xl text-base text-mute sm:text-lg">{sub}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
