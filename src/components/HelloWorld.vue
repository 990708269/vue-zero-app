<template>
  <div class="container flex-c flex-col mt-10 relative flex-wrap">
    <!-- 右上角按钮 -->
    <el-space wrap class="mb-8">
      <el-button type="success" @click="jump('/test1')"
        >跳转到 /test1</el-button
      >
      <el-button type="success" @click="jump('/universe')"
        >跳转到 /universe</el-button
      >
      <el-button type="success" @click="jump('/video')"
        >跳转到 /video</el-button
      >
      <el-button type="success" @click="jump('/daisy-ui')"
        >跳转到 /daisy-ui</el-button
      >
      <el-button type="success" @click="jump('/relationGraph')"
        >跳转到 /relationGraph</el-button
      >
    </el-space>

    <el-space wrap class="p-10 border border-dashed border-pink-400">
      <div>
        <div class="text-2xl mb-2">ColorPickerPanel 颜色选择器面板</div>
        <el-color-picker-panel v-model="color" />
      </div>
      <el-button @click="increment">{{ count }}</el-button>
      <el-button type="primary" @click="increment">{{ count }}</el-button>
      <el-button type="success" @click="increment">{{ count }}</el-button>
      <el-button type="info" @click="increment">{{ count }}</el-button>
      <el-button type="warning" @click="increment">{{ count }}</el-button>
      <el-button type="danger" @click="increment">{{ count }}</el-button>
    </el-space>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const jump = (path: string) => {
  router.push(path)
}
const color = ref('#409EFF')

const count = ref(0)
const increment = () => {
  count.value++
}
</script>
