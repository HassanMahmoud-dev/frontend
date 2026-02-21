<template>
  <header
    class="border-b border-slate-200 bg-white px-4 py-3 transition-colors duration-300 md:px-6 dark:border-slate-800 dark:bg-slate-950"
  >
    <div class="flex items-center justify-between">
      <BaseLogo :width="150" :height="44" />
      <nav class="flex items-center gap-2 text-sm">
        <ThemeToggle />
        <RouterLink
          to="/"
          class="rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          active-class="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 active-link"
        >
          الرئيسية
        </RouterLink>
        <RouterLink
          v-if="authStore.isAdmin"
          to="/system/users"
          class="rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          active-class="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 active-link"
        >
          المستخدمين
        </RouterLink>
        <RouterLink
          v-if="authStore.isAdmin"
          to="/system/settings/system-monitor"
          class="rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          active-class="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 active-link"
        >
          مراقب النظام
        </RouterLink>
        <div class="relative" ref="dropdownRef">
          <button
            v-if="authStore.isAuthenticated && authStore.user"
            @click="isDropdownOpen = !isDropdownOpen"
            class="flex items-center gap-3 rounded-full border border-transparent p-1 transition hover:bg-slate-50 dark:hover:bg-slate-900"
            :class="{ 'bg-slate-50 dark:bg-slate-900': isDropdownOpen }"
          >
            <div class="hidden flex-col items-end text-right sm:flex">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{
                authStore.user.username
              }}</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ userRoleDisplay }}</span>
            </div>
            <div
              class="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-slate-700"
            >
              <img
                v-if="authStore.user.avatar"
                :src="getImageUrl(authStore.user.avatar)"
                class="h-full w-full object-cover"
                alt="User"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              >
                <span class="text-xs font-bold">{{
                  authStore.user.username?.charAt(0).toUpperCase()
                }}</span>
              </div>
            </div>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isDropdownOpen"
            class="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-900 dark:ring-slate-700 z-50"
          >
            <RouterLink
              to="/system/profile"
              class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="isDropdownOpen = false"
            >
              الملف الشخصي
            </RouterLink>
            <button
              @click="handleLogout"
              class="block w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'NavBar',
})
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import BaseLogo from './base/BaseLogo.vue'
import ThemeToggle from './ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth.store'
import { BASE_URL } from '@/services/api'

const authStore = useAuthStore()

const userRoleDisplay = computed(() => {
  const role = authStore.user?.role
  if (role === 'admin') return 'مدير النظام'
  if (role === 'employee') return 'موظف'
  return role
})

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const handleLogout = () => {
  isDropdownOpen.value = false
  authStore.logout()
}

// Click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
