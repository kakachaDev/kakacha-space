# Portfolio site — stretch features design

Follow-up to `2026-07-03-portfolio-site-design.md`, implementing the three items its "Build order" step 5 named but deferred. All three are additive layers on top of the already-shipped MVP — nothing here replaces existing tested logic, and mouse/touch remain fully functional throughout.

## 1. WebGL particle renderer

Reuse the existing, already-tested particle physics unchanged (`particleSim.ts`, `particles.worker.ts`, `useParticleWorker.ts`) — only the rendering backend in `ParticleBackground.vue` changes, from Canvas2D `ctx.arc()` calls to WebGL `gl.POINTS`.

- New `src/webgl/particleRenderer.ts`: a small class wrapping raw WebGL (no library — matches the project's existing small-bundle bias). Compiles one vertex/fragment shader pair that draws a soft circular point sprite; color comes from `theme.colors.accentGold`, per-particle alpha from `Particle.opacity`.
- `hexToRgbFloat(hex: string): [number, number, number]` (normalized 0–1, for shader uniforms) is a pure, unit-tested helper — same pattern as the existing `hexToRgb` in `ParticleBackground.vue`, just normalized for GL instead of 0–255 for CSS.
- `ParticleBackground.vue` tries `canvas.getContext('webgl')`; if `null` (unsupported browser), it falls back to the existing Canvas2D path, which stays in the codebase rather than being deleted.
- The GL calls themselves (shader compile/link, buffer upload, `drawArrays`) are thin, untested glue, consistent with how `particles.worker.ts` was already treated — jsdom has no real WebGL context to test against.

## 2. Procedural UI sound

No audio files. `src/audio/uiSound.ts` generates short clicks via `AudioContext` + `OscillatorNode` + a fast attack/decay `GainNode` envelope — the same spirit as the ZzFX approach praised in the site's own LittleJS blog post.

- `playHoverTick()` — a very short, quiet blip.
- `playSelectChime()` — a slightly longer, brighter tone.
- The `AudioContext` is created lazily on first user gesture (browser autoplay policy requires this — it cannot be constructed at module load).
- `useMenuSound.ts` composable wraps this and exposes a reactive `enabled` ref persisted to `localStorage` (key `sound-enabled`), **defaulting to `false`**. A small toggle control (in `MenuNav.vue` or `MenuLayout.vue`, wherever fits visually) flips it. Sound only ever plays when `enabled` is true.
- `MenuNav.vue`'s links call `playHoverTick()` on `@mouseenter`/`@focus` and `playSelectChime()` on click/navigation, gated by `enabled`.
- Testing: the envelope-shape math (attack/decay curve as a function of time) can be extracted as a pure function and tested; `AudioContext`/`OscillatorNode` construction is untested glue (jsdom has no Web Audio implementation), mirroring the Worker precedent. The `enabled` toggle and `localStorage` persistence in `useMenuSound.ts` ARE fully testable (mock `localStorage`, assert reactive state).

## 3. Keyboard navigation

Keyboard only — no Gamepad API. Leans on native semantics rather than reinventing them: `MenuNav.vue`'s links are already real `<a>` elements (via `router-link`), which natively activate on Enter when focused — no custom Enter handling needed.

- `useKeyboardNav.ts` composable: listens for `keydown` on the nav's `<ul>` (or document, scoped to when a nav link has focus), and on `ArrowDown`/`ArrowUp` moves focus to the next/previous link, wrapping around at the ends. A pure `nextIndex(current: number, direction: 1 | -1, length: number): number` function handles the wraparound math and is unit-tested directly.
- The actual `.focus()` call on the target `<a>` element is thin glue tested via `@vue/test-utils` + jsdom (jsdom supports real focus management, unlike Canvas/WebGL/AudioContext) — mount `MenuNav`, dispatch `keydown` events, assert `document.activeElement` moves to the expected link.
- No change to mobile/touch behavior; this is purely an additive desktop-keyboard affordance.

## Out of scope

- Gamepad API support.
- Any change to the mobile layout model (still the stacked single-column behavior already shipped, not a slide-in drill-in panel).
- Sound files / external audio assets of any kind.
- WebGL fallback beyond "browser doesn't support WebGL → use existing Canvas2D" (no mid-tier fallback).
