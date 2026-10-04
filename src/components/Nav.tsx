import { useEffect, useRef, useState } from 'react'
import { identity } from '../data/profile'
import { CloseIcon, MenuIcon } from '../lib/icons'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#arsenal', label: 'Arsenal' },
  { href: '#work', label: 'Work' },
  { href: '#playground', label: 'Playground' },
  { href: '#contact', label: 'Contact' },
] as const

/** Primitive-shapes mark: triangle / circle / square — the atoms of 2D rendering. */
function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M8 3.5 14.5 15h-13L8 3.5Z" stroke="var(--color-ember)" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="18" cy="10" r="5.4" stroke="var(--color-ki)" strokeWidth="1.8" />
      <rect x="9.5" y="14.5" width="9" height="9" rx="1.5" stroke="#e9eef7" strokeWidth="1.8" />
    </svg>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const ticking = useRef(false)

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const doc = document.documentElement
        const max = doc.scrollHeight - doc.clientHeight
        setProgress(max > 0 ? window.scrollY / max : 0)
        setScrolled(window.scrollY > 24)
        ticking.current = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // track which section is in view for the active link
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null,
    )
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-100 -translate-y-20 rounded-md bg-ember px-4 py-2 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || open
            ? 'border-b border-white/8 bg-ink/80 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        {/* frame-render progress */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 origin-left bg-linear-to-r from-ember to-ki"
          style={{ transform: `scaleX(${progress})` }}
        />
        <nav aria-label="Primary" className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#home" className="flex items-center gap-2.5 font-mono text-sm text-fg" onClick={() => setOpen(false)}>
            <Mark />
            <span>
              mahesh<span className="text-ember">.</span>kv
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? 'true' : undefined}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active === l.href ? 'text-ember' : 'text-mute hover:text-fg'
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href={identity.resumeFile}
              target="_blank"
              rel="noopener"
              className="ml-3 rounded-lg border border-ember/50 px-4 py-2 text-sm font-medium text-ember transition-colors hover:bg-ember hover:text-ink"
            >
              Resume
            </a>
          </div>

          <button
            type="button"
            className="rounded-md p-2 text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </nav>
      </header>

      {/* mobile overlay menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-lg transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-2">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 py-2 text-3xl font-semibold tracking-tight text-fg"
                >
                  <span className="font-mono text-xs text-ember">0{i + 1}</span>
                  <span className="transition-colors group-hover:text-ember">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={identity.resumeFile}
            target="_blank"
            rel="noopener"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="mt-8 inline-block rounded-lg border border-ember/60 px-6 py-3 font-medium text-ember"
          >
            View Resume
          </a>
        </nav>
      </div>
    </>
  )
}
