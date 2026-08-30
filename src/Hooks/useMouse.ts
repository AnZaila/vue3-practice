import { ref, onMounted, onUnmounted } from 'vue'
import { useThrottle } from './useThrottle'

export const useMouse = () => {
  const x = ref(0)
  const y = ref(0)
  const throttledUpdate = useThrottle((e: MouseEvent) => {
    x.value = e.clientX
    y.value = e.clientY
  }, 100)
  onMounted(() => window.addEventListener('mousemove', throttledUpdate))
  onUnmounted(() => window.removeEventListener('mousemove', throttledUpdate))
  return { x, y }
}
