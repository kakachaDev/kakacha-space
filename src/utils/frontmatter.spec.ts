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
