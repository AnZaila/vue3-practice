import { computed, ref } from 'vue'

const visible = ref(false)
const progress = ref(0)

let activeCount = 0
let timer: number | null = null
let hideTimer: number | null = null

function clearTimers() {
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }

  if (hideTimer !== null) {
    window.clearTimeout(hideTimer)
    hideTimer = null
  }
}

function startTimer() {
  if (timer !== null) {
    return
  }

  timer = window.setInterval(() => {
    if (!visible.value) {
      return
    }

    const next = progress.value < 80 ? progress.value + 6 : progress.value < 92 ? progress.value + 1.5 : progress.value
    progress.value = Math.min(92, Number(next.toFixed(1)))
  }, 120)
}

export function startPageProgress() {
  activeCount += 1

  if (activeCount > 1) {
    return
  }

  clearTimers()
  visible.value = true
  progress.value = 14
  startTimer()
}

export function finishPageProgress() {
  if (activeCount === 0) {
    return
  }

  activeCount -= 1

  if (activeCount > 0) {
    return
  }

  clearTimers()
  progress.value = 100
  hideTimer = window.setTimeout(() => {
    visible.value = false
    progress.value = 0
    hideTimer = null
  }, 180)
}

export const pageProgressState = {
  visible: computed(() => visible.value),
  progress: computed(() => progress.value),
}
