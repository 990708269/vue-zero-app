<template>
  <RGProvider>
    <MyGraph />
  </RGProvider>
</template>

<script setup lang="ts">
import { RGProvider } from '@relation-graph/vue'
import MyGraph from './MyGraph.vue'
</script>
