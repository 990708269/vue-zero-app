<template>
  <div style="width: 100vw; height: 100vh; background-color: #ffffff">
    <RelationGraph
      :options="graphOptions"
      @onNodeClick="onNodeClick"
      @onLineClick="onLineClick" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RelationGraph, RGHooks } from '@relation-graph/vue'
import type { JsonNode, JsonLine, RGOptions } from '@relation-graph/vue'
import type { RGNode, RGLine, RGLink, RGUserEvent } from '@relation-graph/vue'

const graphInstance = RGHooks.useGraphInstance()

const graphOptions: RGOptions = {
  showToolBar: false,
  wheelEventAction: 'scroll',
  dragEventAction: 'move',
  layout: {
    layoutName: 'tree',
    from: 'left',
    treeNodeGapH: 150,
    treeNodeGapV: 10,
  },
}

const onNodeClick = (nodeObject: RGNode, event: RGUserEvent) => {
  console.log('node click:', nodeObject.id, event)
}

const onLineClick = (
  lineObject: RGLine,
  linkObject: RGLink,
  event: RGUserEvent,
) => {
  console.log('line click:', lineObject.from, lineObject.to, linkObject, event)
}

const initializeGraph = () => {
  const nodes: JsonNode[] = [
    { id: '1', text: 'Root' },
    { id: '2', text: 'Vue3 App' },
    { id: '3', text: 'Graph Engine' },
    { id: '4', text: 'UI Layer' },
  ]
  const lines: JsonLine[] = [
    { id: 's1', from: '1', to: '2', text: 'uses' },
    { id: 's2', from: '1', to: '3', text: 'drives' },
    { id: 's3', from: '2', to: '4', text: 'renders' },
  ]

  graphInstance.clearGraph()
  graphInstance.addNodes(nodes)
  graphInstance.addLines(lines)

  setTimeout(() => {
    const layouter = graphInstance.createLayout({
      layoutName: 'tree',
      from: 'left',
      treeNodeGapH: 150,
      treeNodeGapV: 10,
    })
    const allNodes = graphInstance.getNodes()
    const rootNode = graphInstance.getNodeById('1')
    if (rootNode) {
      layouter.placeNodes(allNodes, rootNode)
    }
    graphInstance.moveToCenter()
    graphInstance.zoomToFit()
  }, 300)
}

onMounted(() => {
  initializeGraph()
})

const creatingLine = RGHooks.useCreatingLine()
const creatingNode = RGHooks.useCreatingNode()
const editingNodes = RGHooks.useEditingNodes()
const editingLine = RGHooks.useEditingLine()
const connectingNode = RGHooks.useConnectingNode()
const viewInformation = RGHooks.useViewInformation()
const checkedItem = RGHooks.useCheckedItem()
</script>
