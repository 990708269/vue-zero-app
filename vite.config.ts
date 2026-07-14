import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base: '/vue-zero-app/',
  build: {
    // 输出目录改为 dist/vue-zero-app
    outDir: 'dist/vue-zero-app',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // 配置别名 @ 指向 src 目录
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
