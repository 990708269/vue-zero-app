import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

// import HomeView from './HomeView.vue'
// import AboutView from './AboutView.vue'

const routes = [
  // 加上layout组件 src\layout\index.vue
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/hello',
    children: [
      {
        path: '/hello',
        component: () => import('@/components/HelloWorld.vue'),
      },
      {
        path: '/test1',
        component: () => import('@/views/container/index.vue'),
      },
      {
        path: '/universe',
        component: () => import('@/views/universeIo/index.vue'),
      },
      {
        path: '/video',
        component: () => import('@/components/Video/index.vue'),
      },
      {
        path: '/daisy-ui',
        component: () => import('@/views/daysyui/index.vue'),
      },
      {
        path: '/relationGraph',
        component: () => import('@/views/relationGraph/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  // 保持和vite.config.ts中base一致
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
