import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import StackView from './StackView.vue'
import { siteStack, skillCategories } from '../data/stack'

function mountView() {
  return mount(StackView, { global: { stubs: { RouterLink: RouterLinkStub } } })
}

describe('StackView', () => {
  it('renders one entry per skill item', () => {
    const wrapper = mountView()
    const total = skillCategories.reduce((sum, c) => sum + c.items.length, 0)
    expect(wrapper.findAll('[data-testid="stack-item"]')).toHaveLength(total)
  })

  it('renders the site stack separately', () => {
    const wrapper = mountView()
    expect(wrapper.findAll('[data-testid="site-stack-item"]')).toHaveLength(siteStack.length)
  })

  it('shows all four skill category titles', () => {
    const wrapper = mountView()
    for (const category of skillCategories) {
      expect(wrapper.text()).toContain(category.title)
    }
  })
})
