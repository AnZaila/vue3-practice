<template>
  <template v-for="item in menus" :key="item.id">
    <el-menu-item v-if="!item.children?.length" :index="item.path || String(item.id)">
      <el-icon class="menu-icon">
        <component :is="resolveMenuIcon(item.icon)" />
      </el-icon>
      <span>{{ item.name }}</span>
    </el-menu-item>
    <el-sub-menu v-else :index="item.path || String(item.id)">
      <template #title>
        <el-icon class="menu-icon">
          <component :is="resolveMenuIcon(item.icon)" />
        </el-icon>
        <span>{{ item.name }}</span>
      </template>
      <SidebarMenuTree :menus="item.children ?? []" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { resolveMenuIcon } from '@/constants/menuIcons'
import type { MenuNode } from '@/types/models'

defineOptions({ name: 'SidebarMenuTree' })

defineProps<{
  menus: MenuNode[]
}>()
</script>

<style scoped lang="scss">
.menu-icon {
  width: 25px;
  margin-right: 8px;
  color: var(--color-text-muted);
  font-size: 18px;
  text-align: center;
}
</style>
