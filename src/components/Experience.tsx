import { education, experience } from '../data/profile'
import { Reveal } from '../lib/reveal'
import { Section } from './Section'

export function Experience() {
  const job = experience[0]
  return (
    <Section
      id="experience"
      stage="03 · TRANSFORM"
      title="Where the work happens"
      sub="A framework team is a force multiplier: everything we build, every feature team builds on."
    >
      <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
        {/* role meta */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <div className="panel p-6">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse-dot" aria-hidden="true" />
              <p className="font-mono text-xs tracking-wider text-green-400/90 uppercase">Current</p>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-fg">{job.role}</h3>
            <p className="mt-1 text-mute">{job.company}</p>
            <p className="font-mono text-xs text-ki/80">{job.team}</p>
            <p className="mt-3 font-mono text-xs text-dim">{job.period}</p>
            <p className="mt-4 text-sm leading-relaxed text-mute">{job.summary}</p>
          </div>

          <div className="panel mt-4 p-6">
            <p className="hud mb-2">education</p>
            <h3 className="font-semibold text-fg">{education.degree}</h3>
            <p className="mt-1 text-sm text-mute">{education.school}</p>
            <p className="font-mono text-xs text-dim">{education.period}</p>
            <p className="mt-3 inline-block rounded-md border border-ember/35 bg-ember/8 px-2.5 py-1 font-mono text-xs text-ember">
              {education.gpa}
            </p>
          </div>
        </Reveal>

        {/* highlight timeline */}
        <ol className="relative space-y-3 before:absolute before:top-3 before:bottom-3 before:left-[7px] before:w-px before:bg-linear-to-b before:from-ember/60 before:via-white/15 before:to-ki/40">
          {job.highlights.map((h, i) => (
            <Reveal as="li" key={h.title} delay={i * 80} className="relative pl-9">
              <span
                aria-hidden="true"
                className="absolute top-6 left-0 h-[15px] w-[15px] rounded-full border-2 border-ember bg-ink"
              />
              <div className="panel panel-hover p-5 sm:p-6">
                <h4 className="font-semibold text-fg">{h.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-mute">{h.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
