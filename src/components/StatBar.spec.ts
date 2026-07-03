import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatBar from './StatBar.vue'

describe('StatBar', () => {
  it('renders the label', () => {
    const wrapper = mount(StatBar, { props: { label: 'Frontend', value: 90 } })
    expect(wrapper.text()).toContain('Frontend')
  })

  it('sets the fill width from value', () => {
    const wrapper = mount(StatBar, { props: { label: 'Frontend', value: 90 } })
    const fill = wrapper.find('.stat-bar__fill')
    expect(fill.attributes('style')).toContain('width: 90%')
  })

  it('clamps values above 100 to 100', () => {
    const wrapper = mount(StatBar, { props: { label: 'Coffee', value: 140 } })
    const fill = wrapper.find('.stat-bar__fill')
    expect(fill.attributes('style')).toContain('width: 100%')
  })

  it('clamps negative values to 0', () => {
    const wrapper = mount(StatBar, { props: { label: 'Sleep', value: -20 } })
    const fill = wrapper.find('.stat-bar__fill')
    expect(fill.attributes('style')).toContain('width: 0%')
  })
})
