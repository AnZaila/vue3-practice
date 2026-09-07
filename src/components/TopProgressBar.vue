<template>
  <div class="top-progress" :class="{ 'is-visible': visible }" aria-hidden="true">
    <div class="top-progress__bar" :style="barStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { pageProgressState } from '@/utils/pageProgress'

const visible = pageProgressState.visible
const progress = pageProgressState.progress

const barStyle = computed(() => ({
  width: `${progress.value}%`,
}))
</script>

<style scoped lang="scss">
.top-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 3px;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.top-progress.is-visible {
  opacity: 1;
}

.top-progress__bar {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #2f7cff 0%, #58a6ff 55%, #8cc5ff 100%);
  box-shadow: 0 0 10px rgb(47 124 255 / 0.45);
  transition: width 0.12s linear;
}
</style>
