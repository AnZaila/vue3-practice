import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface TabItem {
  path: string
  title: string
  affix?: boolean
}

const AFFIX: TabItem[] = [{ path: '/dashboard', title: '工作台', affix: true }]

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([...AFFIX])

  const paths = computed(() => tabs.value.map((item) => item.path))

  function visit(route: RouteLocationNormalizedLoaded) {
    const path = route.path
    if (!path || path === '/login' || path === '/403' || path === '/404' || path === '/500') {
      return
    }
    const title = String(route.meta.title || '未命名')
    const exists = tabs.value.find((item) => item.path === path)
    if (exists) {
      exists.title = title
      return
    }
    tabs.value.push({ path, title })
  }

  function close(path: string, current: string) {
    const target = tabs.value.find((item) => item.path === path)
    if (!target || target.affix) {
      return current
    }
    const index = tabs.value.findIndex((item) => item.path === path)
    tabs.value = tabs.value.filter((item) => item.path !== path)
    if (path !== current) {
      return current
    }
    return tabs.value[Math.max(0, index - 1)]?.path || '/dashboard'
  }

  function closeOthers(path: string) {
    tabs.value = tabs.value.filter((item) => item.affix || item.path === path)
  }

  function reset() {
    tabs.value = [...AFFIX]
  }

  return { tabs, paths, visit, close, closeOthers, reset }
})
