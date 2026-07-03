export type ProjectCategory = 'platform' | 'games' | 'minecraft' | 'audio' | 'tools'

export interface Project {
  slug: string
  name: string
  description: string
  category: ProjectCategory
  repoUrl: string
  demoUrl?: string
  archived?: boolean
}

export interface StackItem {
  name: string
  note: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
}

export interface BlogPost extends BlogPostMeta {
  html: string
}
