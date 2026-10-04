import { createElement, useEffect, useRef, type ElementType, type ReactNode } from 'react'

/** Shared IntersectionObserver — one instance for every revealed element. */
let observer: IntersectionObserver | null = null

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
  }
  return observer
}

type RevealProps = {
  as?: ElementType
  delay?: number
  className?: string
  children?: ReactNode
  id?: string
}

/** Wrapper that fades/slides its content in the first time it scrolls into view. */
export function Reveal({ as = 'div', delay = 0, className, children, id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = getObserver()
    io.observe(node)
    return () => io.unobserve(node)
  }, [])

  return createElement(
    as,
    {
      ref,
      id,
      className,
      'data-reveal': '',
      style: delay ? { '--reveal-delay': `${delay}ms` } : undefined,
    },
    children,
  )
}
