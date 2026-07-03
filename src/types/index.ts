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
