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
