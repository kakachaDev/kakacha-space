import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/AboutView.vue') },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue') },
    { path: '/stack', name: 'stack', component: () => import('../views/StackView.vue') },
    { path: '/blog', name: 'blog', component: () => import('../views/BlogIndexView.vue') },
    { path: '/blog/:slug', name: 'blog-post', component: () => import('../views/BlogPostView.vue'), props: true },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
  ],
})

export default router
