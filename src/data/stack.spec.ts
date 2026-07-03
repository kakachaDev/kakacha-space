import { describe, it, expect } from 'vitest'
import { siteStack, skillCategories } from './stack'

describe('skill categories', () => {
  it('has the four skill groups', () => {
    expect(skillCategories.map((c) => c.id)).toEqual(['frontend', 'backend', 'gamedev', 'tools'])
  })

  it('every item has a name and an evidence note', () => {
    for (const category of skillCategories) {
      expect(category.items.length).toBeGreaterThan(0)
      for (const item of category.items) {
        expect(item.name.length).toBeGreaterThan(0)
        expect(item.note.length).toBeGreaterThan(0)
      }
    }
  })
})

describe('site stack', () => {
  it('mentions the core framework choices', () => {
    const names = siteStack.map((i) => i.name)
    expect(names).toContain('Vue 3 + Vite + TypeScript')
    expect(names).toContain('Web Worker')
  })
})
