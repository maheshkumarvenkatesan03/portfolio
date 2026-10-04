import '@fontsource-variable/space-grotesk'
import '@fontsource/jetbrains-mono'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// a note for the engineers who open the console
console.log(
  '%c▲ ● ■  mahesh.kv %c\n\nscene graph loaded · power level: over 9000 draw calls avoided\nbuilt from scratch — react + raw webgl2, no animation libraries.\nsource of truth: the resume. source of fun: the playground.',
  'color:#ff942e;font-size:16px;font-weight:bold;font-family:monospace',
  'color:#5ac8ff;font-family:monospace;font-size:12px',
)

// QA/e2e escape hatch: ?static renders everything revealed, no scroll choreography,
// and lands on the URL hash immediately (SPAs mount after the native hash jump)
if (new URLSearchParams(location.search).has('static')) {
  document.documentElement.classList.add('force-static')
  if (location.hash) {
    // after React's initial commit (rAF may be suspended in headless/hidden tabs)
    setTimeout(
      () => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant', block: 'start' }),
      120,
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
