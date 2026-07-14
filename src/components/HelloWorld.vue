<template>
  <div class="container flex-c mt-10 relative">
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

    <!-- 右上角按钮 -->
    <el-button type="success" @click="jump" class="absolute top-0 right-20"
      >跳转到 /test1</el-button
    >
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const jump = () => {
  router.push('/test1')
}
const color = ref('#409EFF')

const count = ref(0)
const increment = () => {
  count.value++
}
</script>
