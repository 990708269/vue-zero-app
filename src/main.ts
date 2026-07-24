import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

// 引入视频播放器
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

// 引入路由
import router from '@/router'

// 先加载daisy所有内置组件（含hover-3d）
import 'daisyui/daisyui.css'
// 引入unocss
import 'virtual:uno.css'
// 引入重置样式
import '@unocss/reset/tailwind-v4.css'

createApp(App).use(router).use(VueVideoPlayer).mount('#app')
