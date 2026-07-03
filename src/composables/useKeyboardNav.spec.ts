import { describe, it, expect } from 'vitest'
import { defineComponent, ref, h } from 'vue'
import { mount } from '@vue/test-utils'
import { nextIndex, useKeyboardNav } from './useKeyboardNav'

describe('nextIndex', () => {
  it('moves forward within bounds', () => {
    expect(nextIndex(1, 1, 5)).toBe(2)
  })

  it('wraps forward past the end', () => {
    expect(nextIndex(4, 1, 5)).toBe(0)
  })

  it('moves backward within bounds', () => {
    expect(nextIndex(2, -1, 5)).toBe(1)
  })

  it('wraps backward past the start', () => {
    expect(nextIndex(0, -1, 5)).toBe(4)
  })
})

const TestNav = defineComponent({
  setup() {
    const containerRef = ref<HTMLElement | null>(null)
    useKeyboardNav(containerRef)
    return { containerRef }
  },
  render() {
    return h('ul', { ref: 'containerRef' }, [
      h('li', [h('a', { href: '#a', id: 'link-a' }, 'A')]),
      h('li', [h('a', { href: '#b', id: 'link-b' }, 'B')]),
      h('li', [h('a', { href: '#c', id: 'link-c' }, 'C')]),
    ])
  },
})

describe('useKeyboardNav', () => {
  it('moves focus to the next link on ArrowDown', () => {
    const wrapper = mount(TestNav, { attachTo: document.body })
    const linkA = wrapper.find('#link-a').element as HTMLElement
    const linkB = wrapper.find('#link-b').element as HTMLElement
    linkA.focus()
    expect(document.activeElement).toBe(linkA)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))

    expect(document.activeElement).toBe(linkB)
    wrapper.unmount()
  })

  it('wraps to the first link when ArrowDown is pressed on the last link', () => {
    const wrapper = mount(TestNav, { attachTo: document.body })
    const linkA = wrapper.find('#link-a').element as HTMLElement
    const linkC = wrapper.find('#link-c').element as HTMLElement
    linkC.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))

    expect(document.activeElement).toBe(linkA)
    wrapper.unmount()
  })

  it('moves focus to the previous link on ArrowUp', () => {
    const wrapper = mount(TestNav, { attachTo: document.body })
    const linkA = wrapper.find('#link-a').element as HTMLElement
    const linkB = wrapper.find('#link-b').element as HTMLElement
    linkB.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))

    expect(document.activeElement).toBe(linkA)
    wrapper.unmount()
  })

  it('does nothing when focus is outside the container', () => {
    const wrapper = mount(TestNav, { attachTo: document.body })
    const linkA = wrapper.find('#link-a').element as HTMLElement
    document.body.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))

    expect(document.activeElement).not.toBe(linkA)
    wrapper.unmount()
  })
})
