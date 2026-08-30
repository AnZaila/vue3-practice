import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchMenuTree } from '@/mock/menu'
import type { MenuNode } from '@/types/menu'

function collectOpenKeys(nodes: MenuNode[]): string[] {
  const keys: string[] = []

  for (const item of nodes) {
    if (item.children?.length) {
      keys.push(item.path)
      keys.push(...collectOpenKeys(item.children))
    }
  }

  return keys
}

function collectLeafPaths(nodes: MenuNode[]): string[] {
  const paths: string[] = []

  for (const item of nodes) {
    if (item.children?.length) {
      paths.push(...collectLeafPaths(item.children))
      continue
    }

    paths.push(item.path)
  }

  return paths
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
