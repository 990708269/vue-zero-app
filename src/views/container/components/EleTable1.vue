<template>
  <el-table
    :data="displayData"
    :cell-style="{ padding: '0' }"
    :header-cell-style="{ padding: '0' }"
    style="width: 100%"
    border
    height="100%"
  >
    <el-table-column label="任务1" prop="t1" width="100" align="center" />
    <el-table-column label="任务2" prop="t2" width="100" align="center" />
    <el-table-column label="任务3" prop="t3" width="100" align="center" />

    <!-- 年度时间轴列 -->
    <el-table-column min-width="1080">
      <template #header>
        <div class="timeline-header">
          <span v-for="i in 12" :key="i" class="month-tick">{{ i }}月</span>
        </div>
      </template>
      <template #default="{ row }">
        <!-- 主行 -->
        <div
          v-if="row.rowType === 'main'"
          class="timeline-row"
          :style="{ height: getRowHeight(row as TableDataType) + 'px' }"
        >
          <div class="month-grid">
            <div v-for="i in 12" :key="i" class="grid-segment" />
          </div>
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
                  top: child.lane * 32 + 4 + 'px',
                }"
              >
                <span class="task-bar-text">{{ child.title }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
        <!-- 子任务行 -->
        <div
          v-else
          class="subtask-row"
          :style="{
            marginLeft: row.parentLeft + '%',
            width: row.parentWidth + '%',
          }"
        >
          <el-scrollbar max-height="50px">
            <div
              class="subtask-scroll-inner"
              :style="{
                height: (row.subtaskBars?.[0]?.totalLanes ?? 1) * 26 + 4 + 'px',
              }"
            >
              <el-tooltip
                v-for="bar in row.subtaskBars"
                :key="bar.title"
                placement="top"
                :show-after="200"
                :hide-after="0"
              >
                <template #content>
                  <div class="tooltip-content">
                    <div class="tooltip-title">{{ bar.title }}</div>
                    <div class="tooltip-date">
                      {{ bar.start }} ~ {{ bar.end }}
                    </div>
                  </div>
                </template>
                <div
                  class="subtask-bar"
                  :style="{
                    left: bar.leftPercent + '%',
                    width: bar.widthPercent + '%',
                    top: bar.lane * 26 + 2 + 'px',
                  }"
                >
                  <span class="task-bar-text">{{ bar.title }}</span>
                </div>
              </el-tooltip>
            </div>
          </el-scrollbar>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="单位1" prop="d1" width="100" align="center" />
    <el-table-column label="组1" prop="g1" width="100" align="center" />
  </el-table>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const year = ref(2026)

interface TaskChild {
  title: string
  start: string
  end: string
  children?: TaskChild[]
}

/** 基于全年时间轴的任务条数据 */
interface TaskBar {
  title: string
  start: string
  end: string
  leftPercent: number
  widthPercent: number
  lane: number
  totalLanes: number
}

interface TableDataType {
  t1: string
  t2: string
  t3: string
  d1: string
  g1: string
  taskChildren: TaskChild[]
}

/** 展开后的显示行：主行 / 子任务行 */
interface DisplayRow extends TableDataType {
  rowType: 'main' | 'subtask'
  parentLeft?: number
  parentWidth?: number
  subtaskBars?: TaskBar[]
}

const rawData = ref<TableDataType[]>([])

/** 生成多样化的模拟数据，验证跨月、重叠、超长名称省略等场景 */
const generateMockData = (): TableDataType[] => {
  const mockChildren: TaskChild[][] = [
    [{ title: '需求评审', start: '2026-1-10', end: '2026-1-25' }],
    [
      {
        title: '前端开发',
        start: '2026-3-1',
        end: '2026-6-30',
        children: [
          { title: '框架搭建', start: '2026-3-1', end: '2026-3-20' },
          { title: '页面开发', start: '2026-3-21', end: '2026-5-31' },
          { title: '联调修复', start: '2026-6-1', end: '2026-6-25' },
          { title: '代码评审', start: '2026-3-10', end: '2026-6-15' },
        ],
      },
      { title: 'UI设计', start: '2026-4-10', end: '2026-5-20' },
      { title: '联调测试', start: '2026-8-3', end: '2026-9-15' },
    ],
    [
      {
        title: '后端接口联调',
        start: '2026-4-15',
        end: '2026-7-31',
        children: [
          { title: '接口设计', start: '2026-4-15', end: '2026-4-30' },
          { title: '服务端开发', start: '2026-5-1', end: '2026-6-30' },
          { title: '压力测试', start: '2026-7-1', end: '2026-7-25' },
        ],
      },
      { title: '性能优化专项', start: '2026-5-1', end: '2026-8-20' },
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
  rawData.value = generateMockData()
})

/**
 * 将日期转为百分比位置（按月份等比，与视觉 12 等分列宽对齐）
 */
const dateToPercent = (d: dayjs.Dayjs): number => {
  const m = d.month()
  const dayInMonth = d.date()
  const daysInMonth = d.daysInMonth()
  return ((m + (dayInMonth - 1) / daysInMonth) / 12) * 100
}

/** 将一组 TaskChild 转为原始（年度坐标）TaskBar 数组，不做泳道分配 */
const computeRawBars = (children: TaskChild[]): TaskBar[] => {
  const yearStart = dayjs(`${year.value}-01-01`)
  const yearEnd = dayjs(`${year.value}-12-31`)

  return children.map((child) => {
    let s = dayjs(child.start)
    let e = dayjs(child.end)
    if (s.isBefore(yearStart)) s = yearStart
    if (e.isAfter(yearEnd)) e = yearEnd

    const leftPercent = dateToPercent(s)
    const widthPercent =
      dateToPercent(e) - leftPercent + 100 / 12 / e.daysInMonth()

    return {
      title: child.title,
      start: child.start,
      end: child.end,
      leftPercent,
      widthPercent,
      lane: 0,
      totalLanes: 1,
    }
  })
}

/** 为 bars 分配泳道 */
const assignLanes = (bars: TaskBar[]): TaskBar[] => {
  if (bars.length === 0) return bars
  const sorted = bars
    .map((b, i) => ({ ...b, _idx: i }))
    .toSorted((a, b) => a.leftPercent - b.leftPercent)
  const laneRightEnds: number[] = []
  for (const bar of sorted) {
    let assigned = false
    for (let i = 0; i < laneRightEnds.length; i++) {
      if (laneRightEnds[i] <= bar.leftPercent) {
        bars[bar._idx].lane = i
        laneRightEnds[i] = bar.leftPercent + bar.widthPercent
        assigned = true
        break
      }
    }
    if (!assigned) {
      bars[bar._idx].lane = laneRightEnds.length
      laneRightEnds.push(bar.leftPercent + bar.widthPercent)
    }
  }
  bars.forEach((b) => (b.totalLanes = laneRightEnds.length))
  return bars
}

/** 获取主任务条（含泳道） */
const getTaskBars = (row: TableDataType): TaskBar[] => {
  if (!row.taskChildren || row.taskChildren.length === 0) return []
  return assignLanes(computeRawBars(row.taskChildren))
}

/** 根据泳道数计算行高 */
const getRowHeight = (row: TableDataType): number => {
  const bars = getTaskBars(row)
  const lanes = bars.length > 0 ? bars[0].totalLanes : 1
  return lanes * 32 + 10
}

/** 展平为显示行：主行 + 子任务行 */
const displayData = computed<DisplayRow[]>(() => {
  const result: DisplayRow[] = []
  for (const row of rawData.value) {
    result.push({ ...row, rowType: 'main' })
    // 获取改行所有任务
    const bars = getTaskBars(row)
    // 遍历每个任务
    for (const bar of bars) {
      // 找到当前任务
      const parent = row.taskChildren.find((c) => c.title === bar.title)
      // 若任务存在子任务
      if (parent?.children && parent.children.length > 0) {
        const rawChildren = computeRawBars(parent.children)
        // 转为相对父任务的坐标
        const relative: TaskBar[] = rawChildren.map((b) => ({
          ...b,
          leftPercent:
            ((b.leftPercent - bar.leftPercent) / bar.widthPercent) * 100,
          widthPercent: (b.widthPercent / bar.widthPercent) * 100,
        }))
        assignLanes(relative)
        result.push({
          t1: `└ ${bar.title}`,
          t2: '',
          t3: '',
          d1: '',
          g1: '',
          taskChildren: [],
          rowType: 'subtask',
          parentLeft: bar.leftPercent,
          parentWidth: bar.widthPercent,
          subtaskBars: relative,
        })
      }
    }
  }
  return result
})
</script>

<style scoped lang="scss">
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
  height: 28px;
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

/* ========= 子任务行 ========= */
.subtask-row {
  box-sizing: border-box;
  padding: 2px 0;
}

.subtask-scroll-inner {
  position: relative;
  width: 100%;
}

.subtask-bar {
  position: absolute;
  height: 22px;
  border-radius: 3px;
  background: linear-gradient(135deg, #e6a23c, #f0c78a);
  display: flex;
  align-items: center;
  padding: 0 6px;
  box-sizing: border-box;
  cursor: pointer;
  min-width: 4px;
  transition:
    box-shadow 0.2s,
    filter 0.2s;

  &:hover {
    box-shadow: 0 2px 6px rgba(230, 162, 60, 0.45);
    filter: brightness(1.08);
    z-index: 2;
  }

  .task-bar-text {
    font-size: 11px;
  }
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

/* 穿透 Element Plus 表格，去掉所有默认内边距 */
:deep() {
  .el-table {
    --el-table-cell-padding: 0px;
    --el-table-header-cell-padding: 0px;
    --el-table-row-padding: 0px;

    .el-table__header-wrapper,
    .el-table__body-wrapper,
    .el-table__footer-wrapper,
    .el-table__inner-wrapper {
      padding: 0 !important;
    }

    .el-table__header,
    .el-table__body {
      padding: 0 !important;
    }

    tr {
      padding: 0 !important;
    }

    th.el-table__cell,
    td.el-table__cell {
      padding: 0 !important;
      box-sizing: border-box;

      .cell {
        padding: 0 !important;
        line-height: normal;
      }
    }
  }
}
</style>
