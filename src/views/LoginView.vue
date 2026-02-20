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
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
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
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
