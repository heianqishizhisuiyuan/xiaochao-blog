import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/posts', name: 'posts', component: () => import('../views/PostsView.vue') },
    { path: '/posts/:slug', name: 'post-detail', component: () => import('../views/PostDetailView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/archive', name: 'archive', component: () => import('../views/ArchiveView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
