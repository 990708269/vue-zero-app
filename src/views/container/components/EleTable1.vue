<template>
  <el-table :data="tableData" style="width: 100%" border height="100%">
    <el-table-column label="任务1" prop="t1" width="100" />
    <el-table-column label="任务2" prop="t2" width="100" />
    <el-table-column label="任务3" prop="t3" width="100" />

    <!-- 年度时间轴列：整条绝对定位渲染，不再按月拆分 -->
    <el-table-column min-width="1080">
      <template #header>
        <div class="timeline-header">
          <span v-for="i in 12" :key="i" class="month-tick">{{ i }}月</span>
        </div>
      </template>
      <template #default="{ row }">
        <div class="timeline-row">
          <!-- 月份网格背景线 -->
          <div class="month-grid">
            <div v-for="i in 12" :key="i" class="grid-segment" />
          </div>
          <!-- 任务条层 -->
          <div class="bars-layer">
            <el-tooltip
              v-for="child in getTaskBars(row as TableDataType)"
              :key="child.title"
              placement="top"
              :show-after="200"
              :hide-after="0"
            >
              <template #content>
                <div class="tooltip-content">
                  <div class="tooltip-title">{{ child.title }}</div>
                  <div class="tooltip-date">
                    {{ child.start }} ~ {{ child.end }}
                  </div>
                </div>
              </template>
              <div
                class="task-bar"
                :style="{
                  left: child.leftPercent + '%',
                  width: child.widthPercent + '%',
                }"
              >
                <span class="task-bar-text">{{ child.title }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="单位1" prop="d1" width="100" />
    <el-table-column label="组1" prop="g1" width="100" />
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

/** 基于全年时间轴的任务条数据 */
interface TaskBar {
  title: string
  start: string
  end: string
  leftPercent: number
  widthPercent: number
}

interface TableDataType {
  t1: string
  t2: string
  t3: string
  d1: string
  g1: string
  taskChildren: TaskChild[]
}

const tableData = ref<TableDataType[]>([])

/** 生成多样化的模拟数据，验证跨月、重叠、超长名称省略等场景 */
function generateMockData(): TableDataType[] {
  const mockChildren: TaskChild[][] = [
    [{ title: '需求评审', start: '2026-1-10', end: '2026-1-25' }],
    [{ title: '前端开发', start: '2026-3-1', end: '2026-6-30' }],
    [
      { title: '后端接口联调', start: '2026-4-15', end: '2026-6-15' },
      { title: '性能优化专项', start: '2026-7-1', end: '2026-8-20' },
    ],
    [{ title: 'UI走查', start: '2026-8-1', end: '2026-8-5' }],
    [{ title: '提测修复阶段', start: '2026-9-1', end: '2026-10-15' }],
    [
      { title: '灰度发布验证', start: '2026-11-1', end: '2026-11-14' },
      { title: '全量上线', start: '2026-11-20', end: '2026-12-5' },
    ],
    [{ title: '数据分析平台搭建', start: '2026-2-1', end: '2026-12-31' }],
    [{ title: '安全审计', start: '2026-5-10', end: '2026-5-25' }],
    [
      {
        title: '这是一个很长的子任务名称用来测试省略号效果',
        start: '2026-3-15',
        end: '2026-4-28',
      },
    ],
    [{ title: '年底复盘总结', start: '2026-12-10', end: '2026-12-28' }],
  ]

  return mockChildren.map((children, i) => ({
    t1: `模块-${i + 1}`,
    t2: `迭代-${i + 1}`,
    t3: `负责人${String.fromCharCode(65 + i)}`,
    d1: `部门${(i % 3) + 1}`,
    g1: `组${(i % 4) + 1}`,
    taskChildren: children,
  }))
}

onMounted(() => {
  tableData.value = generateMockData()
})

/**
 * 基于全年时间轴计算每个子任务的位置与宽度
 * leftPercent / widthPercent 相对于整年天数（365/366）
 */
function getTaskBars(row: TableDataType): TaskBar[] {
  if (!row.taskChildren || row.taskChildren.length === 0) return []

  const yearStart = dayjs(`${year.value}-01-01`)
  const yearEnd = dayjs(`${year.value}-12-31`)
  const daysInYear = yearEnd.diff(yearStart, 'day') + 1

  return row.taskChildren.map((child) => {
    const childStart = dayjs(child.start)
    const childEnd = dayjs(child.end)

    // 钳制到年度范围
    const segStart = childStart.isAfter(yearStart) ? childStart : yearStart
    const segEnd = childEnd.isBefore(yearEnd) ? childEnd : yearEnd

    const leftPercent = (segStart.diff(yearStart, 'day') / daysInYear) * 100
    const widthPercent = ((segEnd.diff(segStart, 'day') + 1) / daysInYear) * 100

    return {
      title: child.title,
      start: child.start,
      end: child.end,
      leftPercent,
      widthPercent,
    }
  })
}
</script>

<style scoped lang="less">
/* ========= 列头：月份刻度 ========= */
.timeline-header {
  display: flex;
  width: 100%;
}

.month-tick {
  flex: 1;
  text-align: center;
  font-size: 13px;
  border-right: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-right: none;
  }
}

/* ========= 每行：时间轴容器 ========= */
.timeline-row {
  position: relative;
  width: 100%;
  height: 42px;
  box-sizing: border-box;
}

/* 月份网格背景虚线 */
.month-grid {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}

.grid-segment {
  flex: 1;
  border-right: 1px solid var(--el-border-color-lighter);

  &:last-child {
    border-right: none;
  }
}

/* 任务条层 */
.bars-layer {
  position: absolute;
  inset: 4px 0;
}

/* 单条任务条 */
.task-bar {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(135deg, #409eff, #66b1ff);
  display: flex;
  align-items: center;
  padding: 0 6px;
  box-sizing: border-box;
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    filter 0.2s;
  min-width: 4px;

  &:hover {
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.45);
    filter: brightness(1.08);
    z-index: 2;
  }
}

/* 条内文字：单行超出省略号 */
.task-bar-text {
  color: #fff;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

/* Tooltip 内容 */
.tooltip-content {
  font-size: 13px;
  line-height: 1.5;

  .tooltip-title {
    font-weight: 600;
    margin-bottom: 2px;
  }

  .tooltip-date {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}
</style>

<style lang="less">
/* 去掉全局表格单元格的默认内边距，让时间轴占满 */
.el-table td.el-table__cell {
  padding: 0 !important;
  box-sizing: border-box;
}
</style>
