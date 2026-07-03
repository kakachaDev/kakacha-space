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
