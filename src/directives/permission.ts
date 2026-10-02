import type { Directive } from 'vue'
import { usePermission } from '@/composables/usePermission'

export const permissionDirective: Directive<HTMLElement, string | string[] | undefined> = {
  mounted(el, binding) {
    const { hasPermission } = usePermission()
    if (!hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  },
}
