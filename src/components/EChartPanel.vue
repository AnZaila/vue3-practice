<template>
  <div ref="chartElement" class="chart-panel" :style="{ height }"></div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    option: EChartsOption
    height?: string
  }>(),
  {
    height: '280px',
  },
)

const chartElement = ref<HTMLElement>()
let chart: echarts.ECharts | undefined

function renderChart() {
  if (!chart && chartElement.value) {
    chart = echarts.init(chartElement.value)
  }

  chart?.setOption(props.option)
}

function resizeChart() {
  chart?.resize()
}

onMounted(async () => {
  await nextTick()
  renderChart()
  window.addEventListener('resize', resizeChart)
})

watch(() => props.option, renderChart, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
  chart = undefined
})
</script>

<style scoped lang="scss">
.chart-panel {
  width: 100%;
  min-height: 220px;
}
</style>
