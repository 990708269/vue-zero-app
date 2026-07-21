<template>
  <div class="size-full" ref="$container"></div>
</template>

<script setup lang="ts">
import Artplayer, { type Option } from 'artplayer'

const props = defineProps<{
  option: Option
}>()
const emit = defineEmits(['getInstance'])

const art = shallowRef<Artplayer | null>(null)
const $container = ref(null)

onMounted(() => {
  art.value = new Artplayer({
    ...props.option,
    container: $container.value,
  })
  emit('getInstance', art.value)
})

onBeforeUnmount(() => {
  art.value?.destroy(false)
})
</script>

<style scoped lang="scss"></style>
