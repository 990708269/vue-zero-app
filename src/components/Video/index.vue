<template>
  <el-space direction="vertical" :size="50">
    <div class="w-[800px] h-[500px] border-base video-item">
      <h2>artplayer库</h2>
      <ArtplayerVideo :option />
    </div>
    <div class="w-[800px] h-[500px] border-base video-item">
      <h2>原生video</h2>
      <!-- 这里的src无需加vite.config.ts中的base前缀，vite会处理 -->
      <video ref="videoRef" src="/video/qianyuqianxun.mp4" controls></video>
    </div>
    <div class="w-[800px] h-[500px] border-base video-item">
      <h2>video-player库</h2>
      <video-player class="size-full" :src :poster controls :volume="0.6">
        <template v-slot="{ player, state }">
          <div class="custom-player-controls">
            <button @click="state.playing ? player.pause() : player.play()">
              {{ state.playing ? 'Pause' : 'Play' }}
            </button>
            <button @click="player.muted(!state.muted)">
              {{ state.muted ? 'UnMute' : 'Mute' }}
            </button>
            <!-- more custom controls elements ... -->
          </div>
        </template>
      </video-player>
    </div>
  </el-space>
</template>

<script setup lang="ts">
import { type Option } from 'artplayer'
import ArtplayerVideo from '@/components/Video/ArtplayerVideo.vue'
import { VideoPlayer } from '@videojs-player/vue'

// 视频地址
const src = `${import.meta.env.BASE_URL}/video/qianyuqianxun.mp4`
const poster = `${import.meta.env.BASE_URL}/video/qianyuqianxun.png`

const option: Option = {
  container: null,
  url: src,
}
</script>

<style scoped lang="scss">
.video-item {
  h2 {
    @apply text-center text-lg font-bold mb-2;
  }
}
</style>
