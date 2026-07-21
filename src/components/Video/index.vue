<template>
  <div class="w-[800px] h-[500px] border-base m-[0_auto]">
    <ArtplayerVideo :option />
  </div>
</template>

<script setup lang="ts">
import { type Option } from 'artplayer'
import ArtplayerVideo from '@/components/Video/ArtplayerVideo.vue'

const option: Option = {
  container: null,
  url: `${import.meta.env.BASE_URL}/video/video_回望当年第一声枪响如何刺破长夜沉.mp4`,
}
</script>

<style scoped></style>
