import { otherAchievements, recognitions } from '../data/profile'
import { SparkIcon } from '../lib/icons'
import { Reveal } from '../lib/reveal'
import { Section } from './Section'

export function Achievements() {
  return (
    <Section
      id="achievements"
      stage="06 · COMPOSITE"
      title="Recognition & impact"
      sub="Appreciation that came with names attached — from the people the work was for."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recognitions.map((r, i) => (
          <Reveal
            as="li"
            key={r.what}
            delay={i * 70}
            className={`panel panel-hover flex flex-col p-6 ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
          >
            <SparkIcon size={18} className="text-ember" />
            <h3 className="mt-3 font-semibold text-balance text-fg">{r.what}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{r.detail}</p>
            <p className="mt-4 font-mono text-[11px] tracking-wider text-ki/80 uppercase">— {r.from}</p>
          </Reveal>
        ))}
        {/* beyond the codebase */}
        <Reveal as="li" delay={350} className="panel flex flex-col border-ki/25 bg-ki/4 p-6">
          <p className="hud text-ki">beyond the codebase</p>
          <ul className="mt-3 flex-1 space-y-3">
            {otherAchievements.map((a) => (
              <li key={a.what} className="text-sm">
                <p className="font-medium text-fg">{a.what}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-mute">{a.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[11px] text-dim">
            // performance optimization isn’t only for code
          </p>
        </Reveal>
      </ul>
    </Section>
  )
}
