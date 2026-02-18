<template>
  <aside class="hidden w-64 border-r border-slate-200 bg-slate-50 p-4 md:block">
    <BaseLogo :width="48" :height="48" container-class="mb-6" />

    <nav class="space-y-2">
      <RouterLink
        to="/"
        class="block rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        active-class="bg-slate-900 text-white hover:bg-slate-900 hover:text-white"
      >
        الرئيسية
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SideBar'
})
import { RouterLink } from 'vue-router'
import BaseLogo from './base/BaseLogo.vue'

</script>
