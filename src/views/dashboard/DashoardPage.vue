<template>
  <div class="dashboard-page">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">OPERATION CENTER</span>
        <h2>上午好，林知远</h2>
        <p>今天先处理 12 项待办，平台整体运行稳定，近 7 日访问量继续上升。</p>
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
      <article v-for="item in metrics" :key="item.label" class="metric-card">
        <span class="metric-label">{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <em :class="item.trendType">{{ item.trend }}</em>
      </article>
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
          <div v-for="task in tasks" :key="task.title" class="task-item">
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
            <strong>数据趋势</strong>
            <span>近 5 日活跃度</span>
          </div>
        </template>
        <div class="trend-list">
          <div v-for="item in trends" :key="item.day" class="trend-row">
            <span>{{ item.day }}</span>
            <div class="trend-bar">
              <i :style="{ width: `${item.rate}%` }"></i>
            </div>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
const metrics = [
  { label: '本周新增用户', value: '326', trend: '+18.2%', trendType: 'up' },
  { label: '待处理工单', value: '47', trend: '-6.4%', trendType: 'down' },
  { label: '接口响应时长', value: '182ms', trend: '-12ms', trendType: 'down' },
  { label: '活跃角色数', value: '14', trend: '+2', trendType: 'up' },
]

const tasks = [
  {
    title: '审核新注册企业账号',
    desc: '包含 8 条资料待复核，建议优先完成。',
    tag: '高',
    type: 'danger',
  },
  {
    title: '同步权限策略变更',
    desc: '角色权限需要在今晚发布窗口前确认。',
    tag: '中',
    type: 'warning',
  },
  {
    title: '导出运营日报',
    desc: '数据已完成聚合，待发送给业务负责人。',
    tag: '低',
    type: 'success',
  },
]

const trends = [
  { day: '周一', rate: 72, value: '72%' },
  { day: '周二', rate: 82, value: '82%' },
  { day: '周三', rate: 64, value: '64%' },
  { day: '周四', rate: 91, value: '91%' },
  { day: '周五', rate: 87, value: '87%' },
]
</script>

<style scoped lang="scss">
.dashboard-page {
  display: grid;
  gap: 20px;
}

.hero-card,
.content-grid {
  display: grid;
  gap: 20px;
}

.hero-card {
  grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff, #fbfcfe);
  color: var(--ink);
  box-shadow: 0 18px 50px rgba(17, 24, 39, 0.06);
}

.hero-copy {
  max-width: 560px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: #4f7cff;
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
  background: #f8fafc;
  border: 1px solid #edf1f6;
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
  box-shadow: 0 12px 32px rgba(17, 24, 39, 0.05);
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

.content-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.panel-card {
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.98);
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title strong {
  color: var(--color-text-strong);
}

.task-list,
.trend-list {
  display: grid;
  gap: 14px;
}

.task-item,
.trend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.task-item strong,
.trend-row strong {
  color: var(--color-text-strong);
}

.task-item p {
  margin: 4px 0 0;
  color: var(--color-text-muted);
  font-size: 13px;
}

.trend-row {
  color: var(--color-text-muted);
}

.trend-bar {
  position: relative;
  flex: 1;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #edf2f7;
}

.trend-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4f7cff, #8aa7ff);
}

@media (max-width: 960px) {
  .hero-card,
  .content-grid,
  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
