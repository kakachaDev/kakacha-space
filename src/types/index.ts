export type ProjectCategory = 'platform' | 'games' | 'minecraft' | 'audio' | 'tools'

export type ProjectStatus = 'active' | 'done' | 'onhold'

export interface Project {
  slug: string
  name: string
  description: string
  category: ProjectCategory
  repoUrl: string
  demoUrl?: string
  icon: string
  tags: string[]
  year?: number
  status: ProjectStatus
  highlight?: string
}

export interface StackItem {
  name: string
  note: string
}

export interface StackCategory {
  id: string
  title: string
  items: StackItem[]
}

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingMinutes: number
  cover?: string
}

export interface BlogPost extends BlogPostMeta {
  html: string
}
