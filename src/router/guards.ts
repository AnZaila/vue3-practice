import type { Router } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { useSessionStore } from '@/stores/session'
import { finishPageProgress, startPageProgress } from '@/utils/pageProgress'
import { getRefreshToken } from '@/utils/token'

const WHITE_LIST = new Set(['/login', '/403', '/500'])

export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    startPageProgress()

    const session = useSessionStore()
    const permission = usePermissionStore()
    const hasToken = Boolean(getRefreshToken())

    if (to.path === '/login') {
      if (!hasToken) {
        return true
      }
      try {
        await session.ensureSession()
        await permission.ensureRoutes(router)
        const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/dashboard'
        return redirect
      } catch {
        return true
      }
    }

    if (WHITE_LIST.has(to.path)) {
      return true
    }

    if (!hasToken) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    try {
      const profile = await session.ensureSession()
      const firstLoad = !permission.routesReady
      await permission.ensureRoutes(router)
      if (profile.mustChangePassword && to.path !== '/profile') {
        return '/profile'
      }
      if (permission.isProtectedPath(to.path) && !permission.canAccessPath(to.path)) {
        return '/403'
      }
      if (firstLoad) {
        return { path: to.path, query: to.query, hash: to.hash, replace: true }
      }
    } catch {
      await session.logout()
      permission.reset(router)
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = `${String(to.meta.title || import.meta.env.VITE_APP_TITLE)} · ${import.meta.env.VITE_APP_TITLE}`
    finishPageProgress()
  })

  router.onError(() => {
    finishPageProgress()
  })
}
