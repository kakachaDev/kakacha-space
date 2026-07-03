import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BlogPostView from './BlogPostView.vue'

describe('BlogPostView', () => {
  it('renders the post matching the slug prop', () => {
    const wrapper = mount(BlogPostView, { props: { slug: '2026-07-03-kak-ustroen-etot-sayt' } })
    expect(wrapper.text()).toContain('Как устроен этот сайт')
  })

  it('shows a not-found message for an unknown slug', () => {
    const wrapper = mount(BlogPostView, { props: { slug: 'nope' } })
    expect(wrapper.text()).toContain('не найден')
  })
})
