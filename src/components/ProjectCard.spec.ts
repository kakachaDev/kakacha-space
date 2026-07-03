import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from './ProjectCard.vue'
import type { Project } from '../types'

const project: Project = {
  slug: 'flag-mines',
  name: 'Flag Mines',
  description: 'Сапёр наоборот.',
  category: 'games',
  repoUrl: 'https://github.com/kakachaDev/flag-mines',
  demoUrl: 'https://work.kakacha.space/yg/flag-mines/',
  icon: '💣',
  tags: ['LittleJS', 'Vite'],
  year: 2026,
  status: 'done',
  highlight: 'Движок выбран под размер бандла.',
}

describe('ProjectCard', () => {
  it('renders the project name and description', () => {
    const wrapper = mount(ProjectCard, { props: { project } })
    expect(wrapper.text()).toContain('Flag Mines')
    expect(wrapper.text()).toContain('Сапёр наоборот.')
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

  it('renders icon, tags, year and status badge', () => {
    const wrapper = mount(ProjectCard, { props: { project } })
    expect(wrapper.text()).toContain('💣')
    expect(wrapper.text()).toContain('2026')
    expect(wrapper.find('[data-testid="status"]').text()).toContain('завершён')
    const tags = wrapper.findAll('[data-testid="tags"] li').map((t) => t.text())
    expect(tags).toEqual(['LittleJS', 'Vite'])
  })

  it('renders the highlight line when present and hides it otherwise', () => {
    const withHighlight = mount(ProjectCard, { props: { project } })
    expect(withHighlight.find('[data-testid="highlight"]').text()).toContain('Движок выбран')

    const { highlight, ...withoutHighlight } = project
    const wrapper = mount(ProjectCard, { props: { project: withoutHighlight } })
    expect(wrapper.find('[data-testid="highlight"]').exists()).toBe(false)
  })
})
