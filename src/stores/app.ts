import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

function resolveTheme(): ThemeMode {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useAppStore = defineStore('app', () => {
  const collapsed = ref(false)
  const theme = ref<ThemeMode>(resolveTheme())

  function applyTheme(next: ThemeMode) {
    theme.value = next
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  applyTheme(theme.value)

  return { collapsed, theme, applyTheme, toggleTheme }
})
