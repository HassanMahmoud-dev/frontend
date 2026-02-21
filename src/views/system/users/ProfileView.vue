<template>
  <div class="container mx-auto">
    <!-- Header Section -->
    <div
      class="relative mb-12 overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-xl dark:bg-blue-900"
    >
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div
        class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"
      ></div>

      <div class="relative flex flex-col items-center gap-6 md:flex-row md:items-end">
        <!-- Avatar Section -->
        <div class="group relative">
          <div
            class="h-32 w-32 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm transition-transform duration-300 hover:scale-105 dark:border-white/10"
          >
            <img
              v-if="shouldShowAvatar"
              :src="previewAvatar || getImageUrl(authStore.user?.avatar!)"
              class="h-full w-full object-cover"
              alt="Profile"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-white/60">
              <i class="bi bi-person text-6xl"></i>
            </div>

            <label
              class="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
            >
              <i class="bi bi-camera-fill text-2xl text-white"></i>
              <input type="file" class="hidden" accept="image/*" @change="handleFileChange" />
            </label>
          </div>

          <button
            v-if="hasAvatar"
            type="button"
            @click="handleRemoveAvatar"
            class="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
            title="إزالة الصورة"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>

        <div class="flex-1 text-center md:text-right">
          <h1 class="text-3xl font-bold">
            {{ authStore.user?.fullName || authStore.user?.username }}
          </h1>
          <p class="mt-1 text-blue-100 opacity-80">
            {{ getUserRole(authStore.user?.role || '') }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Sidebar Info -->
      <div class="space-y-6">
        <div
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <h3 class="mb-4 text-lg font-bold text-slate-800 dark:text-white">معلومات الحساب</h3>
          <div class="space-y-4 text-sm">
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              >
                <i class="bi bi-person-badge"></i>
              </div>
              <div>
                <p class="text-slate-500">اسم المستخدم</p>
                <p class="font-medium text-slate-800 dark:text-slate-200">
                  @{{ authStore.user?.username }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              >
                <i class="bi bi-envelope"></i>
              </div>
              <div>
                <p class="text-slate-500">البريد الإلكتروني</p>
                <p class="font-medium text-slate-800 dark:text-slate-200">
                  {{ authStore.user?.email || 'غير محدد' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form -->
      <div class="lg:col-span-2">
        <div
          class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <div class="border-b border-slate-100 p-6 dark:border-slate-800">
            <h2 class="text-xl font-bold text-slate-800 dark:text-white text-center">
              تعديل البيانات
            </h2>
          </div>

          <div class="p-6">
            <BaseForm :loading="loading" @submit="handleSubmit">
              <div class="space-y-8">
                <!-- Personal Info Section -->
                <section>
                  <div class="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <i class="bi bi-person-fill"></i>
                    <h3 class="font-bold">المعلومات الشخصية</h3>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <!-- Username (Read-only) -->
                    <BaseInput
                      label="اسم المستخدم"
                      :modelValue="authStore.user?.username || ''"
                      disabled
                      placeholder="لا يمكن تغيير اسم المستخدم"
                    />
                    <!-- Email (Read-only) -->
                    <BaseInput
                      label="البريد الإلكتروني"
                      :modelValue="authStore.user?.email || ''"
                      disabled
                      placeholder="لا يمكن تغيير البريد الإلكتروني"
                    />
                    <BaseInput
                      label="الاسم الكامل"
                      v-model="formData.fullName"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                    <BaseInput
                      label="رقم الهاتف"
                      v-model="formData.phoneNumber"
                      type="tel"
                      placeholder="أدخل رقم هاتفك"
                    />
                  </div>
                </section>

                <!-- Security Section -->
                <section>
                  <div class="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <i class="bi bi-shield-lock-fill"></i>
                    <h3 class="font-bold">الأمان</h3>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <BaseInput
                      label="كلمة المرور الجديدة"
                      type="password"
                      v-model="formData.password"
                      placeholder="اتركه فارغاً للحفاظ على الحالية"
                    />
                    <BaseInput
                      label="تأكيد كلمة المرور"
                      type="password"
                      v-model="formData.confirmPassword"
                      placeholder="أعد إدخال كلمة المرور"
                    />
                  </div>
                </section>
              </div>

              <!-- Actions -->
              <template #actions="{ loading }">
                <div class="mt-8 flex flex-wrap justify-center gap-4">
                  <!-- Save Button -->
                  <button
                    type="submit"
                    :disabled="loading || !hasChanges"
                    class="flex min-w-[200px] items-center justify-center gap-2 rounded-xl px-8 py-3 font-semibold text-white shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
                    :class="[
                      hasChanges
                        ? 'bg-blue-600 shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 dark:shadow-none'
                        : 'bg-slate-400 dark:bg-slate-700',
                    ]"
                  >
                    <span
                      v-if="loading"
                      class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                    ></span>
                    <i v-else class="bi bi-check-circle"></i>
                    <span>حفظ التغييرات</span>
                  </button>
                  <!-- Cancel Button -->
                  <button
                    type="button"
                    @click="goBack"
                    class="flex min-w-[140px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-800 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <i class="bi bi-x-circle"></i>
                    <span>إلغاء</span>
                  </button>
                </div>
              </template>
            </BaseForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import api, { BASE_URL } from '@/services/api'
import swalService from '@/services/swal.service'
import BaseForm from '@/components/base/BaseForm.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const previewAvatar = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const isAvatarRemoved = ref(false)

const formData = reactive({
  fullName: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
})

const hasChanges = computed(() => {
  if (!authStore.user) return false

  const nameChanged = formData.fullName !== (authStore.user.fullName || '')
  const phoneChanged = formData.phoneNumber !== (authStore.user.phoneNumber || '')
  const passwordEntered = formData.password.length > 0
  const avatarChanged = !!selectedFile.value || isAvatarRemoved.value

  return nameChanged || phoneChanged || passwordEntered || avatarChanged
})

const goBack = () => {
  router.back()
}

onMounted(() => {
  if (authStore.user) {
    formData.fullName = authStore.user.fullName || ''
    formData.phoneNumber = authStore.user.phoneNumber || ''
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
    if (formData.phoneNumber) data.append('phoneNumber', formData.phoneNumber)
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
