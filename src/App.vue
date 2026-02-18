<template>
  <div class="flex min-h-screen bg-white text-slate-900">
    <div class="flex min-w-0 flex-1 flex-col">
      <Navbar />
      <main class="flex-1 px-4 py-6 md:px-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>
