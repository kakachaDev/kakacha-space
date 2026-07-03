import { describe, it, expect, beforeEach } from 'vitest'
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
  beforeEach(() => {
    localStorage.clear()
  })

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

  it('renders a sound toggle that is off by default', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(MenuNav, { global: { plugins: [router] } })
    expect(wrapper.find('.menu-nav__sound-toggle').text()).toContain('выкл')
  })

  it('clicking the sound toggle flips its label', async () => {
    router.push('/')
    await router.isReady()
    const wrapper = mount(MenuNav, { global: { plugins: [router] } })
    await wrapper.find('.menu-nav__sound-toggle').trigger('click')
    expect(wrapper.find('.menu-nav__sound-toggle').text()).toContain('вкл')
  })
})
