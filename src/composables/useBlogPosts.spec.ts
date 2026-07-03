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
