import { caseStudies, sideQuests } from '../data/profile'
import { Reveal } from '../lib/reveal'
import { Section } from './Section'

const BLOCKS = [
  { key: 'problem', label: 'The problem', accent: 'text-ki' },
  { key: 'built', label: 'What I built', accent: 'text-ember' },
  { key: 'impact', label: 'Impact', accent: 'text-green-400' },
] as const

export function Work() {
  return (
    <Section
      id="work"
      stage="05 · SHADE"
      title="Engineering work"
      sub="Problems, what got built, and what it changed — the way engineers actually talk about work."
    >
      <div className="space-y-6">
        {caseStudies.map((cs, i) => (
          <Reveal key={cs.id} as="article" className="panel panel-hover relative overflow-hidden p-6 sm:p-9">
            <span
              aria-hidden="true"
              className="outline-num pointer-events-none absolute -top-4 right-4 text-[7rem] font-bold select-none sm:text-[9rem]"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="relative">
              <p className="hud text-ember/80">
                case {String(i + 1).padStart(2, '0')} · {cs.kicker}
              </p>
              <h3 className="mt-2 max-w-xl text-xl font-semibold text-balance text-fg sm:text-2xl">{cs.title}</h3>

              <div className="mt-7 grid gap-6 md:grid-cols-3 md:gap-8">
                {BLOCKS.map((b) => (
                  <div key={b.key}>
                    <h4 className={`font-mono text-[11px] tracking-[0.18em] uppercase ${b.accent}`}>{b.label}</h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-mute">{cs[b.key]}</p>
                  </div>
                ))}
              </div>

              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Technologies">
                {cs.tech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* personal projects */}
      <div className="mt-16">
        <Reveal>
          <p className="hud text-ki/80">side quests · personal builds</p>
          <h3 className="mt-2 text-xl font-semibold text-fg sm:text-2xl">Built after hours</h3>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sideQuests.map((q, i) => (
            <Reveal key={q.title} delay={i * 70} className="panel panel-hover flex flex-col p-5">
              <h4 className="font-semibold text-fg">{q.title}</h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">{q.detail}</p>
              <p className="mt-4 font-mono text-[11px] text-dim">{q.tech.join(' · ')}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
