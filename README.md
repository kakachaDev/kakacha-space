# kakacha.space

Personal portfolio SPA/PWA for kakachaDev — Vue 3 + Vite + TypeScript, styled after a
console pause menu (stylistic inspiration only, no third-party game assets used).

## Features

- Mobile-first responsive menu (stacked single-column on narrow screens, two-pane rail+content on wider screens)
- Sections: Character (about), Quest Log (projects), Inventory (tech stack), Chronicle (blog), Notice Board (contact) — content in Russian
- About page: fact-based "player stats" with explanations, perks (skill + proof), career timeline
- Projects: icons, tech tags, status badges, per-project highlight lines
- PWA: installable, offline app-shell caching
- Ambient particle background computed in a Web Worker, off the main thread
- Blog: build-time Markdown, no backend — tags, reading time, covers, full markdown styling
- Comments: optional Remark42 or giscus embed, enabled via env vars (see `docs/comments-setup.md`)

## Dev

```bash
npm install
npm run dev
npm run test
npx vue-tsc --noEmit
npm run build
npm run preview
```

## Icons

Regenerate PWA icons from `public/icon-source.svg`:

```bash
node scripts/generate-icons.mjs
```
