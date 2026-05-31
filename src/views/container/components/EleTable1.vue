<template>
  <el-table :data="tableData" style="width: 100%" border max-height="100%">
    <!-- 生成列，列名如下：任务1、任务2、任务3、1月至12月、单位1、组1 -->
    <el-table-column label="任务1" prop="t1"></el-table-column>
    <el-table-column label="任务2" prop="t2"></el-table-column>
    <el-table-column label="任务3" prop="t3"></el-table-column>
    <!-- 循环生成1到12的列，列名格式为：1月至12月 -->
    <el-table-column
      v-for="i in 12"
      :label="`${i}月`"
      :key="i"
      :prop="`${i}月`"
    >
    </el-table-column>
    <el-table-column label="单位1" prop="d1"></el-table-column>
    <el-table-column label="组1" prop="g1"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const now = new Date()

// 表格数据类型
interface TableDataType {
  t1: string
  t2: string
  t3: string
  d1: string
  g1: string
  [key: string]: any
}

const tableData = ref<TableDataType[]>([])

onMounted(() => {
  // 生成10行表格数据
  for (let i = 0; i < 10; i++) {
    const data: TableDataType = {
      t1: `任务1-${i + 1}`,
      t2: `任务2-${i + 1}`,
      t3: `任务3-${i + 1}`,
      d1: `单位-${i + 1}`,
      g1: `组-${i + 1}`,
      taskChildren: [
        {
          title: '子任务1',
          start: '2026-4-15',
          end: '2026-6-15',
        },
      ],
    }
    for (let j = 1; j <= 12; j++) {
      data[`${j}月`] = ''
    }
    tableData.value.push(data)
  }
})
</script>

<style scoped></style>
