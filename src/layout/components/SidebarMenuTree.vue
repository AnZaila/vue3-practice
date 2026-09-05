<template>
  <template v-for="item in menus" :key="item.path">
    <el-menu-item v-if="!item.children?.length" :index="item.path">
      <el-icon class="menu-icon">
        <component :is="resolveMenuIcon(item.icon)" />
      </el-icon>
      <template #title>{{ item.label }}</template>
    </el-menu-item>
    <el-sub-menu v-else :index="item.path">
      <template #title>
        <el-icon class="menu-icon">
          <component :is="resolveMenuIcon(item.icon)" />
        </el-icon>
        <span>{{ item.label }}</span>
      </template>
      <SidebarMenuTree :menus="item.children ?? []" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { resolveMenuIcon } from '@/constants/menuIcons'
import type { MenuNode } from '@/types/menu'

defineOptions({
  name: 'SidebarMenuTree',
})

defineProps<{
  menus: MenuNode[]
}>()
</script>

<style scoped lang="scss">
.menu-icon {
  width: 25px;
  margin-right: 8px;
  color: #94a3b8;
  font-size: 18px;
  text-align: center;
}
</style>
