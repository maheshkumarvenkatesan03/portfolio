const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
        <p className="font-mono text-xs text-dim">
          © {YEAR} Mahesh Kumar V · frame rendered in{' '}
          <span className="text-mute">your browser</span>
        </p>
        <p className="font-mono text-[11px] text-dim">
          designed &amp; built from scratch — react · typescript · raw webgl2 · zero animation libraries
        </p>
      </div>
    </footer>
  )
}
