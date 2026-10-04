/**
 * Hero particle field — raw WebGL2, no three.js.
 *
 * The simulation is stateless and lives entirely in the vertex shader:
 * each particle derives its position from (home, seed, time, pointer),
 * so the CPU does no per-frame work beyond updating a handful of uniforms.
 *
 * Interactions:
 *  - pointer move   → particles are pushed aside
 *  - press & hold   → "charge": particles spiral inward and ignite
 *  - release        → outward energy burst
 */

const VERT = /* glsl */ `#version 300 es
precision highp float;

in vec2 a_home;   // CSS-pixel space
in float a_seed;  // 0..1

uniform vec2  u_res;      // CSS pixels
uniform float u_time;     // seconds
uniform float u_intro;    // 0..1 assemble-from-chaos
uniform vec2  u_mouse;    // CSS pixels (smoothed)
uniform float u_pointer;  // 0..1 pointer presence
uniform float u_charge;   // 0..1 press & hold
uniform float u_burst;    // decaying release impulse
uniform float u_dpr;

out float v_glow;
out float v_seed;
out float v_charge;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  float t = u_time;

  // layered sine drift — cheap pseudo-curl noise
  vec2 p = a_home;
  float s = a_seed * 6.28318;
  vec2 drift = vec2(
    sin(p.y * 0.012 + t * 0.70 + s) + 0.6 * cos(p.x * 0.007 - t * 0.43 + s * 2.0),
    cos(p.x * 0.011 - t * 0.56 + s) + 0.6 * sin(p.y * 0.008 + t * 0.37 + s * 3.0)
  ) * 7.0;
  p += drift;

  // pointer field
  vec2 toP = p - u_mouse;
  float d = max(length(toP), 0.001);
  vec2 dir = toP / d;
  float radius = 190.0 + 130.0 * u_charge;
  float fall = smoothstep(radius, 0.0, d);

  vec2 repel   = dir * fall * 36.0;
  vec2 tangent = vec2(-dir.y, dir.x);
  vec2 vortex  = (dir * -0.55 + tangent * 0.85) * fall * (40.0 + 110.0 * u_charge);
  p += mix(repel, vortex, u_charge) * u_pointer;
  p += dir * fall * u_burst * 150.0;

  // intro: assemble from scatter
  vec2 scatter = vec2(hash(a_seed * 7.13), hash(a_seed * 3.77)) * u_res;
  p = mix(scatter, p, u_intro);

  vec2 clip = (p / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);

  float twinkle = 0.5 + 0.5 * sin(t * (1.5 + hash(a_seed * 9.1) * 2.0) + s * 7.0);
  v_glow = fall * u_pointer * (0.75 + 0.25 * u_charge) + u_burst * fall;
  v_seed = a_seed;
  v_charge = u_charge;
  gl_PointSize = (1.4 + 1.7 * hash(a_seed * 5.31) + twinkle * 0.5 + v_glow * 3.2) * u_dpr;
}
`

const FRAG = /* glsl */ `#version 300 es
precision mediump float;

in float v_glow;
in float v_seed;
in float v_charge;
out vec4 outColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  float disc = smoothstep(0.5, 0.12, r);
  if (disc < 0.01) discard;

  vec3 slate = vec3(0.42, 0.50, 0.62);
  vec3 ember = vec3(1.00, 0.58, 0.18);
  vec3 ki    = vec3(0.35, 0.78, 1.00);

  float pick = fract(v_seed * 7.1317);
  vec3 col = slate;
  if (pick > 0.89)      col = ember;
  else if (pick > 0.80) col = ki;

  // hover halo is ki-blue; charging ignites it to ember
  vec3 glowCol = mix(ki, ember, v_charge);
  col = mix(col, glowCol, clamp(v_glow, 0.0, 1.0) * 0.95);
  float alpha = disc * (0.42 + 0.58 * clamp(v_glow, 0.0, 1.0));
  outColor = vec4(col * alpha, alpha); // premultiplied, additive-friendly
}
`

export type ParticleField = {
  destroy: () => void
  setPaused: (paused: boolean) => void
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[particles] shader error:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function createParticleField(canvas: HTMLCanvasElement): ParticleField | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null

  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('[particles] link error:', gl.getProgramInfoLog(prog))
    return null
  }
  gl.useProgram(prog)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // premultiplied alpha

  const u = {
    res: gl.getUniformLocation(prog, 'u_res'),
    time: gl.getUniformLocation(prog, 'u_time'),
    intro: gl.getUniformLocation(prog, 'u_intro'),
    mouse: gl.getUniformLocation(prog, 'u_mouse'),
    pointer: gl.getUniformLocation(prog, 'u_pointer'),
    charge: gl.getUniformLocation(prog, 'u_charge'),
    burst: gl.getUniformLocation(prog, 'u_burst'),
    dpr: gl.getUniformLocation(prog, 'u_dpr'),
  }

  const vao = gl.createVertexArray()
  const buf = gl.createBuffer()
  let count = 0

  // quality tier: fewer particles on small screens / low-end hardware
  const nav = navigator as Navigator & { deviceMemory?: number }
  const lowEnd =
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
    (navigator.hardwareConcurrency ?? 8) <= 4
  const density = lowEnd ? 1 / 220 : 1 / 110 // particles per CSS px²
  const dpr = Math.min(window.devicePixelRatio || 1, lowEnd ? 1.5 : 2)

  let width = 0
  let height = 0

  function rebuild() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w === 0 || h === 0) return
    width = w
    height = h
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    gl!.viewport(0, 0, canvas.width, canvas.height)

    count = Math.max(1500, Math.min(16000, Math.round(w * h * density)))
    const data = new Float32Array(count * 3)
    // jittered grid homes — even coverage without visible rows
    const cols = Math.ceil(Math.sqrt((count * w) / h))
    const rows = Math.ceil(count / cols)
    const cw = w / cols
    const ch = h / rows
    for (let i = 0; i < count; i++) {
      const cx = (i % cols) * cw
      const cy = Math.floor(i / cols) * ch
      data[i * 3] = cx + Math.random() * cw
      data[i * 3 + 1] = cy + Math.random() * ch
      data[i * 3 + 2] = Math.random()
    }
    gl!.bindVertexArray(vao)
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buf)
    gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW)
    gl!.enableVertexAttribArray(0)
    gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 12, 0)
    gl!.enableVertexAttribArray(1)
    gl!.vertexAttribPointer(1, 1, gl!.FLOAT, false, 12, 8)
  }

  // ---- interaction state ----
  const start = performance.now()
  let mouseX = -9999
  let mouseY = -9999
  let targetX = -9999
  let targetY = -9999
  let pointer = 0 // eased presence
  let pointerTarget = 0
  let charge = 0
  let chargeTarget = 0
  let burst = 0
  let paused = false
  let destroyed = false
  let raf = 0

  function onMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    targetX = e.clientX - rect.left
    targetY = e.clientY - rect.top
    pointerTarget = targetX >= 0 && targetY >= 0 && targetY <= rect.height ? 1 : 0
  }
  function onDown(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    if (e.clientY < rect.top || e.clientY > rect.bottom) return
    targetX = e.clientX - rect.left
    targetY = e.clientY - rect.top
    pointerTarget = 1
    chargeTarget = 1
  }
  function onUp() {
    if (chargeTarget === 1 && charge > 0.25) burst = Math.min(1, 0.4 + charge)
    chargeTarget = 0
  }
  function onLeave() {
    pointerTarget = 0
    chargeTarget = 0
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointercancel', onUp, { passive: true })
  document.addEventListener('pointerleave', onLeave)

  const ro = new ResizeObserver(() => rebuild())
  ro.observe(canvas)
  rebuild()

  let lastFrame = performance.now()

  function frame(now: number) {
    if (destroyed) return
    raf = requestAnimationFrame(frame)
    if (paused || count === 0) {
      lastFrame = now
      return
    }
    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000))
    lastFrame = now

    // ease interaction state toward targets — dt-based, frame-rate independent
    const ease = (k: number) => 1 - Math.exp(-dt * k)
    if (mouseX < -999) {
      mouseX = targetX
      mouseY = targetY
    }
    mouseX += (targetX - mouseX) * ease(8)
    mouseY += (targetY - mouseY) * ease(8)
    pointer += (pointerTarget - pointer) * ease(5)
    charge += (chargeTarget - charge) * ease(chargeTarget > charge ? 1.6 : 6)
    burst *= Math.exp(-dt * 5)

    const t = (now - start) / 1000
    const intro = Math.min(1, t / 1.6)
    const eased = 1 - Math.pow(1 - intro, 3)

    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__pf = {
        t: t.toFixed(2),
        pointer: pointer.toFixed(2),
        charge: charge.toFixed(2),
        mouse: [Math.round(mouseX), Math.round(mouseY)],
        target: [Math.round(targetX), Math.round(targetY)],
        count,
        size: [width, height],
        // QA hook: jump interaction state instantly (visual testing in environments
        // where rAF only runs on forced frames)
        force(x: number, y: number, p: number, c: number, b = 0) {
          targetX = mouseX = x
          targetY = mouseY = y
          pointerTarget = pointer = p
          chargeTarget = charge = c
          burst = b
        },
      }
    }

    gl!.clearColor(0, 0, 0, 0)
    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.useProgram(prog)
    gl!.bindVertexArray(vao)
    gl!.uniform2f(u.res, width, height)
    gl!.uniform1f(u.time, t)
    gl!.uniform1f(u.intro, eased)
    gl!.uniform2f(u.mouse, mouseX, mouseY)
    gl!.uniform1f(u.pointer, pointer)
    gl!.uniform1f(u.charge, charge)
    gl!.uniform1f(u.burst, burst)
    gl!.uniform1f(u.dpr, dpr)
    gl!.drawArrays(gl!.POINTS, 0, count)
  }
  raf = requestAnimationFrame(frame)

  function onVisibility() {
    paused = document.hidden
  }
  document.addEventListener('visibilitychange', onVisibility)

  return {
    setPaused(p: boolean) {
      paused = p || document.hidden
    },
    destroy() {
      destroyed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      gl!.deleteBuffer(buf)
      gl!.deleteVertexArray(vao)
      gl!.deleteProgram(prog)
    },
  }
}
