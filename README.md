# mahesh.kv — portfolio

Personal portfolio of **Mahesh Kumar V** — Software Engineer, 2D Rendering & Graphics
(Framework team, Zoho Vani).

**The concept:** the site is structured as a render pipeline. Each section is a stage —
`SCENE → GEOMETRY → TRANSFORM → RASTERIZE → SHADE → COMPOSITE → PRESENT → OUTPUT` —
because that's the domain I work in all day.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** for styling
- **Raw WebGL2** for the hero particle field — hand-written shaders, no three.js.
  The simulation is stateless and runs entirely in the vertex shader.
- **Canvas2D** for the three playground demos (scanline rasterizer, de Casteljau
  Bézier editor, mini auto-layout engine) — no libraries
- **Zero animation libraries** — scroll reveals are one shared `IntersectionObserver`
  plus CSS transitions

## Performance notes

- ~85 KB gzipped JS total (React included); playground demos are lazy-loaded chunks
- Particle count adapts to viewport area and device (`deviceMemory` / core count),
  DPR capped at 2
- Every render loop pauses when offscreen (`IntersectionObserver`) or when the tab
  is hidden (`visibilitychange`)
- `prefers-reduced-motion` disables the particle field, scroll choreography and
  demo auto-animation
- Self-hosted fonts (Fontsource woff2), no external requests

## Develop

```bash
npm install
npm run dev      # dev server on :5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

`?static` on any URL renders the page fully revealed (useful for e2e/screenshots).

## Content

All copy lives in [`src/data/profile.ts`](src/data/profile.ts) — one typed file,
sourced from the resume. The resume PDF itself is served from
[`public/MaheshKumarV-Resume.pdf`](public/MaheshKumarV-Resume.pdf).

## Deploy

Static output in `dist/` — deploys to Vercel with the default Vite preset,
no configuration needed.
