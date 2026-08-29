import type { EChartsOption } from 'echarts'
import type {
  DashboardChartTheme,
  DashboardOrders,
  DashboardSource,
  DashboardTraffic,
} from '@/types/dashboard'

const palette = ['#4f7cff', '#5fd3a4', '#f5b94c', '#ef8f8f']

function createAxisLabel(theme: DashboardChartTheme) {
  return {
    color: theme.muted,
    fontFamily: "'Avenir Next', 'Noto Sans SC', sans-serif",
  }
}

export function createTrafficOption(
  traffic: DashboardTraffic,
  theme: DashboardChartTheme,
): EChartsOption {
  return {
    color: ['#4f7cff'],
    tooltip: { trigger: 'axis' },
    grid: { left: 12, right: 16, top: 24, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: traffic.days,
      axisLine: { lineStyle: { color: theme.border } },
      axisTick: { show: false },
      axisLabel: createAxisLabel(theme),
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      splitLine: { lineStyle: { color: theme.border, type: 'dashed' } },
      axisLabel: createAxisLabel(theme),
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        data: traffic.values,
        lineStyle: { width: 3 },
        areaStyle: { color: 'rgba(79, 124, 255, 0.12)' },
      },
    ],
  }
}

export function createSourceOption(
  sources: DashboardSource[],
  theme: DashboardChartTheme,
): EChartsOption {
  return {
    color: palette,
    tooltip: { trigger: 'item', formatter: '{b}<br />{c}% ({d}%)' },
    legend: {
      bottom: 0,
      icon: 'circle',
      textStyle: createAxisLabel(theme),
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['50%', '43%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: theme.surface, borderWidth: 3 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 600, color: theme.strong },
        },
        data: sources,
      },
    ],
  }
}

export function createOrderOption(
  orders: DashboardOrders,
  theme: DashboardChartTheme,
): EChartsOption {
  return {
    color: ['#4f7cff', '#a5b9ff'],
    tooltip: { trigger: 'axis' },
    legend: { top: 0, right: 0, textStyle: createAxisLabel(theme) },
    grid: { left: 12, right: 16, top: 36, bottom: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: orders.days,
      axisLine: { lineStyle: { color: theme.border } },
      axisTick: { show: false },
      axisLabel: createAxisLabel(theme),
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.border, type: 'dashed' } },
      axisLabel: createAxisLabel(theme),
    },
    series: [
      { name: '已完成', type: 'bar', barMaxWidth: 18, data: orders.completed },
      { name: '待处理', type: 'bar', barMaxWidth: 18, data: orders.pending },
    ],
  }
}
