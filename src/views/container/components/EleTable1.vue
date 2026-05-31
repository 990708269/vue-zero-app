<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    border
    height="100%"
    :cell-class-name="cellClassName"
  >
    <el-table-column label="任务1" prop="t1" width="100"></el-table-column>
    <el-table-column label="任务2" prop="t2" width="100"></el-table-column>
    <el-table-column label="任务3" prop="t3" width="100"></el-table-column>
    <el-table-column
      v-for="i in 12"
      :label="`${i}月`"
      :key="i"
      min-width="90"
      class-name="month-col"
    >
      <template #default="{ row }">
        <div class="month-cell">
          <div
            v-for="child in getMonthSegments(row as TableDataType, i)"
            :key="child.title"
            class="month-bar"
            :style="{
              left: child.leftPercent + '%',
              width: child.widthPercent + '%',
            }"
            :title="`${child.title}: ${child.start} ~ ${child.end}`"
          ></div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="单位1" prop="d1" width="100"></el-table-column>
    <el-table-column label="组1" prop="g1" width="100"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const year = ref(2026)

interface TaskChild {
  title: string
  start: string
  end: string
}

interface MonthSegment {
  title: string
  start: string
  end: string
  leftPercent: number
  widthPercent: number
}

// 表格数据类型
interface TableDataType {
  t1: string
  t2: string
  t3: string
  d1: string
  g1: string
  taskChildren: TaskChild[]
  [key: string]: any
}

const tableData = ref<TableDataType[]>([])

onMounted(() => {
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

/**
 * 计算某一行的某个月份中，每个子任务占据的天数比例（精确到天）
 */
function getMonthSegments(
  row: TableDataType,
  monthIndex: number,
): MonthSegment[] {
  if (!row.taskChildren || row.taskChildren.length === 0) return []

  const monthStart = dayjs(`${year.value}-${monthIndex}-01`)
  const monthEnd = monthStart.endOf('month')
  const daysInMonth = monthStart.daysInMonth()

  const segments: MonthSegment[] = []

  for (const child of row.taskChildren) {
    const childStart = dayjs(child.start)
    const childEnd = dayjs(child.end)

    // 子任务与当前月份无交集，跳过
    if (childEnd.isBefore(monthStart) || childStart.isAfter(monthEnd)) {
      continue
    }

    // 取交集区间
    const segStart = childStart.isAfter(monthStart) ? childStart : monthStart
    const segEnd = childEnd.isBefore(monthEnd) ? childEnd : monthEnd

    // 计算该区间占整月天数的比例
    const segStartDay = segStart.date()
    // const segEndDay = segEnd.date()

    // leftPercent: 区间起点在月中的位置（0% = 1号，100% = 最后一天）
    const leftPercent = ((segStartDay - 1) / daysInMonth) * 100
    // widthPercent: 区间跨度（包含起止日当天）
    const spanDays = segEnd.diff(segStart, 'day') + 1
    const widthPercent = (spanDays / daysInMonth) * 100

    segments.push({
      title: child.title,
      start: segStart.format('YYYY-MM-DD'),
      end: segEnd.format('YYYY-MM-DD'),
      leftPercent,
      widthPercent,
    })
  }

  return segments
}

/**
 * 判断某一行的某个月份，是否有子任务跨越到该月最后一天（即还会延续到下个月）
 * 条件：子任务与该月有交集，且子任务结束日期在该月月末之后
 */
function monthEndsOnTask(row: TableDataType, monthIndex: number): boolean {
  if (!row.taskChildren || row.taskChildren.length === 0) return false

  const monthStart = dayjs(`${year.value}-${monthIndex}-01`)
  const monthEnd = monthStart.endOf('month')

  return row.taskChildren.some((child) => {
    const childStart = dayjs(child.start)
    const childEnd = dayjs(child.end)
    // 月末被包含在子任务区间内：开始 ≤ 月末 < 结束
    return !childStart.isAfter(monthEnd) && childEnd.isAfter(monthEnd)
  })
}

/**
 * cell-class-name：月份列中如果任务跨越到月末，添加 no-border-right 类
 */
function cellClassName({ row, column }: { row: TableDataType; column: any }) {
  const match = column.label?.match(/^(\d+)月$/)
  if (match) {
    const monthIndex = Number.parseInt(match[1])
    if (monthEndsOnTask(row, monthIndex)) {
      return 'no-border-right'
    }
  }
  return ''
}
</script>

<style scoped lang="less">
:deep(.cell) {
  padding: 0;
}

:deep(.no-border-right) {
  border-right: none !important;
}

.month-cell {
  @apply relative w-full h-full min-h-50px;
}

.month-bar {
  position: absolute;
  top: 0;
  height: 100%;
  background-color: #409eff;
  opacity: 0.6;
}
</style>

<style lang="less">
.el-table td.el-table__cell {
  padding: 0 !important;
  box-sizing: border-box;
}
</style>
