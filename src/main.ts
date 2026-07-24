import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

// 引入视频播放器
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

// 引入路由
import router from '@/router'

// 按需加载daisyUI组件（排除 megamenu，避免 Chrome Popover API 弃用警告）
import '@/assets/daisyui-custom.css'
// 引入unocss
import 'virtual:uno.css'
// 引入重置样式
import '@unocss/reset/tailwind-v4.css'

createApp(App).use(router).use(VueVideoPlayer).mount('#app')
