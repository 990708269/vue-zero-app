import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

// import HomeView from './HomeView.vue'
// import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: () => import('@/components/HelloWorld.vue') },
  { path: '/test1', component: () => import('@/views/container/index.vue') },
]

const router = createRouter({
  history: createWebHistory('/vue-zero-app/'),
  routes,
})

export default router
