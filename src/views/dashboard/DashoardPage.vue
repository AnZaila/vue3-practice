<template>
  <div class="dashboard-page">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">OPERATION CENTER</span>
        <h2>上午好，林知远</h2>
        <p>今天先处理 12 项待办，平台整体运行稳定，近 7 日访问量持续上升。</p>
      </div>
      <div class="hero-panel">
        <div class="hero-stat">
          <strong>96.4%</strong>
          <span>在线率</span>
        </div>
        <div class="hero-stat">
          <strong>28</strong>
          <span>待审批</span>
        </div>
        <div class="hero-stat">
          <strong>1,284</strong>
          <span>今日访问</span>
        </div>
      </div>
    </section>

    <section class="metric-grid">
      <article v-for="item in dashboard.metrics" :key="item.label" class="metric-card">
        <span class="metric-label">{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <em :class="item.trendType">{{ item.trend }} 较上周</em>
      </article>
    </section>

    <section class="chart-grid">
      <el-card shadow="never" class="panel-card chart-card">
        <template #header>
          <div class="panel-title">
            <div>
              <strong>访问趋势</strong>
              <span>近 7 日访问量变化</span>
            </div>
            <el-tag type="success" effect="light">实时</el-tag>
          </div>
        </template>
        <EChartPanel :option="trafficOption" height="300px" />
      </el-card>

      <el-card shadow="never" class="panel-card chart-card">
        <template #header>
          <div class="panel-title">
            <div>
              <strong>访问来源</strong>
              <span>用户访问渠道占比</span>
            </div>
          </div>
        </template>
        <EChartPanel :option="sourceOption" height="300px" />
      </el-card>

      <el-card shadow="never" class="panel-card chart-card chart-card-wide">
        <template #header>
          <div class="panel-title">
            <div>
              <strong>工单处理量</strong>
              <span>已完成与待处理数量对比</span>
            </div>
          </div>
        </template>
        <EChartPanel :option="orderOption" height="300px" />
      </el-card>
    </section>

    <section class="content-grid">
      <el-card shadow="never" class="panel-card">
        <template #header>
          <div class="panel-title">
            <strong>近期任务</strong>
            <span>按优先级排序</span>
          </div>
        </template>
        <div class="task-list">
          <div v-for="task in dashboard.tasks" :key="task.title" class="task-item">
            <div>
              <strong>{{ task.title }}</strong>
              <p>{{ task.desc }}</p>
            </div>
            <el-tag :type="task.type" effect="light">{{ task.tag }}</el-tag>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="panel-card">
        <template #header>
          <div class="panel-title">
            <strong>学习提示</strong>
            <span>静态数据模拟接口</span>
          </div>
        </template>
        <div class="learning-tip">
          <div class="tip-index">01</div>
          <div>
            <strong>数据与视图分离</strong>
            <p>
              当前页面从 <code>src/mock/dashboard.ts</code> 获取数据，替换为真实接口时只需要调整数据来源。
            </p>
          </div>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import EChartPanel from '@/components/EChartPanel.vue'
import { createOrderOption, createSourceOption, createTrafficOption } from '@/charts/dashboard'
import { fetchDashboardData } from '@/mock/dashboard'
import type { DashboardChartTheme, DashboardData } from '@/types/dashboard'

const dashboard = ref<DashboardData>({
  metrics: [],
  tasks: [],
  traffic: { days: [], values: [] },
  sources: [],
  orders: { days: [], completed: [], pending: [] },
})

const fallbackThemeColors: DashboardChartTheme = {
  muted: '#667085',
  strong: '#111827',
  border: '#e5e7eb',
  surface: '#ffffff',
}

const themeColors = ref<DashboardChartTheme>(fallbackThemeColors)
let themeMediaQuery: MediaQueryList | undefined
let themeObserver: MutationObserver | undefined

function readThemeColors(): DashboardChartTheme {
  if (typeof window === 'undefined') {
    return fallbackThemeColors
  }

  const styles = getComputedStyle(document.documentElement)

  return {
    muted: styles.getPropertyValue('--color-text-muted').trim() || fallbackThemeColors.muted,
    strong: styles.getPropertyValue('--color-text-strong').trim() || fallbackThemeColors.strong,
    border: styles.getPropertyValue('--color-border').trim() || fallbackThemeColors.border,
    surface: styles.getPropertyValue('--color-surface').trim() || fallbackThemeColors.surface,
  }
}

function syncThemeColors() {
  themeColors.value = readThemeColors()
}

const trafficOption = computed(() => createTrafficOption(dashboard.value.traffic, themeColors.value))
const sourceOption = computed(() => createSourceOption(dashboard.value.sources, themeColors.value))
const orderOption = computed(() => createOrderOption(dashboard.value.orders, themeColors.value))

onMounted(async () => {
  syncThemeColors()
  themeObserver = new MutationObserver(syncThemeColors)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  if (!document.documentElement.dataset.theme) {
    themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    themeMediaQuery.addEventListener('change', syncThemeColors)
  }

  dashboard.value = await fetchDashboardData()
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeMediaQuery?.removeEventListener('change', syncThemeColors)
})
</script>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 20px;
}

.hero-card,
.content-grid,
.chart-grid {
  display: grid;
  gap: 20px;
}

.hero-card {
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: linear-gradient(180deg, var(--color-surface-glass), var(--color-surface-muted));
  color: var(--ink);
  box-shadow: 0 18px 50px var(--color-shadow);
}

.hero-copy {
  max-width: 560px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.hero-copy h2 {
  margin: 0;
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1.1;
}

.hero-copy p {
  margin: 14px 0 0;
  max-width: 48ch;
  color: var(--color-text-muted);
}

.hero-panel {
  display: grid;
  gap: 12px;
}

.hero-stat,
.metric-card,
.panel-card {
  border-radius: 20px;
}

.hero-stat {
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding: 18px 20px;
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
}

.hero-stat strong {
  font-size: 28px;
  color: var(--color-text-strong);
}

.hero-stat span {
  color: var(--color-text-muted);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.metric-card {
  padding: 22px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 12px 32px var(--color-shadow-soft);
}

.metric-label,
.panel-title span {
  color: var(--color-text-muted);
  font-size: 12px;
}

.metric-card strong {
  display: block;
  margin-top: 10px;
  font-size: 30px;
  color: var(--color-text-strong);
}

.metric-card em {
  display: inline-block;
  margin-top: 8px;
  font-style: normal;
  font-size: 12px;
}

.up {
  color: var(--color-success);
}

.down {
  color: var(--color-primary);
}

.chart-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.chart-card-wide {
  grid-column: span 2;
}

.panel-card {
  border: 1px solid var(--color-border);
  background: var(--color-surface-glass);
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.panel-title > div {
  display: grid;
  gap: 3px;
}

.panel-title strong {
  color: var(--color-text-strong);
}

.content-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.task-list {
  display: grid;
  gap: 14px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.task-item strong {
  color: var(--color-text-strong);
}

.task-item p,
.learning-tip p {
  margin: 4px 0 0;
  color: var(--color-text-muted);
  font-size: 13px;
}

.learning-tip {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.tip-index {
  color: var(--color-primary);
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

code {
  padding: 2px 5px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface-muted);
  color: var(--color-text-strong);
  font-size: 12px;
}

@media (max-width: 960px) {
  .hero-card,
  .content-grid,
  .metric-grid,
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .chart-card-wide {
    grid-column: auto;
  }
}
</style>
