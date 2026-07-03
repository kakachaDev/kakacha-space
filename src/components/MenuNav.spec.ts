import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import MenuNav from './MenuNav.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div/>' } },
    { path: '/projects', name: 'projects', component: { template: '<div/>' } },
    { path: '/stack', name: 'stack', component: { template: '<div/>' } },
    { path: '/blog', name: 'blog', component: { template: '<div/>' } },
    { path: '/contact', name: 'contact', component: { template: '<div/>' } },
  ],
})

describe('MenuNav', () => {
  it('renders exactly 5 section links', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(MenuNav, { global: { plugins: [router] } })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(5)
  })

  it('includes the Quest Log (projects) link', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(MenuNav, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Quest Log')
  })
})
