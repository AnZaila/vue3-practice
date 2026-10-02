import { computed } from 'vue'
import { useSessionStore } from '@/stores/session'

export function usePermission() {
  const session = useSessionStore()

  function hasPermission(code?: string | string[]) {
    if (!code) {
      return true
    }
    if (Array.isArray(code)) {
      return code.every((item) => session.hasPermission(item))
    }
    return session.hasPermission(code)
  }

  function hasAnyPermission(codes: string[]) {
    return codes.some((item) => session.hasPermission(item))
  }

  return {
    hasPermission,
    hasAnyPermission,
    permissions: computed(() => session.permissions),
  }
}
