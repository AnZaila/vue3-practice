import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchMenuTree } from '@/mock/menu'
import type { MenuNode } from '@/types/menu'

function collectOpenKeys(nodes: MenuNode[]): string[] {
  return nodes.flatMap((item) => {
    const keys = item.children?.length ? [item.path] : []
    return item.children?.length ? keys.concat(collectOpenKeys(item.children)) : keys
  })
}

function collectLeafPaths(nodes: MenuNode[]): string[] {
  return nodes.flatMap((item) => {
    if (item.children?.length) {
      return collectLeafPaths(item.children)
    }

    return [item.path]
  })
}

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<MenuNode[]>([])
  const permissions = ref<string[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const version = ref(0)

  const openKeys = computed(() => collectOpenKeys(menus.value))
  const routePaths = computed(() => collectLeafPaths(menus.value))

  async function loadMenus(force = false) {
    if (loaded.value && !force) {
      return
    }

    loading.value = true
    try {
      const data = await fetchMenuTree()
      menus.value = data.menus
      permissions.value = data.permissions
      loaded.value = true
      version.value += 1
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    loaded,
    menus,
    openKeys,
    permissions,
    routePaths,
    version,
    loadMenus,
  }
})
