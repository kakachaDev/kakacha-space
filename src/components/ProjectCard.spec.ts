import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from './ProjectCard.vue'
import type { Project } from '../types'

const project: Project = {
  slug: 'flag-mines',
  name: 'Flag Mines',
  description: 'Reverse-minesweeper web game.',
  category: 'games',
  repoUrl: 'https://github.com/kakachaDev/flag-mines',
  demoUrl: 'https://work.kakacha.space/yg/flag-mines/',
}

describe('ProjectCard', () => {
  it('renders the project name and description', () => {
    const wrapper = mount(ProjectCard, { props: { project } })
    expect(wrapper.text()).toContain('Flag Mines')
    expect(wrapper.text()).toContain('Reverse-minesweeper web game.')
  })

  it('links to the repo URL', () => {
    const wrapper = mount(ProjectCard, { props: { project } })
    const repoLink = wrapper.find('a[data-testid="repo-link"]')
    expect(repoLink.attributes('href')).toBe('https://github.com/kakachaDev/flag-mines')
  })

  it('shows a demo link when demoUrl is present', () => {
    const wrapper = mount(ProjectCard, { props: { project } })
    expect(wrapper.find('a[data-testid="demo-link"]').exists()).toBe(true)
  })

  it('omits the demo link when demoUrl is absent', () => {
    const { demoUrl, ...withoutDemo } = project
    const wrapper = mount(ProjectCard, { props: { project: withoutDemo } })
    expect(wrapper.find('a[data-testid="demo-link"]').exists()).toBe(false)
  })
})
