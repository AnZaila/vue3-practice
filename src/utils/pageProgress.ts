import { computed, ref } from 'vue'

const visible = ref(false)
const progress = ref(0)

let routeBusy = false
let requestCount = 0
let tickTimer: number | null = null
let hideTimer: number | null = null
let safetyTimer: number | null = null

function clearTimer(id: number | null) {
  if (id !== null) {
    window.clearTimeout(id)
    window.clearInterval(id)
  }
}

function stopTick() {
  clearTimer(tickTimer)
  tickTimer = null
}

function stopHide() {
  clearTimer(hideTimer)
  hideTimer = null
}

function stopSafety() {
  clearTimer(safetyTimer)
  safetyTimer = null
}

function armSafety() {
  stopSafety()
  safetyTimer = window.setTimeout(() => {
    routeBusy = false
    requestCount = 0
    hideNow()
  }, 8000)
}

function show() {
  stopHide()
  if (!visible.value) {
    visible.value = true
    progress.value = 14
  }
  if (tickTimer === null) {
    tickTimer = window.setInterval(() => {
      if (!visible.value) {
        return
      }
      const next = progress.value < 80 ? progress.value + 6 : progress.value < 92 ? progress.value + 1.2 : progress.value
      progress.value = Math.min(92, Number(next.toFixed(1)))
    }, 120)
  }
  armSafety()
}

function hideNow() {
  stopTick()
  stopSafety()
  progress.value = 100
  hideTimer = window.setTimeout(() => {
    visible.value = false
    progress.value = 0
    hideTimer = null
  }, 180)
}

function maybeHide() {
  if (!routeBusy && requestCount <= 0) {
    requestCount = 0
    hideNow()
  }
}

export function startPageProgress() {
  routeBusy = true
  show()
}

export function finishPageProgress() {
  routeBusy = false
  maybeHide()
}

export function startRequestProgress() {
  requestCount += 1
  show()
}

export function finishRequestProgress() {
  requestCount = Math.max(0, requestCount - 1)
  maybeHide()
}

export const pageProgressState = {
  visible: computed(() => visible.value),
  progress: computed(() => progress.value),
}
