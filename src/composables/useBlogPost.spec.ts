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
