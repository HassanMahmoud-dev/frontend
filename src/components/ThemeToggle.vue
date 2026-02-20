<template>
  <div class="relative" ref="containerRef">
    <!-- Trigger Button -->
    <button
      @click="toggleMenu"
      class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      :title="`الوضع الحالي: ${currentLabel}`"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
    >
      <i :class="currentIcon" class="text-lg"></i>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="theme-dropdown">
      <div
        v-if="isOpen"
        role="listbox"
        :aria-label="'اختيار وضع العرض'"
        class="absolute start-0 top-12 z-50 min-w-[160px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <ul class="py-1">
          <li
            v-for="option in options"
            :key="option.value"
            role="option"
            :aria-selected="themeStore.theme === option.value"
            @click="selectTheme(option.value)"
            class="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            :class="{
              'bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white':
                themeStore.theme === option.value,
            }"
          >
            <i :class="option.icon" class="text-base"></i>
            <span>{{ option.label }}</span>
            <!-- Active Indicator -->
            <i
              v-if="themeStore.theme === option.value"
              class="bi bi-check2 ms-auto text-base text-blue-500"
            ></i>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useThemeStore } from '@/stores/theme.store'
import type { Theme } from '@/stores/theme.store'

defineOptions({ name: 'ThemeToggle' })

const themeStore = useThemeStore()
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const options: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'فاتح', icon: 'bi bi-sun-fill' },
  { value: 'dark', label: 'داكن', icon: 'bi bi-moon-stars-fill' },
  { value: 'system', label: 'النظام', icon: 'bi bi-laptop' },
]

const currentIcon = computed(() => {
  const match = options.find((o) => o.value === themeStore.theme)
  return match ? match.icon : 'bi bi-laptop'
})

const currentLabel = computed(() => {
  const match = options.find((o) => o.value === themeStore.theme)
  return match ? match.label : 'النظام'
})

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function selectTheme(theme: Theme) {
  themeStore.setTheme(theme)
  isOpen.value = false
}

function handleOutsideClick(event: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<style scoped>
/* Dropdown animation */
.theme-dropdown-enter-active,
.theme-dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.theme-dropdown-enter-from,
.theme-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
