import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactView from './ContactView.vue'

describe('ContactView', () => {
  it('links to the GitHub profile', () => {
    const wrapper = mount(ContactView)
    const link = wrapper.find('a[href="https://github.com/kakachaDev"]')
    expect(link.exists()).toBe(true)
  })

  it('links to kakacha.space itself', () => {
    const wrapper = mount(ContactView)
    const link = wrapper.find('a[href="https://kakacha.space"]')
    expect(link.exists()).toBe(true)
  })
})
