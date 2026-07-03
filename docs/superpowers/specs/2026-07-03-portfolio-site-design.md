# kakacha.space portfolio site — design

## Purpose

Personal portfolio for Egor (kakachaDev/RTDxE), replacing the current default Vite placeholder at kakacha.space. Two audiences with equal weight:

- **Personal flex** — a site worth showing to other devs/friends, with real technical polish (PWA, worker-driven background, smooth interaction).
- **Recruiters** — linked from his resume/hh.ru profile and GitHub. Must stay legible and navigable even for someone who has never seen a game menu in their life. Immersion is the skin, not an obstacle course.

Visual language: The Witcher 3's pause menu — vertical section list, dark leather/parchment mood, red/gold accent, ambient particles. **Stylistic inspiration only** — no CDPR assets (fonts, audio, textures, logos) are used or copied; typography, sound, and art are original or freely-licensed.

## Sections (reskinned as in-world menu items)

1. **Character** (About me) — bio, frontend + gamedev background, optional playful stat-bar flourish.
2. **Quest Log** (Projects) — the 10 published GitHub repos, grouped by category (web games, Minecraft plugins, tools/bots, audio), each linking out to GitHub (and to a live demo where one exists, e.g. flag-mines/sky-dash).
3. **Inventory** (Tech stack) — what this site itself is built with, presented as its own section (the explicit "flex" page).
4. **Chronicle** (Blog) — empty at launch, structured so posts can be added later without rework.
5. **Notice Board** (Contact) — GitHub, email, kakacha.space links.

## Layout: mobile-first, responsive

- **Mobile (base case):** single-column vertical menu as the home screen. Tapping a section slides in a full-screen panel with a back affordance. This is the primary, fully-supported experience — not a degraded fallback.
- **≥tablet width:** progressively enhances to a two-pane layout — persistent menu rail on the left, content pane on the right — closer to the literal pause-menu look.
- Real routes via `vue-router` (`/`, `/projects`, `/stack`, `/blog`, `/blog/:slug`, `/contact`) so any section is directly linkable/shareable — useful for recruiters and for future blog posts.

## Technical approach

**Stack:** Vue 3 + Vite + TypeScript. New repo `kakachaDev/kakacha-space`, deployed to the kakacha.space Netlify site (repo repointed after first push — Netlify side is a manual step, not something this build automates).

**PWA:** `vite-plugin-pwa` (Workbox under the hood) — web app manifest (name, icons, theme colors matching the palette), offline app-shell caching, installable.

**Worker:** the ambient particle background (dust motes / embers) runs its physics/position updates in a dedicated Web Worker, off the main thread; the main thread only reads positions and draws to canvas each frame. Real justification, not just decoration: keeps animation from competing with interaction/scroll on low-end mobile.

**Blog:** Markdown files under a content folder, loaded at build time via `import.meta.glob`, rendered through a lightweight markdown renderer. Blog index route lists posts (empty state: in-universe copy, not a broken-looking blank page); per-post route renders one file. No CMS, no backend — stays a static SPA.

**Typography/assets:** self-hosted fonts (matching the practice already used for the resume) — a fantasy-flavored display font for headings (a freely-licensed lookalike, not the game's actual font) + a clean readable body font. No external font/CDN calls, consistent with the site being installable/offline-capable.

## Build order (MVP first, then layered polish)

1. Scaffold (Vue+Vite+TS, router, base layout, mobile-first menu shell with the 5 sections, responsive two-pane breakpoint).
2. Real content: About/Projects/Stack/Contact filled in; Blog wired up empty.
3. PWA (manifest + service worker/offline caching, installability).
4. Particle background + Web Worker.
5. **Stretch, only after 1-4 are solid:** WebGL/shader-driven background instead of canvas2D particles, subtle original UI sound on hover/select, optional keyboard navigation on desktop (arrow keys + Enter) as a bonus on top of — not instead of — full mouse/touch support.

## Out of scope for this spec

- Actual blog post content (he'll write it later).
- Netlify account/DNS changes (repo repointing is a manual step on his end after first push).
- CMS/auth/comments — the blog stays static Markdown, no backend.
