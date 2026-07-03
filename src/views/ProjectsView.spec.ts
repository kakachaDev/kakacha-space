import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsView from './ProjectsView.vue'

describe('ProjectsView', () => {
  it('renders all 10 projects', () => {
    const wrapper = mount(ProjectsView)
    const cards = wrapper.findAllComponents({ name: 'ProjectCard' })
    expect(cards).toHaveLength(10)
  })

  it('groups projects under category headings', () => {
    const wrapper = mount(ProjectsView)
    expect(wrapper.text()).toContain('games')
    expect(wrapper.text()).toContain('minecraft')
  })
})
