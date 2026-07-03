import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StackView from './StackView.vue'
import { stackItems } from '../data/stack'

describe('StackView', () => {
  it('renders one entry per stack item', () => {
    const wrapper = mount(StackView)
    const entries = wrapper.findAll('[data-testid="stack-item"]')
    expect(entries).toHaveLength(stackItems.length)
  })
})
