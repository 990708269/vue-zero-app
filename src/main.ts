import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

// 引入路由
import router from '@/router'
// 引入unocss
import 'virtual:uno.css'
// 引入重置样式
import '@unocss/reset/tailwind-v4.css'

createApp(App).use(router).mount('#app')
