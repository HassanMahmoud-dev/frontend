<template>
  <div
    class="flex min-h-screen bg-white transition-colors duration-300 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
  >
    <div class="flex min-w-0 flex-1 flex-col">
      <Navbar v-if="showNavbar" />
      <main class="flex-1 px-4 py-6 md:px-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { computed, onMounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme.store'
import { useAuthStore } from '@/stores/auth.store'
import { initSocket, disconnectSocket } from '@/services/socket.service'

const route = useRoute()
useThemeStore() // Initialize theme store to trigger watcher
const authStore = useAuthStore()
const showNavbar = computed(() => !route.meta.guest)

onMounted(() => {
  if (authStore.isAuthenticated) {
    initSocket()
  }

  watch(
    () => authStore.isAuthenticated,
    (isAuth) => {
      if (isAuth) {
        initSocket()
      } else {
        disconnectSocket()
      }
    },
  )
})
</script>
