<template>
  <div class="flex flex-col items-center justify-center p-4">
    <div class="text-center space-y-6">
      <h1 class="text-4xl font-bold text-slate-900 dark:text-white">مرحباً بك في النظام</h1>
      <p class="text-xl text-slate-600 dark:text-slate-300">تم تسجيل دخولك بنجاح</p>

      <div class="flex gap-4 justify-center">
        <router-link
          v-if="authStore.isAdmin"
          to="/users"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          إدارة المستخدمين
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
const authStore = useAuthStore()
</script>
