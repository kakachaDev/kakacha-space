import { computed, type ComputedRef } from 'vue'
import { parseFrontmatter, slugFromPath } from '../utils/frontmatter'
import { readingMinutes } from '../utils/readingTime'
import { blogModules } from '../content/blog-modules'
import type { BlogPostMeta } from '../types'

export function parseTags(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function useBlogPosts(): { posts: ComputedRef<BlogPostMeta[]> } {
  const posts = computed<BlogPostMeta[]>(() => {
    const entries = Object.entries(blogModules).map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw)
      return {
        slug: slugFromPath(path),
        title: data.title ?? slugFromPath(path),
        date: data.date ?? '',
        excerpt: data.excerpt ?? '',
        tags: parseTags(data.tags),
        readingMinutes: readingMinutes(content),
        cover: data.cover,
      }
    })
    return entries.sort((a, b) => (a.date < b.date ? 1 : -1))
  })

  return { posts }
}
