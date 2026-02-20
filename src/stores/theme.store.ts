import { defineStore } from 'pinia'
import { ref, watch, onScopeDispose } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system')

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (newTheme === 'system') {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      root.setAttribute('data-theme', systemTheme)
      root.style.colorScheme = 'light dark'
    } else {
      root.classList.add(newTheme)
      root.setAttribute('data-theme', newTheme)
      root.style.colorScheme = newTheme
    }
  }

  watch(
    theme,
    (newTheme) => {
      localStorage.setItem('theme', newTheme)
      applyTheme(newTheme)
    },
    { immediate: true },
  )

  // Listen for system theme changes and re-apply if in system mode
  const onSystemThemeChange = () => {
    if (theme.value === 'system') {
      applyTheme('system')
    }
  }

  mediaQuery.addEventListener('change', onSystemThemeChange)

  // Cleanup listener when the store is disposed
  onScopeDispose(() => {
    mediaQuery.removeEventListener('change', onSystemThemeChange)
  })

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  const toggleTheme = () => {
    if (theme.value === 'light') {
      theme.value = 'dark'
    } else if (theme.value === 'dark') {
      theme.value = 'system'
    } else {
      theme.value = 'light'
    }
  }

  const isDark = () => {
    if (theme.value === 'dark') return true
    if (theme.value === 'light') return false
    return mediaQuery.matches
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    applyTheme,
    isDark,
  }
})
