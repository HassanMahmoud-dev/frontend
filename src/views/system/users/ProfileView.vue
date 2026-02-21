<template>
  <div class="container mx-auto max-w-2xl px-4 py-8">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-slate-800 dark:text-white">الملف الشخصي</h1>
      <p class="mt-2 text-slate-600 dark:text-slate-400">تعديل معلوماتك الشخصية</p>
    </div>

    <div
      class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <BaseForm :loading="loading" @submit="handleSubmit">
        <!-- Avatar Upload -->
        <div class="mb-8 flex flex-col items-center gap-4">
          <div class="relative">
            <div
              class="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-slate-100 dark:ring-slate-800"
            >
              <img
                v-if="shouldShowAvatar"
                :src="previewAvatar || getImageUrl(authStore.user?.avatar!)"
                class="h-full w-full object-cover"
                alt="Profile"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              >
                <i class="bi bi-person text-6xl"></i>
              </div>

              <label
                class="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100"
              >
                <i class="bi bi-camera-fill text-2xl"></i>
                <input type="file" class="hidden" accept="image/*" @change="handleFileChange" />
              </label>
            </div>

            <!-- Remove Avatar Button -->
            <button
              v-if="hasAvatar"
              type="button"
              @click="handleRemoveAvatar"
              class="absolute bottom-0 right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-md ring-2 ring-white transition hover:bg-red-200 dark:bg-red-900/80 dark:text-red-300 dark:ring-slate-900"
              title="إزالة الصورة"
            >
              <i class="bi bi-trash text-lg"></i>
            </button>
          </div>

          <div v-if="authStore.user" class="text-center">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
              {{ authStore.user.username }}
            </h3>
            <span class="text-sm text-slate-500 dark:text-slate-400">
              {{ getUserRole(authStore.user.role) }}
            </span>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="px-1 mb-4">
          <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span class="text-red-500 font-bold">*</span>
            <span>الحقول المميزة بهذه العلامة اجبارية</span>
          </p>
        </div>

        <div class="space-y-4">
          <BaseInput
            label="الاسم الكامل"
            v-model="formData.fullName"
            placeholder="أدخل اسمك الكامل"
            required
          />

          <BaseInput
            label="كلمة المرور الجديدة"
            type="password"
            v-model="formData.password"
            placeholder="اتركه فارغاً إذا كنت لا تريد تغيير كلمة المرور"
          />

          <BaseInput
            label="تأكيد كلمة المرور"
            type="password"
            v-model="formData.confirmPassword"
            placeholder="أعد إدخال كلمة المرور "
          />
        </div>

        <!-- Actions -->
        <template #actions="{ loading }">
          <button
            type="submit"
            :disabled="loading"
            class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            <span
              v-if="loading"
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            <span>حفظ التغييرات</span>
          </button>
        </template>
      </BaseForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import api, { BASE_URL } from '@/services/api'
import swalService from '@/services/swal.service'
import BaseForm from '@/components/base/BaseForm.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const authStore = useAuthStore()
const loading = ref(false)
const previewAvatar = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const isAvatarRemoved = ref(false)

const formData = reactive({
  fullName: '',
  password: '',
  confirmPassword: '',
})

onMounted(() => {
  if (authStore.user) {
    formData.fullName = authStore.user.fullName || ''
  }
})

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

const getUserRole = (role: string) => {
  if (role === 'admin') return 'مدير النظام'
  if (role === 'employee') return 'موظف'
  return role
}

const hasAvatar = computed(() => {
  return !!previewAvatar.value || (!!authStore.user?.avatar && !isAvatarRemoved.value)
})

const shouldShowAvatar = computed(() => {
  if (previewAvatar.value) return true
  if (authStore.user?.avatar && !isAvatarRemoved.value) return true
  return false
})

const handleRemoveAvatar = () => {
  selectedFile.value = null
  previewAvatar.value = null
  isAvatarRemoved.value = true
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    selectedFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewAvatar.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  // Validate password confirmation
  if (formData.password && formData.password !== formData.confirmPassword) {
    swalService.error('كلمات المرور غير متطابقة')
    return
  }

  loading.value = true
  try {
    const data = new FormData()
    if (formData.fullName) data.append('fullName', formData.fullName)
    if (formData.password) data.append('password', formData.password)
    if (selectedFile.value) {
      data.append('AVATAR', selectedFile.value)
    } else if (isAvatarRemoved.value) {
      data.append('removeAvatar', 'true')
    }

    const response = await api.put('/auth/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success && response.data.data) {
      // Update store user
      authStore.setUser(response.data.data)

      // Reset sensitive fields
      formData.password = ''
      formData.confirmPassword = ''
      previewAvatar.value = null
      selectedFile.value = null
      isAvatarRemoved.value = false

      swalService.success('تم تحديث الملف الشخصي بنجاح')
    }
  } catch (err) {
    const error = err as AxiosError<{ message: string }>
    console.error('Update profile error:', error)
    swalService.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث الملف الشخصي')
  } finally {
    loading.value = false
  }
}
</script>
