import { arsenal } from '../data/profile'
import { Reveal } from '../lib/reveal'
import { Section } from './Section'

export function Arsenal() {
  return (
    <Section
      id="arsenal"
      stage="04 · RASTERIZE"
      title="Technical arsenal"
      sub="Not a logo wall — what each tool is actually for in my hands."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {arsenal.map((group, gi) => (
          <Reveal key={group.name} delay={gi * 90} className="panel panel-hover flex flex-col p-6 sm:p-7">
            <div className="mb-5 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold text-fg">{group.name}</h3>
              <span className="hud text-ki/70">{group.stage}</span>
            </div>
            <ul className="flex-1 divide-y divide-white/6">
              {group.skills.map((s) => (
                <li key={s.name} className="group/skill flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="relative shrink-0 font-medium text-fg sm:w-44">
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 -left-3 hidden h-4 w-0.5 -translate-y-1/2 rounded bg-ember opacity-0 transition-opacity group-hover/skill:opacity-100 sm:block"
                    />
                    {s.name}
                  </span>
                  <span className="font-mono text-xs leading-relaxed text-dim transition-colors group-hover/skill:text-mute">
                    {s.note}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[11px] text-dim/80">// {group.blurb}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
