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
import { computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme.store'

const route = useRoute()
useThemeStore() // Initialize theme store to trigger watcher
const showNavbar = computed(() => !route.meta.guest)

onMounted(() => {
  // Theme is already applied by the watcher with immediate: true
  // but we can ensure it here if needed.
})
</script>
