<template>
  <el-header class="layout-header">
    <div class="header-left">
      <button
        class="collapse-button"
        type="button"
        aria-label="折叠菜单"
        @click="emit('update:collapsed', !collapsed)"
      >
        {{ collapsed ? '›' : '‹' }}
      </button>
      <nav class="breadcrumb-wrap" aria-label="当前位置">
        <RouterLink class="breadcrumb-muted" :to="{ path: '/' }">Northstar</RouterLink>
        <template v-for="item in breadcrumbs" :key="item.path || item.title">
          <span class="breadcrumb-separator">/</span>
          <RouterLink v-if="item.isCurrent" :to="{ path: item.path }">{{ item.title }}</RouterLink>
          <RouterLink v-else class="breadcrumb-muted" :to="{ path: item.path }">{{ item.title }}</RouterLink>
        </template>
      </nav>
    </div>
    <div class="header-right">
      <div class="header-date">{{ todayLabel }}</div>
      <button
        class="theme-button"
        type="button"
        :aria-label="isDark ? '切换浅色' : '切换深色'"
        :title="isDark ? '切换浅色' : '切换深色'"
        @click="emit('toggle-theme')"
      >
        <span aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
      </button>
      <el-dropdown trigger="click" @command="handleCommand">
        <button class="profile-button" type="button">
          <span class="avatar">林</span>
          <span class="profile-copy">
            <strong>林知远</strong>
            <small>超级管理员</small>
          </span>
          <span class="chevron">⌄</span>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

interface BreadcrumbItem {
  title: string
  path: string
  isCurrent: boolean
}

defineProps<{
  collapsed: boolean
  isDark: boolean
  todayLabel: string
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  'toggle-theme': []
  command: [command: string]
}>()

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matchedRoutes = route.matched.filter((item) => item.meta.title)

  return matchedRoutes.map((item, index) => ({
    title: item.meta.title as string,
    path: item.path,
    isCurrent: index === matchedRoutes.length - 1,
  }))
})

function handleCommand(command: string | number | object) {
  emit('command', String(command))
}
</script>

<style scoped lang="scss">
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
  padding: 0 34px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  backdrop-filter: blur(10px);
}

.header-left,
.header-right,
.profile-button,
.breadcrumb-wrap {
  display: flex;
  align-items: center;
}

.header-left {
  min-width: 0;
  gap: 20px;
}

.collapse-button {
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 8px;
  background: var(--color-surface-muted);
  color: var(--color-text-strong);
  cursor: pointer;
  font-size: 23px;
  line-height: 1;
  transition: background 0.2s ease;
}

.collapse-button:hover {
  background: var(--color-primary-soft);
}

.breadcrumb-wrap {
  min-width: 0;
  gap: 11px;
  overflow: hidden;
  color: var(--ink);
  font-size: 14px;
  white-space: nowrap;
}

.breadcrumb-wrap strong,
.breadcrumb-muted {
  overflow: hidden;
  text-overflow: ellipsis;
}

.breadcrumb-muted,
.breadcrumb-separator {
  color: var(--color-text-muted);
}

.breadcrumb-separator {
  flex: 0 0 auto;
}

.header-right {
  flex: 0 0 auto;
  gap: 27px;
}

.theme-button {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 9px;
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.theme-button:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.header-date {
  color: var(--color-text-muted);
  font-size: 12px;
}

.profile-button {
  gap: 10px;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  text-align: left;
}

.avatar {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 700;
}

.profile-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.25;

  strong {
    font-size: 13px;
  }

  small {
    margin-top: 3px;
    color: var(--color-text-muted);
    font-size: 10px;
  }
}

.chevron {
  margin-left: 3px;
  color: var(--color-text-muted);
  font-size: 16px;
}

@media (max-width: 720px) {
  .layout-header {
    padding: 0 16px;
  }

  .profile-copy,
  .chevron,
  .header-date {
    display: none;
  }
}
</style>
