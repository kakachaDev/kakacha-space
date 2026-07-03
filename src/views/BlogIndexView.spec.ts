import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import BlogIndexView from './BlogIndexView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/blog/:slug', name: 'blog-post', component: { template: '<div/>' } }],
})

describe('BlogIndexView', () => {
  it('lists both seed posts', async () => {
    router.push('/blog/x')
    await router.isReady()
    const wrapper = mount(BlogIndexView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('LittleJS')
    expect(wrapper.text()).toContain('Как устроен этот сайт')
  })
})
