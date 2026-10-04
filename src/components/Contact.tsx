import { useState } from 'react'
import { identity, interests } from '../data/profile'
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExternalIcon,
  FileIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MapPinIcon,
  PhoneIcon,
} from '../lib/icons'
import { Reveal } from '../lib/reveal'
import { Section } from './Section'

export function Contact() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(identity.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  }

  return (
    <Section
      id="contact"
      stage="08 · OUTPUT"
      title="Frame complete. Your move."
      sub="Hiring for rendering, graphics or framework work — or just want to talk shop about layout engines? My inbox is open."
    >
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* primary contact */}
        <Reveal className="panel flex flex-col justify-between gap-8 p-7 sm:p-9">
          <div>
            <p className="hud mb-4 text-ember/80">direct line</p>
            <a
              href={`mailto:${identity.email}`}
              className="link-sweep text-xl font-semibold break-all text-fg sm:text-2xl"
            >
              {identity.email}
            </a>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={copyEmail}
                className="chip inline-flex items-center gap-2"
                aria-live="polite"
              >
                {copied ? <CheckIcon size={13} className="text-green-400" /> : <CopyIcon size={13} />}
                {copied ? 'copied' : 'copy address'}
              </button>
              <a href={`tel:${identity.phone.replace(/\s/g, '')}`} className="chip inline-flex items-center gap-2">
                <PhoneIcon size={13} />
                {identity.phone}
              </a>
              <span className="chip inline-flex items-center gap-2">
                <MapPinIcon size={13} />
                {identity.location}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {identity.socials.map((s) => {
              const Icon = s.icon === 'github' ? GitHubIcon : s.icon === 'linkedin' ? LinkedInIcon : InstagramIcon
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center gap-2.5 rounded-lg border border-white/12 px-4 py-2.5 text-sm text-mute transition-colors hover:border-ki/50 hover:text-fg"
                >
                  <Icon size={16} />
                  {s.label}
                  <ExternalIcon size={12} className="text-dim transition-colors group-hover:text-ki" />
                </a>
              )
            })}
          </div>
        </Reveal>

        {/* resume */}
        <Reveal delay={120} className="panel flex flex-col border-ember/30 bg-ember/4 p-7 sm:p-9">
          <p className="hud mb-4 text-ember/80">for recruiters</p>
          <FileIcon size={26} className="text-ember" />
          <h3 className="mt-3 text-lg font-semibold text-fg">The one-page version</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-mute">
            Everything on this site, compressed to a PDF — experience, skills, education and the numbers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={identity.resumeFile}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ember-soft"
            >
              <ExternalIcon size={15} /> View
            </a>
            <a
              href={identity.resumeFile}
              download="MaheshKumarV-Resume.pdf"
              className="inline-flex items-center gap-2 rounded-lg border border-ember/50 px-5 py-2.5 text-sm font-medium text-ember transition-colors hover:bg-ember/10"
            >
              <DownloadIcon size={15} /> Download
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={180} className="mt-10">
        <p className="hud mb-3">when not rendering</p>
        <ul className="flex flex-wrap gap-2">
          {interests.map((i) => (
            <li key={i} className="chip">
              {i}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
