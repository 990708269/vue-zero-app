import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

// import HomeView from './HomeView.vue'
// import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: () => import('@/components/HelloWorld.vue') },
  { path: '/test1', component: () => import('@/views/container/index.vue') },
]

const router = createRouter({
  // 保持和vite.config.ts中base一致
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
