# Portfolio Site Stretch Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three additive polish features to the already-shipped portfolio site: a WebGL renderer for the existing particle background, procedural (file-free) UI sound with an opt-in toggle, and keyboard navigation for the menu.

**Architecture:** Each feature is a small, independently-testable module (`src/webgl/particleRenderer.ts`, `src/audio/uiSound.ts` + `src/composables/useMenuSound.ts`, `src/composables/useKeyboardNav.ts`) with pure logic extracted and unit-tested; browser-API glue (WebGL context, AudioContext, DOM focus) stays thin and is either left untested (matching the existing Worker precedent) or tested via jsdom where jsdom actually supports the API (focus management, localStorage). `MenuNav.vue` and `ParticleBackground.vue` are the only existing files modified — everything else is additive.

**Tech Stack:** Vue 3 (Composition API), TypeScript, raw WebGL (no library), Web Audio API (no audio files), Vitest, @vue/test-utils, jsdom.

## Global Constraints

- Reuse the existing, already-tested particle physics (`particleSim.ts`, `particles.worker.ts`, `useParticleWorker.ts`) unchanged — only `ParticleBackground.vue`'s rendering backend changes.
- If WebGL is unavailable, fall back to the existing Canvas2D path — do not delete it.
- No audio files of any kind — sound is procedurally generated via Web Audio API only.
- The sound toggle defaults to OFF and its state persists in `localStorage`.
- Keyboard navigation is arrow keys + native anchor Enter-activation only — no Gamepad API.
- No change to the mobile layout model (still the shipped stacked single-column behavior).
- No CD Projekt Red / third-party game assets — the shader visuals and sounds are original.

---

## File Structure

```
src/
├── webgl/
│   ├── particleRenderer.ts       (new — hexToRgbFloat + ParticleGLRenderer)
│   └── particleRenderer.spec.ts  (new)
├── audio/
│   ├── uiSound.ts                 (new — buildClickEnvelope, playHoverTick, playSelectChime)
│   └── uiSound.spec.ts            (new)
├── composables/
│   ├── useMenuSound.ts            (new — enabled/toggle/persistence + gated play functions)
│   ├── useMenuSound.spec.ts       (new)
│   ├── useKeyboardNav.ts          (new — nextIndex + focus-management composable)
│   └── useKeyboardNav.spec.ts     (new)
└── components/
    ├── ParticleBackground.vue     (modify — try WebGL, fall back to Canvas2D)
    ├── ParticleBackground.spec.ts (modify — add WebGL-path test)
    ├── MenuNav.vue                (modify — wire in keyboard nav + sound toggle/hooks)
    └── MenuNav.spec.ts            (modify — add sound-toggle tests)
```

---

### Task 1: WebGL particle renderer

**Files:**
- Create: `src/webgl/particleRenderer.ts`, `src/webgl/particleRenderer.spec.ts`
- Modify: `src/components/ParticleBackground.vue`, `src/components/ParticleBackground.spec.ts`

**Interfaces:**
- Produces: `hexToRgbFloat(hex: string): [number, number, number]`, `class ParticleGLRenderer { constructor(gl: WebGLRenderingContext, colorHex: string); draw(particles: { x: number; y: number; radius: number; opacity: number }[], width: number, height: number): void }`.
- Consumes: `Particle` shape from `../workers/particleSim` (already exists — only `x`, `y`, `radius`, `opacity` fields are used, so no import is strictly required, a structural type is enough).

- [ ] **Step 1: Write the failing test for `hexToRgbFloat`**

Create `src/webgl/particleRenderer.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { hexToRgbFloat } from './particleRenderer'

describe('hexToRgbFloat', () => {
  it('converts a hex color to normalized RGB floats', () => {
    const [r, g, b] = hexToRgbFloat('#c9a15a')
    expect(r).toBeCloseTo(201 / 255, 5)
    expect(g).toBeCloseTo(161 / 255, 5)
    expect(b).toBeCloseTo(90 / 255, 5)
  })

  it('handles pure black', () => {
    expect(hexToRgbFloat('#000000')).toEqual([0, 0, 0])
  })

  it('handles pure white', () => {
    const [r, g, b] = hexToRgbFloat('#ffffff')
    expect(r).toBeCloseTo(1, 5)
    expect(g).toBeCloseTo(1, 5)
    expect(b).toBeCloseTo(1, 5)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './particleRenderer'`

- [ ] **Step 3: Implement `src/webgl/particleRenderer.ts`**

```ts
export function hexToRgbFloat(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
attribute float aRadius;
attribute float aOpacity;
uniform vec2 uResolution;
varying float vOpacity;
void main() {
  vec2 clipSpace = (aPosition / uResolution) * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  gl_PointSize = aRadius * 2.0;
  vOpacity = aOpacity;
}
`

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 uColor;
varying float vOpacity;
void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;
  float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * vOpacity;
  gl_FragColor = vec4(uColor, alpha);
}
`

interface RenderableParticle {
  x: number
  y: number
  radius: number
  opacity: number
}

export class ParticleGLRenderer {
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private positionBuffer: WebGLBuffer
  private radiusBuffer: WebGLBuffer
  private opacityBuffer: WebGLBuffer
  private color: [number, number, number]

  constructor(gl: WebGLRenderingContext, colorHex: string) {
    this.gl = gl
    this.color = hexToRgbFloat(colorHex)
    this.program = this.compileProgram()
    this.positionBuffer = gl.createBuffer()!
    this.radiusBuffer = gl.createBuffer()!
    this.opacityBuffer = gl.createBuffer()!
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(`Shader compile error: ${info}`)
    }
    return shader
  }

  private compileProgram(): WebGLProgram {
    const gl = this.gl
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program)
      throw new Error(`Program link error: ${info}`)
    }
    return program
  }

  draw(particles: RenderableParticle[], width: number, height: number): void {
    const gl = this.gl
    gl.viewport(0, 0, width, height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.useProgram(this.program)

    const positions = new Float32Array(particles.length * 2)
    const radii = new Float32Array(particles.length)
    const opacities = new Float32Array(particles.length)
    particles.forEach((p, i) => {
      positions[i * 2] = p.x
      positions[i * 2 + 1] = p.y
      radii[i] = p.radius
      opacities[i] = p.opacity
    })

    const aPosition = gl.getAttribLocation(this.program, 'aPosition')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const aRadius = gl.getAttribLocation(this.program, 'aRadius')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.radiusBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, radii, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(aRadius)
    gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, 0, 0)

    const aOpacity = gl.getAttribLocation(this.program, 'aOpacity')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.opacityBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, opacities, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(aOpacity)
    gl.vertexAttribPointer(aOpacity, 1, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(this.program, 'uResolution')
    gl.uniform2f(uResolution, width, height)
    const uColor = gl.getUniformLocation(this.program, 'uColor')
    gl.uniform3f(uColor, this.color[0], this.color[1], this.color[2])

    gl.drawArrays(gl.POINTS, 0, particles.length)
  }
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS (the 3 `hexToRgbFloat` tests)

- [ ] **Step 5: Write the failing test for the WebGL-vs-fallback path in `ParticleBackground.vue`**

Read the current `src/components/ParticleBackground.spec.ts` first — it already has a mock for `useParticleWorker` and one test ("renders a canvas element"). Add a mock for the new renderer module and a new test, so the file becomes:

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('../composables/useParticleWorker', () => ({
  useParticleWorker: () => ({
    particles: ref([{ x: 10, y: 10, vx: 0, vy: 0, radius: 2, opacity: 0.5 }]),
  }),
}))

vi.mock('../webgl/particleRenderer', () => ({
  ParticleGLRenderer: vi.fn().mockImplementation(() => ({ draw: vi.fn() })),
}))

import ParticleBackground from './ParticleBackground.vue'
import { ParticleGLRenderer } from '../webgl/particleRenderer'

describe('ParticleBackground', () => {
  it('renders a canvas element', () => {
    const wrapper = mount(ParticleBackground)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('does not construct the WebGL renderer when no WebGL context is available (jsdom has none by default)', () => {
    vi.mocked(ParticleGLRenderer).mockClear()
    mount(ParticleBackground)
    expect(ParticleGLRenderer).not.toHaveBeenCalled()
  })

  it('constructs the WebGL renderer when a WebGL context is available', () => {
    vi.mocked(ParticleGLRenderer).mockClear()
    const fakeGl = {} as WebGLRenderingContext
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(((type: string) => (type === 'webgl' ? fakeGl : null)) as typeof HTMLCanvasElement.prototype.getContext)

    mount(ParticleBackground)

    expect(ParticleGLRenderer).toHaveBeenCalledWith(fakeGl, expect.any(String))
    getContextSpy.mockRestore()
  })
})
```

- [ ] **Step 6: Run to verify the new tests fail**

Run: `npm run test`
Expected: FAIL — `ParticleBackground.vue` doesn't reference `ParticleGLRenderer` yet, so the "constructs the WebGL renderer" test fails (never called); the "does not construct" test passes vacuously, which is fine, it becomes meaningful once Step 7 lands.

- [ ] **Step 7: Modify `src/components/ParticleBackground.vue`**

Replace the file's `<script setup>` block with:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useParticleWorker } from '../composables/useParticleWorker'
import { theme } from '../theme'
import { ParticleGLRenderer } from '../webgl/particleRenderer'

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

const { r, g, b } = hexToRgb(theme.colors.accentGold)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { particles } = useParticleWorker(
  typeof window !== 'undefined' ? window.innerWidth : 800,
  typeof window !== 'undefined' ? window.innerHeight : 600,
  50
)

let glRenderer: ParticleGLRenderer | null = null

function draw2d(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth
  if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const p of particles.value) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`
    ctx.fill()
  }
}

function drawGl(canvas: HTMLCanvasElement) {
  if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth
  if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight
  glRenderer!.draw(particles.value, canvas.width, canvas.height)
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return

  if (glRenderer) {
    drawGl(canvas)
  } else {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    draw2d(ctx, canvas)
  }

  requestAnimationFrame(draw)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    const gl = canvas.getContext('webgl')
    if (gl) {
      glRenderer = new ParticleGLRenderer(gl, theme.colors.accentGold)
    }
  }
  requestAnimationFrame(draw)
})
</script>
```

Leave the `<template>` and `<style scoped>` blocks unchanged.

- [ ] **Step 8: Run tests to verify pass**

Run: `npm run test`
Expected: PASS — all 3 `ParticleBackground.spec.ts` tests, plus the full suite.

- [ ] **Step 9: Run the build**

Run: `npm run build`
Expected: succeeds, no type errors.

- [ ] **Step 10: Commit**

```bash
git add src/webgl/ src/components/ParticleBackground.vue src/components/ParticleBackground.spec.ts
git commit -m "Add WebGL particle renderer with Canvas2D fallback"
```

---

### Task 2: Procedural UI sound + toggle composable

**Files:**
- Create: `src/audio/uiSound.ts`, `src/audio/uiSound.spec.ts`, `src/composables/useMenuSound.ts`, `src/composables/useMenuSound.spec.ts`

**Interfaces:**
- Produces: `buildClickEnvelope(peakGain: number, attack: number, decay: number): { time: number; gain: number }[]`, `playHoverTick(): void`, `playSelectChime(): void` (from `uiSound.ts`); `useMenuSound(): { enabled: Ref<boolean>; toggle: () => void; playHover: () => void; playSelect: () => void }` (from `useMenuSound.ts`).
- Not yet wired into any component — Task 4 does that.

- [ ] **Step 1: Write the failing test for `buildClickEnvelope`**

Create `src/audio/uiSound.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { buildClickEnvelope } from './uiSound'

describe('buildClickEnvelope', () => {
  it('starts silent, peaks at the attack time, and returns to silent after decay', () => {
    const envelope = buildClickEnvelope(0.1, 0.01, 0.05)
    expect(envelope).toEqual([
      { time: 0, gain: 0 },
      { time: 0.01, gain: 0.1 },
      { time: 0.06, gain: 0 },
    ])
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './uiSound'`

- [ ] **Step 3: Implement `src/audio/uiSound.ts`**

```ts
export interface EnvelopePoint {
  time: number
  gain: number
}

export function buildClickEnvelope(peakGain: number, attack: number, decay: number): EnvelopePoint[] {
  return [
    { time: 0, gain: 0 },
    { time: attack, gain: peakGain },
    { time: attack + decay, gain: 0 },
  ]
}

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

function playTone(frequency: number, peakGain: number, attack: number, decay: number): void {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  const now = ctx.currentTime
  const envelope = buildClickEnvelope(peakGain, attack, decay)
  gainNode.gain.setValueAtTime(envelope[0].gain, now + envelope[0].time)
  gainNode.gain.linearRampToValueAtTime(envelope[1].gain, now + envelope[1].time)
  gainNode.gain.linearRampToValueAtTime(envelope[2].gain, now + envelope[2].time)

  oscillator.start(now)
  oscillator.stop(now + envelope[2].time)
}

export function playHoverTick(): void {
  playTone(880, 0.05, 0.005, 0.04)
}

export function playSelectChime(): void {
  playTone(1320, 0.08, 0.005, 0.12)
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS. (`playHoverTick`/`playSelectChime` are not called by any test yet — they require a real `AudioContext`, unavailable in jsdom, so they stay untested glue per the project's established Worker precedent. Importing the module must not throw, which it won't, since `getAudioContext()` is only invoked lazily inside `playTone`.)

- [ ] **Step 5: Write the failing tests for `useMenuSound`**

Create `src/composables/useMenuSound.spec.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../audio/uiSound', () => ({
  playHoverTick: vi.fn(),
  playSelectChime: vi.fn(),
}))

import { useMenuSound } from './useMenuSound'
import { playHoverTick, playSelectChime } from '../audio/uiSound'

describe('useMenuSound', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('defaults to disabled when nothing is stored', () => {
    const { enabled } = useMenuSound()
    expect(enabled.value).toBe(false)
  })

  it('reads a previously stored enabled state', () => {
    localStorage.setItem('sound-enabled', 'true')
    const { enabled } = useMenuSound()
    expect(enabled.value).toBe(true)
  })

  it('toggle flips enabled and persists it', () => {
    const { enabled, toggle } = useMenuSound()
    toggle()
    expect(enabled.value).toBe(true)
    expect(localStorage.getItem('sound-enabled')).toBe('true')
  })

  it('playHover only calls the tone when enabled', () => {
    const { toggle, playHover } = useMenuSound()
    playHover()
    expect(playHoverTick).not.toHaveBeenCalled()
    toggle()
    playHover()
    expect(playHoverTick).toHaveBeenCalledTimes(1)
  })

  it('playSelect only calls the chime when enabled', () => {
    const { toggle, playSelect } = useMenuSound()
    playSelect()
    expect(playSelectChime).not.toHaveBeenCalled()
    toggle()
    playSelect()
    expect(playSelectChime).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 6: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './useMenuSound'`

- [ ] **Step 7: Implement `src/composables/useMenuSound.ts`**

```ts
import { ref, watch, type Ref } from 'vue'
import { playHoverTick, playSelectChime } from '../audio/uiSound'

const STORAGE_KEY = 'sound-enabled'

export function useMenuSound(): {
  enabled: Ref<boolean>
  toggle: () => void
  playHover: () => void
  playSelect: () => void
} {
  const stored = localStorage.getItem(STORAGE_KEY)
  const enabled = ref(stored === 'true')

  watch(enabled, (value) => {
    localStorage.setItem(STORAGE_KEY, String(value))
  })

  function toggle(): void {
    enabled.value = !enabled.value
  }

  function playHover(): void {
    if (enabled.value) playHoverTick()
  }

  function playSelect(): void {
    if (enabled.value) playSelectChime()
  }

  return { enabled, toggle, playHover, playSelect }
}
```

- [ ] **Step 8: Run tests to verify pass**

Run: `npm run test`
Expected: PASS — all 5 `useMenuSound` tests, plus the full suite.

- [ ] **Step 9: Run the build**

Run: `npm run build`
Expected: succeeds, no type errors.

- [ ] **Step 10: Commit**

```bash
git add src/audio/ src/composables/useMenuSound.ts src/composables/useMenuSound.spec.ts
git commit -m "Add procedural UI sound and opt-in toggle composable"
```

---

### Task 3: Keyboard navigation composable

**Files:**
- Create: `src/composables/useKeyboardNav.ts`, `src/composables/useKeyboardNav.spec.ts`

**Interfaces:**
- Produces: `nextIndex(current: number, direction: 1 | -1, length: number): number`, `useKeyboardNav(containerRef: Ref<HTMLElement | null>): void`.
- Not yet wired into `MenuNav.vue` — Task 4 does that.

- [ ] **Step 1: Write the failing tests for `nextIndex`**

Create `src/composables/useKeyboardNav.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { defineComponent, ref, h } from 'vue'
import { mount } from '@vue/test-utils'
import { nextIndex, useKeyboardNav } from './useKeyboardNav'

describe('nextIndex', () => {
  it('moves forward within bounds', () => {
    expect(nextIndex(1, 1, 5)).toBe(2)
  })

  it('wraps forward past the end', () => {
    expect(nextIndex(4, 1, 5)).toBe(0)
  })

  it('moves backward within bounds', () => {
    expect(nextIndex(2, -1, 5)).toBe(1)
  })

  it('wraps backward past the start', () => {
    expect(nextIndex(0, -1, 5)).toBe(4)
  })
})

const TestNav = defineComponent({
  setup() {
    const containerRef = ref<HTMLElement | null>(null)
    useKeyboardNav(containerRef)
    return { containerRef }
  },
  render() {
    return h('ul', { ref: 'containerRef' }, [
      h('li', [h('a', { href: '#a', id: 'link-a' }, 'A')]),
      h('li', [h('a', { href: '#b', id: 'link-b' }, 'B')]),
      h('li', [h('a', { href: '#c', id: 'link-c' }, 'C')]),
    ])
  },
})

describe('useKeyboardNav', () => {
  it('moves focus to the next link on ArrowDown', () => {
    const wrapper = mount(TestNav, { attachTo: document.body })
    const linkA = wrapper.find('#link-a').element as HTMLElement
    const linkB = wrapper.find('#link-b').element as HTMLElement
    linkA.focus()
    expect(document.activeElement).toBe(linkA)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))

    expect(document.activeElement).toBe(linkB)
    wrapper.unmount()
  })

  it('wraps to the first link when ArrowDown is pressed on the last link', () => {
    const wrapper = mount(TestNav, { attachTo: document.body })
    const linkA = wrapper.find('#link-a').element as HTMLElement
    const linkC = wrapper.find('#link-c').element as HTMLElement
    linkC.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))

    expect(document.activeElement).toBe(linkA)
    wrapper.unmount()
  })

  it('moves focus to the previous link on ArrowUp', () => {
    const wrapper = mount(TestNav, { attachTo: document.body })
    const linkA = wrapper.find('#link-a').element as HTMLElement
    const linkB = wrapper.find('#link-b').element as HTMLElement
    linkB.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))

    expect(document.activeElement).toBe(linkA)
    wrapper.unmount()
  })

  it('does nothing when focus is outside the container', () => {
    const wrapper = mount(TestNav, { attachTo: document.body })
    const linkA = wrapper.find('#link-a').element as HTMLElement
    document.body.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))

    expect(document.activeElement).not.toBe(linkA)
    wrapper.unmount()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './useKeyboardNav'`

- [ ] **Step 3: Implement `src/composables/useKeyboardNav.ts`**

```ts
import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function nextIndex(current: number, direction: 1 | -1, length: number): number {
  return (current + direction + length) % length
}

export function useKeyboardNav(containerRef: Ref<HTMLElement | null>): void {
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const container = containerRef.value
    if (!container) return

    const links = Array.from(container.querySelectorAll('a'))
    if (links.length === 0) return

    const currentIndex = links.findIndex((link) => link === document.activeElement)
    if (currentIndex === -1) return

    event.preventDefault()
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const target = links[nextIndex(currentIndex, direction, links.length)]
    ;(target as HTMLElement).focus()
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS — all 4 `nextIndex` tests and all 4 `useKeyboardNav` tests.

- [ ] **Step 5: Run the build**

Run: `npm run build`
Expected: succeeds, no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/composables/useKeyboardNav.ts src/composables/useKeyboardNav.spec.ts
git commit -m "Add keyboard navigation composable"
```

---

### Task 4: Wire sound and keyboard nav into MenuNav, final verification

**Files:**
- Modify: `src/components/MenuNav.vue`, `src/components/MenuNav.spec.ts`

**Interfaces:**
- Consumes: `useKeyboardNav(containerRef: Ref<HTMLElement | null>): void` (Task 3), `useMenuSound(): { enabled: Ref<boolean>; toggle: () => void; playHover: () => void; playSelect: () => void }` (Task 2).

- [ ] **Step 1: Write the failing tests for the sound toggle in `MenuNav`**

Read the current `src/components/MenuNav.spec.ts` first — it has a `router` setup and two existing tests. Add `localStorage.clear()` before each test that touches sound state, and add two new tests, so the file becomes:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import MenuNav from './MenuNav.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div/>' } },
    { path: '/projects', name: 'projects', component: { template: '<div/>' } },
    { path: '/stack', name: 'stack', component: { template: '<div/>' } },
    { path: '/blog', name: 'blog', component: { template: '<div/>' } },
    { path: '/contact', name: 'contact', component: { template: '<div/>' } },
  ],
})

describe('MenuNav', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders exactly 5 section links', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(MenuNav, { global: { plugins: [router] } })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(5)
  })

  it('includes the Quest Log (projects) link', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(MenuNav, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Quest Log')
  })

  it('renders a sound toggle that is off by default', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(MenuNav, { global: { plugins: [router] } })
    expect(wrapper.find('.menu-nav__sound-toggle').text()).toContain('выкл')
  })

  it('clicking the sound toggle flips its label', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(MenuNav, { global: { plugins: [router] } })
    await wrapper.find('.menu-nav__sound-toggle').trigger('click')
    expect(wrapper.find('.menu-nav__sound-toggle').text()).toContain('вкл')
  })
})
```

- [ ] **Step 2: Run to verify the new tests fail**

Run: `npm run test`
Expected: FAIL — `.menu-nav__sound-toggle` does not exist yet.

- [ ] **Step 3: Modify `src/components/MenuNav.vue`**

Replace the entire file with:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useKeyboardNav } from '../composables/useKeyboardNav'
import { useMenuSound } from '../composables/useMenuSound'

interface MenuItem {
  label: string
  to: { name: string }
}

const items: MenuItem[] = [
  { label: 'Character', to: { name: 'home' } },
  { label: 'Quest Log', to: { name: 'projects' } },
  { label: 'Inventory', to: { name: 'stack' } },
  { label: 'Chronicle', to: { name: 'blog' } },
  { label: 'Notice Board', to: { name: 'contact' } },
]

const containerRef = ref<HTMLElement | null>(null)
useKeyboardNav(containerRef)

const { enabled: soundEnabled, toggle: toggleSound, playHover, playSelect } = useMenuSound()
</script>

<template>
  <nav class="menu-nav" aria-label="Main menu">
    <ul ref="containerRef">
      <li v-for="item in items" :key="item.label">
        <router-link
          :to="item.to"
          class="menu-nav__link"
          active-class="menu-nav__link--active"
          @mouseenter="playHover"
          @focus="playHover"
          @click="playSelect"
        >
          {{ item.label }}
        </router-link>
      </li>
    </ul>
    <button type="button" class="menu-nav__sound-toggle" @click="toggleSound">
      {{ soundEnabled ? 'Звук: вкл' : 'Звук: выкл' }}
    </button>
  </nav>
</template>

<style scoped>
.menu-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.menu-nav__link {
  display: block;
  padding: 1rem 1.25rem;
  color: var(--text-dim);
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  border-left: 3px solid transparent;
}

.menu-nav__link--active,
.menu-nav__link:hover {
  color: var(--accent-gold);
  border-left-color: var(--accent-red);
  background: rgba(138, 31, 31, 0.08);
}

.menu-nav__sound-toggle {
  margin: 0.75rem 1.25rem;
  padding: 0.4rem 0.75rem;
  background: transparent;
  border: 1px solid var(--panel-border);
  color: var(--text-dim);
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.menu-nav__sound-toggle:hover {
  color: var(--accent-gold);
  border-color: var(--accent-gold);
}
</style>
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS — all 4 `MenuNav.spec.ts` tests, plus the full suite.

- [ ] **Step 5: Type-check**

Run: `npx vue-tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Full production build**

Run: `npm run build`
Expected: succeeds. Confirm the WebGL/audio/keyboard-nav code did not regress the PWA build: `ls dist/manifest.webmanifest dist/sw.js` should still list both files with no errors.

- [ ] **Step 7: Manual smoke check**

Run: `npm run preview -- --port 4174 &` then `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4174/` (expect `200`), then stop the preview server (`kill %1`). This confirms the app still boots after these changes — a full interactive check (does the shader actually render, does sound actually play, does arrow-key focus actually move visually) requires a real browser and is out of scope for this automated step; note in the commit or PR that a manual browser check is recommended before considering this fully done.

- [ ] **Step 8: Commit**

```bash
git add src/components/MenuNav.vue src/components/MenuNav.spec.ts
git commit -m "Wire keyboard navigation and sound toggle into menu"
```

---

## Explicitly out of scope (per the design spec)

- Gamepad API support.
- Any change to the mobile layout model.
- Sound files or other external audio assets.
- A WebGL fallback tier beyond "unsupported → Canvas2D" (no mid-quality tier).
