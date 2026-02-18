<template>
  <header class="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
    <div class="flex items-center justify-between">
      <BaseLogo :width="150" :height="44" />

      <nav class="flex items-center gap-2 text-sm">
        <RouterLink
          to="/"
          class="rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
        >
          الرئيسية
        </RouterLink>

        <RouterLink
          to="/system/users"
          class="rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
        >
          إدارة المستخدمين
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'NavBar'
})
import { RouterLink } from 'vue-router'
import BaseLogo from './base/BaseLogo.vue'
</script>
