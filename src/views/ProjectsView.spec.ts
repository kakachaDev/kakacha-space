import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsView from './ProjectsView.vue'
import { projects } from '../data/projects'

describe('ProjectsView', () => {
  it('renders a card for every project', () => {
    const wrapper = mount(ProjectsView)
    const cards = wrapper.findAllComponents({ name: 'ProjectCard' })
    expect(cards).toHaveLength(projects.length)
  })

  it('groups projects under russian category headings', () => {
    const wrapper = mount(ProjectsView)
    expect(wrapper.text()).toContain('Игры')
    expect(wrapper.text()).toContain('Minecraft-плагины')
  })

  it('shows status badges and tags', () => {
    const wrapper = mount(ProjectsView)
    expect(wrapper.findAll('[data-testid="status"]').length).toBe(projects.length)
    expect(wrapper.text()).toContain('в разработке')
  })
})
