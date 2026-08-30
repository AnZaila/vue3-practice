<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapsed ? '76px' : '244px'" class="layout-aside">
      <div class="brand-block">
        <div class="brand-mark">N</div>
        <div v-if="!isCollapsed" class="brand-copy">
          <strong>Northstar</strong>
          <span>运营管理平台</span>
        </div>
      </div>

      <div v-if="!isCollapsed" class="menu-caption">WORKSPACE</div>
      <el-menu
        :key="menuStore.version"
        :default-active="route.path"
        :default-openeds="[]"
        :collapse="isCollapsed"
        background-color="var(--color-surface-elevated)"
        text-color="var(--color-text)"
        active-text-color="var(--color-primary)"
        router
        class="side-menu"
      >
        <SidebarMenuTree :menus="menuStore.menus" />
      </el-menu>

      <div class="aside-foot">
        <div class="status-dot"></div>
        <span v-if="!isCollapsed">系统运行正常</span>
      </div>
    </el-aside>

    <el-container class="content-container">
      <el-header class="layout-header">
        <div class="header-left">
          <button
            class="collapse-button"
            type="button"
            aria-label="折叠菜单"
            @click="isCollapsed = !isCollapsed"
          >
            {{ isCollapsed ? '›' : '‹' }}
          </button>
          <div class="breadcrumb-wrap">
            <span class="breadcrumb-muted">Northstar</span>
            <span class="breadcrumb-separator">/</span>
            <strong>{{ currentTitle }}</strong>
          </div>
        </div>
        <div class="header-right">
          <div class="header-date">{{ todayLabel }}</div>
          <button
            class="theme-button"
            type="button"
            :aria-label="isDark ? '切换浅色' : '切换深色'"
            :title="isDark ? '切换浅色' : '切换深色'"
            @click="toggleTheme"
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

      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useMenuStore } from '@/stores/menu'
import SidebarMenuTree from './components/SidebarMenuTree.vue'

const menuStore = useMenuStore()
const route = useRoute()
const router = useRouter()
const isCollapsed = ref(false)
const isDark = ref(resolveInitialTheme() === 'dark')

const currentTitle = computed(() => (route.meta.title as string) || '工作台')
const todayLabel = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

function resolveInitialTheme() {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: 'dark' | 'light') {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
  isDark.value = theme === 'dark'
}

function toggleTheme() {
  applyTheme(isDark.value ? 'light' : 'dark')
}

function handleCommand(command: string) {
  if (command === 'logout') {
    ElMessage.success('已安全退出')
    router.push('/login')
  }

  if (command === 'profile') {
    ElMessage.info('个人中心会在后续版本补上')
  }
}

onMounted(() => {
  void menuStore.loadMenus()
})
</script>

<style lang="scss" scoped>
.layout-container {
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}

.layout-aside {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-surface-elevated);
  border-right: 1px solid var(--color-border);
  transition: width 0.25s ease;
  box-shadow: 10px 0 30px var(--color-shadow-soft);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 84px;
  padding: 0 22px;
  color: var(--color-text-strong);
}

.brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 10px 10px 10px 3px;
  background: var(--color-surface-muted);
  color: var(--color-primary);
  font-family: Georgia, serif;
  font-size: 21px;
  font-weight: 700;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  strong {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 20px;
    letter-spacing: 0.02em;
  }

  span {
    margin-top: 4px;
    color: var(--color-text-muted);
    font-size: 11px;
    letter-spacing: 0.18em;
  }
}

.menu-caption {
  padding: 16px 24px 9px;
  color: #9aa3af;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.side-menu {
  flex: 1;
  overflow-y: auto;
  border-right: 0;
  background: transparent;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: var(--color-text);
  --el-menu-active-color: var(--color-primary);
  --el-menu-hover-bg-color: var(--color-surface-muted);

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 50px;
    margin: 4px 12px;
    border-radius: 8px;
    color: var(--color-text);
    font-size: 14px;
    background-color: transparent;
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background: var(--color-surface-muted);
    color: var(--color-text-strong);
  }

  :deep(.el-menu-item.is-active) {
    background: var(--color-primary-soft);
    color: var(--color-primary);
    font-weight: 600;
  }

  :deep(.el-sub-menu .el-menu-item) {
    min-width: auto;
    padding-left: 57px !important;
    background: transparent;
    color: var(--color-text-muted);
    font-size: 13px;
  }

  :deep(.el-sub-menu .el-menu-item.is-active) {
    background: var(--color-primary-soft);
    color: var(--color-primary);
  }

  :deep(.el-sub-menu__icon-arrow) {
    color: var(--color-text-muted);
  }
}

.aside-foot {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: auto 22px 24px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 12px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 0 4px var(--color-success-soft);
}

.content-container {
  min-width: 0;
  min-height: 0;
}

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
  gap: 20px;
}

.collapse-button {
  width: 32px;
  height: 32px;
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
  gap: 11px;
  color: var(--ink);
  font-size: 14px;
}

.breadcrumb-muted,
.breadcrumb-separator {
  color: var(--color-text-muted);
}

.header-right {
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

.layout-main {
  min-height: 0;
  flex: 1;
  padding: 34px;
  overflow: auto;
  background: transparent;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 720px) {
  .layout-aside {
    width: 76px !important;
  }

  .brand-block {
    justify-content: center;
    padding: 0;
  }

  .menu-caption,
  .aside-foot span,
  .profile-copy,
  .chevron,
  .header-date {
    display: none;
  }

  .side-menu :deep(.el-menu-item),
  .side-menu :deep(.el-sub-menu__title) {
    justify-content: center;
    padding: 0 !important;
  }

  .side-menu :deep(.el-sub-menu .el-menu-item) {
    padding-left: 0 !important;
    text-align: center;
  }

  .layout-header {
    padding: 0 16px;
  }

  .layout-main {
    padding: 20px 16px;
  }
}
</style>
