<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div
      class="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden p-8 space-y-6 transform transition-all hover:scale-[1.01]"
    >
      <div class="text-center">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">تسجيل الدخول</h1>
        <p class="text-slate-500 dark:text-slate-400">أدخل بياناتك للمتابعة إلى النظام</p>
      </div>

      <BaseForm @submit="handleLogin" :loading="isLoading" content-class="space-y-6">
        <BaseInput
          id="username"
          v-model="username"
          label="اسم المستخدم"
          placeholder="admin"
          required
        />

        <BaseInput
          id="password"
          v-model="password"
          type="password"
          label="كلمة المرور"
          placeholder="••••••••"
          required
        />

        <template #actions>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i v-if="isLoading" class="bi bi-arrow-repeat animate-spin -ml-1 mr-3 text-lg"></i>
            {{ isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول' }}
          </button>
        </template>
      </BaseForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import type { AxiosError } from 'axios'
import swalService from '@/services/swal.service'
import BaseForm from '@/components/base/BaseForm.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    return
  }

  isLoading.value = true
  try {
    await authStore.login(username.value, password.value)
  } catch (err) {
    const error = err as AxiosError<{ message: string }>
    console.error('Login error:', error)
    const message = error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول'
    swalService.error(message)
  } finally {
    isLoading.value = false
  }
}
</script>
