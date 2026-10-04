import { useEffect, useRef, useState } from 'react'
import { heroStats, identity } from '../data/profile'
import { createParticleField, type ParticleField } from '../gl/particles'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowDownIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../lib/icons'

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()
  const [glFailed, setGlFailed] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return

    let field: ParticleField | null = null
    try {
      field = createParticleField(canvas)
    } catch {
      field = null
    }
    if (!field) {
      setGlFailed(true)
      return
    }

    // stop rendering entirely while the hero is scrolled away
    const io = new IntersectionObserver(([entry]) => field.setPaused(!entry.isIntersecting), {
      threshold: 0.02,
    })
    io.observe(canvas)

    return () => {
      io.disconnect()
      field.destroy()
    }
  }, [reducedMotion])

  const staticFallback = reducedMotion || glFailed

  return (
    <section id="home" aria-label="Introduction" className="relative flex min-h-svh flex-col">
      {/* particle field / static fallback */}
      {staticFallback ? (
        <div aria-hidden="true" className="dotgrid absolute inset-0" />
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full touch-none"
        />
      )}
      {/* readability vignette + energy glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 40% at 42% 46%, rgb(7 9 15 / 0.55) 0%, rgb(7 9 15 / 0.22) 55%, transparent 100%), radial-gradient(34% 30% at 82% 10%, rgb(90 200 255 / 0.07), transparent), radial-gradient(40% 34% at 12% 88%, rgb(255 148 46 / 0.08), transparent)',
        }}
      />

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pt-24 pb-10 sm:px-8">
        <p className="hud mb-6 opacity-0 animate-[fade-up_0.8s_0.1s_ease_forwards]">
          STAGE 01 · SCENE <span className="text-dim/70">— initializing frame</span>
        </p>

        <div className="pointer-events-auto inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-ink-2/70 py-1.5 pr-4 pl-3 backdrop-blur-sm opacity-0 animate-[fade-up_0.8s_0.25s_ease_forwards]">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse-dot" aria-hidden="true" />
          <span className="font-mono text-xs text-mute">
            {identity.title} @ {identity.company} · {identity.product} framework
          </span>
        </div>

        <h1 className="mt-6 text-5xl font-bold tracking-tight text-balance opacity-0 animate-[fade-up_0.8s_0.4s_ease_forwards] sm:text-7xl lg:text-8xl">
          Mahesh Kumar<span className="text-ember">.</span>
        </h1>

        <p className="mt-4 bg-linear-to-r from-ember to-ki bg-clip-text text-xl font-semibold text-transparent opacity-0 animate-[fade-up_0.8s_0.55s_ease_forwards] sm:text-2xl">
          Software Engineer — 2D Rendering &amp; Graphics
        </p>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-mute opacity-0 animate-[fade-up_0.8s_0.7s_ease_forwards] sm:text-lg">
          {identity.tagline}
        </p>

        <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4 opacity-0 animate-[fade-up_0.8s_0.85s_ease_forwards]">
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-lg bg-ember px-6 py-3 font-semibold text-ink transition-[background-color,transform] hover:bg-ember-soft active:scale-[0.98]"
          >
            Explore the work
            <ArrowDownIcon size={17} className="transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href={identity.resumeFile}
            target="_blank"
            rel="noopener"
            className="rounded-lg border border-white/15 px-6 py-3 font-medium text-fg transition-colors hover:border-ki/60 hover:text-ki"
          >
            View resume
          </a>
          <div className="flex items-center gap-1">
            <a
              href={identity.socials[0].href}
              target="_blank"
              rel="noopener"
              aria-label="GitHub profile"
              className="rounded-md p-2.5 text-mute transition-colors hover:text-fg"
            >
              <GitHubIcon size={20} />
            </a>
            <a
              href={identity.socials[1].href}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn profile"
              className="rounded-md p-2.5 text-mute transition-colors hover:text-fg"
            >
              <LinkedInIcon size={20} />
            </a>
            <a
              href={`mailto:${identity.email}`}
              aria-label="Send an email"
              className="rounded-md p-2.5 text-mute transition-colors hover:text-fg"
            >
              <MailIcon size={20} />
            </a>
          </div>
        </div>

        {!staticFallback && (
          <p className="hud mt-10 opacity-0 animate-[fade-up_0.8s_1.4s_ease_forwards]" aria-hidden="true">
            <span className="text-ember/70">⟡</span> press &amp; hold anywhere — charge the field
          </p>
        )}
      </div>

      {/* stats strip */}
      <div className="relative z-10 border-t border-white/8 bg-ink/60 backdrop-blur-sm">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 sm:px-8 md:grid-cols-4">
          {heroStats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col opacity-0 animate-[fade-up_0.7s_ease_forwards]"
              style={{ animationDelay: `${1 + i * 0.12}s` }}
            >
              <dt className="order-2 font-mono text-[11px] tracking-wider text-dim uppercase">{s.label}</dt>
              <dd className="text-2xl font-bold text-fg sm:text-3xl">
                {s.value.replace(/[+×]/g, '')}
                <span className="text-ember">{s.value.match(/[+×]/)?.[0] ?? ''}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
