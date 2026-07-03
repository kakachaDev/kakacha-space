import { computed, type ComputedRef } from 'vue'
import MarkdownIt from 'markdown-it'
import { parseFrontmatter, slugFromPath } from '../utils/frontmatter'
import { readingMinutes } from '../utils/readingTime'
import { blogModules } from '../content/blog-modules'
import { parseTags } from './useBlogPosts'
import type { BlogPost } from '../types'

const md = new MarkdownIt({ linkify: true })

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
      tags: parseTags(data.tags),
      readingMinutes: readingMinutes(content),
      cover: data.cover,
      html: md.render(content),
    }
  })

  return { post }
}
