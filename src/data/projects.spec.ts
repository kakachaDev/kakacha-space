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
