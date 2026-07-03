import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import BlogPostView from './BlogPostView.vue'

function mountView(slug: string) {
  return mount(BlogPostView, {
    props: { slug },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('BlogPostView', () => {
  it('renders the post matching the slug prop', () => {
    const wrapper = mountView('2026-07-03-kak-ustroen-etot-sayt')
    expect(wrapper.text()).toContain('Как устроен этот сайт')
  })

  it('shows date, reading time and tags in the meta line', () => {
    const wrapper = mountView('2026-07-03-kak-ustroen-etot-sayt')
    expect(wrapper.text()).toContain('3 июля 2026')
    expect(wrapper.text()).toMatch(/\d+ мин чтения/)
    expect(wrapper.text()).toContain('#vue')
  })

  it('renders a cover image when the post has one', () => {
    const wrapper = mountView('2026-02-14-svoy-dvizhok-chastic')
    expect(wrapper.find('.post-cover').attributes('src')).toBe('/blog/particles-cover.svg')
  })

  it('hides the comments block when no backend is configured', () => {
    const wrapper = mountView('2026-07-03-kak-ustroen-etot-sayt')
    expect(wrapper.find('[data-testid="comments"]').exists()).toBe(false)
  })

  it('shows a not-found message for an unknown slug', () => {
    const wrapper = mountView('nope')
    expect(wrapper.text()).toContain('не найден')
  })
})
