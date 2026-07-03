# kakacha.space Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MVP of a Witcher-3-pause-menu-styled personal portfolio SPA/PWA for kakachaDev — About/Projects/Stack/Blog/Contact sections, mobile-first responsive layout, a Web-Worker-driven particle background, offline/installable PWA support, and a markdown blog shipping with two real seed posts.

**Architecture:** Vue 3 (`<script setup>` + Composition API) + Vite + TypeScript SPA. Business logic lives in plain, framework-agnostic TS modules (`particleSim.ts`, `frontmatter.ts`, `data/*.ts`) that are unit-tested directly with Vitest; Vue components/views are thin consumers of that logic, tested with `@vue/test-utils` only where they contain real branching (grouping, empty states). No backend — blog content is markdown files bundled at build time via `import.meta.glob`.

**Tech Stack:** Vue 3, Vite, TypeScript, vue-router 4, vite-plugin-pwa, markdown-it, @fontsource/inter, @fontsource/cinzel, Vitest, @vue/test-utils, jsdom, Playwright (icon generation only, dev-time).

## Global Constraints

- Mobile-first: every view must work as a single-column, touch-first experience first; wider layouts are a progressive enhancement, not the baseline.
- No CD Projekt Red assets (fonts, audio, art, logos) anywhere in the repo — visual language is original, inspired only.
- No backend/CMS — blog is static markdown, bundled at build time.
- Real content only: project descriptions and blog post #2's technical claims must match what's already verified elsewhere in this session (GitHub repo descriptions, `ya-games/_docs/engine-comparison.md`) — no invented statistics.
- Package versions: install via `npm install <pkg>` (no hand-picked version pins in this plan) — let npm resolve current versions at execution time.

---

## File Structure

```
kakacha-space/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
├── public/
│   ├── icon-source.svg
│   ├── apple-touch-icon.png       (generated)
│   └── icons/
│       ├── icon-192.png            (generated)
│       └── icon-512.png            (generated)
├── scripts/
│   └── generate-icons.mjs
└── src/
    ├── main.ts
    ├── App.vue
    ├── style.css
    ├── theme.ts
    ├── types/index.ts
    ├── data/
    │   ├── projects.ts
    │   └── stack.ts
    ├── pwa/manifestConfig.ts
    ├── utils/frontmatter.ts
    ├── workers/
    │   ├── particleSim.ts
    │   └── particles.worker.ts
    ├── composables/
    │   ├── useIsWidePane.ts
    │   ├── useParticleWorker.ts
    │   ├── useBlogPosts.ts
    │   └── useBlogPost.ts
    ├── content/blog/
    │   ├── 2026-05-24-littlejs-vs-phaser.md
    │   └── 2026-07-03-kak-ustroen-etot-sayt.md
    ├── router/index.ts
    ├── layouts/MenuLayout.vue
    └── components/
    │   ├── MenuNav.vue
    │   ├── ProjectCard.vue
    │   ├── StatBar.vue
    │   └── ParticleBackground.vue
    └── views/
        ├── AboutView.vue
        ├── ProjectsView.vue
        ├── StackView.vue
        ├── BlogIndexView.vue
        ├── BlogPostView.vue
        └── ContactView.vue
```

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `.gitignore`, `src/main.ts`, `src/App.vue`, `README.md`
- Test: `src/App.spec.ts`

**Interfaces:**
- Produces: a runnable Vite dev server, a working `npm run test` (Vitest) command, `App.vue` root component mounted at `#app`.

- [ ] **Step 1: Scaffold with Vite's official Vue-TS template**

```bash
cd /home/dev/projects/kakacha-space
npm create vite@latest . -- --template vue-ts
```

When prompted about the non-empty directory (it already has `.git` and `docs/`), choose to continue / ignore existing files.

- [ ] **Step 2: Install base + test dependencies**

```bash
npm install
npm install -D vitest @vue/test-utils jsdom @vitest/coverage-v8
```

- [ ] **Step 3: Add Vitest config to `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 4: Add test script to `package.json`**

Add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Replace `src/App.vue` with a minimal root**

```vue
<script setup lang="ts">
</script>

<template>
  <div id="app-root">
    <router-view />
  </div>
</template>
```

(The `<router-view />` will fail until Task 4 adds the router — that's expected and fixed by Task 4's step 1, so App.vue is not re-tested here in isolation with router content; Step 6 below tests only that App.vue mounts without the router present.)

- [ ] **Step 6: Write a failing smoke test**

Create `src/App.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

// App.vue itself requires router-view (added in Task 4). For this
// scaffold-only smoke test we mount a stand-in root with the same id
// to verify the test toolchain (Vitest + jsdom + @vue/test-utils) works.
const StubRoot = defineComponent({
  render: () => h('div', { id: 'app-root' }, 'ok'),
})

describe('test toolchain', () => {
  it('mounts a component and finds it by id', () => {
    const wrapper = mount(StubRoot)
    expect(wrapper.find('#app-root').exists()).toBe(true)
  })
})
```

- [ ] **Step 7: Run the test**

Run: `npm run test`
Expected: PASS — 1 test passed.

- [ ] **Step 8: Write `.gitignore`**

```
node_modules
dist
dist-ssr
*.local
.DS_Store
```

- [ ] **Step 9: Write minimal `README.md`**

```markdown
# kakacha.space

Personal portfolio SPA/PWA — Vue 3 + Vite + TypeScript.

## Dev

\`\`\`bash
npm install
npm run dev
npm run test
npm run build
\`\`\`
```

- [ ] **Step 10: Verify dev server boots**

Run: `npm run build`
Expected: build succeeds, `dist/` is created (the router error from Step 5 does not appear yet because `main.ts` from the Vite template doesn't reference router — this is fixed in Task 4).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite+Vue+TS project with Vitest"
```

---

### Task 2: Theme tokens, global CSS, self-hosted fonts

**Files:**
- Create: `src/theme.ts`, `src/style.css`
- Modify: `src/main.ts` (import style.css and fonts)
- Test: `src/theme.spec.ts`

**Interfaces:**
- Produces: `theme` object (`src/theme.ts`) with `colors` record, consumed by `ParticleBackground.vue` (Task 11) for canvas fill colors and by CSS custom properties for everything else.

- [ ] **Step 1: Install font packages**

```bash
npm install @fontsource/inter @fontsource/cinzel
```

- [ ] **Step 2: Write failing test for theme tokens**

Create `src/theme.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { theme } from './theme'

describe('theme', () => {
  it('exposes the core color tokens', () => {
    expect(theme.colors.bg).toBeDefined()
    expect(theme.colors.panel).toBeDefined()
    expect(theme.colors.accentRed).toBeDefined()
    expect(theme.colors.accentGold).toBeDefined()
    expect(theme.colors.text).toBeDefined()
    expect(theme.colors.textDim).toBeDefined()
  })

  it('colors are valid hex strings', () => {
    const hex = /^#[0-9a-f]{6}$/i
    for (const value of Object.values(theme.colors)) {
      expect(value).toMatch(hex)
    }
  })
})
```

- [ ] **Step 2b: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './theme'`

- [ ] **Step 3: Implement `src/theme.ts`**

```ts
export const theme = {
  colors: {
    bg: '#14100d',
    panel: '#1f1912',
    panelBorder: '#3a2f22',
    accentRed: '#8a1f1f',
    accentGold: '#c9a15a',
    text: '#e8dfd0',
    textDim: '#a89a82',
  },
} as const

export type ThemeColors = typeof theme.colors
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Write `src/style.css`**

```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/cinzel/500.css';
@import '@fontsource/cinzel/700.css';

:root {
  --bg: #14100d;
  --panel: #1f1912;
  --panel-border: #3a2f22;
  --accent-red: #8a1f1f;
  --accent-gold: #c9a15a;
  --text: #e8dfd0;
  --text-dim: #a89a82;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
.display {
  font-family: 'Cinzel', serif;
  letter-spacing: 0.02em;
}

a {
  color: var(--accent-gold);
}

#app-root {
  min-height: 100vh;
  position: relative;
}
```

- [ ] **Step 6: Import the stylesheet in `src/main.ts`**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
```

(The router `.use(router)` call is added in Task 4's step — don't add it yet here.)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add theme tokens and global styles with self-hosted fonts"
```

---

### Task 3: Types and Quest Log project data

**Files:**
- Create: `src/types/index.ts`, `src/data/projects.ts`
- Test: `src/data/projects.spec.ts`

**Interfaces:**
- Produces: `Project` interface, `ProjectCategory` type, `projects: Project[]` (10 entries) — consumed by `ProjectCard.vue`/`ProjectsView.vue` (Task 5).

- [ ] **Step 1: Write `src/types/index.ts`**

```ts
export type ProjectCategory = 'platform' | 'games' | 'minecraft' | 'audio' | 'tools'

export interface Project {
  slug: string
  name: string
  description: string
  category: ProjectCategory
  repoUrl: string
  demoUrl?: string
  archived?: boolean
}
```

- [ ] **Step 2: Write failing test for project data**

Create `src/data/projects.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { projects } from './projects'

describe('projects data', () => {
  it('has exactly 10 entries', () => {
    expect(projects).toHaveLength(10)
  })

  it('every project has a unique slug', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('every project has a valid github repo URL', () => {
    for (const p of projects) {
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\/kakachaDev\//)
    }
  })

  it('every category is one of the known categories', () => {
    const allowed = new Set(['platform', 'games', 'minecraft', 'audio', 'tools'])
    for (const p of projects) {
      expect(allowed.has(p.category)).toBe(true)
    }
  })
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './projects'`

- [ ] **Step 4: Implement `src/data/projects.ts`**

```ts
import type { Project } from '../types'

export const projects: Project[] = [
  {
    slug: 'rtdxe-games',
    name: 'RTDxE Games',
    description:
      'Hub/platform for shipping browser games — shared i18n/analytics runtime + multi-engine templates.',
    category: 'platform',
    repoUrl: 'https://github.com/kakachaDev/rtdxe-games',
  },
  {
    slug: 'flag-mines',
    name: 'Flag Mines',
    description: 'Reverse-minesweeper web game (LittleJS + Vite): tap the dark cells to find the mines.',
    category: 'games',
    repoUrl: 'https://github.com/kakachaDev/flag-mines',
    demoUrl: 'https://work.kakacha.space/yg/flag-mines/',
  },
  {
    slug: 'sky-dash',
    name: 'Sky Dash',
    description: 'Vertical arcade runner (LittleJS + Vite): dodge cubes, collect coins, chase power-ups.',
    category: 'games',
    repoUrl: 'https://github.com/kakachaDev/sky-dash',
    demoUrl: 'https://work.kakacha.space/yg/sky-dash/',
  },
  {
    slug: 'origami-battle-godot',
    name: 'Origami Battle',
    description:
      'Mobile match-3 battler prototype (Godot 4.6) with skills, passives, and a bot opponent — unfinished, on hold.',
    category: 'games',
    repoUrl: 'https://github.com/kakachaDev/origami-battle-godot',
    archived: true,
  },
  {
    slug: 'viscera-flat',
    name: 'Viscera Flat',
    description: 'Game jam entry (Godot 4): grow and graft mutations onto a living house until it blooms.',
    category: 'games',
    repoUrl: 'https://github.com/kakachaDev/viscera-flat',
  },
  {
    slug: 'races-plugin-paper',
    name: 'Races Plugin',
    description:
      'Paper/Minecraft 26.1 plugin: 6 playable races with unique stats, passives, XP-gated tier progression.',
    category: 'minecraft',
    repoUrl: 'https://github.com/kakachaDev/races-plugin-paper',
  },
  {
    slug: 'survival-envelope-plugin-paper',
    name: 'Survival Envelope',
    description:
      'Paper/Minecraft 26.1 plugin: dangerous mob variants, behaviour overhauls, persistent particle effects.',
    category: 'minecraft',
    repoUrl: 'https://github.com/kakachaDev/survival-envelope-plugin-paper',
  },
  {
    slug: 'kd-fishing',
    name: 'kd-fishing',
    description: 'Custom fishing plugin for Paper/Minecraft 26.1: biome loot tables, rarities, bait, custom minigame (WIP).',
    category: 'minecraft',
    repoUrl: 'https://github.com/kakachaDev/kd-fishing',
  },
  {
    slug: 'erosionfx',
    name: 'ErosionFx',
    description: 'Ableton Erosion-style audio distortion plugin (JUCE + Visage): noise/sine/scratch modes.',
    category: 'audio',
    repoUrl: 'https://github.com/kakachaDev/erosionfx',
  },
  {
    slug: 'tg-video-downloader',
    name: 'tg-video-downloader',
    description: 'Telegram inline bot for downloading YouTube, TikTok and Instagram media.',
    category: 'tools',
    repoUrl: 'https://github.com/kakachaDev/tg-video-downloader',
  },
]
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm run test`
Expected: PASS — all 4 tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add project types and Quest Log project data"
```

---

### Task 4: Router and mobile-first MenuLayout shell

**Files:**
- Create: `src/router/index.ts`, `src/composables/useIsWidePane.ts`, `src/components/MenuNav.vue`, `src/layouts/MenuLayout.vue`
- Modify: `src/main.ts` (install router), `src/App.vue` (already has `<router-view/>` from Task 1)
- Test: `src/composables/useIsWidePane.spec.ts`, `src/components/MenuNav.spec.ts`

**Interfaces:**
- Consumes: nothing external yet (views are stubbed placeholders here; real views replace stubs in Tasks 5-10).
- Produces: `router` (default export of `src/router/index.ts`) with named routes `home`, `projects`, `stack`, `blog`, `blog-post`, `contact`; `useIsWidePane(breakpointPx = 768): { isWide: Ref<boolean> }`.

- [ ] **Step 1: Install vue-router**

```bash
npm install vue-router
```

- [ ] **Step 2: Write failing test for `useIsWidePane`**

Create `src/composables/useIsWidePane.spec.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useIsWidePane } from './useIsWidePane'

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.push(cb),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
  return listeners
}

describe('useIsWidePane', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is wide when the media query matches', () => {
    mockMatchMedia(true)
    const { isWide } = useIsWidePane()
    expect(isWide.value).toBe(true)
  })

  it('is not wide when the media query does not match', () => {
    mockMatchMedia(false)
    const { isWide } = useIsWidePane()
    expect(isWide.value).toBe(false)
  })

  it('builds the query from the given breakpoint', () => {
    mockMatchMedia(true)
    useIsWidePane(1024)
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
  })
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './useIsWidePane'`

- [ ] **Step 4: Implement `src/composables/useIsWidePane.ts`**

```ts
import { onBeforeUnmount, ref, type Ref } from 'vue'

export function useIsWidePane(breakpointPx = 768): { isWide: Ref<boolean> } {
  const query = window.matchMedia(`(min-width: ${breakpointPx}px)`)
  const isWide = ref(query.matches)

  const listener = (e: MediaQueryListEvent) => {
    isWide.value = e.matches
  }
  query.addEventListener('change', listener)

  onBeforeUnmount(() => {
    query.removeEventListener('change', listener)
  })

  return { isWide }
}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Write failing test for `MenuNav`**

Create `src/components/MenuNav.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
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
})
```

- [ ] **Step 7: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Failed to resolve import "./MenuNav.vue"`

- [ ] **Step 8: Implement `src/components/MenuNav.vue`**

```vue
<script setup lang="ts">
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
</script>

<template>
  <nav class="menu-nav" aria-label="Main menu">
    <ul>
      <li v-for="item in items" :key="item.label">
        <router-link :to="item.to" class="menu-nav__link" active-class="menu-nav__link--active">
          {{ item.label }}
        </router-link>
      </li>
    </ul>
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
</style>
```

- [ ] **Step 9: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 10: Implement `src/router/index.ts`** with placeholder views (real views replace these in later tasks)

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/AboutView.vue') },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue') },
    { path: '/stack', name: 'stack', component: () => import('../views/StackView.vue') },
    { path: '/blog', name: 'blog', component: () => import('../views/BlogIndexView.vue') },
    { path: '/blog/:slug', name: 'blog-post', component: () => import('../views/BlogPostView.vue'), props: true },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
  ],
})

export default router
```

This references `../views/*.vue`, which don't exist until Tasks 5-10. To keep the app buildable right now, create minimal stub views:

```bash
mkdir -p src/views
for name in AboutView ProjectsView StackView BlogIndexView BlogPostView ContactView; do
  cat > "src/views/$name.vue" <<'EOF'
<template>
  <div>stub</div>
</template>
EOF
done
```

(Each stub is fully replaced with real content in its own task below — do not hand-write real content here.)

- [ ] **Step 11: Wire the router into `src/main.ts`**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 12: Implement `src/layouts/MenuLayout.vue`**

```vue
<script setup lang="ts">
import { useIsWidePane } from '../composables/useIsWidePane'
import MenuNav from '../components/MenuNav.vue'

const { isWide } = useIsWidePane()
</script>

<template>
  <div class="menu-layout" :class="{ 'menu-layout--wide': isWide }">
    <aside class="menu-layout__rail">
      <MenuNav />
    </aside>
    <main class="menu-layout__content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.menu-layout {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.menu-layout__rail {
  background: var(--panel);
  border-bottom: 1px solid var(--panel-border);
}

.menu-layout__content {
  padding: 1.25rem;
}

.menu-layout--wide {
  display: grid;
  grid-template-columns: 260px 1fr;
}

.menu-layout--wide .menu-layout__rail {
  border-bottom: none;
  border-right: 1px solid var(--panel-border);
  min-height: 100vh;
}
</style>
```

- [ ] **Step 13: Use `MenuLayout` in `src/App.vue`**

```vue
<script setup lang="ts">
import MenuLayout from './layouts/MenuLayout.vue'
</script>

<template>
  <div id="app-root">
    <MenuLayout />
  </div>
</template>
```

- [ ] **Step 14: Run full test suite and build**

Run: `npm run test && npm run build`
Expected: all tests PASS, build succeeds.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat: add router and mobile-first MenuLayout shell"
```

---

### Task 5: ProjectCard and ProjectsView (Quest Log)

**Files:**
- Create: `src/components/ProjectCard.vue`
- Modify: `src/views/ProjectsView.vue` (replace stub)
- Test: `src/components/ProjectCard.spec.ts`, `src/views/ProjectsView.spec.ts`

**Interfaces:**
- Consumes: `Project` type and `projects` data from Task 3.
- Produces: `ProjectCard` (props: `{ project: Project }`).

- [ ] **Step 1: Write failing test for `ProjectCard`**

Create `src/components/ProjectCard.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from './ProjectCard.vue'
import type { Project } from '../types'

const project: Project = {
  slug: 'flag-mines',
  name: 'Flag Mines',
  description: 'Reverse-minesweeper web game.',
  category: 'games',
  repoUrl: 'https://github.com/kakachaDev/flag-mines',
  demoUrl: 'https://work.kakacha.space/yg/flag-mines/',
}

describe('ProjectCard', () => {
  it('renders the project name and description', () => {
    const wrapper = mount(ProjectCard, { props: { project } })
    expect(wrapper.text()).toContain('Flag Mines')
    expect(wrapper.text()).toContain('Reverse-minesweeper web game.')
  })

  it('links to the repo URL', () => {
    const wrapper = mount(ProjectCard, { props: { project } })
    const repoLink = wrapper.find('a[data-testid="repo-link"]')
    expect(repoLink.attributes('href')).toBe('https://github.com/kakachaDev/flag-mines')
  })

  it('shows a demo link when demoUrl is present', () => {
    const wrapper = mount(ProjectCard, { props: { project } })
    expect(wrapper.find('a[data-testid="demo-link"]').exists()).toBe(true)
  })

  it('omits the demo link when demoUrl is absent', () => {
    const { demoUrl, ...withoutDemo } = project
    const wrapper = mount(ProjectCard, { props: { project: withoutDemo } })
    expect(wrapper.find('a[data-testid="demo-link"]').exists()).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Failed to resolve import "./ProjectCard.vue"`

- [ ] **Step 3: Implement `src/components/ProjectCard.vue`**

```vue
<script setup lang="ts">
import type { Project } from '../types'

defineProps<{ project: Project }>()
</script>

<template>
  <article class="project-card">
    <h3>{{ project.name }}</h3>
    <p>{{ project.description }}</p>
    <p v-if="project.archived" class="project-card__badge">on hold</p>
    <div class="project-card__links">
      <a :href="project.repoUrl" data-testid="repo-link" target="_blank" rel="noopener">GitHub</a>
      <a v-if="project.demoUrl" :href="project.demoUrl" data-testid="demo-link" target="_blank" rel="noopener">
        Play
      </a>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.project-card h3 {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
}

.project-card p {
  margin: 0 0 0.5rem;
  color: var(--text-dim);
  font-size: 0.92rem;
}

.project-card__badge {
  display: inline-block;
  color: var(--accent-gold);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-card__links {
  display: flex;
  gap: 1rem;
}
</style>
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Write failing test for `ProjectsView`**

Create `src/views/ProjectsView.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsView from './ProjectsView.vue'

describe('ProjectsView', () => {
  it('renders all 10 projects', () => {
    const wrapper = mount(ProjectsView)
    const cards = wrapper.findAllComponents({ name: 'ProjectCard' })
    expect(cards).toHaveLength(10)
  })

  it('groups projects under category headings', () => {
    const wrapper = mount(ProjectsView)
    expect(wrapper.text()).toContain('games')
    expect(wrapper.text()).toContain('minecraft')
  })
})
```

- [ ] **Step 6: Run to verify it fails**

Run: `npm run test`
Expected: FAIL (stub `ProjectsView.vue` renders "stub", no `ProjectCard` components)

- [ ] **Step 7: Implement `src/views/ProjectsView.vue`** (replace stub content)

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '../data/projects'
import type { ProjectCategory } from '../types'
import ProjectCard from '../components/ProjectCard.vue'

const categoryOrder: ProjectCategory[] = ['platform', 'games', 'minecraft', 'audio', 'tools']

const grouped = computed(() =>
  categoryOrder
    .map((category) => ({ category, items: projects.filter((p) => p.category === category) }))
    .filter((group) => group.items.length > 0)
)
</script>

<template>
  <section>
    <h2 class="display">Quest Log</h2>
    <div v-for="group in grouped" :key="group.category" class="projects-group">
      <h3 class="projects-group__title">{{ group.category }}</h3>
      <ProjectCard v-for="project in group.items" :key="project.slug" :project="project" />
    </div>
  </section>
</template>

<style scoped>
.projects-group {
  margin-bottom: 1.5rem;
}

.projects-group__title {
  text-transform: capitalize;
  color: var(--text-dim);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 0.3rem;
}
</style>
```

`ProjectCard` must be given an explicit `name` for the `findAllComponents({ name: ... })` lookup in the test to work — add it via a second `<script>` block is not valid SFC syntax, so instead define the name through `defineOptions`:

- [ ] **Step 7b: Add `defineOptions` to `ProjectCard.vue`**

At the top of `ProjectCard.vue`'s `<script setup>` block, add:

```ts
defineOptions({ name: 'ProjectCard' })
```

- [ ] **Step 8: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add ProjectCard and ProjectsView (Quest Log)"
```

---

### Task 6: StatBar and AboutView (Character)

**Files:**
- Create: `src/components/StatBar.vue`
- Modify: `src/views/AboutView.vue` (replace stub)
- Test: `src/components/StatBar.spec.ts`

**Interfaces:**
- Produces: `StatBar` (props: `{ label: string; value: number }`, value clamped to `[0, 100]`).

- [ ] **Step 1: Write failing test for `StatBar`**

Create `src/components/StatBar.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatBar from './StatBar.vue'

describe('StatBar', () => {
  it('renders the label', () => {
    const wrapper = mount(StatBar, { props: { label: 'Frontend', value: 90 } })
    expect(wrapper.text()).toContain('Frontend')
  })

  it('sets the fill width from value', () => {
    const wrapper = mount(StatBar, { props: { label: 'Frontend', value: 90 } })
    const fill = wrapper.find('.stat-bar__fill')
    expect(fill.attributes('style')).toContain('width: 90%')
  })

  it('clamps values above 100 to 100', () => {
    const wrapper = mount(StatBar, { props: { label: 'Coffee', value: 140 } })
    const fill = wrapper.find('.stat-bar__fill')
    expect(fill.attributes('style')).toContain('width: 100%')
  })

  it('clamps negative values to 0', () => {
    const wrapper = mount(StatBar, { props: { label: 'Sleep', value: -20 } })
    const fill = wrapper.find('.stat-bar__fill')
    expect(fill.attributes('style')).toContain('width: 0%')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Failed to resolve import "./StatBar.vue"`

- [ ] **Step 3: Implement `src/components/StatBar.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'StatBar' })

const props = defineProps<{ label: string; value: number }>()

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div class="stat-bar">
    <span class="stat-bar__label">{{ label }}</span>
    <div class="stat-bar__track">
      <div class="stat-bar__fill" :style="{ width: `${clamped}%` }" />
    </div>
  </div>
</template>

<style scoped>
.stat-bar {
  margin-bottom: 0.6rem;
}

.stat-bar__label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-bottom: 0.25rem;
}

.stat-bar__track {
  height: 8px;
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-red), var(--accent-gold));
}
</style>
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Implement `src/views/AboutView.vue`** (replace stub content)

```vue
<script setup lang="ts">
import StatBar from '../components/StatBar.vue'
</script>

<template>
  <section>
    <h2 class="display">Character</h2>
    <p>
      Frontend developer with a gamedev background. Currently building the frontend of a
      real-time PWA product — from architecture to release. Before that, 5+ years in gamedev:
      Unity, a custom ECS, engine tooling.
    </p>
    <p>
      Side projects live in Minecraft/Paper plugins, Godot games, a JUCE audio plugin, and
      Telegram bots — see the Quest Log for the full list.
    </p>
    <div class="stats">
      <StatBar label="Frontend" :value="90" />
      <StatBar label="Gamedev" :value="85" />
      <StatBar label="Audio/DSP" :value="55" />
      <StatBar label="Coffee" :value="100" />
    </div>
  </section>
</template>

<style scoped>
.stats {
  margin-top: 1.5rem;
  max-width: 320px;
}
</style>
```

- [ ] **Step 6: Run full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add StatBar and AboutView (Character)"
```

---

### Task 7: StackView (Inventory)

**Files:**
- Create: `src/data/stack.ts`
- Modify: `src/views/StackView.vue` (replace stub)
- Test: `src/data/stack.spec.ts`, `src/views/StackView.spec.ts`

**Interfaces:**
- Produces: `StackItem` interface (in `src/types/index.ts`), `stackItems: StackItem[]`.

- [ ] **Step 1: Add `StackItem` to `src/types/index.ts`**

Append:

```ts
export interface StackItem {
  name: string
  note: string
}
```

- [ ] **Step 2: Write failing test for stack data**

Create `src/data/stack.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { stackItems } from './stack'

describe('stack data', () => {
  it('is not empty', () => {
    expect(stackItems.length).toBeGreaterThan(0)
  })

  it('every item has a name and a note', () => {
    for (const item of stackItems) {
      expect(item.name.length).toBeGreaterThan(0)
      expect(item.note.length).toBeGreaterThan(0)
    }
  })

  it('mentions the core framework choices', () => {
    const names = stackItems.map((i) => i.name)
    expect(names).toContain('Vue 3 + Vite + TypeScript')
    expect(names).toContain('Web Worker')
  })
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './stack'`

- [ ] **Step 4: Implement `src/data/stack.ts`**

```ts
import type { StackItem } from '../types'

export const stackItems: StackItem[] = [
  { name: 'Vue 3 + Vite + TypeScript', note: 'Composition API, strict TS, instant HMR dev server.' },
  { name: 'vue-router', note: 'Real, shareable URLs for every menu section.' },
  { name: 'Web Worker', note: 'The ambient particle background runs its physics off the main thread.' },
  { name: 'vite-plugin-pwa', note: 'Offline app-shell caching and installability.' },
  { name: 'markdown-it', note: 'Renders the Chronicle (blog) from build-time bundled Markdown files.' },
  { name: 'Vitest + @vue/test-utils', note: 'Unit and component tests, same toolchain as the dev server.' },
  { name: '@fontsource/inter + @fontsource/cinzel', note: 'Self-hosted, no external font requests.' },
]
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Write failing test for `StackView`**

Create `src/views/StackView.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StackView from './StackView.vue'
import { stackItems } from '../data/stack'

describe('StackView', () => {
  it('renders one entry per stack item', () => {
    const wrapper = mount(StackView)
    const entries = wrapper.findAll('[data-testid="stack-item"]')
    expect(entries).toHaveLength(stackItems.length)
  })
})
```

- [ ] **Step 7: Run to verify it fails**

Run: `npm run test`
Expected: FAIL (stub renders "stub", no matching entries)

- [ ] **Step 8: Implement `src/views/StackView.vue`** (replace stub content)

```vue
<script setup lang="ts">
import { stackItems } from '../data/stack'
</script>

<template>
  <section>
    <h2 class="display">Inventory</h2>
    <p>What this site itself is built with.</p>
    <ul class="stack-list">
      <li v-for="item in stackItems" :key="item.name" data-testid="stack-item">
        <strong>{{ item.name }}</strong>
        <span>{{ item.note }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.stack-list {
  list-style: none;
  padding: 0;
}

.stack-list li {
  border-bottom: 1px solid var(--panel-border);
  padding: 0.6rem 0;
}

.stack-list strong {
  display: block;
  color: var(--accent-gold);
}

.stack-list span {
  display: block;
  color: var(--text-dim);
  font-size: 0.88rem;
}
</style>
```

- [ ] **Step 9: Run full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add StackView (Inventory)"
```

---

### Task 8: ContactView (Notice Board)

**Files:**
- Modify: `src/views/ContactView.vue` (replace stub)
- Test: `src/views/ContactView.spec.ts`

- [ ] **Step 1: Write failing test**

Create `src/views/ContactView.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactView from './ContactView.vue'

describe('ContactView', () => {
  it('links to the GitHub profile', () => {
    const wrapper = mount(ContactView)
    const link = wrapper.find('a[href="https://github.com/kakachaDev"]')
    expect(link.exists()).toBe(true)
  })

  it('links to kakacha.space itself', () => {
    const wrapper = mount(ContactView)
    const link = wrapper.find('a[href="https://kakacha.space"]')
    expect(link.exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test`
Expected: FAIL (stub has no matching links)

- [ ] **Step 3: Implement `src/views/ContactView.vue`** (replace stub content)

```vue
<template>
  <section>
    <h2 class="display">Notice Board</h2>
    <ul class="notice-list">
      <li><a href="https://github.com/kakachaDev" target="_blank" rel="noopener">GitHub — kakachaDev</a></li>
      <li><a href="https://kakacha.space">kakacha.space</a></li>
    </ul>
  </section>
</template>

<style scoped>
.notice-list {
  list-style: none;
  padding: 0;
}

.notice-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--panel-border);
}
</style>
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add ContactView (Notice Board)"
```

---

### Task 9: Frontmatter parser and blog composables

**Files:**
- Create: `src/utils/frontmatter.ts`, `src/composables/useBlogPosts.ts`, `src/composables/useBlogPost.ts`
- Modify: `src/types/index.ts` (add `BlogPostMeta`, `BlogPost`)
- Test: `src/utils/frontmatter.spec.ts`, `src/composables/useBlogPosts.spec.ts`

**Interfaces:**
- Produces: `parseFrontmatter(raw: string): { data: Record<string, string>; content: string }`; `useBlogPosts(): { posts: ComputedRef<BlogPostMeta[]> }`; `useBlogPost(slug: string): { post: ComputedRef<BlogPost | undefined> }`.
- Consumed by: Task 10 (`BlogIndexView`, `BlogPostView`).

- [ ] **Step 1: Add blog types to `src/types/index.ts`**

Append:

```ts
export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
}

export interface BlogPost extends BlogPostMeta {
  html: string
}
```

- [ ] **Step 2: Write failing test for the frontmatter parser**

Create `src/utils/frontmatter.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { parseFrontmatter, slugFromPath } from './frontmatter'

describe('parseFrontmatter', () => {
  it('parses key/value frontmatter and separates content', () => {
    const raw = `---\ntitle: Hello\ndate: 2026-07-03\n---\n# Body\n\nText here.`
    const { data, content } = parseFrontmatter(raw)
    expect(data.title).toBe('Hello')
    expect(data.date).toBe('2026-07-03')
    expect(content.trim()).toBe('# Body\n\nText here.')
  })

  it('trims whitespace around values', () => {
    const raw = `---\ntitle:   Spaced Title  \n---\nBody`
    const { data } = parseFrontmatter(raw)
    expect(data.title).toBe('Spaced Title')
  })

  it('returns empty data and the raw string as content when there is no frontmatter block', () => {
    const raw = `Just a plain document.`
    const { data, content } = parseFrontmatter(raw)
    expect(data).toEqual({})
    expect(content).toBe('Just a plain document.')
  })
})

describe('slugFromPath', () => {
  it('strips the directory and .md extension', () => {
    expect(slugFromPath('/src/content/blog/2026-07-03-post.md')).toBe('2026-07-03-post')
  })

  it('handles a bare filename with no directory', () => {
    expect(slugFromPath('post.md')).toBe('post')
  })
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './frontmatter'`

- [ ] **Step 4: Implement `src/utils/frontmatter.ts`**

```ts
export interface ParsedMarkdown {
  data: Record<string, string>
  content: string
}

export function parseFrontmatter(raw: string): ParsedMarkdown {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, content: raw }
  }

  const [, block, content] = match
  const data: Record<string, string> = {}

  for (const line of block.split(/\r?\n/)) {
    const lineMatch = line.match(/^([^:]+):\s*(.*)$/)
    if (!lineMatch) continue
    const [, key, value] = lineMatch
    data[key.trim()] = value.trim()
  }

  return { data, content }
}

export function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.md$/, '')
}
```

`slugFromPath` lives here (not duplicated in each composable) because both `useBlogPosts.ts` and `useBlogPost.ts` (Steps 9 and 14 below) need the exact same slug-extraction rule — defining it twice would let the two drift out of sync.

- [ ] **Step 5: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Write failing test for `useBlogPosts`**

Create `src/composables/useBlogPosts.spec.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('../content/blog-modules', () => ({
  blogModules: {
    '/src/content/blog/2026-07-03-second.md': `---\ntitle: Second\ndate: 2026-07-03\nexcerpt: Second post\n---\nBody two`,
    '/src/content/blog/2026-05-24-first.md': `---\ntitle: First\ndate: 2026-05-24\nexcerpt: First post\n---\nBody one`,
  },
}))

import { useBlogPosts } from './useBlogPosts'

describe('useBlogPosts', () => {
  it('returns one entry per markdown file, newest first', () => {
    const { posts } = useBlogPosts()
    expect(posts.value).toHaveLength(2)
    expect(posts.value[0].slug).toBe('2026-07-03-second')
    expect(posts.value[1].slug).toBe('2026-05-24-first')
  })

  it('maps frontmatter fields onto each post', () => {
    const { posts } = useBlogPosts()
    expect(posts.value[0].title).toBe('Second')
    expect(posts.value[0].excerpt).toBe('Second post')
  })
})
```

This test mocks a small indirection module (`../content/blog-modules`) rather than `import.meta.glob` directly, because `import.meta.glob` is a Vite build-time macro that Vitest's mocking cannot intercept once it's inlined — isolating it behind a plain module keeps `useBlogPosts` testable.

- [ ] **Step 7: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './useBlogPosts'`

- [ ] **Step 8: Implement `src/content/blog-modules.ts`** (the real, non-mocked glob — this file has no logic to unit test, it's a thin Vite-specific data source)

```ts
export const blogModules = import.meta.glob('./blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>
```

- [ ] **Step 9: Implement `src/composables/useBlogPosts.ts`**

```ts
import { computed, type ComputedRef } from 'vue'
import { parseFrontmatter, slugFromPath } from '../utils/frontmatter'
import { blogModules } from '../content/blog-modules'
import type { BlogPostMeta } from '../types'

export function useBlogPosts(): { posts: ComputedRef<BlogPostMeta[]> } {
  const posts = computed<BlogPostMeta[]>(() => {
    const entries = Object.entries(blogModules).map(([path, raw]) => {
      const { data } = parseFrontmatter(raw)
      return {
        slug: slugFromPath(path),
        title: data.title ?? slugFromPath(path),
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
      }
    })
    return entries.sort((a, b) => (a.date < b.date ? 1 : -1))
  })

  return { posts }
}
```

- [ ] **Step 10: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 11: Write failing test for `useBlogPost`**

Create `src/composables/useBlogPost.spec.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('../content/blog-modules', () => ({
  blogModules: {
    '/src/content/blog/2026-07-03-second.md': `---\ntitle: Second\ndate: 2026-07-03\nexcerpt: Second post\n---\n# Heading`,
  },
}))

import { useBlogPost } from './useBlogPost'

describe('useBlogPost', () => {
  it('returns the matching post with rendered html', () => {
    const { post } = useBlogPost('2026-07-03-second')
    expect(post.value?.title).toBe('Second')
    expect(post.value?.html).toContain('<h1>Heading</h1>')
  })

  it('returns undefined for an unknown slug', () => {
    const { post } = useBlogPost('does-not-exist')
    expect(post.value).toBeUndefined()
  })
})
```

- [ ] **Step 12: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './useBlogPost'`

- [ ] **Step 13: Install `markdown-it`**

```bash
npm install markdown-it
npm install -D @types/markdown-it
```

- [ ] **Step 14: Implement `src/composables/useBlogPost.ts`**

```ts
import { computed, type ComputedRef } from 'vue'
import MarkdownIt from 'markdown-it'
import { parseFrontmatter, slugFromPath } from '../utils/frontmatter'
import { blogModules } from '../content/blog-modules'
import type { BlogPost } from '../types'

const md = new MarkdownIt()

export function useBlogPost(slug: string): { post: ComputedRef<BlogPost | undefined> } {
  const post = computed<BlogPost | undefined>(() => {
    const entry = Object.entries(blogModules).find(([path]) => slugFromPath(path) === slug)
    if (!entry) return undefined

    const [, raw] = entry
    const { data, content } = parseFrontmatter(raw)

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '',
      excerpt: data.excerpt ?? '',
      html: md.render(content),
    }
  })

  return { post }
}
```

- [ ] **Step 15: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 16: Commit**

```bash
git add -A
git commit -m "feat: add frontmatter parser and blog composables"
```

---

### Task 10: Seed blog posts, BlogIndexView, BlogPostView

**Files:**
- Create: `src/content/blog/2026-05-24-littlejs-vs-phaser.md`, `src/content/blog/2026-07-03-kak-ustroen-etot-sayt.md`
- Modify: `src/views/BlogIndexView.vue`, `src/views/BlogPostView.vue` (replace stubs)
- Test: `src/views/BlogIndexView.spec.ts`, `src/views/BlogPostView.spec.ts`

**Interfaces:**
- Consumes: `useBlogPosts` / `useBlogPost` from Task 9.

- [ ] **Step 1: Write the first seed post**

Create `src/content/blog/2026-05-24-littlejs-vs-phaser.md`:

```markdown
---
title: LittleJS vs Phaser — почему выбрал LittleJS для мини-игр
date: 2026-05-24
excerpt: Разбирался с движками для Flag Mines и Sky Dash — победил LittleJS, и вот почему.
---

Перед тем как начать Flag Mines и Sky Dash, сравнивал LittleJS и Phaser 3 (и голый Canvas2D
как базовую линию).

Главный аргумент — размер бандла. LittleJS минифицированный весит около **25 КБ**, у Phaser
даже после tree-shaking в Vite выходит **600–900 КБ**. Для площадок вроде Yandex Games, где
важна скорость первой загрузки, это не мелочь.

Дальше — рендер. LittleJS даёт WebGL2-батчинг спрайтов из коробки: сотни объектов рисуются
за один draw call, тогда как в чистом Canvas2D на каждый спрайт уходит отдельный вызов.
Частицы там же — GPU-эмиттер с аддитивным блендингом, а не CPU-композитинг, который выдаёт
Canvas2D.

Ещё важная деталь — фиксированный таймстеп (`1/60`) и детерминированная физика без лишней
настройки, плюс ZzFX для процедурного звука — не нужно тащить аудиофайлы для базовых SFX.

Phaser в целом мощнее (полноценный Tiled-импорт, твины из коробки, Spine-анимации), но для
аркадных прототипов без сложных уровней это оверинжиниринг. UI в обоих играх у меня целиком
на DOM — LittleJS не лезет в этот слой вообще, что и было нужно.
```

- [ ] **Step 2: Write the second seed post**

Create `src/content/blog/2026-07-03-kak-ustroen-etot-sayt.md`:

```markdown
---
title: Как устроен этот сайт
date: 2026-07-03
excerpt: Vue 3 + Vite + TS, меню в духе Ведьмака, частицы в отдельном потоке — и зачем всё это.
---

Этот сайт — SPA/PWA на Vue 3 + Vite + TypeScript, стилизованный под меню паузы в духе
Ведьмака 3: вертикальный список разделов, тёмная палитра, немного атмосферы. Ничего из
реальных ассетов игры не использовано — только настроение и композиция.

Технически интересны две вещи. Во-первых, фоновые частицы (пыль/угольки) считаются не в
основном потоке, а в отдельном Web Worker — он отдаёт только позиции, а канвас в main
thread просто их рисует. На слабом мобильном это разгружает поток, который иначе бы
делил время с скроллом и тапами.

Во-вторых, сам сайт — PWA: устанавливается, работает офлайн за счёт service worker,
кеширующего app shell. И да, вёрстка mobile-first в буквальном смысле — сначала собирался
однoколоночный вариант с выезжающими панелями, и только потом он дорастает до
двухпанельной раскладки на широких экранах.

Блог, который вы читаете прямо сейчас, — просто markdown-файлы, собираемые на этапе сборки
через `import.meta.glob`. Никакого бэкенда для двух постов не нужно.
```

- [ ] **Step 3: Write failing test for `BlogIndexView`**

Create `src/views/BlogIndexView.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import BlogIndexView from './BlogIndexView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/blog/:slug', name: 'blog-post', component: { template: '<div/>' } }],
})

describe('BlogIndexView', () => {
  it('lists both seed posts', async () => {
    router.push('/blog/x')
    await router.isReady()
    const wrapper = mount(BlogIndexView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('LittleJS')
    expect(wrapper.text()).toContain('Как устроен этот сайт')
  })
})
```

- [ ] **Step 4: Run to verify it fails**

Run: `npm run test`
Expected: FAIL (stub renders "stub")

- [ ] **Step 5: Implement `src/views/BlogIndexView.vue`** (replace stub content)

```vue
<script setup lang="ts">
import { useBlogPosts } from '../composables/useBlogPosts'

const { posts } = useBlogPosts()
</script>

<template>
  <section>
    <h2 class="display">Chronicle</h2>
    <p v-if="posts.length === 0" class="empty-state">Хроники пока не написаны.</p>
    <ul v-else class="post-list">
      <li v-for="post in posts" :key="post.slug">
        <router-link :to="{ name: 'blog-post', params: { slug: post.slug } }">
          <h3>{{ post.title }}</h3>
        </router-link>
        <p class="post-list__date">{{ post.date }}</p>
        <p>{{ post.excerpt }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.post-list {
  list-style: none;
  padding: 0;
}

.post-list li {
  border-bottom: 1px solid var(--panel-border);
  padding: 0.75rem 0;
}

.post-list h3 {
  margin: 0;
  color: var(--accent-gold);
}

.post-list__date {
  color: var(--text-dim);
  font-size: 0.8rem;
  margin: 0.2rem 0 0.4rem;
}

.empty-state {
  color: var(--text-dim);
}
</style>
```

- [ ] **Step 6: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 7: Write failing test for `BlogPostView`**

Create `src/views/BlogPostView.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BlogPostView from './BlogPostView.vue'

describe('BlogPostView', () => {
  it('renders the post matching the slug prop', () => {
    const wrapper = mount(BlogPostView, { props: { slug: '2026-07-03-kak-ustroen-etot-sayt' } })
    expect(wrapper.text()).toContain('Как устроен этот сайт')
  })

  it('shows a not-found message for an unknown slug', () => {
    const wrapper = mount(BlogPostView, { props: { slug: 'nope' } })
    expect(wrapper.text()).toContain('не найден')
  })
})
```

- [ ] **Step 8: Run to verify it fails**

Run: `npm run test`
Expected: FAIL (stub renders "stub", ignores `slug` prop)

- [ ] **Step 9: Implement `src/views/BlogPostView.vue`** (replace stub content)

```vue
<script setup lang="ts">
import { useBlogPost } from '../composables/useBlogPost'

const props = defineProps<{ slug: string }>()
const { post } = useBlogPost(props.slug)
</script>

<template>
  <section>
    <template v-if="post">
      <h2 class="display">{{ post.title }}</h2>
      <p class="post-date">{{ post.date }}</p>
      <div class="post-body" v-html="post.html" />
    </template>
    <p v-else>Пост не найден.</p>
  </section>
</template>

<style scoped>
.post-date {
  color: var(--text-dim);
  font-size: 0.8rem;
}

.post-body :deep(h1) {
  font-family: 'Cinzel', serif;
}
</style>
```

- [ ] **Step 10: Run full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add two seed blog posts, BlogIndexView, BlogPostView"
```

---

### Task 11: Particle physics, Web Worker, particle background

**Files:**
- Create: `src/workers/particleSim.ts`, `src/workers/particles.worker.ts`, `src/composables/useParticleWorker.ts`, `src/components/ParticleBackground.vue`
- Modify: `src/App.vue` (mount `ParticleBackground`)
- Test: `src/workers/particleSim.spec.ts`, `src/components/ParticleBackground.spec.ts`

**Interfaces:**
- Produces: `Particle` interface, `createParticles(count, width, height): Particle[]`, `stepParticles(particles, dt, width, height): Particle[]` — pure, no DOM/Worker globals, fully unit-testable. `useParticleWorker(width, height, count?): { particles: Ref<Particle[]> }`.

- [ ] **Step 1: Write failing tests for the pure particle simulation**

Create `src/workers/particleSim.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { createParticles, stepParticles, type Particle } from './particleSim'

describe('createParticles', () => {
  it('creates the requested number of particles', () => {
    const particles = createParticles(10, 800, 600)
    expect(particles).toHaveLength(10)
  })

  it('places particles within the given bounds', () => {
    const particles = createParticles(20, 800, 600)
    for (const p of particles) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(800)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(600)
    }
  })
})

describe('stepParticles', () => {
  it('moves a particle by velocity * dt', () => {
    const particles: Particle[] = [{ x: 10, y: 10, vx: 5, vy: 2, radius: 1, opacity: 0.5 }]
    const [result] = stepParticles(particles, 1, 800, 600)
    expect(result.x).toBe(15)
    expect(result.y).toBe(12)
  })

  it('wraps a particle back below the bottom edge once it drifts above the top', () => {
    const particles: Particle[] = [{ x: 10, y: 5, vx: 0, vy: -20, radius: 1, opacity: 0.5 }]
    const [result] = stepParticles(particles, 1, 800, 600)
    expect(result.y).toBe(610)
  })

  it('wraps a particle to the right edge once it drifts past the left', () => {
    const particles: Particle[] = [{ x: 5, y: 10, vx: -20, vy: 0, radius: 1, opacity: 0.5 }]
    const [result] = stepParticles(particles, 1, 800, 600)
    expect(result.x).toBe(810)
  })

  it('does not mutate the input array', () => {
    const particles: Particle[] = [{ x: 10, y: 10, vx: 5, vy: 2, radius: 1, opacity: 0.5 }]
    stepParticles(particles, 1, 800, 600)
    expect(particles[0].x).toBe(10)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './particleSim'`

- [ ] **Step 3: Implement `src/workers/particleSim.ts`**

```ts
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export function createParticles(count: number, width: number, height: number): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 10,
      vy: -5 - Math.random() * 10,
      radius: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.5,
    })
  }
  return particles
}

export function stepParticles(particles: Particle[], dt: number, width: number, height: number): Particle[] {
  return particles.map((p) => {
    let x = p.x + p.vx * dt
    let y = p.y + p.vy * dt
    if (y < -10) y = height + 10
    if (x < -10) x = width + 10
    if (x > width + 10) x = -10
    return { ...p, x, y }
  })
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test`
Expected: PASS — all `particleSim` tests pass.

- [ ] **Step 5: Implement `src/workers/particles.worker.ts`** (thin runtime wrapper — not unit tested directly; its only logic is delegated to the tested `particleSim.ts` functions)

```ts
import { createParticles, stepParticles, type Particle } from './particleSim'

let particles: Particle[] = []
let width = 0
let height = 0
let lastTime = 0
let stopped = false

self.onmessage = (e: MessageEvent) => {
  const msg = e.data
  if (msg.type === 'init') {
    width = msg.width
    height = msg.height
    particles = createParticles(msg.count, width, height)
    lastTime = performance.now()
    stopped = false
    tick()
  } else if (msg.type === 'resize') {
    width = msg.width
    height = msg.height
  } else if (msg.type === 'stop') {
    stopped = true
  }
}

function tick() {
  if (stopped) return
  const now = performance.now()
  const dt = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now
  particles = stepParticles(particles, dt, width, height)
  self.postMessage({ type: 'tick', particles })
  setTimeout(tick, 1000 / 60)
}
```

- [ ] **Step 6: Implement `src/composables/useParticleWorker.ts`** (thin glue — not unit tested directly; `Worker` is unavailable in the jsdom test environment, so coverage lives in `particleSim.spec.ts` plus the mocked component test in Step 8 below)

```ts
import { onBeforeUnmount, ref, type Ref } from 'vue'
import type { Particle } from '../workers/particleSim'

export function useParticleWorker(width: number, height: number, count = 50): { particles: Ref<Particle[]> } {
  const particles = ref<Particle[]>([]) as Ref<Particle[]>
  const worker = new Worker(new URL('../workers/particles.worker.ts', import.meta.url), { type: 'module' })

  worker.onmessage = (e: MessageEvent) => {
    if (e.data.type === 'tick') {
      particles.value = e.data.particles
    }
  }
  worker.postMessage({ type: 'init', width, height, count })

  onBeforeUnmount(() => {
    worker.postMessage({ type: 'stop' })
    worker.terminate()
  })

  return { particles }
}
```

- [ ] **Step 7: Write failing test for `ParticleBackground`** (mocks `useParticleWorker` entirely, since real Workers don't run in jsdom)

Create `src/components/ParticleBackground.spec.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('../composables/useParticleWorker', () => ({
  useParticleWorker: () => ({
    particles: ref([{ x: 10, y: 10, vx: 0, vy: 0, radius: 2, opacity: 0.5 }]),
  }),
}))

import ParticleBackground from './ParticleBackground.vue'

describe('ParticleBackground', () => {
  it('renders a canvas element', () => {
    const wrapper = mount(ParticleBackground)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})
```

- [ ] **Step 8: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Failed to resolve import "./ParticleBackground.vue"`

- [ ] **Step 9: Implement `src/components/ParticleBackground.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useParticleWorker } from '../composables/useParticleWorker'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { particles } = useParticleWorker(
  typeof window !== 'undefined' ? window.innerWidth : 800,
  typeof window !== 'undefined' ? window.innerHeight : 600,
  50
)

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth
  if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const p of particles.value) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(201, 161, 90, ${p.opacity})`
    ctx.fill()
  }
  requestAnimationFrame(draw)
}

onMounted(() => {
  requestAnimationFrame(draw)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-bg" aria-hidden="true" />
</template>

<style scoped>
.particle-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
```

- [ ] **Step 10: Run tests to verify pass**

Run: `npm run test`
Expected: PASS. (jsdom's canvas `getContext` returns `null` by default and jsdom has no real `Worker`, but since `useParticleWorker` is mocked, the component never constructs a real `Worker` in this test.)

- [ ] **Step 11: Mount `ParticleBackground` in `src/App.vue`**

```vue
<script setup lang="ts">
import MenuLayout from './layouts/MenuLayout.vue'
import ParticleBackground from './components/ParticleBackground.vue'
</script>

<template>
  <div id="app-root">
    <ParticleBackground />
    <MenuLayout />
  </div>
</template>
```

- [ ] **Step 12: Run full test suite and build**

Run: `npm run test && npm run build`
Expected: all tests PASS, build succeeds (Vite bundles `particles.worker.ts` as a separate worker chunk automatically because of the `new URL(..., import.meta.url)` pattern).

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add Web-Worker-driven particle background"
```

---

### Task 12: PWA — manifest, icons, offline support

**Files:**
- Create: `src/pwa/manifestConfig.ts`, `public/icon-source.svg`, `scripts/generate-icons.mjs`
- Modify: `vite.config.ts` (add `VitePWA` plugin)
- Test: `src/pwa/manifestConfig.spec.ts`

**Interfaces:**
- Produces: `manifestConfig` object consumed by `vite.config.ts`'s `VitePWA({ manifest: manifestConfig })` call.

- [ ] **Step 1: Install `vite-plugin-pwa`**

```bash
npm install -D vite-plugin-pwa
```

- [ ] **Step 2: Write failing test for the manifest config**

Create `src/pwa/manifestConfig.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { manifestConfig } from './manifestConfig'

describe('manifestConfig', () => {
  it('has the required PWA manifest fields', () => {
    expect(manifestConfig.name).toBeTruthy()
    expect(manifestConfig.short_name).toBeTruthy()
    expect(manifestConfig.start_url).toBe('/')
    expect(manifestConfig.display).toBe('standalone')
    expect(manifestConfig.theme_color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(manifestConfig.background_color).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('declares the 192 and 512 icon sizes', () => {
    const sizes = manifestConfig.icons.map((icon) => icon.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
  })
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm run test`
Expected: FAIL — `Cannot find module './manifestConfig'`

- [ ] **Step 4: Implement `src/pwa/manifestConfig.ts`**

```ts
export const manifestConfig = {
  name: 'kakachaDev — Portfolio',
  short_name: 'kakachaDev',
  description: 'Frontend + gamedev portfolio.',
  start_url: '/',
  display: 'standalone' as const,
  background_color: '#14100d',
  theme_color: '#14100d',
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm run test`
Expected: PASS

- [ ] **Step 6: Write the original SVG source icon**

Create `public/icon-source.svg` — an original geometric medallion (circle + angular wolf-silhouette triangle), not a copy of any existing logo:

```xml
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <circle cx="256" cy="256" r="248" fill="#14100d" stroke="#c9a15a" stroke-width="10"/>
  <circle cx="256" cy="256" r="210" fill="none" stroke="#8a1f1f" stroke-width="4"/>
  <polygon points="256,120 340,260 300,260 340,392 256,300 172,392 212,260 172,260"
           fill="#c9a15a"/>
  <circle cx="220" cy="230" r="8" fill="#14100d"/>
  <circle cx="292" cy="230" r="8" fill="#14100d"/>
</svg>
```

- [ ] **Step 7: Install Playwright for one-off icon rasterization**

```bash
npm install -D playwright
npx playwright install chromium
```

- [ ] **Step 8: Write `scripts/generate-icons.mjs`**

```js
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(dir, '..')
const svg = readFileSync(path.join(root, 'public/icon-source.svg'), 'utf-8')

const targets = [
  { size: 192, out: 'public/icons/icon-192.png' },
  { size: 512, out: 'public/icons/icon-512.png' },
  { size: 180, out: 'public/apple-touch-icon.png' },
]

mkdirSync(path.join(root, 'public/icons'), { recursive: true })

const browser = await chromium.launch()
for (const { size, out } of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(
    `<html><body style="margin:0">${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`
  )
  const buffer = await page.screenshot({ omitBackground: false })
  writeFileSync(path.join(root, out), buffer)
  await page.close()
  console.log('wrote', out)
}
await browser.close()
```

- [ ] **Step 9: Run the icon generator**

Run: `node scripts/generate-icons.mjs`
Expected: creates `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/apple-touch-icon.png`.

- [ ] **Step 10: Wire `VitePWA` into `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { manifestConfig } from './src/pwa/manifestConfig'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: manifestConfig,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 11: Add the apple-touch-icon link to `index.html`**

In `index.html`, inside `<head>`, add:

```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#14100d" />
```

- [ ] **Step 12: Run full test suite and build**

Run: `npm run test && npm run build`
Expected: all tests PASS. Build succeeds and emits `dist/manifest.webmanifest` and a service worker file (`dist/sw.js`).

- [ ] **Step 13: Verify the PWA build artifacts**

Run: `ls dist/manifest.webmanifest dist/sw.js dist/icons/icon-192.png dist/icons/icon-512.png`
Expected: all four files listed, no "No such file" errors.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: add PWA support (manifest, icons, offline caching)"
```

---

### Task 13: Final integration pass

**Files:**
- Modify: `README.md` (expand with real feature list)
- No new source files — this task is verification, not new functionality.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: every spec file from Tasks 1-12 passes, 0 failures.

- [ ] **Step 2: Type-check the whole project**

```bash
npx vue-tsc --noEmit
```

Expected: no type errors. If there are errors from the Vite template's default `src/env.d.ts` or `tsconfig.json` being stricter than needed, fix them at the reported location — do not loosen `strict` mode to silence errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: succeeds, `dist/` contains `index.html`, hashed JS/CSS chunks, a separate worker chunk for `particles.worker`, `manifest.webmanifest`, `sw.js`, and `icons/`.

- [ ] **Step 4: Manual smoke check with the preview server**

```bash
npm run preview -- --port 4173 &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/projects
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/blog
kill %1
```

Expected: all three return `200` (client-side routing serves `index.html` for every path since `createWebHistory` needs server-side fallback — if `/projects` and `/blog` return `404` from the static preview server, add a fallback rewrite; note this explicitly for the eventual Netlify deploy: a `public/_redirects` file with `/* /index.html 200` is required for Netlify to serve the SPA correctly on deep links).

- [ ] **Step 5: Add the Netlify SPA fallback**

Create `public/_redirects`:

```
/* /index.html 200
```

- [ ] **Step 6: Re-run build to confirm `_redirects` is copied into `dist/`**

Run: `npm run build && ls dist/_redirects`
Expected: file listed, no error.

- [ ] **Step 7: Expand `README.md`** with the real feature set

```markdown
# kakacha.space

Personal portfolio SPA/PWA for kakachaDev — Vue 3 + Vite + TypeScript, styled after a
console pause menu (stylistic inspiration only, no third-party game assets used).

## Features

- Mobile-first responsive menu (single-column drill-in → two-pane on wider screens)
- Sections: Character (about), Quest Log (projects), Inventory (tech stack), Chronicle (blog), Notice Board (contact)
- PWA: installable, offline app-shell caching
- Ambient particle background computed in a Web Worker, off the main thread
- Blog: build-time Markdown, no backend

## Dev

\`\`\`bash
npm install
npm run dev
npm run test
npx vue-tsc --noEmit
npm run build
npm run preview
\`\`\`

## Icons

Regenerate PWA icons from `public/icon-source.svg`:

\`\`\`bash
node scripts/generate-icons.mjs
\`\`\`
```

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "chore: final integration pass — SPA fallback, README, verification"
```

---

## Explicitly deferred (not part of this plan)

Per the spec's build order, these are later, separate work — do not implement them as part of executing this plan:

- WebGL/shader-driven background (replacing the canvas2D particle renderer)
- Original UI sound effects on hover/select
- Keyboard/gamepad-style navigation (arrow keys + Enter) as a bonus on top of mouse/touch
- Netlify repo repointing / DNS (manual, on the user's Netlify account)
- Additional blog posts beyond the two seed posts
